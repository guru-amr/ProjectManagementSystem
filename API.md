# API Documentation

All protected routes require: `Authorization: Bearer <token>`

Validation errors return `400` with body: `{ "errors": [{ "field": "...", "message": "..." }] }`

---

## Auth

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| POST | `/api/auth/register` | ❌ | `{ fullName, email, password }` | `201 { id, fullName, email }` |
| POST | `/api/auth/login` | ❌ | `{ email, password }` | `200 { token, user: { id, fullName, email } }` |
| POST | `/api/auth/logout` | ✅ | — | `200 { message }` |

**Rate limit**: 20 requests per 15 minutes on `/register` and `/login`.

---

## Projects

All endpoints scoped to the authenticated user (`userId = req.user.id`).

| Method | Endpoint | Auth | Query Params | Request Body | Response |
|--------|----------|------|--------------|--------------|----------|
| GET | `/api/projects` | ✅ | `?search=&status=` | — | `200 Project[]` |
| GET | `/api/projects/:id` | ✅ | — | — | `200 Project` or `404` |
| POST | `/api/projects` | ✅ | — | `{ name*, description?, status?, startDate?, endDate? }` | `201 Project` |
| PUT | `/api/projects/:id` | ✅ | — | `{ name?, description?, status?, startDate?, endDate? }` | `200 Project` |
| DELETE | `/api/projects/:id` | ✅ | — | — | `204` |

**Project shape**:
```json
{
  "id": 1,
  "userId": 1,
  "name": "My Project",
  "description": "...",
  "status": "Not Started",
  "startDate": "2025-01-01",
  "endDate": "2025-06-30",
  "createdAt": "2025-07-01T10:00:00.000Z"
}
```

---

## Tasks

All endpoints scoped to the authenticated user via project ownership.

| Method | Endpoint | Auth | Query Params | Request Body | Response |
|--------|----------|------|--------------|--------------|----------|
| GET | `/api/tasks` | ✅ | `?search=&status=&priority=&projectId=` | — | `200 Task[]` |
| GET | `/api/tasks/:id` | ✅ | — | — | `200 Task` or `404` |
| POST | `/api/tasks` | ✅ | — | `{ projectId*, name*, description?, priority?, status?, dueDate? }` | `201 Task` |
| PUT | `/api/tasks/:id` | ✅ | — | `{ name?, description?, priority?, status?, dueDate? }` | `200 Task` |
| DELETE | `/api/tasks/:id` | ✅ | — | — | `204` |

**Quick complete**: `PUT /api/tasks/:id` with `{ "status": "Completed" }`

**Task shape**:
```json
{
  "id": 1,
  "projectId": 1,
  "name": "Design wireframes",
  "description": "...",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2025-02-01",
  "createdAt": "2025-07-01T10:00:00.000Z"
}
```

---

## Dashboard

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/dashboard` | ✅ | `200 { totalProjects, projectsInProgress, totalTasks, completedTasks, pendingTasks }` |

---

## Error Shapes

| Scenario | Status | Body |
|----------|--------|------|
| Validation failure | `400` | `{ "errors": [{ "field": "email", "message": "Valid email is required" }] }` |
| Unauthenticated | `401` | `{ "error": "No token provided" }` |
| Not found / unauthorized | `404` | `{ "error": "Project not found" }` |
| Conflict (duplicate email) | `409` | `{ "error": "Email already registered" }` |
| Server error | `500` | `{ "error": "Internal server error" }` |
