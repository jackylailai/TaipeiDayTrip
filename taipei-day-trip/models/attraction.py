from .model import create_db_connection
import mysql.connector
class AttractionsError(Exception):
    pass
def get_attractions(page, per_page, keyword):
    try:
        with create_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                if page >= 0:
                    start_index = page * per_page
                else:
                    start_index = 0
                
                query = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT %s, %s"
                cursor.execute(query, ("%" + keyword + "%", "%" + keyword + "%", start_index, per_page))
                attractions = cursor.fetchall()
                return attractions

    except Exception as e:
        
        return {}

def get_attraction(attractionId):
    try:
        with create_db_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM attractions WHERE id = %s"
                cursor.execute(query, (attractionId,))
                attraction = cursor.fetchone()
                return attraction if attraction else None

    except Exception as e:
        return None
def get_mrt_stations():
    try:
        with create_db_connection() as connection:
            with connection.cursor() as cursor:
                query = "SELECT MRT, COUNT(*) AS attractions_count FROM attractions GROUP BY MRT ORDER BY attractions_count DESC"
                cursor.execute(query)
                results = cursor.fetchall()
                mrt_list = [result[0] for result in results]
                return mrt_list

    except mysql.connector.Error as db_error:
        raise AttractionsError("Database error occurred while fetching MRT stations.")

    except Exception as e:
        raise AttractionsError("An error occurred while fetching MRT stations.")