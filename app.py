from fastapi import FastAPI
from fastapi.responses import JSONResponse , HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import re, logging, base64
from io import BytesIO
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.runnables import RunnableLambda
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_openai.embeddings import OpenAIEmbeddings
from duckduckgo_search import DDGS
from urllib.parse import unquote
import spacy
import psycopg2, ast, json
import os
import boto3
from fastapi.middleware.cors import CORSMiddleware
from Models.loginModel import LoginRequest
from DbContext import Database
from auth import create_access_token, verify_token
from datetime import timedelta
from fastapi import Depends, HTTPException
from fastapi import Query


# ----------------- FastAPI Init -----------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------- Pydantic Schemas -----------------
class AskRequest(BaseModel):
    question: str

class ImageRequest(BaseModel):
    question: str
    answer: str

class VideoRequest(BaseModel):
    question: str

class SourceRequest(BaseModel):
    question: str

class InsightRequest(BaseModel):
    question: str
    answer: str

# ----------------- Globals -----------------
nlp = spacy.load("en_core_web_trf")
FAISS_INDEX_PATH = "faiss_index"
TABLE_NAME = "tb_vector_embeddings"

DB_CONFIG = {
    "host": os.getenv("POSTGRES_HOST"),
    "port": int(os.getenv("POSTGRES_PORT", "5432")),
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD")
}



# ----------------- Load VectorStore -----------------
def fetch_pgvector_documents():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute(f"SELECT chunk_text, embedding, metadata FROM {TABLE_NAME}")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    texts, embeddings, metadatas = [], [], []
    for text, emb_array, meta in rows:
        try:
            emb_array = ast.literal_eval(emb_array) if isinstance(emb_array, str) else emb_array
            metadata = json.loads(meta) if isinstance(meta, str) else meta
            if emb_array and len(emb_array) == 1536:
                texts.append(text)
                embeddings.append(emb_array)
                metadatas.append(metadata)
        except Exception:
            continue
    return texts, embeddings, metadatas


if os.path.exists(os.path.join(FAISS_INDEX_PATH, "index.faiss")):
    vector_store = FAISS.load_local(
        folder_path=FAISS_INDEX_PATH,
        embeddings=OpenAIEmbeddings(),
        allow_dangerous_deserialization=True
    )
    logging.info("✅ Loaded FAISS index from local storage.")
else:
    texts, embeddings, metadatas = fetch_pgvector_documents()
    vector_store = FAISS.from_embeddings(
        list(zip(texts, embeddings)),
        embedding=OpenAIEmbeddings(),
        metadatas=metadatas
    )
    vector_store.save_local(FAISS_INDEX_PATH)
    logging.info("📦 FAISS index created and saved locally.")


s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)


