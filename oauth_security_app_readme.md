# OAuth Security App

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## Overview

The **OAuth Security App** is a secure authentication system built with **Node.js**, **Express**, and **JWT**.  
It provides registration, login, OAuth-based authentication, and password reset functionalities following modern web security standards.

---

## Features

- User registration and login
- Google OAuth 2.0 login
- JWT-based authentication
- Password reset via email
- CSRF protection and input validation
- Responsive and mobile-friendly UI

---

## Setup Instructions

1. **Clone the repository**:
```bash
git clone https://github.com/your-repo/oauth-security-app.git
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create a `.env` file**:
```env
MONGO_URI=mongodb+srv://...
EMAIL_USER=your_email
EMAIL_PASS=your_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_REDIRECT_URI=your_google_redirect_uri
GOOGLE_SECRET=your_google_secret
SESSION_SECRET=your_session_secret
```

4. **Run the server**:
```bash
npm start
```

---

## Google OAuth Setup

To enable Google OAuth 2.0 in your app:

1. Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).  
2. Create or select a project.  
3. Navigate to **APIs & Services → Credentials**.  
4. Click **Create Credentials → OAuth Client ID**.  
5. Choose **Web Application**.  
6. Add authorized redirect URIs:
```
http://localhost:3000/auth/google/callback
```
7. Copy the **Client ID** and **Client Secret** and add them to your `.env`.

> ⚙️ **Pro Tip:** Ensure the Google+ API is enabled under **APIs & Services → Library** to allow user info retrieval.

---

## API Endpoints

### 1. Register
```
POST /auth/register-action
Body:
{
  "email": "user@example.com",
  "password": "your_password"
}
Response:
{
  "success": true,
  "message": "Account created successfully"
}
```

### 2. Login
```
POST /auth/login
Body:
{
  "email": "user@example.com",
  "password": "your_password"
}
Response:
{
  "token": "JWT_TOKEN_HERE",
  "message": "Login successful"
}
```

### 3. Forgot Password
```
POST /auth/forgot-password
Body:
{
  "email": "user@example.com"
}
Response:
{
  "message": "Password reset link sent to email"
}
```

### 4. Google OAuth Login
```
GET /auth/google
Redirects to Google OAuth consent screen.

Callback:
GET /auth/google/callback
Response:
{
  "token": "JWT_TOKEN_HERE",
  "user": { "email": "user@example.com" }
}
```

---

## Security Practices

- Passwords are hashed using **bcrypt**  
- JWT tokens are signed and verified with **JWT_SECRET**  
- OAuth credentials are securely stored using environment variables  
- Session expiration enforced via JWT expiry  
- CSRF protection and input validation applied on all routes

---

## Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** JWT, OAuth 2.0  
- **Email Service:** Nodemailer  
- **Frontend:** Tailwind CSS, Font Awesome, Alpine.js

---

## Contribution

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---
