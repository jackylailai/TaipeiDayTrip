import mysql.connector
import os
from dotenv import load_dotenv
import os.path
import json
# 載入.env文件中的環境變數
load_dotenv()
# 從環境變數中讀取資料庫配置
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_DATABASE"),
}

connection = mysql.connector.connect(**db_config)
# 建立游標
cursor = connection.cursor()
# cursor其實盡可能不要共用，因為同時開需求就會亂掉
print(connection)
taipei_attractions="taipei-day-trip/data/taipei-attractions.json"
# 讀 JSON 文件
with open(taipei_attractions, 'r', encoding='utf-8') as json_file:
    json_data = json_file.read()
#解析
data = json.loads(json_data)
# 再進入一層
results = data['result']['results']
all_values = []

for i in range(len(results)):#57個results
    # 取 file 的值
	attractions = results[i]
	id=attractions["_id"]
	name=attractions["name"]
	category=attractions["CAT"]
	description=attractions["description"]
	address=attractions["address"]
	transport=attractions["direction"]
	mrt=attractions["MRT"]
	lat=attractions["latitude"]
	lng=attractions["longitude"]
	# for attraction in attractions:
	file_links = attractions["file"]
	# print("filelink",file_links)
	link_list = file_links.split("https://")
	# print("link",link_list)
	# 使用正則表達式匹配 jpg、png 和 JPG 格式的链接
	valid_links = []
	for link in link_list:
		if link.lower().endswith((".jpg", ".png", ".JPG")):
			valid_links.append(f"https://{link}")
	images=json.dumps(valid_links)#將list轉為json字串
	values = (id, name, category, description, address, transport, mrt, lat, lng, images)
	all_values.append(values)

insert_query = (
        "INSERT INTO attractions (id, name, category, description, address, transport, mrt, lat, lng, images) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
cursor.executemany(insert_query,all_values)
connection.commit()
cursor.close()
connection.close()


