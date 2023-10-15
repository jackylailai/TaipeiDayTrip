from .model import create_db_connection




def insert_order(order_number, price, attraction_id, contact_id, date, time, status):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "INSERT INTO orders (number, price, attraction_id, contact_id, Date, Time, status) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values = (order_number, price, attraction_id, contact_id, date, time, status)
            cursor.execute(query, values,)
            connection.commit()
            print("成功insert付費訂單")
    except Exception as e:
        print("error：", str(e))

def get_order_info(order_number):
    try:
        with create_db_connection() as connection, connection.cursor(dictionary=True) as cursor:
            # connection = mysql.connector.connect(**db_config)
            query_order = "SELECT * FROM orders WHERE number = %s"
            cursor.execute(query_order, (order_number,))
            order_data = cursor.fetchone()
            return order_data
    except Exception as e:
        print("error：", str(e))
        return None
