# 👮 Admin & User Access Setup Guide

## 🎯 Overview

Darshana has a **3-tier role-based access control** system:

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Admin** 👑 | Full Access | All CRUD operations, user management, system settings |
| **Guide** 📚 | Content Creation | Create & edit stories, monuments, manage own content |
| **User** 👤 | Basic Access | View content, book tickets, participate in quests |

---

## 🔐 System Already Has

Your Darshana backend already includes:

✅ **User Model** with role field (`user`, `guide`, `admin`)  
✅ **Auth Middleware** (`protect`, `authorize`)  
✅ **Admin Routes** (`/api/admin/*`)  
✅ **Admin Controller** (user management, analytics)  
✅ **Role-based Authorization** in stories, monuments, etc.

---

## 🚀 Quick Start - Create Admin User

### Method 1: Using Script (Recommended)

```bash
cd Darshana/backend
node src/scripts/createAdmin.js
```

**Follow the prompts:**
```
First Name: Ajay
Last Name: Tiwari
Email: admin@darshana.com
Password: Admin@123456
Confirm Password: Admin@123456
```

✅ **Admin user created!**

### Method 2: Direct Database (MongoDB Mock Mode)

Default admin is already created in mock mode:

```
Email: admin@darshana.com
Password: Admin123
```

### Method 3: API Registration (then update role)

1. Register via `/api/auth/register`
2. Connect to MongoDB:
   ```bash
   mongo "mongodb+srv://ajay:okGoogle936@darshanadb.bxanviv.mongodb.net/darshana"
   ```
3. Update role:
   ```js
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 👥 User Roles Explained

### 1. 👤 User (Default)

**Created when:** Anyone registers via `/api/auth/register`

**Permissions:**
- ✅ View all monuments & stories
- ✅ Book tickets
- ✅ Participate in quests & treasure hunts
- ✅ Chat with Narad AI
- ✅ Update own profile
- ✅ Save favorites
- ❌ Cannot create/edit content
- ❌ Cannot access admin panel

### 2. 📚 Guide

**Created by:** Admin promotes user to guide

**Permissions:**
- ✅ Everything a User can do
- ✅ Create new stories & monuments
- ✅ Edit own stories & monuments
- ✅ View analytics for own content
- ✅ Respond to user comments
- ❌ Cannot delete other users' content
- ❌ Cannot access user management

### 3. 👑 Admin

**Created by:** Running admin creation script or manual DB update

**Permissions:**
- ✅ **Full System Access**
- ✅ User management (create, edit, delete, change roles)
- ✅ Content moderation (approve, reject, delete any content)
- ✅ System settings & configuration
- ✅ View all analytics & reports
- ✅ Ticket management
- ✅ Quest & treasure hunt management

---

## 🛣️ Protected Routes

### Backend API Routes

#### Public Routes (No Auth Required)
```javascript
GET  /api/monuments          // List all monuments
GET  /api/monuments/:id      // View monument details
GET  /api/stories            // List all stories
GET  /api/stories/:id        // View story details
POST /api/auth/register      // Register new user
POST /api/auth/login         // Login
POST /api/ai/chat            // Chat with Narad AI
```

#### User Routes (Auth Required)
```javascript
GET  /api/auth/me            // Get current user
PUT  /api/auth/profile       // Update profile
POST /api/tickets            // Book ticket
GET  /api/tickets/my-tickets // View own tickets
GET  /api/quests             // View quests
POST /api/quests/:id/start   // Start quest
```

#### Guide Routes (Guide or Admin)
```javascript
POST /api/stories            // Create story
PUT  /api/stories/:id        // Edit own story
POST /api/monuments          // Create monument
```

#### Admin Routes (Admin Only)
```javascript
GET    /api/admin/users            // List all users
GET    /api/admin/users/:id        // Get user details
PUT    /api/admin/users/:id        // Update user
DELETE /api/admin/users/:id        // Delete user
PUT    /api/admin/users/:id/role   // Change user role
GET    /api/admin/stats            // System statistics
PUT    /api/stories/:id            // Edit any story
DELETE /api/stories/:id            // Delete any story
```

---

## 💻 Frontend Implementation

### Check User Role in Components

```typescript
// Using AuthContext
import { useAuth } from '@/hooks/useAuth'

function DashboardPage() {
  const { user, isAdmin, isGuide } = useAuth()
  
  if (isAdmin) {
    return <AdminDashboard />
  }
  
  if (isGuide) {
    return <GuideDashboard />
  }
  
  return <UserDashboard />
}
```

### Route Protection (middleware.ts)

```typescript
// Already implemented in src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // Verify admin role
    const user = verifyToken(token)
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}
```

### Conditional Rendering

```tsx
{user?.role === 'admin' && (
  <Link href="/admin">
    <Button>Admin Panel</Button>
  </Link>
)}

