# Central Intelligence War Room
# True Vision Project Management System (PMS)

## Technical Infrastructure & Security Documentation

**Version:** 1.0
**Date:** January 6, 2026
**Organization:** CP Group - True Visions
**Document Type:** System Overview & Technical Specification

---

# Table of Contents

1. [What is Central Intelligence War Room?](#1-what-is-central-intelligence-war-room)
2. [System Modules & Features](#2-system-modules--features)
3. [Technology Stack](#3-technology-stack)
4. [Database System](#4-database-system)
5. [Security Implementation](#5-security-implementation)
6. [System Architecture](#6-system-architecture)
7. [Deployment & Infrastructure](#7-deployment--infrastructure)
8. [API Documentation](#8-api-documentation)

---

# 1. What is Central Intelligence War Room?

## 1.1 Overview

**Central Intelligence War Room** (also known as **True Vision War Room**) is an enterprise-grade **Project Management System (PMS)** designed specifically for CP Group - True Visions. The system serves as a centralized platform for managing, monitoring, and tracking all strategic projects across the organization.

## 1.2 Purpose & Objectives

| Objective | Description |
|-----------|-------------|
| **Centralized Management** | Single platform to manage all projects across departments |
| **Real-time Visibility** | Dashboard showing project status, progress, and KPIs |
| **ROI Tracking** | Monitor return on investment for each project |
| **Team Collaboration** | Assign team members, track responsibilities |
| **Decision Support** | Prioritization tools for strategic planning |
| **Audit & Compliance** | Complete logging of all activities for security |

## 1.3 Target Users

| User Role | Responsibilities |
|-----------|------------------|
| **Executives** | View dashboards, approve projects, strategic decisions |
| **Project Managers** | Create/manage projects, assign teams, track progress |
| **Team Members** | View assigned projects, update progress, add notes |
| **Administrators** | Manage users, permissions, system configuration |

## 1.4 Business Value

- **Improved Visibility**: Real-time status of all projects in one place
- **Better Decision Making**: ROI and KPI data for prioritization
- **Accountability**: Clear ownership and audit trails
- **Efficiency**: Streamlined project lifecycle management
- **Security**: Enterprise-grade protection of sensitive data

---

# 2. System Modules & Features

## 2.1 Module Overview

The Central War Room consists of **7 main modules**:

```
┌─────────────────────────────────────────────────────────────────┐
│                   CENTRAL WAR ROOM SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│   │    1.     │  │    2.     │  │    3.     │  │    4.     │   │
│   │ Dashboard │  │ Projects  │  │   ROI     │  │  Members  │   │
│   │           │  │           │  │ Tracking  │  │           │   │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘   │
│                                                                  │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│   │    5.     │  │    6.     │  │    7.     │                   │
│   │    My     │  │ Prioriti- │  │  Finance  │                   │
│   │ Projects  │  │  zation   │  │ Investment│                   │
│   └───────────┘  └───────────┘  └───────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.2 Module 1: Dashboard (Home)

**Purpose:** Central overview of all project activities and key metrics

### Features:
| Feature | Description |
|---------|-------------|
| Project Statistics | Total projects, active, completed, draft counts |
| Status Overview | Projects by status (Green/Yellow/Red/Gray) |
| Recent Activity | Latest project updates and changes |
| Quick Actions | Fast access to create/view projects |
| KPI Summary | Key performance indicators at a glance |

### Data Displayed:
- Total number of projects
- Projects by status color
- Projects by type (TVS-L, TVS-S)
- Year-to-date progress

---

## 2.3 Module 2: Projects

**Purpose:** Complete project lifecycle management

### Features:
| Feature | Description |
|---------|-------------|
| Project List | View all projects with filtering/sorting |
| Project Creation | Create new projects with full details |
| Project Details | View comprehensive project information |
| Project Editing | Update project status, details, progress |
| Draft Management | Save and publish draft projects |
| Action Plans | Add/manage action items within projects |

### Project Information Captured:
```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT DATA FIELDS                       │
├─────────────────────────────────────────────────────────────┤
│ BASIC INFO          │ FINANCIAL           │ STATUS          │
│ ─────────────       │ ─────────           │ ──────          │
│ • Project Name      │ • Budget (Target)   │ • Progress %    │
│ • Project Number    │ • Budget (Actual)   │ • Status Color  │
│ • Start Date        │ • ROI Target        │ • Priority      │
│ • End Date          │ • ROI Actual        │ • KPI           │
│ • Project Leader    │ • Investment        │ • Urgency       │
│ • Team Members      │ • Beneficiary       │ • Impact        │
│ • Description       │                     │                 │
│ • Objectives        │                     │                 │
│ • Obstacles         │                     │                 │
│ • Solutions         │                     │                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2.4 Module 3: ROI Tracking

**Purpose:** Monitor return on investment for projects

### Features:
| Feature | Description |
|---------|-------------|
| ROI Dashboard | Visual overview of ROI metrics |
| Target vs Actual | Compare planned vs achieved ROI |
| ROI by Project | Individual project ROI analysis |
| ROI Trends | Historical ROI performance |

### ROI Data Fields:
- ROI Type (KPI type)
- ROI Description
- ROI Year
- Target ROI Value
- Actual ROI Value
- Beneficiary (Company/Personal)
- ROI to Company
- ROI to Person

---

## 2.5 Module 4: Members

**Purpose:** Team member management and directory

### Features:
| Feature | Description |
|---------|-------------|
| Member Directory | List all team members |
| Member Profiles | View member details and assignments |
| Project Count | See how many projects each member has |
| Member Search | Find members by name or department |

### Member Information:
- Employee ID
- Username
- Full Name
- Email
- Department/Group
- Permission Level
- Profile Picture
- Project Assignments

---

## 2.6 Module 5: My Projects

**Purpose:** Personal project view for individual users

### Features:
| Feature | Description |
|---------|-------------|
| Assigned Projects | View projects assigned to logged-in user |
| Owned Projects | Projects where user is the leader |
| Quick Update | Fast access to update own projects |
| Personal Dashboard | User-specific metrics |

---

## 2.7 Module 6: Prioritization

**Purpose:** Strategic project prioritization and planning

### Features:
| Feature | Description |
|---------|-------------|
| Priority Matrix | View projects by urgency/impact |
| Ranking System | Prioritize projects systematically |
| Resource Allocation | Plan resource distribution |
| Strategic View | High-level planning overview |

---

## 2.8 Module 7: Finance & Investment

**Purpose:** Financial tracking and investment analysis

### Features:
| Feature | Description |
|---------|-------------|
| Investment Dashboard | Overview of project investments |
| Budget Tracking | Monitor budget vs actual spending |
| Financial Reports | Investment summaries by period |
| YTD Analysis | Year-to-date financial metrics |

---

# 3. Technology Stack

## 3.1 Technology Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TECHNOLOGY STACK                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND                    BACKEND                             │
│  ────────                    ───────                             │
│  • React.js 18.2.0          • Node.js 16+                       │
│  • React Router 6.4.1       • Express.js 4.18.1                 │
│  • Material-UI 5.11.16      • JSON Web Token (JWT)              │
│  • ApexCharts 3.37.2        • bcrypt 6.0.0                      │
│  • Framer Motion 6.2.6      • Nodemailer 6.10.1                 │
│  • SASS 1.53.0              • dotenv 17.2.3                     │
│                                                                  │
│  DATABASE                    INFRASTRUCTURE                      │
│  ────────                    ──────────────                      │
│  • MySQL 8.0                • Apache 2.4.41                     │
│  • MySQL2 Driver 2.3.3      • PM2 Process Manager               │
│  • Connection Pooling       • Let's Encrypt SSL                 │
│                             • Ubuntu Server                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 3.2 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.2.0 | Core UI framework for building interactive interfaces |
| **React Router DOM** | 6.4.1 | Client-side navigation and routing |
| **Material-UI (MUI)** | 5.11.16 | Pre-built UI components (buttons, forms, tables) |
| **ApexCharts** | 3.37.2 | Data visualization (charts, graphs) |
| **Framer Motion** | 6.2.6 | Smooth animations and transitions |
| **SASS** | 1.53.0 | Advanced CSS styling |

## 3.3 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >= 16.0 | JavaScript runtime environment |
| **Express.js** | 4.18.1 | Web server framework |
| **MySQL2** | 2.3.3 | Database driver with connection pooling |
| **jsonwebtoken** | 8.5.1 | JWT authentication tokens |
| **bcrypt** | 6.0.0 | Password hashing (secure) |
| **Nodemailer** | 6.10.1 | Email sending for OTP |
| **dotenv** | 17.2.3 | Environment configuration |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

## 3.4 Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Web Server** | Apache 2.4.41 | Serve static files, SSL termination, reverse proxy |
| **Process Manager** | PM2 | Keep Node.js running, auto-restart on crash |
| **SSL Certificate** | Let's Encrypt | HTTPS encryption (auto-renewal) |
| **Operating System** | Ubuntu Server | Linux server environment |
| **File Transfer** | SFTP | Secure file deployment |

---

# 4. Database System

## 4.1 Database Overview

| Property | Value |
|----------|-------|
| **Database System** | MySQL 8.0 |
| **Database Name** | tvs_db_dup |
| **Host** | localhost |
| **Port** | 3306 |
| **Connection Type** | Connection Pool (max 10 connections) |
| **Character Set** | UTF-8 |

## 4.2 Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
│                        tvs_db_dup                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CORE TABLES                    SECURITY TABLES                  │
│  ───────────                    ───────────────                  │
│  • cwr038_member               • cwr038_login_log               │
│  • cwr038_project              • cwr038_logout_log              │
│  • cwr038_project_group        • cwr038_page_access_log         │
│  • cwr038_project_member       • cwr038_password_history        │
│  • cwr038_project_team         • cwr038_password_otp            │
│                                                                  │
│  PROJECT DETAIL TABLES          PERMISSION TABLES                │
│  ────────────────────          ─────────────────                 │
│  • cwr038_action_plans         • cwr038_member_permission_group │
│  • cwr038_project_notes        • cwr038_member_permission_list  │
│  • cwr038_project_logs                                          │
│  • cwr038_roi                                                   │
│  • cwr038_expense                                               │
│  • cwr038_revenue                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 4.3 Core Tables

### 4.3.1 Members Table (cwr038_member)

**Purpose:** Store all user accounts and authentication data

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key (auto-increment) |
| c_emp_id | INT | Employee ID (unique identifier) |
| c_username | VARCHAR(255) | Login username |
| c_password | VARCHAR(255) | Hashed password (bcrypt) |
| c_name | VARCHAR(255) | First name |
| c_lastname | VARCHAR(255) | Last name |
| c_email | VARCHAR(255) | Email address (for OTP) |
| c_permission_group_id | INT | Permission level (0=Admin, 1=Manager, 2=User) |
| c_project_group | INT | Assigned project group |
| c_status | INT | Account status (0=inactive, 1=active) |
| c_failed_attempts | INT | Failed login counter |
| c_lockout_until | DATETIME | Account lockout expiry |
| c_password_changed_at | DATETIME | Last password change |
| c_must_change_password | TINYINT | Force password change flag |
| c_last_login | DATETIME | Last successful login |

### 4.3.2 Projects Table (cwr038_project)

**Purpose:** Store all project information

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| c_name | VARCHAR(255) | Project name |
| c_project_NO | VARCHAR(50) | Project number/code |
| c_project_start | DATE | Start date |
| c_project_finish | DATE | End date |
| c_leader_id | INT | Project leader (member ID) |
| c_project_group_id | INT | Project group |
| c_detail | TEXT | Project description |
| c_objective | TEXT | Project objectives |
| c_project_status | VARCHAR(20) | Status color (Green/Yellow/Red/Gray) |
| c_percent_progress | VARCHAR(10) | Progress percentage |
| c_budget | VARCHAR(255) | Target budget |
| c_budget_act | VARCHAR(255) | Actual budget spent |
| c_roi_tgt | DOUBLE | Target ROI |
| c_roi_act | DOUBLE | Actual ROI |
| c_status | INT | Publication status (0=draft, 1=published) |

## 4.4 Security & Audit Tables

### 4.4.1 Login Log (cwr038_login_log)

**Purpose:** Track all login attempts for security audit

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| c_username | VARCHAR(100) | Username attempted |
| c_emp_id | VARCHAR(20) | Employee ID |
| c_ip_address | VARCHAR(45) | Client IP address |
| c_user_agent | TEXT | Browser/device info |
| c_status | VARCHAR(20) | SUCCESS / FAILED / BLOCKED |
| c_failure_reason | VARCHAR(255) | Reason for failure |
| created_at | TIMESTAMP | Timestamp of attempt |

### 4.4.2 Password History (cwr038_password_history)

**Purpose:** Store previous passwords to prevent reuse

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| c_emp_id | VARCHAR(20) | Employee ID |
| c_password_hash | VARCHAR(255) | Previous password hash |
| created_at | TIMESTAMP | When password was changed |

### 4.4.3 OTP Table (cwr038_password_otp)

**Purpose:** Store one-time passwords for password reset

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| c_emp_id | VARCHAR(20) | Employee ID |
| c_email | VARCHAR(255) | Email sent to |
| c_otp | VARCHAR(6) | 6-digit OTP code |
| c_expires_at | DATETIME | OTP expiry time (10 min) |
| c_verified | TINYINT | OTP verified flag |
| c_used | TINYINT | OTP already used flag |

## 4.5 Total Tables Count

The database contains **80+ tables** including:
- Main application tables (cwr038_*)
- Small TVS tables (cwr038_stvs_*)
- Legacy/archive tables
- Workshop tables

---

# 5. Security Implementation

## 5.1 Security Overview

The system implements **Central War Room Security Policy** with multiple layers of protection:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: AUTHENTICATION                                         │
│  ─────────────────────────                                       │
│  • Username/Password login                                       │
│  • JWT Token-based sessions                                      │
│  • Single session enforcement                                    │
│                                                                  │
│  Layer 2: PASSWORD SECURITY                                      │
│  ──────────────────────────                                      │
│  • bcrypt hashing (12 rounds)                                    │
│  • Complexity requirements                                       │
│  • History tracking (no reuse)                                   │
│  • Expiration after 12 months                                    │
│                                                                  │
│  Layer 3: ACCOUNT PROTECTION                                     │
│  ───────────────────────────                                     │
│  • Lockout after 3 failed attempts                               │
│  • 10-minute lockout duration                                    │
│  • Account start/end dates                                       │
│                                                                  │
│  Layer 4: SESSION SECURITY                                       │
│  ──────────────────────────                                      │
│  • 30-minute inactivity timeout                                  │
│  • Server-side token blacklist                                   │
│  • Activity tracking                                             │
│                                                                  │
│  Layer 5: AUDIT LOGGING                                          │
│  ────────────────────────                                        │
│  • All logins logged                                             │
│  • All logouts logged                                            │
│  • Page access tracked                                           │
│  • Complete audit trail                                          │
│                                                                  │
│  Layer 6: OTP VERIFICATION                                       │
│  ──────────────────────────                                      │
│  • Email-based OTP                                               │
│  • 6-digit code                                                  │
│  • 10-minute validity                                            │
│  • One-time use                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 5.2 Policy Compliance

| Policy Code | Requirement | Implementation |
|-------------|-------------|----------------|
| **5.2.3.1** | Username case sensitivity | BINARY SQL comparison |
| **5.2.3.6** | Password min 8 characters | Validated on change |
| **5.2.3.6** | Password must have letters | Regex validation |
| **5.2.3.6** | Password must have numbers | Regex validation |
| **5.2.3.6** | Password must have special chars | Regex validation |
| **5.2.3.6** | No reuse of last 5 passwords | History table check |
| **5.2.3.6** | Password expires in 12 months | Date comparison check |
| **5.2.3.6** | Audit all activities | 4 log tables |
| **5.2.3.9** | Session timeout 30 min | JWT expiry + client check |
| **5.3.1.9** | Lock after 3 failed attempts | Counter + lockout |
| **5.3.1.9** | 10-minute lockout duration | Timestamp comparison |

## 5.3 Password Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                  PASSWORD POLICY                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MINIMUM REQUIREMENTS:                                           │
│  ─────────────────────                                           │
│  ✓ At least 8 characters                                         │
│  ✓ At least 1 letter (a-z, A-Z)                                  │
│  ✓ At least 1 number (0-9)                                       │
│  ✓ At least 1 special character (!@#$%^&*...)                    │
│                                                                  │
│  RESTRICTIONS:                                                   │
│  ─────────────                                                   │
│  ✗ Cannot reuse last 5 passwords                                 │
│  ✗ Cannot change more than once per 24 hours                     │
│  ✗ Must change after 12 months                                   │
│  ✗ Must change on first login                                    │
│                                                                  │
│  EXAMPLES:                                                       │
│  ─────────                                                       │
│  ✓ Valid:   "MyP@ssw0rd!"                                        │
│  ✓ Valid:   "Secure#123"                                         │
│  ✗ Invalid: "password" (no number, no special)                   │
│  ✗ Invalid: "12345678" (no letter, no special)                   │
│  ✗ Invalid: "Short1!" (less than 8 chars)                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 5.4 Password Hashing

| Property | Value |
|----------|-------|
| **Algorithm** | bcrypt |
| **Cost Factor** | 12 rounds |
| **Salt** | Automatically generated |
| **Hash Format** | $2a$12$[22-char salt][31-char hash] |

**Example:**
```
Password: MyP@ssw0rd!
Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKz8lIu7S7.XGWO
```

## 5.5 Account Lockout Flow

```
                    ┌──────────────┐
                    │ Login Attempt │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Is Account   │───Yes──→ Return "Account Locked"
                    │ Locked?      │          (show remaining time)
                    └──────┬───────┘
                           │ No
                    ┌──────▼───────┐
                    │ Verify       │───Yes──→ Reset counter, Login success
                    │ Password     │
                    └──────┬───────┘
                           │ No (wrong password)
                    ┌──────▼───────┐
                    │ Increment    │
                    │ Failed Count │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Count >= 3?  │───Yes──→ Lock for 10 minutes
                    └──────┬───────┘
                           │ No
                    ┌──────▼───────┐
                    │ Return Error │
                    │ (X attempts  │
                    │ remaining)   │
                    └──────────────┘
```

## 5.6 OTP (One-Time Password) System

### OTP Specifications:
| Property | Value |
|----------|-------|
| **Length** | 6 digits |
| **Validity** | 10 minutes |
| **Delivery** | Email (SMTP) |
| **Format** | Numeric only (000000-999999) |

### OTP Flow:
```
1. User clicks "Forgot Password"
          │
          ▼
2. Enter Username/Email
          │
          ▼
3. System generates 6-digit OTP
          │
          ▼
4. OTP sent to user's email
          │
          ▼
5. User enters OTP
          │
          ▼
6. System verifies OTP
          │
          ▼
7. User sets new password
          │
          ▼
8. OTP marked as used
```

## 5.7 JWT Token Security

### Token Structure:
```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "c_emp_id": "12345",
  "c_username": "john.doe",
  "role": "member",
  "exp": 1704538200,    // Expires in 30 minutes
  "iat": 1704536400     // Issued at
}

// Signature
HMACSHA256(header + "." + payload, JWT_SECRET)
```

### Token Security Features:
- **30-minute expiry** - Tokens automatically expire
- **Server-side blacklist** - Logged out tokens are invalidated
- **Single session** - New login invalidates previous session
- **Secure secret** - JWT_SECRET stored in environment variable

## 5.8 Audit Trail

### What is Logged:

| Event | Data Captured |
|-------|---------------|
| **Login Attempt** | Username, IP, Browser, Status, Failure Reason, Timestamp |
| **Logout** | Username, IP, Browser, Reason (manual/timeout), Timestamp |
| **Page Access** | User, Page Path, Page Title, IP, Browser, Timestamp |
| **Password Change** | User, Timestamp (password not logged) |

### Log Retention:
All logs are stored permanently in the database for audit purposes.

---

# 6. System Architecture

## 6.1 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USERS                                       │
│                    (Web Browser / Mobile)                             │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │ HTTPS (Port 443)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      APACHE WEB SERVER                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  • SSL/TLS Termination (Let's Encrypt)                         │  │
│  │  • Static File Serving (/var/www/html/true-visions-pms/)       │  │
│  │  • Reverse Proxy (/true-visions-api/ → localhost:8080)         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
          ┌────────────────────┴────────────────────┐
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│   REACT FRONTEND    │                   │   EXPRESS BACKEND   │
│  (Static Files)     │                   │   (Node.js API)     │
├─────────────────────┤                   ├─────────────────────┤
│ • index.html        │      API Calls    │ • JWT Auth          │
│ • static/js/*.js    │ ───────────────▶  │ • REST Endpoints    │
│ • static/css/*.css  │                   │ • Business Logic    │
│ • assets/*          │                   │ • bcrypt Hashing    │
└─────────────────────┘                   └──────────┬──────────┘
                                                     │
                                                     │ MySQL Protocol
                                                     │ (Port 3306)
                                                     ▼
                                          ┌─────────────────────┐
                                          │    MySQL DATABASE   │
                                          ├─────────────────────┤
                                          │ • tvs_db_dup        │
                                          │ • 80+ tables        │
                                          │ • Connection Pool   │
                                          └─────────────────────┘
```

## 6.2 Request Flow

```
1. User navigates to https://ibsdo.com/true-visions-pms/
                              │
2. Apache serves React static files (index.html, JS, CSS)
                              │
3. React app loads in browser, shows login page
                              │
4. User enters credentials, React calls POST /login
                              │
5. Request goes through Apache reverse proxy to Express
                              │
6. Express validates credentials against MySQL
                              │
7. On success, JWT token returned to React
                              │
8. React stores token, redirects to Dashboard
                              │
9. All subsequent API calls include JWT in header
                              │
10. Express verifies JWT before processing requests
```

---

# 7. Deployment & Infrastructure

## 7.1 Server Details

| Property | Value |
|----------|-------|
| **Server URL** | ibsdo.com |
| **Operating System** | Ubuntu Server |
| **Web Server** | Apache 2.4.41 |
| **SSL** | Let's Encrypt (auto-renewal) |
| **Process Manager** | PM2 |

## 7.2 Directory Structure

```
Server: ibsdo.com
│
├── /var/www/html/
│   └── true-visions-pms/          ← React Build (Frontend)
│       ├── index.html
│       ├── favicon.ico
│       ├── manifest.json
│       ├── asset-manifest.json
│       ├── robots.txt
│       ├── assets/                ← Images, icons
│       │   ├── true-logo.png
│       │   ├── dashboard.png
│       │   └── ...
│       └── static/
│           ├── js/                ← Compiled JavaScript
│           │   └── main.xxxxx.js
│           └── css/               ← Compiled CSS
│               └── main.xxxxx.css
│
└── /home/kittinv/
    └── true-vision-warroom/
        └── server/                ← Node.js Backend
            ├── app.js             ← Main application
            ├── package.json       ← Dependencies
            ├── package-lock.json
            ├── .env               ← Configuration
            └── node_modules/      ← Installed packages
```

## 7.3 Apache Configuration (Required)

```apache
<VirtualHost *:443>
    ServerName ibsdo.com
    DocumentRoot /var/www/html

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/ibsdo.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/ibsdo.com/privkey.pem

    # Reverse Proxy for API
    ProxyPass "/true-visions-api/" "http://127.0.0.1:8080/"
    ProxyPassReverse "/true-visions-api/" "http://127.0.0.1:8080/"

    <Location "/true-visions-api/">
        Require all granted
    </Location>
</VirtualHost>
```

## 7.4 PM2 Commands

```bash
# View running processes
pm2 list

# Start application
pm2 start app.js --name "true-visions-pms-api"

# View logs
pm2 logs true-visions-pms-api

# Restart application
pm2 restart true-visions-pms-api

# Stop application
pm2 stop true-visions-pms-api

# Save process list (for auto-start)
pm2 save

# Setup auto-start on server reboot
pm2 startup
```

## 7.5 Environment Configuration (.env)

```bash
# Database
DB_HOST=localhost
DB_USER=ibsdo
DB_PASSWORD=********
DB_NAME=tvs_db_dup
DB_PORT=3306

# Server
PORT=8080
NODE_ENV=production

# Security
JWT_SECRET=your-secure-secret-key
ADMIN_RESET_KEY=admin-reset-key

# Email (OTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="True Vision War Room" <noreply@company.com>
```

---

# 8. API Documentation

## 8.1 Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/login` | No | User login |
| POST | `/logout` | Yes | Server-side logout |
| POST | `/refresh-token` | Yes | Extend session |
| GET | `/verify-token` | Yes | Check session validity |
| POST | `/change-password` | No | Change password |
| POST | `/forgot-password` | No | Request OTP |
| POST | `/verify-otp` | No | Verify OTP code |
| POST | `/reset-password-otp` | No | Reset password with OTP |
| POST | `/resend-otp` | No | Resend OTP |
| POST | `/admin-reset-password` | No* | Admin password reset |

*Requires admin key

## 8.2 Project Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/projects` | Yes | List all projects |
| GET | `/projects/:id` | Yes | Get project details |
| POST | `/projects` | Yes | Create new project |
| PUT | `/projects/:id` | Yes | Update project |
| DELETE | `/projects/:id` | Yes | Delete project |
| PUT | `/projects/:id/publish` | Yes | Publish draft project |
| GET | `/projects/drafts` | Yes | List draft projects |
| GET | `/my-projects/:empId` | Yes | User's projects |

## 8.3 Member Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/members` | Yes | List all members |
| GET | `/members-with-counts` | Yes | Members with project counts |
| GET | `/projects/:id/team-members` | Yes | Project team members |
| PUT | `/projects/:id/team` | Yes | Update project team |

## 8.4 Audit Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/log-page-access` | Yes | Log page visit |
| GET | `/page-access-logs` | Yes | View page logs |
| GET | `/login-logs` | Yes | View login logs |
| GET | `/logout-logs` | Yes | View logout logs |

---

# Appendix A: Quick Reference Card

## Ports

| Service | Port |
|---------|------|
| HTTPS | 443 |
| HTTP (redirect) | 80 |
| Backend API | 8080 |
| MySQL | 3306 |

## URLs

| Environment | URL |
|-------------|-----|
| Production Frontend | https://ibsdo.com/true-visions-pms/ |
| Production API | https://ibsdo.com/true-visions-api/ |

## Security Settings

| Setting | Value |
|---------|-------|
| Session Timeout | 30 minutes |
| Failed Login Limit | 3 attempts |
| Lockout Duration | 10 minutes |
| Password Min Length | 8 characters |
| Password History | 5 passwords |
| OTP Validity | 10 minutes |
| JWT Expiry | 30 minutes |

## Key Commands

```bash
# Check backend status
pm2 status

# View logs
pm2 logs true-visions-pms-api --lines 50

# Restart backend
pm2 restart true-visions-pms-api

# Reload Apache
sudo systemctl reload apache2

# Test MySQL connection
mysql -u ibsdo -p tvs_db_dup
```

---

**Document End**

*This document is confidential and intended for CP Group - True Visions internal use only.*
*For questions or updates, contact the development team.*
