# URL Shortener

A full-stack URL shortener with user accounts, custom aliases, link expiry, click analytics, Redis caching and rate limiting.

- **Backend:** Spring Boot 4 (Java 21), Spring Security + JWT, Spring Data JPA (MySQL), Redis
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Axios

## Features

- Register / login with JWT authentication
- Shorten URLs with auto-generated Base62 codes or a custom alias (3–20 chars, `a-z A-Z 0-9 _ -`)
- Optional expiry date per link; expired or deactivated links return `410 Gone`
- Dashboard listing your links with pagination
- Click analytics per link
- Redis cache for redirect lookups (TTL bounded by link expiry)
- Redis-backed rate limiting:
  - Create: 10 requests / minute per user
  - Redirect: 100 requests / minute per IP

## Project structure

```
backend/URLShortener/    Spring Boot API
frontend/url-shortener/  Next.js app
```

## Prerequisites

- Java 21
- Node.js 20+
- MySQL 8 running on `localhost:3306`
- Redis running on `localhost:6379`

## Getting started

### 1. Database

```sql
CREATE DATABASE URL_SHORTENER;
```

Tables are created automatically (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Backend

Set the DB credentials in `backend/URLShortener/src/main/resources/application.properties`, then provide the JWT settings as environment variables:

```bash
export JWT_SECRET=<base64 or long random string, at least 32 bytes>
export JWT_EXPIRATION=86400000   # token lifetime in ms

cd backend/URLShortener
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend/url-shortener
npm install
npm run dev -- -p 3001
```

Open `http://localhost:3001`. The backend's CORS config only allows this origin (see `config/CorsConfig.java`); the API base URL is set in `lib/api.js`.

## API

All `/api/urls/**` endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | – | Body: `{ username, email, password }` (password ≥ 6 chars) |
| POST | `/api/auth/login` | – | Body: `{ email, password }` → `{ token }` |
| POST | `/api/urls` | ✓ | Body: `{ longUrl, customAlias?, expiryAt? }` — `longUrl` must start with `http://` or `https://` |
| GET | `/api/urls/my?page=0&size=10` | ✓ | Your active links (paginated) |
| DELETE | `/api/urls/{code}` | ✓ | Deactivate a link |
| GET | `/api/urls/{code}/analytics` | ✓ | `{ totalClicks }` |
| GET | `/r/{code}` | – | Redirect to the original URL |

### Example

```bash
TOKEN=$(curl -s -X POST localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"me@example.com","password":"secret1"}' | jq -r .token)

curl -X POST localhost:8080/api/urls \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"longUrl":"https://example.com","customAlias":"demo"}'

curl -i localhost:8080/r/demo
```
