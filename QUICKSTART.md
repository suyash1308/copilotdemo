# Quick Start Guide

## ⚡ Get the Application Running in 2 Minutes

### Prerequisites
- Python 3.8+ installed
- Any modern web browser

---

## 🚀 Step 1: Start the Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Expected Output:**
```
WARNING in app.runserver...
 * Running on http://127.0.0.1:5000
```

✅ Backend is now running on `http://localhost:5000`

---

## 🌐 Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
python -m http.server 8000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ Frontend is now running on `http://localhost:8000`

---

## 🎮 Step 3: Open the App

Open your browser and go to: **http://localhost:8000**

---

## 📝 Test the Application

### Test Signup:
1. Click "Sign Up" tab
2. Enter the following:
   - Username: `testuser123`
   - Email: `test@example.com`
   - First Name: `John`
   - Last Name: `Doe`
   - Password: `TestPass123` (must have uppercase, lowercase, and number)
   - Confirm Password: `TestPass123`
3. Click "Create Account"
4. See success message

### Test Login:
1. Click "Sign In" tab
2. Enter:
   - Username: `testuser123` (or email: `test@example.com`)
   - Password: `TestPass123`
3. Click "Sign In"
4. See success message

---

## 🔍 What's Working

✅ User Registration with validation
✅ User Login with authentication
✅ Password hashing and security
✅ Email validation
✅ Real-time form validation
✅ Error handling and user feedback
✅ Responsive design
✅ Database persistence

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5000 in use** | Change port in `backend/app.py` line 67: `app.run(debug=True, port=5001)` |
| **Port 8000 in use** | Run: `python -m http.server 8001` instead |
| **Frontend can't connect to backend** | Check backend is running on port 5000 |
| **ModuleNotFoundError** | Run: `pip install -r requirements.txt` in backend folder |
| **Database errors** | Delete `backend/instance/auth_app.db` and restart |

---

## 📱 Features Demo

### Signup Form
- Real-time password strength indicator
- Username availability checking
- Password requirements display
- Form validation on blur

### Login Form
- Login with username or email
- Password visibility toggle
- Clear error messages
- Successful authentication

### Validation
- Username: 3-80 chars, alphanumeric with hyphens/underscores
- Email: Valid email format
- Password: Min 6 chars, 1 uppercase, 1 lowercase, 1 number
- Names: Required fields

---

## 📂 Project Files

```
copilotdemo/
├── backend/
│   ├── app.py              # Flask app + API routes
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── requirements.txt     # Python dependencies
│   └── instance/
│       └── auth_app.db     # SQLite database (auto-created)
├── frontend/
│   ├── index.html          # Main page
│   ├── styles.css          # Styling
│   ├── app.js              # Vue.js app logic
├── README.md               # Full documentation
└── QUICKSTART.md           # This file
```

---

## 🔒 Security Features

- Password hashing with Werkzeug
- SQL injection prevention (SQLAlchemy ORM)
- Email validation
- Input sanitization
- CORS enabled for localhost
- Duplicate user/email checking
- Strong password requirements

---

## 📚 API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/<id>` - Get user info
- `PUT /api/auth/user/<id>` - Update user
- `GET /api/health` - Health check

---

## 💡 Next Steps

1. ✅ Test signup and login
2. ✅ Try invalid inputs (see validation)
3. ✅ Check database file created
4. ✅ Review code in `backend/app.py` and `frontend/app.js`

---

## ❓ Questions?

Check the full `README.md` for comprehensive documentation.
