# TaskManager_full_stack_application
# Task Manager Application

This project is a full-stack task management application built with Django (backend) and React (frontend). It uses MongoDB as the database.

## Backend Setup

### 1. Clone the Repository

```bash
https://github.com/Marvafathima/TaskManager_full_stack_application.git
cd TaskManager_full_stack_application
```

### 2. Set Up Python Environment

It's recommended to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3. Install Dependencies

Navigate to the `taskmanager` folder and install the required packages:

```bash
cd backend/taskmanager
pip install -r requirements.txt
```

### 4. Configure MongoDB

Ensure MongoDB is installed and running on your system. Then, configure your MongoDB user, password, and database:connect mongodb using mongoengine

- Create a new database named `taskmanager` (or your preferred name)
- Create a new user with read and write permissions for this database

### 5. Generate Secret Key

Run the `generate_key.py` script to generate a secret key:

```bash
python generate_key.py
```

### 6. Set Up Environment Variables

Create a `.env` file in the `taskmanager` directory and add the following:

```
JWT_SECRET_KEY='your_generated_token_here'
MONGODB_URI='mongodb://username:password@localhost:27017/taskmanager'
```

Replace `your_generated_token_here` with the token generated in step 5, and adjust the MongoDB URI as necessary.

### 7. Run Migrations and Start the Server

```bash
python manage.py migrate
python manage.py runserver
```

The backend should now be running on `http://localhost:8000`.

## Frontend Setup

### 1. Navigate to the Frontend Directory

From the project root:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API URL

Create a `.env` file in the frontend root directory and add:

```
REACT_APP_API_URL=http://localhost:8000/api
```

Adjust the URL if your backend is running on a different port or host.

### 4. Start the Development Server

```bash
npm start
```

The frontend should now be running on `http://localhost:3000`.

## Using the Application

1. Open your browser and go to `http://localhost:3000`
2. Register a new account or log in if you already have one
3. Start managing your tasks!




