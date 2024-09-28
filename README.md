
# 📘 ConnectIn - Professional Networking Application

## Overview
**ConnectIn** is a LinkedIn-style professional networking application that allows users to create profiles, manage connections, and interact with other professionals. The application features user role management, job listings, private messaging, and collaborative filtering for personalized content recommendations.

## Technologies Used
- **Backend**: Java 21, Spring Boot 3, Spring Security 6, MySQL 8, Flyway (for migrations)
- **Frontend**: React 18, JavaScript, MDB React UI Kit
- **Communication Protocol**: SSL/TLS for secure HTTP requests 🔒
- **Build Tools**: Maven for backend, npm for frontend

## Features
1. **User Roles**:
   - 👑 Admin: Manages users, views their profiles, and exports data (JSON, XML).
   - 👤 Regular User: Can register, create profiles, add work experience, education, connect with others, post articles, and apply for jobs.
   
2. **Key Pages**:
   - 🏠 **Home**: Users can publish posts and view a timeline based on an algorithm that recommends content using **Matrix Factorization Collaborative Filtering**.
   - 🌐 **Network**: Users manage connections and search for others.
   - 💼 **Jobs**: Job recommendations based on user skills and history. Users can create or apply for job posts.
   - 💬 **Chats**: Private messaging between connected users.
   - 🔔 **Notifications**: View connection requests and reactions to user posts.
   - 📋 **Profile**: Manage personal details, professional experience, and skills.
   - ⚙️ **Settings**: Change email or password.

3. **Admin Features**:
   - View all registered users and export their data in JSON or XML formats.

4. **🧠 Algorithmic Recommendations**:
   - **Posts**: Personalized content recommendations based on user reactions, connections, and post views.
   - **Jobs**: Levenshtein Distance algorithm compares user skills with job titles for recommendations.

## Setup Instructions

### Backend
1. Navigate to `/backend` and install dependencies:
   ```
   mvn clean install
   ```
2. Start the backend server:
   ```
   mvn spring-boot:run
   ```
   - The backend runs on port `8443`. Set up the database credentials in `application.yml`.

### Frontend
1. Navigate to `/frontend` and install dependencies:
   ```
   npm install
   ```
2. Start the frontend server:
   ```
   npm start
   ```
   - The frontend runs on port `3000`.

### Browser Warnings 
Because of the self-signed certificate, the browser will throw warnings, to disable insecure localhost warnings in Chrome by navigating to:
```
chrome://flags/#allow-insecure-localhost
```

##  How to Access
The application is accessible at:
```
https://localhost:3000
```

##  Conclusion
ConnectIn was developed as a secure, scalable application designed to simulate a professional networking environment. 💡
