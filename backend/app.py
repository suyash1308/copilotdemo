from flask import Flask, request, jsonify
from flask_cors import CORS
from db import init_db, User, Wildlife
from config import Config
import re
from datetime import datetime
from bson.objectid import ObjectId

app = Flask(__name__)
app.config.from_object(Config)

# Initialize MongoDB
db = init_db(app)

# Initialize CORS
CORS(app, origins=['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5000', 'http://127.0.0.1:5000'], supports_credentials=True)

# Utility functions
def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_username(username):
    """Validate username format"""
    if len(username) < 3 or len(username) > 80:
        return False, "Username must be between 3 and 80 characters"
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return False, "Username can only contain letters, numbers, hyphens, and underscores"
    return True, ""

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, ""

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User signup endpoint"""
    try:
        data = request.get_json()
        
        # Validate request data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        
        # Validation
        if not username or not email or not password or not password_confirm:
            return jsonify({'error': 'All required fields must be filled'}), 400
        
        # Validate username
        is_valid, msg = validate_username(username)
        if not is_valid:
            return jsonify({'error': msg}), 400
        
        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password
        is_valid, msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': msg}), 400
        
        # Check password confirmation
        if password != password_confirm:
            return jsonify({'error': 'Passwords do not match'}), 400
        
        # Create user in MongoDB
        user_doc = User.create(username, email, password, first_name, last_name)
        user_data = User.to_dict(user_doc)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user_data
        }), 201
        
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 409
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/check-username/<username>', methods=['GET'])
def check_username(username):
    """Check if username is available"""
    try:
        user = User.find_by_username(username)
        return jsonify({'available': user is None}), 200
    except Exception as e:
        return jsonify({'available': True}), 200

@app.route('/api/auth/check-email/<email>', methods=['GET'])
def check_email(email):
    """Check if email is available"""
    try:
        user = User.find_by_email(email)
        return jsonify({'available': user is None}), 200
    except Exception as e:
        return jsonify({'available': True}), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username_or_email = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            return jsonify({'error': 'Username/Email and password are required'}), 400
        
        # Find user by username or email
        user = User.find_by_username_or_email(username_or_email)
        
        if not user:
            return jsonify({'error': 'Invalid username/email or password'}), 401
        
        # Check password
        if not User.verify_password(user, password):
            return jsonify({'error': 'Invalid username/email or password'}), 401
        
        user_data = User.to_dict(user)
        
        return jsonify({
            'message': 'Login successful',
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user information"""
    try:
        from bson.objectid import ObjectId
        users_collection = db.db['users']
        
        try:
            user = users_collection.find_one({'_id': ObjectId(user_id)})
        except:
            return jsonify({'error': 'Invalid user ID'}), 400
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = User.to_dict(user)
        return jsonify(user_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        from bson.objectid import ObjectId
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        try:
            obj_id = ObjectId(user_id)
        except:
            return jsonify({'error': 'Invalid user ID'}), 400
        
        users_collection = db.db['users']
        
        # Check if user exists
        user = users_collection.find_one({'_id': obj_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update allowed fields
        update_data = {'updated_at': datetime.utcnow()}
        
        if 'first_name' in data:
            update_data['first_name'] = data['first_name'].strip()
        if 'last_name' in data:
            update_data['last_name'] = data['last_name'].strip()
        
        result = users_collection.update_one(
            {'_id': obj_id},
            {'$set': update_data}
        )
        
        # Get updated user
        updated_user = users_collection.find_one({'_id': obj_id})
        user_data = User.to_dict(updated_user)
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# ==================== WILDLIFE CRUD OPERATIONS ====================

# CREATE: Add a new wildlife animal
@app.route('/api/wildlife', methods=['POST'])
def create_wildlife():
    """
    CREATE endpoint: Add a new wildlife animal
    
    Expected JSON:
    {
        "name": "Animal Name",
        "description": "Brief description",
        "category": "Big Cats|Birds|Mammals",
        "facts": ["fact1", "fact2", ...],
        "image_url": "optional_url"
    }
    
    Returns: Created animal object with ID
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        category = data.get('category', '').strip()
        facts = data.get('facts', [])
        image_url = data.get('image_url', '')
        
        # Validation
        if not name or not description or not category:
            return jsonify({'error': 'Name, description, and category are required'}), 400
        
        if not isinstance(facts, list) or len(facts) == 0:
            return jsonify({'error': 'Facts must be a non-empty list'}), 400
        
        # Create animal in database
        animal_doc = Wildlife.create(
            name=name,
            description=description,
            category=category,
            facts=facts,
            image_url=image_url if image_url else None
        )
        
        return jsonify({
            'message': 'Wildlife animal created successfully',
            'animal': Wildlife.to_dict(animal_doc)
        }), 201
        
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# READ: Get all wildlife animals with optional filtering
@app.route('/api/wildlife', methods=['GET'])
def get_all_wildlife():
    """
    READ All endpoint: Retrieve all wildlife animals
    
    Query Parameters:
        - category: Filter by category (Big Cats, Birds, Mammals)
        - search: Search by name or description
    
    Returns: List of animal objects
    """
    try:
        # Get query parameters for filtering
        category = request.args.get('category', None)
        search = request.args.get('search', None)
        
        filters = {}
        if category:
            filters['category'] = category
        if search:
            filters['search_text'] = search
        
        animals = Wildlife.read_all(filters if filters else None)
        
        return jsonify({
            'count': len(animals),
            'animals': animals
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# READ: Get a specific wildlife animal by ID
@app.route('/api/wildlife/<animal_id>', methods=['GET'])
def get_wildlife(animal_id):
    """
    READ Single endpoint: Retrieve a specific wildlife animal by ID
    
    Returns: Animal object with details
    """
    try:
        animal = Wildlife.read(animal_id)
        
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        # Increment view count
        Wildlife.increment_views(animal_id)
        
        return jsonify(Wildlife.to_dict(animal)), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# UPDATE: Modify an existing wildlife animal
@app.route('/api/wildlife/<animal_id>', methods=['PUT'])
def update_wildlife(animal_id):
    """
    UPDATE endpoint: Modify an existing wildlife animal
    
    You can update any of these fields:
    {
        "name": "New Name",
        "description": "New description",
        "category": "New category",
        "facts": ["new", "facts", "list"],
        "image_url": "new_image_url"
    }
    
    Returns: Updated animal object
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Check if animal exists first
        animal = Wildlife.read(animal_id)
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        # Validate fields if provided
        if 'name' in data and not data['name'].strip():
            return jsonify({'error': 'Name cannot be empty'}), 400
        
        if 'description' in data and not data['description'].strip():
            return jsonify({'error': 'Description cannot be empty'}), 400
        
        if 'facts' in data:
            if not isinstance(data['facts'], list) or len(data['facts']) == 0:
                return jsonify({'error': 'Facts must be a non-empty list'}), 400
        
        # Prepare update data
        update_kwargs = {}
        if 'name' in data:
            update_kwargs['name'] = data['name'].strip()
        if 'description' in data:
            update_kwargs['description'] = data['description'].strip()
        if 'category' in data:
            update_kwargs['category'] = data['category'].strip()
        if 'facts' in data:
            update_kwargs['facts'] = data['facts']
        if 'image_url' in data:
            update_kwargs['image_url'] = data['image_url']
        
        # Update the animal
        success = Wildlife.update(animal_id, **update_kwargs)
        
        if not success:
            return jsonify({'error': 'No changes made'}), 400
        
        # Get updated animal
        updated_animal = Wildlife.read(animal_id)
        
        return jsonify({
            'message': 'Wildlife animal updated successfully',
            'animal': Wildlife.to_dict(updated_animal)
        }), 200
        
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


# DELETE: Remove a wildlife animal
@app.route('/api/wildlife/<animal_id>', methods=['DELETE'])
def delete_wildlife(animal_id):
    """
    DELETE endpoint: Remove a wildlife animal
    
    Returns: Confirmation message
    """
    try:
        # Check if animal exists first
        animal = Wildlife.read(animal_id)
        if not animal:
            return jsonify({'error': 'Animal not found'}), 404
        
        # Delete the animal
        success = Wildlife.delete(animal_id)
        
        if success:
            return jsonify({
                'message': 'Wildlife animal deleted successfully',
                'deleted_id': animal_id
            }), 200
        else:
            return jsonify({'error': 'Failed to delete animal'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500



def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Starting Authentication Server with MongoDB")
    print("="*60)
    print("✓ Backend API: http://localhost:5000")
    print("✓ Frontend: http://localhost:8000")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000)
