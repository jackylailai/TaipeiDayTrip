import os
from dotenv import load_dotenv




load_dotenv()
partner_key=os.environ.get("partner_key")
print("partnerkey",partner_key)
merchant_id=os.environ.get("merchant_id")
print("merchant_id",merchant_id)