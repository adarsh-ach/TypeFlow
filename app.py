from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

import random
import os
import resend
from datetime import datetime, timedelta


app = Flask(__name__)


# -----------------------------
# Secret key for login sessions
# -----------------------------

app.secret_key = os.getenv("TYPEFLOW_SECRET_KEY")


# -----------------------------
# Database connection
# -----------------------------

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("TYPEFLOW_DB_HOST"),
        port=int(os.getenv("TYPEFLOW_DB_PORT", "3306")),
        user=os.getenv("TYPEFLOW_DB_USER"),
        password=os.getenv("TYPEFLOW_DB_PASSWORD"),
        database=os.getenv("TYPEFLOW_DB_NAME"),
        ssl_disabled=False
    )


# -----------------------------
# Resend configuration
# -----------------------------

resend.api_key = os.getenv("RESEND_API_KEY")


# -----------------------------
# Send Verification Email
# -----------------------------

def send_verification_email(recipient_email, verification_code):

    params = {
        "from": "TypeFlow <onboarding@resend.dev>",

        "to": [
            recipient_email
        ],

        "subject": "TypeFlow Email Verification",

        "html": f"""
        <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 30px;
            background: #111827;
            color: white;
            border-radius: 16px;
        ">

            <h1 style="
                margin-bottom: 10px;
                color: #60a5fa;
            ">
                TypeFlow
            </h1>

            <p>
                Welcome to TypeFlow!
            </p>

            <p>
                Use the verification code below to verify your email address:
            </p>

            <div style="
                margin: 25px 0;
                padding: 20px;
                background: #1f2937;
                border-radius: 12px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
            ">
                {verification_code}
            </div>

            <p>
                Enter this code on the TypeFlow verification page
                to complete your registration.
            </p>

            <p style="color: #9ca3af;">
                This verification code expires in 10 minutes.
            </p>

            <p style="color: #9ca3af;">
                If you did not create a TypeFlow account,
                you can ignore this email.
            </p>

            <p style="margin-top: 30px;">
                Regards,<br>
                <strong>TypeFlow</strong>
            </p>

        </div>
        """
    }

    response = resend.Emails.send(params)

    print(
        "VERIFICATION EMAIL SENT:",
        response
    )

    return response


# -----------------------------
# Login Page
# -----------------------------

@app.route("/")
def login():

    if "user_id" in session:

        return redirect(
            url_for("dashboard")
        )

    return render_template(
        "login.html"
    )


# -----------------------------
# Login User
# -----------------------------

@app.route(
    "/login",
    methods=["POST"]
)
def login_user():

    email = request.form["email"]

    password = request.form["password"]

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()

    connection.close()


    # User doesn't exist

    if not user:

        return "Invalid email or password."


    # Check password

    if not check_password_hash(
        user["password_hash"],
        password
    ):

        return "Invalid email or password."


    # Check email verification

    if not user["email_verified"]:

        session[
            "verification_email"
        ] = email

        return redirect(
            url_for(
                "verify_email"
            )
        )


    # Store user information

    session["user_id"] = user["id"]

    session["email"] = user["email"]


    return redirect(
        url_for("dashboard")
    )


# -----------------------------
# Register Page
# -----------------------------

@app.route("/register")
def register():

    return render_template(
        "register.html"
    )


# -----------------------------
# Register User
# -----------------------------

@app.route(
    "/register",
    methods=["POST"]
)
def register_user():

    email = request.form["email"]

    password = request.form["password"]

    confirm_password = request.form[
        "confirm_password"
    ]


    # Check passwords

    if password != confirm_password:

        return "Passwords do not match!"


    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )


    # Check existing email

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    existing_user = cursor.fetchone()


    # -----------------------------
    # Existing user
    # -----------------------------

    if existing_user:

        # If already verified

        if existing_user["email_verified"]:

            cursor.close()

            connection.close()

            return (
                "An account with this email "
                "already exists."
            )


        # Existing but not verified
        # Generate a new code

        verification_code = str(
            random.randint(
                100000,
                999999
            )
        )

        verification_expires_at = (
            datetime.now()
            + timedelta(minutes=10)
        )


        cursor.execute(
            """
            UPDATE users
            SET
                verification_code = %s,
                verification_expires_at = %s
            WHERE id = %s
            """,
            (
                verification_code,
                verification_expires_at,
                existing_user["id"]
            )
        )


        connection.commit()

        cursor.close()

        connection.close()


        # Send verification email

        try:

            send_verification_email(
                email,
                verification_code
            )

        except Exception as error:

            print(
                "EMAIL ERROR:",
                error
            )

            return (
                "Could not send verification "
                "email. Please check the Resend "
                "configuration."
            )


        session[
            "verification_email"
        ] = email


        return redirect(
            url_for("verify_email")
        )


    # -----------------------------
    # New user
    # -----------------------------

    password_hash = generate_password_hash(
        password
    )


    verification_code = str(
        random.randint(
            100000,
            999999
        )
    )


    verification_expires_at = (
        datetime.now()
        + timedelta(minutes=10)
    )


    cursor.close()


    # New cursor without dictionary mode

    cursor = connection.cursor()


    cursor.execute(
        """
        INSERT INTO users
        (
            email,
            password_hash,
            email_verified,
            verification_code,
            verification_expires_at
        )
        VALUES
        (
            %s,
            %s,
            FALSE,
            %s,
            %s
        )
        """,
        (
            email,
            password_hash,
            verification_code,
            verification_expires_at
        )
    )


    connection.commit()


    cursor.close()

    connection.close()


    # -----------------------------
    # Send verification email
    # -----------------------------

    try:

        send_verification_email(
            email,
            verification_code
        )

    except Exception as error:

        print(
            "EMAIL ERROR:",
            error
        )

        return (
            "Account created but the "
            "verification email could not "
            "be sent. Please check your "
            "Resend configuration."
        )


    # Remember email temporarily

    session[
        "verification_email"
    ] = email


    return redirect(
        url_for("verify_email")
    )


