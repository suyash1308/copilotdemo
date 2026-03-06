# MongoDB Setup Guide

## Two Options for MongoDB

Choose one of the following options to use MongoDB with this application:

### Option 1: MongoDB Atlas (Cloud) - Recommended ✅

**Advantages:**
- No local installation needed
- Automatic backups
- Accessible from anywhere
- Free tier available (up to 512MB)
- Industry standard

**Steps:**

1. **Sign up for MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Click "Create a Project"

2. **Create a Cluster**
   - Select "Build a Database"
   - Choose "Free" tier
   - Select your region (closest to you)
   - Click "Create"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (for development)
   - Click "Confirm"

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Select "Built-in Role: Atlas admin"
   - Click "Create User"

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update Configuration**
   - Open `backend/config.py`
   - Replace `MONGO_URI` with your connection string:
   ```python
   MONGO_URI = 'mongodb+srv://username:password@cluster.mongodb.net/auth_app?retryWrites=true&w=majority'
   ```

---

### Option 2: MongoDB Local Installation

**Advantages:**
- Complete control
- Works offline
- No internet required
- Good for development

**Installation Steps:**

#### Windows:

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows
   - Download the .msi installer

2. **Install MongoDB**
   - Run the installer
   - Select "Install MongoDB as a Service"
   - Complete the installation

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   - Open Services (services.msc)
   - Find "MongoDB"
   - Right-click and select "Start"
   
   OR run in terminal:
   ```bash
   net start MongoDB
   ```

5. **Configuration**
   - Default `MONGO_URI` in `config.py` is: `mongodb://localhost:27017/auth_app`
   - No changes needed if using default configuration

#### macOS (using Homebrew):

1. **Install Homebrew** (if not installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install MongoDB**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

3. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

#### Linux (Ubuntu/Debian):

```bash
# Import the GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

---

## Installation & Setup

1. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

3. **Run Backend Server**
   ```bash
   python app.py
   ```

4. **Run Frontend Server** (in another terminal)
   ```bash
   cd frontend
   python -m http.server 8000
   ```

5. **Access Application**
   - Open browser and go to `http://localhost:8000`

---

## MongoDB Collections

Your `auth_app` database will contain:

### **users Collection**
Stores all user account information:

```javascript
{
  _id: ObjectId("..."),
  username: "john_doe",
  email: "john@example.com",
  password_hash: "$2b$12$...",
  first_name: "John",
  last_name: "Doe",
  created_at: ISODate("2026-03-03T10:30:45Z"),
  updated_at: ISODate("2026-03-03T10:30:45Z")
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

---

## Verify MongoDB Connection

### Using Command Line:

```bash
# Windows/macOS/Linux
mongo

# In MongoDB shell
use auth_app
db.users.find()
```

### Using MongoDB Compass (GUI):

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Install and open
3. For local: Connect to `mongodb://localhost:27017/`
4. For Atlas: Paste your connection string
5. Browse `auth_app` database

---

## Troubleshooting

### Issue: "Connection refused"
- **Local:** Make sure MongoDB is running (`mongod` process)
- **Atlas:** Check IP whitelist and connection string

### Issue: "Authentication failed"
- **Atlas:** Verify username and password in connection string
- **Local:** Usually no authentication needed unless configured

### Issue: "Module not found: pymongo"
```bash
pip install pymongo dnspython
```

### Issue: "Server not responding"
- Check if MongoDB process is running
- Check firewall settings
- Verify port 27017 is accessible

---

## Data Security Notes ⚠️

For **production**, remember to:
1. Use strong database passwords
2. Enable MongoDB IP whitelisting
3. Use SSL/TLS connections
4. Enable authentication
5. Regular backups
6. Store credentials in environment variables
7. Never commit `.env` files to git

---

## Environment Variables (.env)

Create a `.env` file in the backend folder:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_app?retryWrites=true&w=majority
SECRET_KEY=your-super-secret-key-here-change-in-production
```

Then update `config.py`:
```python
MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/auth_app'
SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
```

---

## Next Steps

After MongoDB is set up:
1. ✅ Install Python dependencies
2. ✅ Start MongoDB
3. ✅ Run backend server
4. ✅ Run frontend server
5. ✅ Test signup and login
6. ✅ Check MongoDB for stored user data

All user credentials will now be securely stored in MongoDB! 🎉
