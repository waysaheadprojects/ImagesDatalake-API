import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()

class Database:
    def __init__(self):
        self.connection = None

    def connect(self):
        if self.connection is None:
            self.connection = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST"),
                port=os.getenv("POSTGRES_PORT"),
                database=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD")
            )

    def get_cursor(self):
        if self.connection is None:
            self.connect()
        return self.connection.cursor(cursor_factory=RealDictCursor)

    def close(self):
        if self.connection:
            self.connection.close()