def get_s3_url_by_filename(file_name: str) -> str:
    """Generate signed S3 URL from a raw s3://... reference."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT s3_url FROM tb_fact_magazines WHERE title = %s LIMIT 1", (file_name,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row and row[0]:
            raw_s3 = row[0].replace("s3://", "")
            bucket, key = raw_s3.split("/", 1)
            key = unquote(key).replace("+", " ")
            signed_url = s3_client.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': bucket, 'Key': key},
                ExpiresIn=600
            )
            return signed_url
    except Exception as e:
        logging.warning(f"⚠️ S3 URL fetch failed: {e}")
    return ""


# ----------------- Tool Definitions -----------------
@tool
def query_zoho_leads(input_text: str) -> List[dict]:
    """
    🔍 Search for participant information in the Zoho CRM leads database. Use this tool if asked about events such as PRC 2024, India Fashion Forum etc.

    This tool queries `tb_zoho_crm_lead` using fuzzy keyword matching across:
    - full_name, email, organisation, event_name
    - main_category, sub_category1, sub_category2
    - region, country

    ✅ Returns all matching records (max 10) formatted like:
    "Gopal Asthana (CEO) from Tata CLiQ attended India Fashion Forum 2024. Email: asthanagopal@tatacliq.com."

    If no email is found, it will say "Email not available."
    """

    try:
        keywords = input_text.lower().split()
        fields = [
            "full_name", "email", "organisation", "event_name",
            "main_category", "sub_category1", "sub_category2",
            "region", "country"
        ]
        clause = " OR ".join([f"LOWER({f}) LIKE '%{k}%'" for f in fields for k in keywords])

        sql = f"""
            SELECT 
                full_name, email, organisation, designation, event_name
            FROM tb_zoho_crm_lead
            WHERE {clause}
            LIMIT 100;
        """
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            port= int(os.getenv("POSTGRES_PORT", "5432")),
            dbname=os.getenv("POSTGRES_STG_DB"),
            user=os.getenv("POSTGRES_STG_USER"),
            password=os.getenv("POSTGRES_STG_PASSWORD")
        )

        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        if rows:
            results = []
            for row in rows:
                full_name, email, org, designation, event = row
                email_part = f"Email: {email}" if email else "Email not available."
                response = (
                    f"{full_name} ({designation}) from {org} attended {event}. {email_part}"
                )
                results.append({"response": response})
            return results
        else:
            return [{"response": "No matching participants found in Zoho CRM."}]

    except Exception as e:
        logging.error(f"❌ Zoho leads query failed: {e}")
        return [{"response": "Query failed due to an internal error."}]

    
@tool
def retrieve_documents(input: str) -> str:
    """
    📄 Document QA Tool: Use this tool when the user is asking for information that would
    appear in magazine articles, reports, or documents (e.g., quotes, statements, opinions).

    Examples:
    - "What did Kishore Biyani say about the future of retail?"
    - "Summarize the latest article about D2C brands."
    -who is amitabh taneja?
    - "What are the key insights from the latest India Retailing magazine?"
    Returns: A relevant textual answer based on document similarity search.
    """
    qa = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model="gpt-3.5-turbo", temperature=0),
        retriever=vector_store.as_retriever(search_kwargs={"k": 10}),
        return_source_documents=False
    )
    return qa.run(input)

@tool
def fetch_youtube_videos(input: str) -> List[dict]:
    """
    📺 Fetch relevant YouTube videos from 'India Retailing'.

    Args:
        input (str): Topic to search for.

    Returns:
        List[dict]: Video titles and URLs.
    """
    try:
        from googleapiclient.discovery import build
        yt = build("youtube", "v3", developerKey=os.getenv("YOUTUBE_API_KEY"))
        results = yt.search().list(
            q=input, type="video", part="snippet", maxResults=5,
            channelId="UC8vvbk837aQ6kwxflCVMp1Q"
        ).execute()
        return [{
            "title": i["snippet"]["title"],
            "video_url": f"https://www.youtube.com/watch?v={i['id']['videoId']}"
        } for i in results.get("items", [])]
    except Exception as e:
        logging.error(f"YT API error: {e}")
        return []
        
@tool
def detect_people_and_images(input: str) -> list:
    """
    🖼️ Image Finder Tool with Google Custom Search (CSE)

    Extracts PERSON and ORG names from HTML or text input using spaCy transformers,
    then returns relevant images from PostgreSQL and Google Image Search fallback.
    """
    DB_CONFIG = {
        "host": os.getenv("POSTGRES_HOST"),
        "port": int(os.getenv("POSTGRES_PORT", "5432")),
        "dbname": os.getenv("POSTGRES_DB"),
        "user": os.getenv("POSTGRES_USER"),
        "password": os.getenv("POSTGRES_PASSWORD")
    }

    def extract_plain_text(text: str) -> str:
        try:
            return BeautifulSoup(text, "html.parser").get_text(separator=" ").strip()
        except Exception:
            return re.sub(r"<[^>]+>", "", text)

    def extract_entities(text: str):
        doc = nlp(text)
        entities = []
        for ent in doc.ents:
            if ent.label_ not in {"PERSON", "ORG"}:
                continue
            if len(ent) < 2:
                continue
            if not any(t.is_alpha for t in ent):
                continue
            if not ent[0].text.istitle():
                continue
            if ent.text.strip().lower() in {"co founder", "founder", "ceo"}:
                continue
            entities.append((ent.text.strip(), ent.label_))
        return entities[:5]

    def fetch_google_images(query: str, limit: int = 2) -> list:
        from googleapiclient.discovery import build
        api_key = os.getenv("GOOGLE_CSE_API_KEY")
        cx = os.getenv("GOOGLE_CSE_CX")
        images = []
        try:
            service = build("customsearch", "v1", developerKey=api_key)
            res = service.cse().list(
                q=query,
                cx=cx,
                searchType="image",
                num=limit,
                safe="high",
                fileType="jpg",
                imgType="face"
            ).execute()
            for item in res.get("items", []):
                link = item.get("link", "")
                if link and link.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    images.append(link)
        except Exception as e:
            logging.warning(f"⚠️ Google CSE failed for '{query}': {e}")
        return images or ["https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"]

    clean_text = extract_plain_text(input)
    entities = extract_entities(clean_text)
    seen = set()
    results = []

    for name, label in entities:
        norm_name = name.lower()
        if norm_name in seen:
            continue
        seen.add(norm_name)

        matched_title = "N/A"
        local_photos = []

        # 🔍 PostgreSQL Fuzzy Match
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT title, encode(image_data, 'base64') AS base64_image
                FROM tb_fact_image_uploads
                WHERE similarity(LOWER(title)::text, %s::text) > 0.3
                ORDER BY similarity(LOWER(title)::text, %s::text) DESC
                LIMIT 1
            """, (norm_name, norm_name))
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            if row and row[1]:
                matched_title, base64_img = row
                local_photos = [f"data:image/jpeg;base64,{base64_img}"]
        except Exception as e:
            logging.warning(f"⚠️ DB lookup failed for '{name}': {e}")

        # 🌐 Google Image Search Fallback
        web_photos = fetch_google_images(name, limit=2)

        results.append({
            "name": name,
            "type": "person" if label == "PERSON" else "brand",
            "matched_title": matched_title,
            "local_photos": local_photos,
            "web_photos": web_photos
        })

    return results

