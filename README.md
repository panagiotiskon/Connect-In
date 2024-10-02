
# 📘 ConnectIn - Professional Networking Application

## Overview
**ConnectIn** is a LinkedIn-style professional networking application that allows users to create profiles, manage connections, and interact with other professionals. The application features user role management, job listings, private messaging, and collaborative filtering for personalized content recommendations.

## Technologies Used
<p align="center"> 
   <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java"> 
   <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"> 
   <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white" alt="Spring Security"> 
   <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"> 
   <img src="https://img.shields.io/badge/Flyway-CC0200?style=for-the-badge&logo=flyway&logoColor=white" alt="Flyway"> 
   <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"> 
   <img src="https://img.shields.io/badge/MDB_React_UI_Kit-37B8AF?style=for-the-badge&logoColor=white" alt="MDB React UI Kit"> 
   <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"> 
   <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven"> 
   <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm"> 
</p>

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

## Creators

- [**Panagiotis Kon**](https://github.com/panagiotiskon)  
- [**Stelios Dimopoulos**](https://github.com/steliosdimb)
