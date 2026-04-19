# Admin Registration Issue - Fix Guide

## What's Happening
- Your backend is NOT returning `role: "admin"` when you register and login as admin
- The admin dashboard checks: `if (currentUser.role !== 'admin')` and redirects if false
- You need to verify your backend API is correctly saving the admin role

---

## Step 1: Test Your API (Use the Debug Page)

1. Open the debug page: `debug.html` in your browser
2. Fill in registration details:
   - Email: `admin@test.com`
   - Name: `Test Admin`
   - Password: `password123`
3. Click "Register as Admin"
4. **Check the response**: Look for `"role": "admin"` in the response JSON

**Expected output:**
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "Test Admin",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

**If you see `"role": "student"` instead of `"role": "admin"`, the backend is not handling admin registration correctly.**

---

## Step 2: Backend Issues to Check

Since your backend is in Docker, you need to verify it's doing:

### A. Accept role in registration
```
POST /api/auth/register
{
  "name": "Test Admin",
  "email": "admin@test.com", 
  "password": "password123",
  "role": "admin"        <-- Backend must accept and validate this
}
```

### B. Return correct role in response
The backend response MUST include:
```json
{ "user": { "role": "admin" } }
```

### C. Store role in database
The MongoDB user document MUST have:
```json
{ "role": "admin" }
```

### D. Return role on login
When logging in, the response MUST include the user's role as saved in database

---

## Step 3: Verify Backend Container

Run these commands to check if backend is working:

```powershell
# Check Docker containers
docker ps

# Check logs
docker logs complaint-backend

# Check if backend is responding
Invoke-WebRequest -Uri "http://localhost:5001/api/auth/register" -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Admin","email":"admin@test.com","password":"password123","role":"admin"}'
```

---

## Step 4: Check Database Directly

Connect to MongoDB and verify user was created with admin role:

```bash
# Inside MongoDB container
db.users.find({ email: "admin@test.com" }).pretty()

# Should show:
# { "_id": ..., "email": "admin@test.com", "role": "admin", ... }
```

---

## Step 5: If Backend is Using Default Role

**Solution**: Update your backend code to:

1. **Accept role from frontend** in registration:
   ```javascript
   app.post('/auth/register', (req, res) => {
     const { name, email, password, role } = req.body;  // Accept role
     
     // Validate admin code if role is admin
     if (role === 'admin' && body.adminCode !== 'ADMIN2025') {
       return res.status(400).json({ msg: 'Invalid admin code' });
     }
     
     // Create user with the provided role (not hardcoded as 'student')
     const user = new User({ name, email, password, role });
     // ... save and return
   });
   ```

2. **Return role on login**:
   ```javascript
   app.post('/auth/login', (req, res) => {
     const user = findUser(email);
     // ... authenticate ...
     res.json({
       token: token,
       user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role  // MUST include this
       }
     });
   });
   ```

---

## Step 6: Full Solution Checklist

- [ ] Backend accepts `role` parameter in `/auth/register`
- [ ] Backend validates admin code if `role === 'admin'`
- [ ] Backend saves the role to MongoDB (doesn't default to 'student')
- [ ] Backend returns `role` in both registration and login responses
- [ ] Clear browser localStorage and try again: `localStorage.clear()`
- [ ] Test API with debug.html and see `role: "admin"` in response
- [ ] Register as admin with code `ADMIN2025`
- [ ] Login with the admin account
- [ ] Admin dashboard should now load without redirect

---

## Quick Test Without Changing Backend

If you can't modify the backend code immediately:

1. Open browser console (F12)
2. Type:
   ```javascript
   localStorage.setItem('user', JSON.stringify({
     id: "test123",
     name: "Admin",
     email: "admin@test.com",
     role: "admin"
   }));
   localStorage.setItem('token', 'test-token-123');
   window.location.href = 'admin-dashboard.html';
   ```

This will temporarily allow you to test the admin dashboard while you fix the backend.

---

## Support Files

- **debug.html** - Test your API responses
- **admin-dashboard.html** - Now shows better error messages
- **student-dashboard.html** - Now shows better error messages
