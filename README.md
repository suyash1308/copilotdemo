# Authentication Web Application

A complete authentication system with Login and Signup pages built with Vue.js frontend and Python Flask backend.

## Features

✅ **User Registration (Signup)**
- Username validation (3-80 characters, alphanumeric with hyphens/underscores)
- Email validation
- Strong password requirements (min 6 chars, 1 uppercase, 1 lowercase, 1 number)
- Password confirmation matching
- First and last name input
- Real-time password strength indicator
- Duplicate user/email checking

✅ **User Login**
- Login with username or email
- Password verification
- Clear error messages
- Input validation

✅ **Security Features**
- Password hashing using Werkzeug
- Email format validation
- Input sanitization
- CORS enabled for frontend-backend communication
- SQL injection prevention with SQLAlchemy ORM

✅ **Frontend**
- Modern, responsive design
- Vue.js 3 components
- Real-time form validation
- Password visibility toggle
- Success/error alerts
- Mobile-friendly UI
- Smooth animations

✅ **Backend**
- Flask web framework
- SQLite database
- User model with password hashing
- RESTful API endpoints
- Comprehensive error handling
- Data persistence

## Project Structure

```
copilotdemo/
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # CSS styling
│   └── app.js            # Vue.js application
├── backend/
│   ├── app.py            # Flask application and routes
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   └── requirements.txt   # Python dependencies
└── README.md             # This file
```

## Prerequisites

- Python 3.8+
- Node.js (optional, for serving frontend)
- Modern web browser

## Installation & Setup

### Step 1: Set Up Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Step 2: Run the Backend Server

1. From the backend directory with virtual environment activated:
```bash
python app.py
```

You should see:
```
WARNING in app.runserver...
 * Running on http://127.0.0.1:5000
```

The backend API will be running at `http://localhost:5000`

### Step 3: Set Up Frontend

The frontend is a single-page application that can be served directly. You have two options:

#### Option A: Simple HTTP Server (Recommended)
```bash
# Navigate to frontend directory
cd frontend

# Using Python (Python 3.8+)
python -m http.server 8000

# Or using Python 3
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

#### Option B: Direct File Access
Simply open the `frontend/index.html` file directly in your browser by:
- Double-clicking the file, or
- Right-click → Open with → Browser

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### User Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

Response (Success - 201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2026-03-03T10:30:45.123456"
  }
}
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

Response (Success - 200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2026-03-03T10:30:45.123456"
  }
}
```

### Get User
```
GET /api/auth/user/{user_id}
```

### Update User
```
PUT /api/auth/user/{user_id}
Content-Type: application/json

{
  "first_name": "Johnny",
  "last_name": "Smith"
}
```

## Usage

1. **Open the application** in your browser
2. **Sign Up**: Click "Sign Up" to create a new account
   - Enter valid username (3+ characters, alphanumeric with hyphens/underscores)
   - Enter valid email address
   - Enter first and last name
   - Create a strong password (must include uppercase, lowercase, and number)
   - Confirm password
   - Click "Create Account"

3. **Log In**: Use your credentials to sign in
   - Enter username or email
   - Enter password
   - Click "Sign In"

4. **Form Validation**: All fields have real-time validation
   - Invalid inputs are highlighted with error messages
   - Submit button is only enabled when form is valid
   - Success/error alerts appear after submission

## Validation Rules

### Username
- 3-80 characters
- Only alphanumeric, hyphens, and underscores

### Email
- Must be valid email format
- Unique in database

### Password
- Minimum 6 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

### Names
- First and last name required during signup
- Cannot be empty

## Error Handling

The application handles various error scenarios:

- **Duplicate Username**: Returns 409 Conflict
- **Duplicate Email**: Returns 409 Conflict
- **Invalid Format**: Returns 400 Bad Request
- **Authentication Failed**: Returns 401 Unauthorized
- **Server Error**: Returns 500 Internal Server Error

All errors display clear, user-friendly messages on the frontend.

## Database

The application uses SQLite with the following schema:

### Users Table
```
- id (Integer, Primary Key)
- username (String, Unique, Indexed)
- email (String, Unique, Indexed)
- password_hash (String)
- first_name (String)
- last_name (String)
- created_at (DateTime)
- updated_at (DateTime)
```

Database file: `auth_app.db` (created automatically in backend directory)

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify all firewall settings

### Port already in use
- Change port in `app.py` line: `app.run(debug=True, port=5000)`
- Or kill the process using the port

### Database errors
- Delete `auth_app.db` file and restart backend
- Database will be recreated automatically

### Password validation not working
- Ensure password contains: uppercase, lowercase, and number
- Check the password requirements displayed below the password field

## Development

### To modify the application:

**Backend Changes:**
1. Edit files in the `backend/` directory
2. Restart `python app.py`
3. Database changes may require deleting `auth_app.db`

**Frontend Changes:**
1. Edit files in the `frontend/` directory
2. Refresh browser (Ctrl+R or Cmd+R)
3. Open browser console (F12) to debug

## Security Notes

⚠️ **Important**: This is a demonstration application. For production:

1. Change `SECRET_KEY` in `config.py`
2. Use HTTPS instead of HTTP
3. Add CSRF protection
4. Implement JWT tokens for session management
5. Add rate limiting
6. Use environment variables for sensitive data
7. Add email verification
8. Implement password reset functionality
9. Add logging and monitoring
10. Use a production database (PostgreSQL, MySQL)

## License

Open source for educational purposes.

## Support

For issues or questions, check:
1. Browser console (F12) for frontend errors
2. Terminal output for backend errors
3. Database file exists (`auth_app.db`)
4. All ports are accessible
