import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_DATABASE"),
}

db_pool = pooling.MySQLConnectionPool(pool_name="my_pool", pool_size=5, **db_config)

def create_db_connection():
    return db_pool.get_connection()
