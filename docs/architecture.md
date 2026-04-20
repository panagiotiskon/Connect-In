# High-Level Architecture: Connect-In

## 1. System Overview
Connect-In is a professional social networking platform designed to facilitate user connections, content sharing, job applications, and ML-driven recommendations. It follows a two-tier architecture comprising a React SPA and a Spring Boot REST API.

## 2. Technology Stack
- **Frontend:** React (SPA), Axios, Context API.
- **Backend:** Spring Boot 3.2, Spring Data JPA, Spring Security.
- **Database:** MySQL 8.x with Flyway for schema migrations.
- **Authentication:** Stateless JWTs stored in HTTP-only, Secure, SameSite=None cookies.

## 3. Component Architecture

### Frontend (React)
- **Routing:** Centralized via `Routing.js` using `createBrowserRouter`. Routes are wrapped in an `AuthProvider` and gated by `ProtectedRoute`.
- **State Management:** `AuthContext` serves as the primary store for user identity and global session state. No external state management (Redux/Query) is utilized; data is fetched per-component.
- **API Layer:** Domain-specific Axios wrappers (Auth, Job, Post, etc.) built on a shared base configuration with `withCredentials: true`.

### Backend (Spring Boot)
- **Layered Design:** Follows a Controller -> Service -> Repository pattern.
- **Security:** `JWTAuthenticationFilter` intercepts requests to validate the cookie-based token. Business logic endpoints are scoped under `/auth/**` and administrative ones under `/admin/**`.
- **HATEOAS:** Uses `Resource` wrappers and mappers to provide discoverable API links, reducing frontend URL coupling.

## 4. Key Subsystems

### Recommendation Engine
- **Algorithm:** Matrix Factorization using Stochastic Gradient Descent (SGD).
- **Execution:** recommendations are recomputed per request. It generates a user-item interaction matrix based on:
    - Skill-to-Job Title Levenshtein distance.
    - Connection graph weights.
    - User interaction signals (views, reactions).
- **Storage:** Results are persisted in `job_recommendation` and `post_recommendation` tables for fast retrieval.

### Communication & Real-Time
- **Mechanism:** Short-polling via `setInterval`.
    - **Chat:** 3-second interval for active conversations.
    - **Notifications:** 60-second interval for badge counts.
- **Storage:** Messages are stored in a flat `messages` table; files/attachments are stored as BLOBs (< 2MB) in MySQL.

## 5. Data Model (Core Entities)
- **User Identity:** `User`, `Role`, `PersonalInfo`.
- **Professional Data:** `Experience`, `Education`, `Skill`.
- **Social:** `Post`, `Comment`, `Reaction`, `Connection` (PENDING/ACCEPTED status).
- **Career:** `JobPost`, `JobApplication`, `JobView`.

## 6. Architectural Constraints & Risks
- **Scalability:** - N+1 query patterns exist in feed and job listing services.
    - Matrix Factorization is performed in-memory, limiting the system to a few thousand concurrent users/items.
- **Persistence:** Storing binary files in MySQL increases DB size and impacts backup/restore performance.
- **User Experience:** Forced logouts occur every hour due to the lack of a JWT refresh token mechanism.
- **Performance:** Complex filtering and sorting are often handled in Java collections rather than optimized SQL queries.