{(user?.role === 'admin' || user?.role === 'guide') && (
  <Link href="/create-story">
    <Button>Create Story</Button>
  </Link>
)}
```

---

## 🔧 Backend Middleware Usage

### Protecting Routes with Role Check

```javascript
const { protect, authorize } = require('../middleware/auth')

// Admin only
router.get('/admin/users', 
  protect, 
  authorize('admin'), 
  getAllUsers
)

// Admin or Guide
router.post('/stories', 
  protect, 
  authorize('admin', 'guide'), 
  createStory
)

// All authenticated users
router.get('/profile', 
  protect, 
  getProfile
)
```

---

## 📊 Admin Panel Features

### User Management
```
/admin/users
- View all users
- Search & filter
- Change roles
- Activate/deactivate accounts
- View user activity
```

### Content Moderation
```
/admin/content
- Approve/reject stories
- Edit any content
- Delete inappropriate content
- Featured content management
```

### Analytics Dashboard
```
/admin/analytics
- Total users, stories, monuments
- User registrations over time
- Popular content
- Revenue from tickets
- System health
```

---

## 🧪 Testing Role-Based Access

### Test with cURL

```bash
# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@darshana.com","password":"Admin123"}'

# Save the token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test admin route
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"

# Test as regular user (should get 403 Forbidden)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"User123"}'

USER_TOKEN="..."

curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $USER_TOKEN"
# Response: 403 Forbidden
```

---

## 🔄 Change User Role

### Via Admin API

```javascript
PUT /api/admin/users/:userId/role
Authorization: Bearer <admin_token>

{
  "role": "guide"  // or "admin" or "user"
}
```

### Via Script

```bash
cd Darshana/backend
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.updateOne(
    { email: 'user@example.com' },
    { \$set: { role: 'admin' } }
  );
  console.log('User role updated!');
  process.exit(0);
});
"
```

---

## 🔒 Security Best Practices

### 1. **Never Hardcode Admin Credentials**
```javascript
// ❌ BAD
const ADMIN_EMAIL = 'admin@darshana.com'
const ADMIN_PASSWORD = 'Admin123'

// ✅ GOOD - Use environment variables and creation script
```

### 2. **Always Verify Role on Backend**
```javascript
// ❌ BAD - Trust frontend
if (req.body.isAdmin) {
  // Do admin stuff
}

// ✅ GOOD - Check actual user role
if (req.user.role === 'admin') {
  // Do admin stuff
}
```

### 3. **Use Strong JWT Secrets**
```env
# ❌ BAD
JWT_SECRET=secret

# ✅ GOOD
JWT_SECRET=xK9$mN2pQ7#vF5wL8aR3sT6yU4bE1cD0
```

### 4. **Log Admin Actions**
```javascript
// Log all admin actions
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  console.log(`Admin ${req.user.email} updated user ${req.params.id}`)
  // ... update logic
})
```

---

## 📝 Default Users (Mock Mode)

When using mock data (no MongoDB):

| Email | Password | Role |
|-------|----------|------|
| admin@darshana.com | Admin123 | admin |
| explorer@example.com | Admin123 | user |

---

## 🎯 Quick Commands

```bash
# Create admin user
cd Darshana/backend
node src/scripts/createAdmin.js

# List all users
mongo "mongodb+srv://..." --eval "db.users.find({}, {email:1, role:1})"

# Make user admin
mongo "mongodb+srv://..." --eval "db.users.updateOne({email:'user@example.com'}, {\$set:{role:'admin'}})"

# Check user role
mongo "mongodb+srv://..." --eval "db.users.findOne({email:'admin@darshana.com'}, {role:1})"
```

---

## ❓ Troubleshooting

### "Not authorized to access this route"

**Cause:** No valid token or token expired

**Solution:**
- Login again to get new token
- Check if token is being sent in Authorization header
- Verify JWT_SECRET matches between registration and verification

### "User role is not authorized"

**Cause:** User doesn't have required role

**Solution:**
- Check user role in database
- Update role using admin API or script
- Make sure middleware is checking correct role

### Admin panel not accessible

**Cause:** Frontend route protection or user not admin

**Solution:**
1. Check user role: `console.log(user.role)`
2. Verify middleware is running
3. Check browser console for errors
4. Clear cookies and login again

---

## 🎉 Summary

✅ **Role System:** User, Guide, Admin  
✅ **Admin Creation:** Run `createAdmin.js` script  
✅ **Route Protection:** `protect` + `authorize` middleware  
✅ **Frontend Check:** `useAuth()` hook with `isAdmin`, `isGuide`  
✅ **Backend Routes:** Different endpoints for different roles  

**Next Step:** Run the create admin script and login to test! 🚀

```bash
cd Darshana/backend
node src/scripts/createAdmin.js
```



