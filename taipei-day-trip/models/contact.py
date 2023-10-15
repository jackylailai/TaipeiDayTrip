from model import create_db_connection



def insert_contact(name, email, phone):
    try:
        print("insert contact")
        with create_db_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "SELECT id FROM contact WHERE name=%s AND email=%s AND phone=%s"
            values = (name, email, phone)
            cursor.execute(query, values)
            contact_row = cursor.fetchone()
            if contact_row is not None:
                contact__ = contact_row[0]
                print("有東西")
            else:
                query = "INSERT IGNORE INTO contact (name, email, phone) VALUES (%s, %s, %s)"
                values = (name, email, phone)
                cursor.execute(query, values)
                connection.commit()
                query = "SELECT id FROM contact WHERE name=%s AND email=%s AND phone=%s"
                cursor.execute(query, values)
                contact_row = cursor.fetchone()
                if contact_row is not None:
                    contact__ = contact_row[0]
                    print("insert裡面的contact__")
                else:
                    contact__ = None

            print("cursor完",contact__)
            return contact__
    except Exception as e:
        print("error：", str(e))
        return -1

def get_contact_info(contact_id):
    try:
        with create_db_connection() as connection, connection.cursor(dictionary=True) as cursor:
            # connection = mysql.connector.connect(**db_config)
            query_contact = "SELECT * FROM contact WHERE id = %s"
            cursor.execute(query_contact, (contact_id,))
            contact_data = cursor.fetchone()
            return contact_data
    except Exception as e:
        print("發生異常：", str(e))
        return None