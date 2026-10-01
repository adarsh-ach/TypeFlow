# ✨ TypeFlow

**TypeFlow** is a full-stack typing practice web application designed to help users improve their typing **speed and accuracy** through interactive typing challenges.

Users can create an account, verify their email using a one-time verification code, complete two typing rounds, and track their typing performance.

---

## 🚀 Live Demo

**TypeFlow:**  
https://type-flow-brown.vercel.app

The application is also deployed on Render:

https://typeflow-o64w.onrender.com

---

## ✨ Features

### ⌨️ Typing Practice

- Random typing words
- Character-by-character typing
- Incorrect characters must be corrected before continuing
- Space required after each completed word
- Two typing rounds
- 15 words per round
- Accuracy calculation
- Words Per Minute (WPM) calculation
- Progress indicator
- Interactive on-screen keyboard
- Physical keyboard support

### 📊 Results & History

- Round 1 accuracy
- Round 1 WPM
- Round 2 accuracy
- Round 2 WPM
- Performance comparison between rounds
- Typing history stored in MySQL
- User-specific results
- Dashboard statistics

### 🔐 Authentication

- User registration
- Password confirmation
- Password hashing
- Email verification
- 6-digit verification code
- Verification code expiration
- Login and logout
- Protected user sessions

### 🎨 User Interface

- Modern dark interface
- Glass-style UI
- Responsive design
- Animated elements
- Typing progress bar
- Interactive keyboard
- Dashboard
- Typing history

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Flask
- Gunicorn

### Database

- MySQL
- Aiven Cloud

### Email Verification

- Resend

### Development & Deployment

- Git
- GitHub
- Vercel
- Render
- Aiven

---

## 📁 Project Structure

```text
TypeFlow/
│
├── static/
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── history.css
│   │   ├── login.css
│   │   ├── register.css
│   │   └── typing.css
│   │
│   └── js/
│       └── typing.js
│
├── templates/
│   ├── dashboard.html
│   ├── history.html
│   ├── login.html
│   ├── register.html
│   ├── typing.html
│   └── verify_email.html
│
├── app.py
├── requirements.txt
├── README.md
└── .gitignore
