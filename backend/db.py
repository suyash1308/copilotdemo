from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# MongoDB connection
class Database:
    def __init__(self, uri):
        self.client = MongoClient(uri)
        self.db = self.client.get_database()
    
    def close(self):
        self.client.close()

# Initialize database
db = None

def init_db(app):
    """Initialize database connection"""
    global db
    from config import Config
    db = Database(Config.MONGO_URI)
    
    # Create indexes for better performance
    users_collection = db.db['users']
    users_collection.create_index('username', unique=True)
    users_collection.create_index('email', unique=True)
    
    print("✓ MongoDB connected successfully")
    print(f"✓ Database: {db.db.name}")
    print("✓ Collections initialized")
    
    return db

class User:
    """User model for MongoDB"""
    
    @staticmethod
    def create(username, email, password, first_name, last_name):
        """Create a new user"""
        users_collection = db.db['users']
        
        # Check if user already exists
        if users_collection.find_one({'username': username}):
            raise ValueError('Username already exists')
        
        if users_collection.find_one({'email': email}):
            raise ValueError('Email already registered')
        
        # Validate password
        if len(password) < 6:
            raise ValueError('Password must be at least 6 characters long')
        
        # Create user document
        user_doc = {
            'username': username,
            'email': email,
            'password_hash': generate_password_hash(password),
            'first_name': first_name,
            'last_name': last_name,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = str(result.inserted_id)
        return user_doc
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        users_collection = db.db['users']
        user = users_collection.find_one({'username': username})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        users_collection = db.db['users']
        user = users_collection.find_one({'email': email})
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def find_by_username_or_email(username_or_email):
        """Find user by username or email"""
        users_collection = db.db['users']
        user = users_collection.find_one({
            '$or': [
                {'username': username_or_email},
                {'email': username_or_email}
            ]
        })
        if user:
            user['_id'] = str(user['_id'])
        return user
    
    @staticmethod
    def verify_password(user, password):
        """Verify user password"""
        return check_password_hash(user['password_hash'], password)
    
    @staticmethod
    def to_dict(user):
        """Convert user document to dictionary"""
        return {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'first_name': user.get('first_name', ''),
            'last_name': user.get('last_name', ''),
            'created_at': user['created_at'].isoformat() if user.get('created_at') else None
        }
    
    @staticmethod
    def update(user_id, first_name=None, last_name=None):
        """Update user information"""
        from bson.objectid import ObjectId
        users_collection = db.db['users']
        
        update_data = {'updated_at': datetime.utcnow()}
        
        if first_name:
            update_data['first_name'] = first_name
        if last_name:
            update_data['last_name'] = last_name
        
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return result.modified_count > 0


class Wildlife:
    """Wildlife Animal model for MongoDB - CRUD Operations"""
    
    @staticmethod
    def create(name, description, category, facts, image_url=None):
        """
        CREATE: Add a new wildlife animal to database
        
        Logic:
        1. Validate all required fields are provided
        2. Create a document with metadata (timestamps, id)
        3. Insert into MongoDB 'wildlife' collection
        4. Return the created document with assigned ID
        
        Args:
            name: Animal's common name
            description: Brief description of the animal
            category: Category (Big Cats, Mammals, Birds)
            facts: List of interesting facts about the animal
            image_url: Optional image URL
        
        Returns:
            Dictionary containing the created animal document
        """
        if not name or not description or not category:
            raise ValueError('Name, description, and category are required')
        
        if not isinstance(facts, list) or len(facts) == 0:
            raise ValueError('Facts must be a non-empty list')
        
        wildlife_collection = db.db['wildlife']
        
        # Create the animal document
        animal_doc = {
            'name': name,
            'description': description,
            'category': category,
            'facts': facts,
            'image_url': image_url or None,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'view_count': 0
        }
        
        result = wildlife_collection.insert_one(animal_doc)
        animal_doc['_id'] = str(result.inserted_id)
        return animal_doc
    
    @staticmethod
    def read(animal_id):
        """
        READ (Single): Get a specific animal by ID
        
        Logic:
        1. Convert string ID to MongoDB ObjectId
        2. Query the collection for matching document
        3. Return the animal data
        4. Handle invalid IDs gracefully
        
        Args:
            animal_id: MongoDB ObjectId as string
        
        Returns:
            Dictionary with animal data or None if not found
        """
        from bson.objectid import ObjectId
        wildlife_collection = db.db['wildlife']
        
        try:
            obj_id = ObjectId(animal_id)
        except:
            return None
        
        animal = wildlife_collection.find_one({'_id': obj_id})
        if animal:
            animal['_id'] = str(animal['_id'])
        return animal
    
    @staticmethod
    def read_all(filters=None):
        """
        READ (All): Get all animals with optional filtering
        
        Logic:
        1. Build query filter (default: no filter = all records)
        2. Query MongoDB for matching documents
        3. Convert results to list format
        4. Support filtering by category or name
        
        Args:
            filters: Dictionary with filter criteria (category, search_text)
        
        Returns:
            List of animal documents
        """
        wildlife_collection = db.db['wildlife']
        query = {}
        
        if filters:
            # Filter by category
            if 'category' in filters and filters['category']:
                query['category'] = filters['category']
            
            # Search by name or description
            if 'search_text' in filters and filters['search_text']:
                search_text = filters['search_text']
                query['$or'] = [
                    {'name': {'$regex': search_text, '$options': 'i'}},
                    {'description': {'$regex': search_text, '$options': 'i'}}
                ]
        
        animals = list(wildlife_collection.find(query).sort('created_at', -1))
        
        # Convert ObjectId to string for JSON serialization
        for animal in animals:
            animal['_id'] = str(animal['_id'])
        
        return animals
    
    @staticmethod
    def update(animal_id, **kwargs):
        """
        UPDATE: Modify an existing animal record
        
        Logic:
        1. Validate the animal exists first
        2. Prepare update data with only provided fields
        3. Add updated_at timestamp
        4. Perform MongoDB update operation
        5. Return success status
        
        Args:
            animal_id: MongoDB ObjectId as string
            **kwargs: Fields to update (name, description, category, facts, etc)
        
        Returns:
            Boolean indicating if update was successful
        """
        from bson.objectid import ObjectId
        wildlife_collection = db.db['wildlife']
        
        try:
            obj_id = ObjectId(animal_id)
        except:
            return False
        
        # Check if animal exists
        if not wildlife_collection.find_one({'_id': obj_id}):
            raise ValueError('Animal not found')
        
        # Only allow these fields to be updated
        allowed_fields = {'name', 'description', 'category', 'facts', 'image_url'}
        update_data = {k: v for k, v in kwargs.items() if k in allowed_fields}
        
        if not update_data:
            return False
        
        # Add timestamp
        update_data['updated_at'] = datetime.utcnow()
        
        result = wildlife_collection.update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def delete(animal_id):
        """
        DELETE: Remove an animal record from database
        
        Logic:
        1. Convert string ID to MongoDB ObjectId
        2. Delete the document with matching ID
        3. Return success status based on deletion count
        4. Handle invalid IDs gracefully
        
        Args:
            animal_id: MongoDB ObjectId as string
        
        Returns:
            Boolean indicating if deletion was successful
        """
        from bson.objectid import ObjectId
        wildlife_collection = db.db['wildlife']
        
        try:
            obj_id = ObjectId(animal_id)
        except:
            return False
        
        result = wildlife_collection.delete_one({'_id': obj_id})
        return result.deleted_count > 0
    
    @staticmethod
    def increment_views(animal_id):
        """
        Increment view count when animal is viewed
        
        Logic:
        1. Find the animal by ID
        2. Increment the view_count by 1
        3. Update the record atomically
        
        Args:
            animal_id: MongoDB ObjectId as string
        
        Returns:
            Boolean indicating success
        """
        from bson.objectid import ObjectId
        wildlife_collection = db.db['wildlife']
        
        try:
            obj_id = ObjectId(animal_id)
        except:
            return False
        
        result = wildlife_collection.update_one(
            {'_id': obj_id},
            {'$inc': {'view_count': 1}}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def to_dict(animal):
        """Convert animal document to dictionary for JSON response"""
        return {
            'id': str(animal['_id']),
            'name': animal.get('name'),
            'description': animal.get('description'),
            'category': animal.get('category'),
            'facts': animal.get('facts', []),
            'image_url': animal.get('image_url'),
            'view_count': animal.get('view_count', 0),
            'created_at': animal.get('created_at').isoformat() if animal.get('created_at') else None,
            'updated_at': animal.get('updated_at').isoformat() if animal.get('updated_at') else None
        }
