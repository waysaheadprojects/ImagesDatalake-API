from fastapi import FastAPI
from fastapi.responses import JSONResponse
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
# ----------------- FastAPI Init -----------------
app = FastAPI()

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
nlp = spacy.load("en_core_web_sm")
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
def detect_people_and_images(input: str) -> List[dict]:
    """
    🧠 Detects PERSON and ORG entities from input text and returns:
    - Base64-encoded local photo (fuzzy match using pg_trgm similarity > 0.3)
    - Safe web fallback photos from DuckDuckGo
    - Entity type (person or brand/org)
    - Matched title (if any)

    Returns:
        List[dict]: List of entities with base64 local and safe web image links.
    """
    doc = nlp(input)
    entities = [(ent.text.strip(), ent.label_) for ent in doc.ents if ent.label_ in {"PERSON", "ORG"}]

    seen = set()
    results = []

    SAFE_IMAGE_DOMAINS = [
        "wikipedia.org", "wikimedia.org", "linkedin.com", "staticflickr.com", "gettyimages.com",
        "bbc.co.uk", "nytimes.com", "forbes.com", "bloomberg.com", "reuters.com", "cnn.com"
    ]
    IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif")
    BLACKLISTED_DOMAINS = ["porn", "sex", "adult", "xxx", "erotic", "nsfw"]

    def is_safe_image(url):
        url_l = url.lower()
        return (
            url_l.startswith("http") and
            any(url_l.endswith(ext) for ext in IMAGE_EXTENSIONS) and
            not any(bad in url_l for bad in BLACKLISTED_DOMAINS)
        )

    for name, label in entities:
        norm_name = name.lower()
        if norm_name in seen:
            continue
        seen.add(norm_name)

        matched_title = "N/A"
        local_photos = []

        # ✅ Fuzzy match from PostgreSQL using pg_trgm similarity
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

            if row and len(row) == 2:
                matched_title, base64_img = row
                if base64_img:
                    local_photos = [f"data:image/jpeg;base64,{base64_img}"]
        except Exception as e:
            logging.warning(f"⚠️ Fuzzy DB lookup failed for '{name}': {e}")

        # 🌐 Web fallback via DuckDuckGo
        web_photos = []
        try:
            with DDGS() as ddgs:
                for r in ddgs.images(name, max_results=10):
                    img_url = r.get("image", "")
                    if is_safe_image(img_url):
                        web_photos.append(img_url)
                    if len(web_photos) >= 3:
                        break
        except Exception as e:
            logging.warning(f"⚠️ DuckDuckGo fallback failed for '{name}': {e}")

        if not web_photos:
            web_photos = ["https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"]


        results.append({
            "name": name,
            "type": "person" if label == "PERSON" else "brand",
            "matched_title": matched_title,
            "local_photos": local_photos,
            "web_photos": web_photos
        })

    return results



# ----------------- LangGraph Agent Setup -----------------
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition
from typing_extensions import TypedDict
from typing import Annotated
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

# Define your tools
tools = [query_zoho_leads, retrieve_documents, fetch_youtube_videos, detect_people_and_images]

# Bind tools to the LLM (no system_prompt here)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
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
                "For example, for queries about people, use both `query_zoho_leads` and `retrieve_documents`."
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

@app.post("/ask")
async def ask(payload: AskRequest, request: Request):
    """
    Main LangGraph-driven Q&A endpoint.

    Accepts:
    - payload.question: the user query
    - thread_id (optional query param or header): unique session ID for memory

    Returns:
    - Latest assistant message (multi-turn aware)
    """
    try:
        # Extract thread_id from query or headers, fallback to 'default'
        thread_id = request.query_params.get("thread_id") or request.headers.get("thread-id") or "default"

        result = graph.invoke(
            {"messages": [{"role": "user", "content": payload.question}]},
            config={"configurable": {"thread_id": thread_id}}
        )
        return {"answer": result["messages"][-1].content}

    except Exception as e:
        logging.error(f"/ask failed: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/get_images")
async def get_images(payload: ImageRequest):
    try:
        return {"images": detect_people_and_images.invoke({"input": payload.answer})}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/get_videos")
async def get_videos(payload: VideoRequest):
    try:
        return {"videos": fetch_youtube_videos.invoke({"input": payload.question})}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/get_sources")
async def get_sources(payload: SourceRequest):
    try:
        question = payload.question.strip()

        if not vector_store:
            return JSONResponse(status_code=500, content={"error": "FAISS vector store not initialized."})

        docs = vector_store.similarity_search(question, k=10)
        if not docs:
            return {"sources": []}

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

        return {"sources": list(seen.values())}

    except Exception as e:
        logging.error(f"/get_sources failed: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/get_insights")
async def get_insights(payload: InsightRequest):
    try:
        question = payload.question.strip()
        answer = payload.answer.strip()

        # 🖼️ People detection
        people = detect_people_and_images.invoke({"input": answer})
        num_people = len(people)
        num_with_local = sum(1 for p in people if p["local_photos"])

        # 📄 Document insights
        docs = vector_store.similarity_search(question, k=10)
        unique_files = list({doc.metadata.get("file_name", "unknown") for doc in docs})
        top_sources = unique_files[:5]

        # 🔢 Document DB stats
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
        total_docs = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM tb_fact_image_uploads WHERE is_active = true AND is_deleted = false")
        total_images = cursor.fetchone()[0]
        cursor.close()
        conn.close()

        # 🧠 Answer from doc search
        doc_answer = retrieve_documents.invoke({"input": question})
        top_snippets = [doc.page_content[:150] + "..." for doc in docs[:3]]

        return {
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
        return JSONResponse(status_code=500, content={"error": str(e)})


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

    Guidelines:
    - For event attendees, emails, participant info → query_zoho_leads
    - For quotes, mentions, descriptions from magazines/articles → retrieve_documents
    - For videos (e.g., PRC, IFF, conferences) → fetch_youtube_videos
    - For people image search (based on answer) → detect_people_and_images

    ONLY output the tool name.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": question}
    ]
    response = llm.invoke(messages).content.strip()
    return {"tool": response}
