# 🏥 HealthSphere - Electronic Health Record (EHR) & Telemedicine Platform

**HealthSphere** is a secure online platform that provides electronic health records and telemedicine services.  
The system allows **patients** to manage appointments and view medical records, while **doctors** can conduct virtual consultations, issue e-prescriptions, and manage patient data.  
The platform is built with a strong focus on **data security** and **ease of use**.

---

## ✅ Key Features

- **Secure Authentication**: JWT-based authentication with Role-Based Access Control (RBAC) for **Admin**, **Doctor**, and **Patient** roles.  
- **User Management**: Register users, handle login requests, and allow admins to verify doctors.  
- **EHR & Appointments**: APIs for creating, viewing, and managing patient medical records and appointments.  
- **E-Prescribing**: Doctors can issue secure digital prescriptions to patients.  
- **Telemedicine Foundation**: Core backend infrastructure for real-time video consultations using WebSockets.  
- **Notifications**: Email service for sending notifications and password reset links.  

---

## ⚙️ Technologies Used

- **Backend**: Spring Boot (Java 17)  
- **Build Tool**: Maven  
- **Database**: MySQL  
- **Security**: Spring Security, JWT (`jjwt` library)  
- **APIs**: RESTful APIs  
- **Email Service**: Spring Mail  

---

## 🚀 Getting Started

Follow these steps to set up and run the backend locally:

### 1. Clone the Repository
```bash
git clone https://github.com/aadi-789/HEALTHSPHERE.git
cd HEALTHSPHERE/backend
```

### 2. Set Up the Database
- Ensure your MySQL server is running on **port 3306**.  
- Update `src/main/resources/application.properties` with your MySQL username and password.  
- The application will automatically create the database tables.  

### 3. Configure Environment Variables
Open `src/main/resources/application.properties` and set the following:

```properties
# JWT Secret Key
app.jwt-secret=a_very_long_and_secure_random_key_that_is_used_to_sign_the_jwts

# Email Credentials
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### 4. Run the Application
- Open your IDE and run `HealthSphereApplication.java`.  
- The application will start on **http://localhost:8080**.  

---

## 🔗 API Endpoints

Use an API client (like **Postman** or **VS Code REST Client**) to test the following endpoints:

| Method | Path                                | Description |
|--------|-------------------------------------|-------------|
| **POST** | `/api/auth/register`              | Register a new user (Patient, Doctor, or Admin). |
| **POST** | `/api/auth/login`                 | Log in and get a JWT for authenticated requests. |
| **GET**  | `/api/profile`                    | Get the profile of the currently logged-in user. |
| **PUT**  | `/api/profile/update`             | Update the profile of the currently logged-in user. |
| **POST** | `/api/appointments/book`          | Book a new appointment (Patient role). |
| **GET**  | `/api/appointments/patient/{id}`  | View a patient's appointments (Patient role). |
| **GET**  | `/api/appointments/doctor/{id}`   | View a doctor's appointments (Doctor role). |
| **POST** | `/api/ehr/create`                 | Create a new EHR record (Doctor role). |
| **POST** | `/api/prescriptions/create`       | Create a new e-prescription (Doctor role). |
| **POST** | `/api/admin/doctors/verify/{id}`  | Verify a new doctor (Admin role). |

---

## 🤝 Collaboration

- **Backend Developer**: [Pranav Chinnawar](https://github.com/PranavChinnawar)  
- **Frontend Developer**: [Aditya Singh](https://github.com/aadi-789)  

---
