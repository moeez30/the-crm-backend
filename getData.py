try:
    import json
    import string
    import sys
    import time
    import pymongo
    from pymongo.mongo_client import MongoClient
    from pymongo.server_api import ServerApi
    from config import Config

    try:
        Received = json.loads(sys.stdin.read())
        type = Received['dataType']
        resourceID = Received['ID']
        
        #print(Received)
    except Exception as e:
        print(e)

    dbClient = MongoClient(Config.get_mongodb_uri())
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
        
    def getExpensesData(name):
        theCollection = db["ExpensesData"]
        if(name == "All"):
            userList = list(theCollection.find({},{"_id": 0}))
            return userList
        else:
            return theCollection.find({"firstName":name},{"_id": 0})

    def getEdittingPermission(name):
        theCollection = db["EdittingPermission"]
        if(name == "All"):
            editPermission = (theCollection.find_one({},{"_id": 0}))
            return editPermission
        else:
            return bool(theCollection.find({"permission":name},{"_id": 0}))

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
    elif(type == "ExpensesData"):
        theData = getExpensesData(resourceID)
        # print(theData)
        try:
            sys.stdout.write(json.dumps(theData))
        except Exception as e:
            print(e)
    elif(type == "editPermission"):
        theData = getEdittingPermission(resourceID)
        #print(theData)
        try:
            sys.stdout.write(json.dumps(theData))
        except Exception as e:
            print(e)

except Exception as e:
    print(e)