# -----------------------------
# Verify Email Page
# -----------------------------

@app.route("/verify-email")
def verify_email():

    email = request.args.get(
        "email"
    )


    if not email:

        email = session.get(
            "verification_email"
        )


    if not email:

        return redirect(
            url_for("register")
        )


    return render_template(
        "verify_email.html",
        email=email
    )


# -----------------------------
# Verify Email Code
# -----------------------------

@app.route(
    "/verify-email",
    methods=["POST"]
)
def verify_email_code():

    email = request.form["email"]

    code = request.form[
        "verification_code"
    ]


    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = %s
        """,
        (email,)
    )


    user = cursor.fetchone()


    if not user:

        cursor.close()

        connection.close()

        return "User not found."


    # Check verification code

    if (
        user["verification_code"]
        != code
    ):

        cursor.close()

        connection.close()

        return (
            "Invalid verification code."
        )


    # Check expiration

    if (
        user["verification_expires_at"] is None
        or datetime.now()
        > user["verification_expires_at"]
    ):

        cursor.close()

        connection.close()

        return (
            "Verification code has expired. "
            "Please register again to receive "
            "a new code."
        )


    # Mark email as verified

    cursor.execute(
        """
        UPDATE users
        SET
            email_verified = TRUE,
            verification_code = NULL,
            verification_expires_at = NULL
        WHERE email = %s
        """,
        (email,)
    )


    connection.commit()


    cursor.close()

    connection.close()


    # Remove temporary verification data

    session.pop(
        "verification_email",
        None
    )


    return redirect(
        url_for("login")
    )


# -----------------------------
# Dashboard
# -----------------------------

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )


    conn = get_db_connection()

    cursor = conn.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT
            COUNT(*) AS total_tests,

            MAX(
                GREATEST(
                    round1_accuracy,
                    round2_accuracy
                )
            ) AS best_accuracy,

            MAX(
                GREATEST(
                    round1_wpm,
                    round2_wpm
                )
            ) AS best_wpm,

            AVG(
                (
                    round1_accuracy +
                    round2_accuracy
                ) / 2
            ) AS average_accuracy

        FROM typing_results

        WHERE user_id = %s
        """,
        (session["user_id"],)
    )


    stats = cursor.fetchone()


    cursor.close()

    conn.close()


    return render_template(
        "dashboard.html",
        email=session["email"],
        stats=stats
    )


# -----------------------------
# Typing Page
# -----------------------------

@app.route("/typing")
def typing():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )


    return render_template(
        "typing.html",
        email=session["email"]
    )


# -----------------------------
# Save Typing Result
# -----------------------------

@app.route(
    "/save-result",
    methods=["POST"]
)
def save_result():

    if "user_id" not in session:

        return jsonify({
            "success": False,
            "message": "Not logged in"
        }), 401


    data = request.get_json()


    print(
        "RECEIVED RESULT:",
        data
    )


    print(
        "LOGGED USER:",
        session.get("user_id")
    )


    round1_accuracy = data.get(
        "round1_accuracy"
    )


    round1_wpm = data.get(
        "round1_wpm"
    )


    round2_accuracy = data.get(
        "round2_accuracy"
    )


    round2_wpm = data.get(
        "round2_wpm"
    )


    if (
        round1_accuracy is None
        or round1_wpm is None
        or round2_accuracy is None
        or round2_wpm is None
    ):

        return jsonify({
            "success": False,
            "message": "Missing result data"
        }), 400


    conn = get_db_connection()

    cursor = conn.cursor()


    cursor.execute(
        """
        INSERT INTO typing_results
        (
            user_id,
            round1_accuracy,
            round1_wpm,
            round2_accuracy,
            round2_wpm
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            session["user_id"],
            round1_accuracy,
            round1_wpm,
            round2_accuracy,
            round2_wpm
        )
    )


    conn.commit()


    print(
        "RESULT SAVED SUCCESSFULLY"
    )


    cursor.close()

    conn.close()


    return jsonify({
        "success": True,
        "message": "Result saved successfully"
    })


# -----------------------------
# History
# -----------------------------

@app.route("/history")
def history():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )


    conn = get_db_connection()

    cursor = conn.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT
            id,
            round1_accuracy,
            round1_wpm,
            round2_accuracy,
            round2_wpm,
            created_at

        FROM typing_results

        WHERE user_id = %s

        ORDER BY created_at DESC
        """,
        (session["user_id"],)
    )


    results = cursor.fetchall()


    cursor.close()

    conn.close()


    return render_template(
        "history.html",
        results=results,
        email=session["email"]
    )


# -----------------------------
# Logout
# -----------------------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("login")
    )


# -----------------------------
# Start Flask
# -----------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )