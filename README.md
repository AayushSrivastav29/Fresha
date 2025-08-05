# 💇‍♀️ Fresha: A Salon Appointment Booking System

A full-stack salon appointment booking platform focused on robust **backend functionality** using **Node.js (Express)**, **MySQL with Sequelize**, and a simple **HTML/CSS/JavaScript** frontend.

This project streamlines appointment booking and salon management for both **customers** and **admins**, with built-in support for user authentication, service listings, staff scheduling, automated email notifications, and online payments.

---

## 🚀 Features

### 🔐 User Authentication & Profiles

- **User Registration and Login** (with secure password hashing)
- **Profile Management** for customers to update personal details

### 🛠️ Service Management

- **Add/Edit/Delete Services** (name, description, duration, price)
- **Set Working Hours** and **Manage Availability** for each service

### 👩‍💼 Staff Management

- **Staff Profiles** with name, skills, working hours
- **Assign Services** to staff based on specialization

### 📅 Appointment Booking

- **Real-time Slot Availability**
- **Book Appointments** by selecting date, time, service, and staff
- **Email Confirmation** on successful booking

### 🔔 Notifications

- **Appointment Reminders** via Email using Cron Jobs

### 🔄 Appointment Management

- **Reschedule or Cancel** appointments with proper validations

### 💳 Payment Integration

- **Online Payment Gateway Integration** (Cashfree / Stripe / PayPal)

### ⭐ Reviews & Feedback

- **Post-Service Reviews** by customers
- **Staff Response** to reviews to manage reputation

### 🛠 Admin Dashboard

- **User Management**: View, block, or delete customer accounts
- **Appointment Management**: View/edit/delete all bookings
- **Service & Staff Oversight**

---

## 🧑‍💻 Tech Stack

| Technology    | Description                         |
| ------------- | ----------------------------------- |
| **Backend**   | Node.js, Express.js                 |
| **Frontend**  | HTML, CSS, Vanilla JavaScript       |
| **Database**  | MySQL (with Sequelize ORM)          |
| **Auth**      | JSON Web Tokens (JWT), bcrypt       |
| **Payment**   | Cashfree                            |
| **Mailing**   | Nodemailer for email confirmations  |
| **Scheduler** | node-cron for appointment reminders |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AayushSrivastav29/Fresha.git
cd fresha
```
