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


