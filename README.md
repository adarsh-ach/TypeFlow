# ⌨️ TypeFlow

**TypeFlow** is a full-stack typing practice web application designed to help users improve their typing **accuracy and speed** through interactive typing rounds.

Users can create an account, verify their email using a one-time verification code, complete typing tests, and view their typing results.

---

## 🚀 Live Deployment

TypeFlow is deployed using:

* **Frontend & Backend:** Render
* **Database:** Aiven MySQL
* **Email Verification:** Resend
* **Source Code:** GitHub

The application can be accessed through its Render deployment URL.

---

## ✨ Features

### 🔐 User Authentication

* User registration
* Email and password authentication
* Password confirmation during registration
* 6-digit email verification code
* Verification code expires after 10 minutes
* Login and logout
* Session-based authentication

### ⌨️ Typing Practice

* Random typing words
* Character-by-character typing
* Incorrect characters must be corrected before continuing
* Space required after each word
* Two typing rounds
* 15 words per round
* Accuracy calculation
* Words Per Minute (WPM) calculation
* Progress indicator
* Interactive on-screen keyboard
* Physical keyboard support

### 📊 Results & History

* Round 1 accuracy
* Round 1 WPM
* Round 2 accuracy
* Round 2 WPM
* Comparison between rounds
* Typing history saved in MySQL
* User-specific results

### 🎨 User Interface

* Dark modern interface
* Glass-style UI
* Responsive design
* Animated elements
* Typing progress bar
* Active keyboard keys
* Dashboard and history pages

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask

### Database

* MySQL

### Email

* Resend

### Deployment

* GitHub
* Render
* Aiven

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
```

---

## 🗄️ Database

TypeFlow uses MySQL.

### Users Table

The `users` table stores:

* User ID
* Email
* Password hash
* Email verification status
* Verification code
* Verification code expiration time
* Account creation time

### Typing Results Table

The `typing_results` table stores:

* User ID
* Round 1 accuracy
* Round 1 WPM
* Round 2 accuracy
* Round 2 WPM
* Result creation time

---

## 📧 Email Verification

TypeFlow uses **Resend** to send verification emails.

Registration flow:

```text
Register
   ↓
6-digit verification code generated
   ↓
Verification email sent
   ↓
User enters code
   ↓
Code checked
   ↓
Account verified
   ↓
Login
```

Verification codes expire after **10 minutes**.

> During Resend's testing mode, emails may only be sent to the account's permitted testing recipient. A verified sending domain is required for broader production email delivery.

---

## ⌨️ Typing Test Flow

The typing system works as follows:

```text
Start Typing Test
       ↓
Round 1
15 words
       ↓
Accuracy + WPM calculated
       ↓
Round 2
15 words
       ↓
Accuracy + WPM calculated
       ↓
Results compared
       ↓
Results saved to MySQL
```

The user must type each character correctly.

For example, if the target is:

```text
train
```

and the user types:

```text
trxin
```

the incorrect character must be corrected before the user can continue.

---

## 📈 Accuracy

Accuracy is calculated based on correctly typed characters compared with the total typing input.

The application displays the result as a percentage.

Example:

```text
Accuracy: 96.50%
```

---

## ⚡ Words Per Minute

Typing speed is measured using Words Per Minute (WPM).

The application records WPM for both rounds so users can compare their performance.

Example:

```text
Round 1: 42 WPM
Round 2: 48 WPM
```

---

## 🔒 Security

TypeFlow follows several basic security practices:

* Passwords are stored as password hashes rather than plain text.
* Database credentials are stored using environment variables.
* Resend API credentials are stored using environment variables.
* Flask secret key is stored using an environment variable.
* `.env` files are excluded from Git using `.gitignore`.
* Verification codes expire after 10 minutes.
* User typing results are associated with authenticated users.

### Important

Never commit secrets such as:

```text
TYPEFLOW_DB_PASSWORD
TYPEFLOW_SECRET_KEY
RESEND_API_KEY
```

to GitHub.

---

## 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/adarsh-ach/TypeFlow.git
cd TypeFlow
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Configure environment variables

Set the required environment variables:

```text
TYPEFLOW_DB_HOST
TYPEFLOW_DB_PORT
TYPEFLOW_DB_USER
TYPEFLOW_DB_PASSWORD
TYPEFLOW_DB_NAME
TYPEFLOW_SECRET_KEY
RESEND_API_KEY
```

### 5. Run the application

For local development:

```powershell
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

---

## 🚀 Production Deployment

TypeFlow is deployed using Render.

### Build Command

```text
pip install -r requirements.txt
```

### Start Command

```text
gunicorn app:app
```

### Environment Variables

The following variables are configured in Render:

```text
TYPEFLOW_DB_HOST
TYPEFLOW_DB_PORT
TYPEFLOW_DB_USER
TYPEFLOW_DB_PASSWORD
TYPEFLOW_DB_NAME
TYPEFLOW_SECRET_KEY
RESEND_API_KEY
```

The application connects to the cloud MySQL database hosted by Aiven.

---

## 🔄 Deployment Workflow

TypeFlow uses GitHub for source control.

The deployment workflow is:

```text
Developer
   ↓
Local Development
   ↓
Git Commit
   ↓
GitHub
   ↓
Render
   ↓
Production TypeFlow
```

Changes pushed to the configured GitHub branch can trigger a new Render deployment.

---

## 🌐 Cloud Architecture

```text
                 ┌─────────────────┐
                 │     GitHub      │
                 │ Source Code     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │     Render      │
                 │ Flask + Gunicorn│
                 └───────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌───────────────┐      ┌───────────────┐
      │ Aiven MySQL   │      │    Resend     │
      │ Database      │      │ Email Service │
      └───────────────┘      └───────────────┘
```

---

## 📌 Current Status

TypeFlow currently supports:

* [x] User registration
* [x] Email verification
* [x] OTP expiration
* [x] Login
* [x] Logout
* [x] Typing test
* [x] Two typing rounds
* [x] Accuracy tracking
* [x] WPM tracking
* [x] Progress bar
* [x] On-screen keyboard
* [x] Results storage
* [x] Typing history
* [x] Cloud MySQL database
* [x] Email delivery
* [x] GitHub repository
* [x] Production deployment

---

## 🔮 Future Improvements

Possible future features include:

* User profile
* Personal typing statistics
* Daily typing challenges
* Leaderboards
* More typing modes
* Difficulty levels
* Custom text tests
* Improved mobile experience
* Charts for typing progress
* Personal best records
* Custom themes
* Custom domain
* Google Search indexing
* Performance improvements

---

## 👨‍💻 Author

**Adarsh Acharya**

GitHub:

https://github.com/adarsh-ach/TypeFlow

---

## 📄 License

This project is currently available for educational and personal development purposes.
