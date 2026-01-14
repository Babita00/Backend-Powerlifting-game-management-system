# Athleticore Backend 🏋️‍♀️
Backend service for **Athleticore**, a powerlifting competition / game management system.  
It handles authentication, competition setup, athlete registration, lift attempt tracking, scoring, and official dashboards.

---

## Tech Stack
- **Node.js + TypeScript**
- **Express.js**
- **PostgreSQL**
- **ORM**: TypeORM 
- **Auth**: JWT (access token)
- **Validation**: Zod 
- **File Uploads**: Multer 
- **Docs**: Swagger 

---

## Features
- ✅ Auth (login/register, roles: Admin / Official / Athlete)
- ✅ Event/Test setup (competition config)
- ✅ Dynamic registration forms (fields like `field_0`, `field_1`…)
- ✅ Athlete submissions management (view/filter/edit by officials)
- ✅ Lift attempt APIs (initialize, get attempts, update weights)
- ✅ Scoring and status tracking (IN_PROGRESS, SUBMITTED, etc.)

---

## Folder Structure
```text
project-root/
├── src/                        # Main application source code
│   ├── baseEntity/            # Base entity
│   ├── config/                # Configuration files & modules
│   ├── constants/             # App-wide constants & enums
│   ├── controller/            # Request handlers / controllers
│   ├── middlewares/           # Custom middlewares
│   ├── migration/             # Database migrations
│   ├── models/                # Database models / entities
│   ├── routes/                # Route definitions
│   ├── services/              # Business logic
│   │   └── lock.json
│   ├── utils/                 # Helper functions & utilities
│   ├── validator/             # Validation logic (DTOs, pipes, etc.)
│   ├── app.ts                 # Main NestJS application bootstrap
│   └── main.ts                # Application entry point
│
├── .env                       # Environment variables
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json              # TypeScript configuration

## API Overview

This backend provides RESTful endpoints for managing powerlifting competitions, athlete registrations, dynamic forms, lift attempts, and basic quiz/test functionality.

### Authentication

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| POST   | `/api/auth/register`      | Register a new user                  |
| POST   | `/api/auth/login`         | Login and receive JWT token          |
| GET    | `/api/auth/me`            | Get current authenticated user info  |

### Competitions / Events

| Method | Endpoint                        | Description                                      |
|--------|---------------------------------|--------------------------------------------------|
| POST   | `/api/events`                   | Create a new event (Admin only)                  |
| GET    | `/api/events`                   | List all events (public or filtered)             |
| GET    | `/api/events/:eventId`          | Get details of a specific event                  |

### Dynamic Registration Forms

| Method | Endpoint                                   | Description                                                  |
|--------|--------------------------------------------|--------------------------------------------------------------|
| GET    | `/api/events/:eventId/form`                | Returns dynamic form definition (field_0, field_1, etc.)     |
| POST   | `/api/events/:eventId/submissions`         | Submit a completed registration form                         |
| GET    | `/api/events/:eventId/submissions`         | List submissions (official/admin view with filters)          |
| PATCH  | `/api/events/:eventId/submissions/:submissionId` | Update a submission (e.g., approve, edit)         |

### Lift Attempts (Core Functionality)

| Method | Endpoint                                          | Description                                                                 |
|--------|---------------------------------------------------|-----------------------------------------------------------------------------|
| POST   | `/api/attempts/:attemptId/initialize`             | Initialize attempts for squat, bench, deadlift (attempts 1–3)               |
| GET    | `/api/attempts/:attemptId`                        | Get current lift attempts (athlete or official view)                        |
| PATCH  | `/api/attempts/:attemptId/lifts/:liftType`        | Update lift attempt (weight, status, pass/fail, notes, etc.)<br>liftType: `SQUAT` \| `BENCH` \| `DEADLIFT` |

### Test / Quiz Module (Optional / Integrated)

| Method | Endpoint                                   | Description                          |
|--------|--------------------------------------------|--------------------------------------|
| POST   | `/api/attempts/:attemptId/answers`         | Submit answers to quiz/test questions|
| GET    | `/api/attempts/:attemptId/results`         | Get quiz/test results                |

### Roles & Permissions

- **Admin**  
  Can create events, manage users, configure scoring rules, and access all data.

- **Official**  
  Can view athlete lists, manage lift attempts, validate results, and view submissions.

- **Athlete**  
  Can register for events, view their own attempts, submit quiz answers, and see personal results.

All endpoints are protected by JWT authentication where required. Admin and Official roles have elevated permissions.

