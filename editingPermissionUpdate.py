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

# Create a new client and connect to the server
dbClient = MongoClient(Config.get_mongodb_uri())
# Send a ping to confirm a successful connection

try:
    # Access the database and collection
    db = dbClient["firstCRM"]
    collection = db["EdittingPermission"]

    # Check if the collection is empty
    if collection.count_documents({}) == 0:
        # If the collection is empty, insert the received data
        collection.insert_one(Received)
        print("Data inserted into the collection.")
    else:
        # If the collection is not empty, replace the existing data
        collection.delete_many({})  # Delete all existing documents
        collection.insert_one(Received)  # Insert the new data
        print("Existing data replaced with the received data.")
except Exception as e:
    print("Error interacting with MongoDB:", e)
finally:
    # Close the MongoDB connection
    dbClient.close()