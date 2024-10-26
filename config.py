from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI')
    # Add other configuration variables as needed
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    @staticmethod
    def get_mongodb_uri():
        uri = os.getenv('MONGODB_URI')
        if not uri:
            raise ValueError("MongoDB URI not found in environment variables")
        return uri