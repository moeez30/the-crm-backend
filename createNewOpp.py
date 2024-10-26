from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import sys
from config import Config

try:
    Received = json.loads(sys.stdin.read())
    print(Received)
except Exception as e:
    print(e)


uri = "mongodb+srv://amoeezkhan01:RKlVkCAZ5Ao4zcDl@myfirstcrm.b3uax.mongodb.net/?retryWrites=true&w=majority&appName=myFirstCRM"
# Create a new client and connect to the server
dbClient = MongoClient(Config.get_mongodb_uri())
# Send a ping to confirm a successful connection
try:
    db = dbClient["firstCRM"]
    collection = db["OpportunityData"]
    myData = Received
    collection.insert_one(myData)
except Exception as e:
    print(e)