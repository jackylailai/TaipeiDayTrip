import jwt
from flask import jsonify
from mysql.connector import pooling
from .model import create_db_connection


secret_key = 'secret_key'

def register_user(name, email, password):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({"error": True, "message": "重複的 Email"}), 400

            cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                           (name, email, password))
            connection.commit()
            return jsonify({"ok": True})

    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

def login_user(email, password):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            cursor.execute("SELECT id, name, email FROM users WHERE email = %s AND password = %s", (email, password))
            user = cursor.fetchone()
            return user if user else None
    except Exception as e:
        return None

def get_user_by_email(email):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            cursor.execute("SELECT id, name, email FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            return user if user else None

    except Exception as e:
        return None

def generate_token(user):
    payload = {
        'id': user[0],
        'name': user[1],
        'email': user[2]
    }
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    print("token",token)
    token_bytes = token.encode('utf-8')
    print("token_byte",token_bytes)
    return token_bytes.decode('utf-8')
