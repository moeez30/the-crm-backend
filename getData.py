import json
import string
import sys
import time
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

try:
    Received = json.loads(sys.stdin.read())
    type = Received['dataType']
    resourceID = Received['ID']
    
    # print(Received)
except Exception as e:
    print(e)

uri = "mongodb+srv://amoeezkhan01:RKlVkCAZ5Ao4zcDl@myfirstcrm.b3uax.mongodb.net/?retryWrites=true&w=majority&appName=myFirstCRM"
dbClient = MongoClient(uri, server_api=ServerApi('1'))
db = dbClient["firstCRM"]


def getUserData(name):
    theCollection = db["UserData"]
    if(name == "All"):
        userList = list(theCollection.find({},{"_id": 0}))
        return userList
    else:
        return theCollection.find({"firstName":name},{"_id": 0})
    
    
def getOppData(name):
    theCollection = db["OpportunityData"]
    if(name == "All"):
        userList = list(theCollection.find({},{"_id": 0}))
        return userList
    else:
        return theCollection.find({"firstName":name},{"_id": 0})


if(type == "UserData"):
    theData = getUserData(resourceID)
    # print(theData)
    try:
        sys.stdout.write(json.dumps(theData))
    except Exception as e:
        print(e)
elif(type == "OppData"):
    theData = getOppData(resourceID)
    # print(theData)
    try:
        sys.stdout.write(json.dumps(theData))
    except Exception as e:
        print(e)