@tool
def get_attendee_images(event_name: str) -> List[dict]:
    """
    🧠 Combined Tool: Finds people who attended a specific event (e.g., PRC 2025),
    then fetches their images from the image DB or DuckDuckGo.

    Args:
        event_name (str): Name of the event, e.g., "PRC 2025"

    Returns:
        List[dict]: One entry per person with their image data.
    """
    # Step 1: Get people from Zoho CRM
    leads = query_zoho_leads.invoke(event_name)
    names = []
    for item in leads:
        match = re.match(r"^(.+?)\s+\(.*?\)\s+from", item["response"])
        if match:
            names.append(match.group(1))

    # Step 2: Get images
    if not names:
        return [{"error": "No attendees found"}]
    
    name_input = ", ".join(names)
    return detect_people_and_images.invoke({"input": name_input})




# ----------------- LangGraph Agent Setup -----------------
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition
from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

# Define your tools
tools = [query_zoho_leads, retrieve_documents, fetch_youtube_videos, get_attendee_images]

# Bind tools to the LLM (no system_prompt here)
llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)
llm_with_tools = llm.bind_tools(tools, tool_choice="auto")  # Correct usage

# Shared state type
class State(TypedDict):
    messages: Annotated[list, add_messages]

# Define chatbot node
def chatbot(state: State):
    # Inject the system prompt as a message only if it's the first turn
    if len(state["messages"]) == 1:  # Just the user message
        system_instruction = {
            "role": "system",
            "content": (
                "You are a helpful assistant with access to tools.\n"
                "You may call multiple tools in one step if needed.\n"
                "Always return your response in **HTML format**.\n"
                "Wrap insights, tables, tool outputs, and responses inside proper HTML tags.\n"
                "For example, use <div>, <p>, <h3>, <ul>, <li>, <table>, <tr>, <td> etc., depending on the content.\n"
                "Always respond in **clean, structured HTML format** suitable for display in web dashboards.\n"
            "\n"
            "Follow these rules strictly:\n"
            "\n"
            "<ul>\n"
            "  <li><b>Use HTML formatting</b> for all responses — no Markdown or plain text.</li>\n"
            "  <li><b>Organize responses in bullet points</b> using <code>&lt;ul&gt;</code> and <code>&lt;li&gt;</code> for clarity.</li>\n"
            "  <li>For sections or summaries, use <code>&lt;h3&gt;</code> or <code>&lt;p&gt;</code> with <b>bold labels</b>.</li>\n"
            "  <li>If listing insights from tools like <code>query_zoho_leads</code> or <code>retrieve_documents</code>, show each as a <code>&lt;li&gt;</code> with relevant highlights.</li>\n"
            "  <li>Wrap the entire response in a <code>&lt;div&gt;</code> container.</li>\n"
            "  <li>Always prefer <b>clarity and brevity</b> over verbose paragraphs.</li>\n"
            "</ul>\n"
            "\n"
            "Example structure:\n"
            "<div>\n"
            "  <h3>🔍 Insights</h3>\n"
            "  <ul>\n"
            "    <li><b>Name:</b> Kishore Biyani</li>\n"
            "    <li><b>Event:</b> India Fashion Forum 2024</li>\n"
            "    <li><b>Quote:</b> “Retail is evolving with consumer experience at the center.”</li>\n"
            "  </ul>\n"
            "</div>\n"
            "\n"
            "Be concise, professional, and visually clear — as if your output will appear in a business analytics dashboard AND Use Bullets for pointers please"
        )
        }
        state["messages"].insert(0, system_instruction)
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# Build the LangGraph
graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", ToolNode(tools=tools))
graph_builder.add_conditional_edges("chatbot", tools_condition)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")

