# HealthSphere 🏥

A full-stack healthcare management platform that connects patients and doctors — enabling appointment booking, electronic health records (EHR), prescription management, and secure role-based access for Patients, Doctors, and Admins.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 📋 Overview

HealthSphere is a role-based healthcare management system built to streamline the interaction between patients and healthcare providers. It supports appointment scheduling (in-person & telehealth), digital medical record keeping, e-prescriptions, and a verification workflow for doctors — all secured with JWT-based authentication.

## ✨ Features

- **Role-Based Access Control** — Separate dashboards and permissions for Patient, Doctor, and Admin roles
- **Secure Authentication** — JWT-based login/registration with Spring Security
- **Doctor Verification Workflow** — Admins verify doctor credentials before they appear in patient-facing search
- **Appointment Management** — Book, view, and cancel appointments (In-Person or Telehealth)
- **Telehealth Support** — Doctors can attach meeting links to virtual appointments
- **Electronic Health Records (EHR)** — Doctors can log diagnoses, medications, lab results, and notes per visit
- **E-Prescriptions** — Doctors can write and manage prescriptions tied to appointments
- **Patient Documents** — Secure upload and storage of patient medical documents
- **Notifications** — In-app notifications for key events
- **Security Logging** — Audit trail of authentication and security-relevant events
- **Database Migrations** — Version-controlled schema via Flyway

## 🛠️ Tech Stack

**Backend**
- Java 21, Spring Boot 3.5.5
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8
- Flyway (database migrations)
- Maven

**Frontend**
- React 18 + Vite
- React Hook Form + Zod (form validation)
- Material UI (MUI)
- Axios

## 🏗️ Architecture

```
HealthSphere/
├── Backend/                   # Spring Boot REST API
│   ├── src/main/java/com/healthsphere/healthsphere/
│   │   ├── config/            # Security & app configuration
│   │   ├── controller/        # REST controllers
│   │   ├── dto/                # Request/response DTOs
│   │   ├── model/              # JPA entities
│   │   ├── repository/         # Spring Data repositories
│   │   ├── security/            # JWT filters, providers
│   │   └── service/             # Business logic
│   └── src/main/resources/
│       ├── db/migration/       # Flyway SQL migrations
│       └── application.properties
│
└── frontend/                    # React + Vite SPA
    └── src/
        ├── components/          # Reusable UI components
        ├── hooks/                # Custom React hooks (data fetching)
        ├── pages/                # Route-level pages (per role)
        ├── services/             # Axios API service layer
        ├── validations/          # Zod schemas
        └── constants/            # App-wide constants
```

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8
- Maven

### Backend Setup

```bash
cd Backend
```

Create a `.env`-style config or set environment variables for your database credentials, then update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthsphere_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
```

Run the backend:
```bash
mvn spring-boot:run
```

The API will start on `http://localhost:8080`. Flyway will automatically run migrations and create the schema on first run.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🔐 Roles & Access

| Role      | Capabilities                                                        |
|-----------|----------------------------------------------------------------------|
| **Patient** | Book appointments, view EHR records, view prescriptions, upload documents |
| **Doctor**  | Manage appointments, add EHR records, write prescriptions, upload certificate for verification |
| **Admin**   | Verify doctors, manage users, view security logs                    |

## 📸 Screenshots

> _Add screenshots of your dashboard, booking flow, and EHR screens here to make the README visually appealing._

## 🗺️ Roadmap / Future Improvements

- [ ] Deploy to production (Render / Railway + Vercel)
- [ ] Add automated tests (JUnit + React Testing Library)
- [ ] Add email notifications for appointment confirmations
- [ ] Add doctor availability/scheduling calendar

## 👤 Author

**Alok Tiwari**
Final-year B.Tech CSE student | Java/Spring Boot & ML enthusiast

- GitHub: [@alokatks](https://github.com/alokatks)

## 📄 License

This project is for educational/portfolio purposes.
