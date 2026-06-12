# CONFIDENTIAL - CP Group Internal Use Only

---

# iCENTRAL WAR ROOM & TRUE VISION WAR ROOM (PMS)

## Infrastructure, Security & Technical Documentation
### With Data Security Policy Compliance

| Field | Value |
|-------|-------|
| **Version** | 3.0 |
| **Date** | January 2026 |
| **Status** | Production |
| **Classification** | Internal - Confidential |

**Business Strategy Development Office (BSDO)**
CP Group - Chairman Office

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture & SSO Flow](#2-system-architecture--sso-flow)
3. [iCentral War Room Overview](#3-icentral-war-room-overview)
4. [True Vision War Room (Focus)](#4-true-vision-war-room-primary-focus)
5. [Data Security Policy (Ref: April 2024)](#5-data-security-policy-reference)
6. [Security Implementation Checklist](#6-security-implementation-compliance-checklist)
7. [Infrastructure Details](#7-infrastructure-details)

---

# 1. Executive Summary

The iCentral War Room ecosystem consists of two integrated platforms designed to provide strategic intelligence and operational visibility across CP Group's business units. This documentation focuses primarily on the True Vision War Room system while providing context for how it integrates with the broader iCentral platform.

## Key Integration Points

> **SSO Integration:** True Vision War Room serves as the authentication provider for the entire ecosystem
>
> **Security Compliance:** Both systems comply with CP Group Data Security Procedure (Effective April 1, 2024)
>
> **Primary Focus:** True Vision PMS, BSC, and Analytics modules with enterprise security features

---

# 2. System Architecture & SSO Flow

The following diagram illustrates how the two systems work together through Single Sign-On (SSO) authentication.

## 2.1 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               System Architecture & SSO Authentication Flow                  │
│          iCentral War Room & True Vision War Room Integration                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌──────────────────┐                                │
│                          │ User Login Request│                                │
│                          └────────┬─────────┘                                │
│                                   │                                          │
│                                   ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │              TRUE VISION - SSO Authentication Provider                │    │
│  │         https://ibsdo.com/true-visions-pms/ (Port 443/HTTPS)        │    │
│  │                                                                       │    │
│  │  Enterprise Security Gateway - All authentication passes through here │    │
│  │                                                                       │    │
│  │  ✓ JWT Token (30 min expiry)    ✓ bcrypt Hashing (12 rounds)         │    │
│  │  ✓ Account Lockout (3 attempts) ✓ Auto-unlock (10 min)               │    │
│  │  ✓ Password History (5 prev)    ✓ 12-Month Password Expiry           │    │
│  │  ✓ OTP Email Recovery           ✓ Complete Audit Trail                │    │
│  │  ✓ Single Session per User      ✓ 30-min Session Timeout             │    │
│  │  ✓ Min 8-char Password          ✓ HTTPS Encrypted                    │    │
│  └──────────────────────────┬───────────────────────────────────────────┘    │
│                              │                                               │
│                     ┌── SSO Token Generated ──┐                              │
│                     │                         │                              │
│                     ▼                         ▼                              │
│  ┌──────────────────────────────┐   ┌──────────────────────────────┐        │
│  │  True Vision War Room Modules│   │     iCENTRAL WAR ROOM        │        │
│  │                               │   │                               │        │
│  │  ┌─────┐ ┌─────┐ ┌─────────┐│   │  ✓ Global Economy (GDP)       │        │
│  │  │ PMS │ │ BSC │ │Analytics││   │  ✓ Capital Market (Stock)     │        │
│  │  └─────┘ └─────┘ └─────────┘│   │  ✓ Distribution Maps          │        │
│  │                               │   │  ✓ 20+ Business Units         │        │
│  │  Project Management           │   │                               │        │
│  │  ROI Tracking                 │   │  Connected Business Units:    │        │
│  │  Team Analytics               │   │  Lotus, CPALL, CPF,           │        │
│  │  Action Plans                 │   │  True Visions, CP Land, +More │        │
│  └──────────────────────────────┘   └──────────────────────────────┘        │
│                                                                              │
│  Legend:                                                                     │
│  [Red]    SSO Provider (Authentication)                                      │
│  [Blue]   iCentral (Intelligence Hub)                                        │
│  [Orange] SSO Token Flow                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. iCentral War Room Overview

The iCentral War Room serves as the central intelligence hub for CP Group, providing macro-level business insights. It authenticates users via SSO from True Vision War Room.

## 3.1 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Macro View** | Global economy indicators (GDP, Inflation, Exchange Rates) |
| **Capital Market** | Real-time stock prices via Yahoo Finance API (CPF, TRUE, CPALL) |
| **Overseas Market** | NASDAQ, Hang Seng, ITOCHU, PingAn tracking |
| **Distribution Maps** | Interactive maps (World, Thailand, China) via amCharts |
| **BU Access** | Gateway to 20+ business unit dashboards |

## 3.2 Technical Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18 + Material-UI + amCharts + D3.js + Three.js |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL 8.0 (Database: CIW) |
| **Authentication** | SSO via True Vision War Room (JWT) |

---

# 4. True Vision War Room (Primary Focus)

True Vision War Room is the SSO authentication provider and primary operational platform, offering Project Management (PMS), Balanced Scorecard (BSC), and AI-powered Analytics modules.

## 4.1 System Modules

| PMS - Project Management | BSC - Balanced Scorecard | Analytics - AI Forecasting |
|--------------------------|--------------------------|---------------------------|
| Project Tracking | Strategy Map | 95% AI Accuracy |
| Team & ROI Analysis | 4 Perspectives | Revenue Trends |
| Action Plans | KPI Summary | Churn Analysis |
| Timeline Management | Performance Metrics | Sales Heatmaps |

## 4.2 Technical Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18 + Material-UI + ApexCharts + Redux |
| **Frontend Deployment** | Static build files deployed via FileZilla (SFTP) to Apache web server |
| **Frontend URL** | `https://ibsdo.com/true-visions-pms/` |
| **Backend** | Node.js + Express.js (Internal Port 8080, managed by PM2) |
| **Backend URL** | `https://ibsdo.com/true-visions-api/` (via Apache Reverse Proxy) |
| **Web Server** | Apache 2.4.41 (SSL termination + reverse proxy) |
| **SSL** | Let's Encrypt (HTTPS, auto-renewal) |
| **Database** | MySQL 8.0 (Database: tvs_db_dup) |
| **Authentication** | JWT (30 min) + bcrypt (12 rounds) + SSO Provider |
| **BI Integration** | Power BI Embedded (BSC + Analytics) |
| **Email Service** | Nodemailer + Brevo SMTP (OTP delivery) |
| **Process Manager** | PM2 (auto-restart on crash) |

### 4.2.1 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USERS                                       │
│                    (Web Browser / Mobile)                             │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │ HTTPS (Port 443)
                               │ https://ibsdo.com/true-visions-pms/
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
│  (Static Build Files│                   │   (Node.js API)     │
│   via FileZilla)    │                   │   Port 8080 (PM2)   │
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

### 4.2.2 Frontend Deployment Process

The React frontend is built locally and deployed as static files via FileZilla:

```
Developer Machine                    Production Server (ibsdo.com)
─────────────────                    ────────────────────────────

1. npm run build
   (creates /build folder)

2. Upload via FileZilla (SFTP)  ──→  /var/www/html/true-visions-pms/
   - build/index.html           ──→    ├── index.html
   - build/static/              ──→    ├── static/
   - build/assets/              ──→    │   ├── js/main.xxxxx.js
                                       │   └── css/main.xxxxx.css
                                       └── assets/
```

### 4.2.3 Request Flow

```
1. User navigates to https://ibsdo.com/true-visions-pms/
                              │
2. Apache serves React static files (index.html, JS, CSS)
                              │
3. React app loads in browser, shows login page
                              │
4. User enters credentials, React calls POST /login
                              │
5. Request goes through Apache reverse proxy to Express (port 8080)
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

## 4.3 Enterprise Security Features (SSO Provider)

True Vision War Room implements comprehensive security controls that are shared across all connected systems via SSO:

| Security Feature | Implementation |
|------------------|----------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Token Expiry** | 30 minutes |
| **Account Lockout** | 3 failed attempts |
| **Lockout Duration** | 10 minutes (auto-unlock) |
| **Password History** | Last 5 passwords prevented |
| **Password Expiry** | 12 months mandatory change |
| **Single Session** | Yes - per user enforcement |
| **Audit Logging** | Complete activity trail |
| **OTP Recovery** | 6-digit email OTP (10 min validity) |
| **Session Timeout** | 30 minutes inactivity |

---

# 5. Data Security Policy Reference

**Reference Document:** Data Security Procedure of Central War Room
**Effective Date:** April 1, 2024 | Revision: 1
**Approved By:** Mr. Soopakij Chearavanont, Chairman of CP Group

## 5.1 Policy Objectives

The Central War Room is established according to the direction of the Chairman for management and monitoring of CP Group companies. Key user access levels:

- **Level 1.1.1:** Senior Chairman, Chairman, CEO of CP Group - Full access to all information
- **Level 1.1.2:** C-Level executives - Access to own business group (requires Chairman approval)
- **Level 1.1.3:** Assigned users - Specified access (requires multi-level approval chain)
- **Level 1.1.4:** System Administrators and Working Teams - Chairman approval required

## 5.2 Key Policy Requirements

### 5.2.1 Access Control (Policy Section 5.1)

- All users must sign NDA for confidentiality
- Access Authorization Matrix defines user permissions
- Data copying/distribution requires Chairman approval

### 5.2.2 Password Management (Policy Section 5.2.3.6)

- Password not displayed during entry
- Password change required every 12 months
- Cannot reuse last 5 passwords
- Minimum 8 characters with letters, numbers, special characters
- Account lockout after 5 failed attempts
- MAC Address control for device authorization

### 5.2.3 Session Management (Policy Section 5.2.3.9)

- Auto-lock after 30 minutes of inactivity
- Password required to resume session

### 5.2.4 User Access Review (Policy Section 5.2.4)

- User list review every 6 months
- Inactive users (6+ months) must be reviewed
- Immediate deactivation upon resignation/transfer

---

# 6. Security Implementation Compliance Checklist

This checklist maps the implemented security features against the Data Security Policy requirements.

Legend: ✓ = Implemented, ○ = Partial, ✗ = Not Implemented

### PASSWORD SECURITY

| Status | Policy Requirement | Implementation | Policy Ref |
|--------|--------------------|----------------|------------|
| ✓ | Password not displayed during entry | Input type=password | 5.2.3.6 |
| ✓ | Password change every 12 months | 12-month expiry + auto-force | 5.2.3.6 |
| ✓ | Cannot reuse last 5 passwords | Password history table | 5.2.3.6 |
| ✓ | Min 8 chars with mixed characters | Regex validation | 5.2.3.6 |
| ✓ | Account lockout after failed attempts | 3 attempts (policy: 5) | 5.2.3.6 |
| ✓ | Auto-unlock after lockout period | 10 minutes | 5.3.1.9 |
| ✓ | Force password change on first login | Implemented | 5.2.3.4 |
| ○ | MAC Address device control | Not yet implemented | 5.2.3.6 |

### SESSION MANAGEMENT

| Status | Policy Requirement | Implementation | Policy Ref |
|--------|--------------------|----------------|------------|
| ✓ | Session timeout (30 min inactivity) | JWT 30-min expiry | 5.2.3.9 |
| ✓ | Single session per user | Token invalidation on new login | 5.2.3.2 |
| ✓ | Password required to resume | Re-authentication required | 5.2.3.9 |

### USER MANAGEMENT

| Status | Policy Requirement | Implementation | Policy Ref |
|--------|--------------------|----------------|------------|
| ✓ | Individual user IDs required | Unique usernames enforced | 5.2.3.1 |
| ✓ | No shared/group usernames | BINARY comparison | 5.2.3.2 |
| ✓ | User expiration dates | Start/end date fields | 5.2.3.6 |
| ○ | Access review every 6 months | Manual process required | 5.2.4.1 |

### AUDIT & LOGGING

| Status | Policy Requirement | Implementation | Policy Ref |
|--------|--------------------|----------------|------------|
| ✓ | Login attempt logging | Full audit trail | 5.2.3.6 |
| ✓ | Record all system access attempts | IP, User Agent, Timestamp | 5.2.3.6 |
| ✓ | Page access logging | User ID, Path, Title tracked | 5.2.3.6 |
| ✓ | Password change logging | Hash stored in history | 5.2.3.6 |

### SYSTEM SECURITY

| Status | Policy Requirement | Implementation | Policy Ref |
|--------|--------------------|----------------|------------|
| ✓ | Warning message on login page | CP Group ownership displayed | 5.2.3.5 |
| ✓ | Secure password storage | bcrypt 12 rounds | 5.4.2.1 |
| ✓ | Encrypted password transmission | HTTPS/SSL | 5.2.3.8 |
| ✓ | Password reset verification | OTP via email (6-digit) | 5.2.3.4 |
| ✓ | Default password change required | Force change on first login | 5.4.2.2 |

## 6.1 Compliance Summary

| Category | Count |
|----------|-------|
| Fully Implemented (✓) | 19 |
| Partially Implemented (○) | 2 |
| Not Implemented (✗) | 0 |
| **Compliance Rate** | **90%+** |

## 6.2 Action Items for Full Compliance

1. **MAC Address Control:** Implement device registration and validation system (Policy 5.2.3.6)
2. **6-Month Access Review:** Establish automated user access review process (Policy 5.2.4.1)

---

# 7. Infrastructure Details

## 7.1 Hosting Environment

**Hosted on True IDC** - Thailand's Premier Data Center

| Parameter | Value |
|-----------|-------|
| **VDC Name** | IDC2023_5891_True Visions Group_VDC_New |
| **Organization** | True_Visions_Group |
| **Host** | vm-az01.trueidc.com |
| **CPU** | 16 GHz Allocated |
| **Memory** | 16 GB Used / 20 GB Allocated |
| **Storage** | 66 GB Used / 200 GB Allocated |

## 7.2 Network Configuration

| Service | Port | Description |
|---------|------|-------------|
| **HTTPS** | 443 | SSL/TLS encrypted traffic (all public access) |
| **HTTP** | 80 | Redirects to HTTPS |
| **True Vision Backend** | 8080 (internal) | Node.js API (proxied via Apache at `/true-visions-api/`) |
| **MySQL** | 3306 (internal) | Database (internal only, not exposed) |

### 7.2.1 Public URLs

| System | URL |
|--------|-----|
| **True Vision PMS Frontend** | `https://ibsdo.com/true-visions-pms/` |
| **True Vision PMS API** | `https://ibsdo.com/true-visions-api/` |

> **Note:** All public traffic goes through HTTPS (Port 443) via Apache. Internal service ports (8080, 3306) are NOT exposed to the internet. Apache handles SSL termination and reverse proxying.

## 7.3 Server Directory Structure

```
Server: ibsdo.com (Ubuntu Server)
│
├── /var/www/html/
│   └── true-visions-pms/              ← React Build Files (deployed via FileZilla)
│       ├── index.html
│       ├── favicon.ico
│       ├── manifest.json
│       ├── asset-manifest.json
│       ├── robots.txt
│       ├── assets/                    ← Images, icons
│       │   ├── true-logo.png
│       │   ├── dashboard.png
│       │   └── ...
│       └── static/
│           ├── js/                    ← Compiled JavaScript
│           │   └── main.xxxxx.js
│           └── css/                   ← Compiled CSS
│               └── main.xxxxx.css
│
└── /home/kittinv/
    └── true-vision-warroom/
        └── server/                    ← Node.js Backend (managed by PM2)
            ├── app.js                 ← Main application
            ├── package.json           ← Dependencies
            ├── package-lock.json
            ├── .env                   ← Configuration
            └── node_modules/          ← Installed packages
```

## 7.4 Apache Configuration

```apache
<VirtualHost *:443>
    ServerName ibsdo.com
    DocumentRoot /var/www/html

    # SSL Configuration (Let's Encrypt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/ibsdo.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/ibsdo.com/privkey.pem

    # Reverse Proxy for True Vision API
    ProxyPass "/true-visions-api/" "http://127.0.0.1:8080/"
    ProxyPassReverse "/true-visions-api/" "http://127.0.0.1:8080/"

    <Location "/true-visions-api/">
        Require all granted
    </Location>
</VirtualHost>
```

## 7.5 Database Architecture

| Parameter | True Vision |
|-----------|-------------|
| **Database Name** | tvs_db_dup |
| **Server** | localhost:3306 |
| **Connection Type** | Pool (10 max) |
| **Keep-Alive** | Yes |
| **Auto-reconnect** | Yes |

## 7.6 PM2 Process Management

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

# Save process list (for auto-start on reboot)
pm2 save

# Setup auto-start on server reboot
pm2 startup
```

## 7.7 Environment Configuration (.env)

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

# Appendix A: Quick Reference Card

## Ports

| Service | Port | Access |
|---------|------|--------|
| HTTPS | 443 | Public |
| HTTP (redirect) | 80 | Public (redirects to 443) |
| Backend API | 8080 | Internal only (via Apache reverse proxy) |
| MySQL | 3306 | Internal only |

## URLs

| Environment | URL |
|-------------|-----|
| **Production Frontend** | `https://ibsdo.com/true-visions-pms/` |
| **Production API** | `https://ibsdo.com/true-visions-api/` |

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

**CONFIDENTIAL - CP Group Internal Use Only**

*This document is confidential and intended for CP Group - True Visions internal use only.*
*For questions or updates, contact the BSDO development team.*