# Enable checkpointing
memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)


# ----------------- FastAPI Endpoints -----------------

from fastapi import Request

def get_current_user(payload=Depends(verify_token)):
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload 


from fastapi import Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
import traceback
import logging


@app.post("/ask")
async def ask(payload: AskRequest, request: Request, current_user: dict = Depends(get_current_user)):
    try:
        session_id = (
            request.query_params.get("session_id")
            or request.headers.get("session-id")
            or f"default-session-{current_user.get('sub')}"
        )
        user_key = current_user.get("user_key")
        if not user_key:
            raise HTTPException(status_code=401, detail="Missing user_key in token")

        cursor = db.get_cursor()

        cursor.execute("""
            SELECT MAX(message_order) AS max_order
            FROM tb_chat_history
            WHERE session_id = %s
        """, (session_id,))
        row = cursor.fetchone()
        last_order = row["max_order"] if row and row["max_order"] is not None else 0
        now = datetime.utcnow()

        cursor.execute("""
            SELECT message_role, message_text
            FROM tb_chat_history
            WHERE session_id = %s AND is_deleted = false
            ORDER BY message_order
        """, (session_id,))
        rows = cursor.fetchall()
        history = [{"role": r["message_role"], "content": r["message_text"]} for r in rows]

        system_instruction = {
            "role": "system",
            "content": (
                "You are a helpful assistant with access to tools.\n"
                "You may call multiple tools in one step if needed.\n"
                "Always return your response in <b>HTML format</b>.\n"
                "Use proper tags like <div>, <p>, <ul>, <li>, <h3>, <table>.\n"
                "Never return plain text or Markdown.\n"
                "Example: <div><h3>Insights</h3><ul><li><b>Name:</b> Kishore Biyani</li></ul></div>"
            )
        }

        user_message = {"role": "user", "content": payload.question}
        full_messages = [system_instruction] + history + [user_message]

        result = graph.invoke(
            {"messages": full_messages},
            config={"configurable": {"thread_id": session_id}}
        )
        assistant_msg = result["messages"][-1]
        tool_used = getattr(assistant_msg, "tool_call", None)
        if isinstance(tool_used, dict):
            tool_used = tool_used.get("name", "chat")
        if not tool_used:
            tool_used = "chat"

        cursor.execute("""
            INSERT INTO tb_chat_history (
                interaction_key, session_id, user_key, message_order,
                message_role, message_text, message_html, tool_used,
                is_active, is_deleted, created_at, modified_at
            )
            VALUES (gen_random_uuid(), %s, %s, %s,
                    %s, %s, NULL, %s,
                    true, false, %s, %s)
        """, (
            session_id, user_key, last_order + 1,
            "user", payload.question, tool_used,
            now, now
        ))

        cursor.execute("""
            INSERT INTO tb_chat_history (
                interaction_key, session_id, user_key, message_order,
                message_role, message_text, message_html, tool_used,
                is_active, is_deleted, created_at, modified_at
            )
            VALUES (gen_random_uuid(), %s, %s, %s,
                    %s, %s, %s, %s,
                    true, false, %s, %s)
        """, (
            session_id, user_key, last_order + 2,
            "assistant", assistant_msg.content, assistant_msg.content, tool_used,
            now, now
        ))

        db.connection.commit()
        return {"status": True, "answer": assistant_msg.content}

    except Exception as e:
        logging.error("❌ /ask failed:\n" + traceback.format_exc())
        db.connection.rollback()
        return JSONResponse(status_code=500, content={"status": False, "error": traceback.format_exc()})




