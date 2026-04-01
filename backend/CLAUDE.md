# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
# Build (skip tests)
./mvnw clean install -DskipTests

# Run the application (default port 8080)
./mvnw spring-boot:run

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=ConnectInApplicationTests

# Run a single test method
./mvnw test -Dtest=ConnectInApplicationTests#contextLoads
```

**Prerequisites**: Java 21, MySQL 8.0+ running on localhost:3306 (DB `connectIn` is auto-created).

**Environment variables** (all have defaults for local dev):

- `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
- `JWT_SECRET` — HMAC SHA256 key (min 64 chars)
- `ALLOWED_ORIGINS` — comma-separated CORS origins (default: `http://localhost:3000,https://localhost:3000`)
- `PORT` — server port (default: 8080)

## Architecture

Spring Boot 3.2.5 REST API with layered architecture:

```
web/controllers/  →  service/  →  domain/repository/  →  MySQL
     ↕                  ↕
web/dto/,requests/   domain/ (JPA entities)
web/resources/       domain/enums/
web/mappers/
```

- **Controllers** (`web/controllers/`): REST endpoints, receive request objects, return DTOs/resources
- **Services** (`service/`): Business logic, transaction boundaries
- **Repositories** (`domain/repository/`): Spring Data JPA interfaces
- **Entities** (`domain/`): JPA entities mapping to MySQL tables
- **DTOs & Mappers** (`web/dto/`, `web/mappers/`): Entity↔DTO conversion, one mapper per entity group
- **Request objects** (`web/requests/`): Typed request bodies for controller endpoints
- **Resources** (`web/resources/`): HATEOAS-wrapped response objects

## Authentication & Security

JWT-based auth with HTTP-only cookies (stateless sessions, CSRF disabled):

- `security/SecurityConfig.java` — endpoint authorization rules
- `security/JWTAuthenticationFilter.java` — extracts JWT from cookies on every request
- `security/JWTGenerator.java` — token creation/validation
- Public endpoints: `/auth/login`, `/auth/register`, `/auth/validate-email`
- Admin endpoints: `/admin/**` (requires `ROLE_ADMIN`)
- All other `/auth/**` endpoints require authentication

## Database Migrations

Flyway migrations in `src/main/resources/db/migration/` (V1–V22). Add new migrations as `V{next}__description.sql`.

## API URL Pattern

All endpoints are under `/auth/` or `/admin/`:

- Auth: `/auth/login`, `/auth/logout`, `/auth/register`
- Users: `/auth/{userId}/...` (profile, feed, personal-info)
- Connections: `/auth/connections/`
- Jobs: `/auth/jobs/`
- Messages: `/auth/messages/`
- Notifications: `/auth/notifications/`
- Recommendations: `/auth/recommendations/`
- Files: `/auth/files/`

## Key Patterns

- **Default admin** is seeded on startup via `DefaultAdminConfig` (admin@example.com / admin123)
- **File uploads** stored as binary in `files` table (`FileDB` entity), max 2MB
- **Recommendation engine** uses matrix factorization (`recommendation/algorithm/MatrixFactorization.java`)
- **Connections** have status flow: `PENDING` → `ACCEPTED`
- **Notifications** created for comments, reactions, and connection requests
