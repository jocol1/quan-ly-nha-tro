Rental Management System

Introduction
The Rental Management System is a web application designed to assist landlords in managing rental properties, tenants, utility bills, and critical alerts. The application leverages the following technologies:
 - React: Intuitive and modern user interface.
 - Node.js/Express: Backend for handling RESTful APIs.
 - MongoDB: Primary database for storing room, tenant, and bill information.
 - Firestore: Supports real-time data (room status, notifications, or sensor data).
 - JWT: User authentication and authorization.
 - bcryptjs: Password encryption for enhanced security.

Key Features
 - Login and Authentication: Uses JWT for role-based authorization (admin/user).
 - Room Management: Add, edit, delete, and search rooms by status (vacant/occupied) or price.
 - Tenant Management: Manage tenant information (name, ID card, phone, email, assigned room) with search and room assignment capabilities.
 - Bill Management: Track utility bills (electricity: 3,000 VND/kWh; water: 50,000 VND per toilet or bathroom), confirm payments, send email invoices, and export Excel reports.
 - Alerts: Display notifications for unpaid rooms, expiring contracts, or maintenance requests.
 - Dashboard: Provides an overview with metrics on rooms, tenants, and revenue through pie and bar charts.
 - Real-Time Updates: Sync room status or sensor data via Firestore.

Link demo: https://6850bec17270c4747670c01f--voluble-tulumba-e2c692.netlify.app/login

user: admin

pass: password