@app.post("/get_images")
async def get_images(payload: ImageRequest, current_user: dict = Depends(get_current_user)):
    try:
        images = detect_people_and_images.invoke({"input": payload.answer})
        return {"status": True, "images": images}
    except Exception as e:
        logging.error(f"/get_images failed: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})


@app.post("/get_videos")
async def get_videos(payload: VideoRequest, current_user: dict = Depends(get_current_user)):
    try:
        videos = fetch_youtube_videos.invoke({"input": payload.question})
        return {"status": True, "videos": videos}
    except Exception as e:
        logging.error(f"/get_videos failed: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})

@app.post("/get_sources")
async def get_sources(payload: SourceRequest, current_user: dict = Depends(get_current_user)):
    try:
        question = payload.question.strip()

        if not vector_store:
            return JSONResponse(status_code=500, content={"status": False, "error": "FAISS vector store not initialized."})

        docs = vector_store.similarity_search(question, k=10)
        if not docs:
            return {"status": True, "sources": []}

        seen = {}
        for doc in docs:
            source = doc.metadata.get("file_name", doc.metadata.get("source", "Unknown"))
            page = str(doc.metadata.get("page", "1"))

            if source not in seen:
                seen[source] = {
                    "source": source,
                    "page": page,
                    "snippet": re.sub(r'\[([^\]]+)\]\((https?://[^\)]+)\)', r'\1', doc.page_content.strip()),
                    "signed_url": get_s3_url_by_filename(source)
                }
            else:
                seen[source]["snippet"] += "\n\n" + re.sub(r'\[([^\]]+)\]\((https?://[^\)]+)\)', r'\1', doc.page_content.strip())

        return {"status": True, "sources": list(seen.values())}

    except Exception as e:
        logging.error(f"/get_sources failed: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})


@app.post("/get_insights")
async def get_insights(payload: InsightRequest, current_user: dict = Depends(get_current_user)):
    try:
        question = payload.question.strip()
        answer = payload.answer.strip()

        people = detect_people_and_images.invoke({"input": answer})
        num_people = len(people)
        num_with_local = sum(1 for p in people if p["local_photos"])

        docs = vector_store.similarity_search(question, k=10)
        unique_files = list({doc.metadata.get("file_name", "unknown") for doc in docs})
        top_sources = unique_files[:5]

        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
        total_docs = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM tb_fact_image_uploads WHERE is_active = true AND is_deleted = false")
        total_images = cursor.fetchone()[0]
        cursor.close()
        conn.close()

        doc_answer = retrieve_documents.invoke({"input": question})
        top_snippets = [doc.page_content[:150] + "..." for doc in docs[:3]]

        return {
            "status": True,
            "summary": {
                "total_documents_indexed": total_docs,
                "total_images_available": total_images,
                "people_mentioned": num_people,
                "people_with_local_images": num_with_local,
                "documents_matched": len(docs),
                "distinct_files_matched": len(unique_files),
                "top_file_sources": top_sources
            },
            "file_snippets": top_snippets,
            "people_detected": people,
            "document_answer": doc_answer
        }

    except Exception as e:
        logging.error(f"/get_insights failed: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})


db = Database()

@app.post("/login")
def login(request_data: LoginRequest, request: Request):
    try:
        cursor = db.get_cursor()
        query = "SELECT * FROM tb_dim_user WHERE email = %s"
        cursor.execute(query, (request_data.email,))
        user = cursor.fetchone()

        login_status = "Failed"
        login_reason = ""
        login_token = None

        if not user:
            login_reason = "User not found"
            db.connection.rollback()  # 👈 prevent broken transaction
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if request_data.password != user["password"]:
            login_reason = "Invalid password"
            db.connection.rollback()  # 👈 prevent broken transaction
            raise HTTPException(status_code=401, detail="Invalid email or password")

        login_token = create_access_token(
            data={
                "sub": request_data.email,
                "user_key": str(user["user_key"])
            },
            expires_delta=timedelta(minutes=60)
        )

        login_status = "Success"
        login_reason = "Login successful"

        ip_address = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        insert_log_query = """
            INSERT INTO tb_dim_user_login_logs (userid, email, login_token, status, reason, ip_address, user_agent)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_log_query, (
            user.get("user_key"), request_data.email, login_token,
            login_status, login_reason, ip_address, user_agent
        ))

        db.connection.commit()

        return {
            "status": True,
            "access_token": login_token,
            "user": user,
            "token_type": "bearer"
        }

    except HTTPException as e:
        db.connection.rollback()  # 👈 safe rollback
        raise e
    except Exception as e:
        db.connection.rollback()  # 👈 rollback on unknown errors
        logging.error(f"🚨 Error in /login: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})




@app.get("/verify-token")
def verify_token_endpoint(payload=Depends(verify_token)):
    email = payload.get("sub")
    cursor = db.get_cursor()
    cursor.execute("SELECT * FROM tb_dim_user WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"valid": True, "user": user}

@app.get("/graph", response_class=HTMLResponse)
async def visualize_graph():
    try:
        mermaid_code = graph.get_graph().draw_mermaid()

        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>LangGraph Visualization</title>
            <script type="module">
              import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
              mermaid.initialize({{ startOnLoad: true }});
            </script>
        </head>
        <body style="padding: 2rem; background: #f8f9fa;">
            <h2>LangGraph Flowchart</h2>
            <div class="mermaid">
            {mermaid_code}
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=html)

    except Exception as e:
        return HTMLResponse(content=f"<h3>⚠️ Error generating graph: {e}</h3>", status_code=500)


@app.get("/user-chats")
def get_chat_sessions_for_user(current_user: dict = Depends(get_current_user)):
    try:
        user_key = current_user.get("user_key")
        if not user_key:
            raise HTTPException(status_code=401, detail="Unauthorized: Missing user_key")

        cursor = db.get_cursor()
        cursor.execute("""
            SELECT 
                session_id,
                COUNT(*) as message_count,
                MIN(created_at) as started_at,
                MAX(created_at) as last_updated,
                (
                    SELECT message_text 
                    FROM tb_chat_history t2 
                    WHERE t2.session_id = t1.session_id
                      AND t2.is_deleted = false
                    ORDER BY created_at DESC
                    LIMIT 1
                ) AS last_message
            FROM tb_chat_history t1
            WHERE t1.user_key = %s AND t1.is_deleted = false
            GROUP BY session_id
            ORDER BY last_updated DESC;
        """, (user_key,))
        rows = cursor.fetchall()

        sessions = [
            {
                "session_id": row["session_id"],
                "message_count": row["message_count"],
                "started_at": row["started_at"].isoformat(),
                "last_updated": row["last_updated"].isoformat(),
                "last_message": row["last_message"]
            }
            for row in rows
        ]
        return {"status": True, "sessions": sessions}

    except Exception as e:
        import traceback
        db.connection.rollback()
        logging.error(traceback.format_exc())
        return JSONResponse(status_code=500, content={"status": False, "error": traceback.format_exc()})

 # Assuming these are your DB and auth dependencies

@app.get("/user-chat-history")
def get_chat_history_for_user(
    role: str = Query(None, description="Filter messages by 'user' or 'assistant'")
):
    """
    Admin view: Fetches all chat history across users.
    
    Optional:
    - If 'user' is passed, only user messages are returned.
    - If 'assistant' is passed, only assistant messages are returned.
    - If no filter is provided, all messages are returned, sorted by created_at (latest first).
    
    Returns:
    - status: True/False
    - chats: List of messages with user_name and timestamps
    """
    try:
        cursor = db.get_cursor()

        # Base query
        query = """
            SELECT 
                ch.session_id, 
                ch.message_order, 
                ch.message_role, 
                ch.message_text, 
                ch.created_at, 
                u.full_name
            FROM public.tb_chat_history ch
            LEFT JOIN public.tb_dim_user u ON ch.user_key = u.user_key
            WHERE ch.is_deleted = false
        """
        params = []

        # Optional role filter
        if role:
            if role not in ["user", "assistant"]:
                raise HTTPException(status_code=400, detail="Invalid role filter. Use 'user' or 'assistant'.")
            query += " AND ch.message_role = %s"
            params.append(role)

        query += " ORDER BY ch.created_at DESC"
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        chats = [
            {
                "session_id": row["session_id"],
                "message_order": row["message_order"],
                "message_role": row["message_role"],
                "message_text": row["message_text"],
                "created_at": row["created_at"].isoformat(),
                "user_name": row["full_name"] or "Unknown"
            }
            for row in rows
        ]

        return {"status": True, "chats": chats}

    except Exception as e:
        db.connection.rollback()
        logging.error(f"❌ Error fetching chat history: {e}")
        return JSONResponse(status_code=500, content={"status": False, "error": str(e)})

# ----------------- Router (for initial tool type classification) -----------------
def route_tool(state):
    question = state["input"]
    system_prompt = """
    Decide the best tool to answer this question. Reply ONLY with the tool name.

    Tools available:
    - query_zoho_leads
    - retrieve_documents
    - fetch_youtube_videos
    - detect_people_and_images
    - get_attendee_images

    Guidelines:
    - For event attendees, emails, participant info → query_zoho_leads
    - For quotes, mentions, descriptions from magazines/articles → retrieve_documents
    - For videos (e.g., PRC, IFF, conferences) → fetch_youtube_videos
    - For people image search (based on answer) → detect_people_and_images
    - For showing images use -> get_attendee_images

    ONLY output the tool name.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question}
    ]
    response = llm.invoke(messages).content.strip()
    return {"tool": response}
