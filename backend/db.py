import os

import psycopg
from dotenv import load_dotenv

def insertRow(data):
    # Load environment variables from .env file
    load_dotenv("../.env")

    # Get the connection string from the environment variable
    conn_string = os.getenv("DATABASE_URL")

    try:
        with psycopg.connect(conn_string) as conn:
            print("Connection established")

            # Open a cursor to perform database operations
            with conn.cursor() as cur:
                # Insert a single book record
                cur.execute(
                    "INSERT INTO predictions (predicted_class, is_true) VALUES (%s, %s);",
                    data,
                )
                print("Inserted a row.")

    except Exception as e:
        print("Connection failed.")
        print(e)