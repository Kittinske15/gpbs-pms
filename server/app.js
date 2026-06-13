require('dotenv').config();
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const BCRYPT_ROUNDS = 12; // Cost factor for bcrypt (recommended: 10-12)
const secret = process.env.JWT_SECRET || 'Fullstack-login' // Use env variable (Policy 5.2.3.6)

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
    }
});
const ADMIN_RESET_KEY = process.env.ADMIN_RESET_KEY || 'gpbs2026admin'; // Use env variable
const PORT = process.env.PORT || 5001

// Token blacklist for server-side logout (Policy 5.2.3.6)
const tokenBlacklist = new Set();

// Active sessions map: stores current valid token for each user (Single Session Enforcement)
// Key: username, Value: { token, loginTime }
const activeSessions = new Map();

// Clean up expired tokens from blacklist every hour
setInterval(() => {
    const now = Date.now();
    tokenBlacklist.forEach(item => {
        try {
            const decoded = jwt.decode(item);
            if (decoded && decoded.exp && decoded.exp * 1000 < now) {
                tokenBlacklist.delete(item);
            }
        } catch (e) {
            tokenBlacklist.delete(item);
        }
    });
    // Also clean up expired sessions
    activeSessions.forEach((session, username) => {
        try {
            const decoded = jwt.decode(session.token);
            if (decoded && decoded.exp && decoded.exp * 1000 < now) {
                activeSessions.delete(username);
            }
        } catch (e) {
            activeSessions.delete(username);
        }
    });
}, 3600000); // Clean up every hour

// Simple CORS - allow all origins (like old version)
app.use(cors());
app.use(express.json())

// Profile photo uploads directory
const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for profile photo uploads
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const empId = req.user.c_emp_id;
        cb(null, `${empId}${ext}`);
    }
});

const profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
        }
    }
});

// Serve uploaded profile photos
app.use('/uploads/profiles', express.static(uploadsDir));

// Serve static files from the React app build folder in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

const mysql = require('mysql2');

// Use connection pool instead of single connection to handle reconnection automatically
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ibsdo',
    password: process.env.DB_PASSWORD || '#wyT6G5iQg36',
    database: process.env.DB_NAME || 'gpbs_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// Create a connection alias for backward compatibility
const connection = pool;

// Test database connection and create tables if needed
pool.getConnection((err, testConnection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database (using connection pool)');
    testConnection.release(); // Release the test connection back to pool

    // Create cwr038_project_team table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cwr038_project_team (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            emp_id INT,
            name VARCHAR(255),
            role VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    connection.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating cwr038_project_team table:', err);
        } else {
            console.log('cwr038_project_team table ready');
        }
    });

    // Create security columns in cwr038_member table if they don't exist
    // Per Central War Room Security Policy sections 5.2.3.6 and 5.3.1.9
    const securityColumns = [
        { name: 'c_failed_attempts', sql: "ALTER TABLE cwr038_member ADD COLUMN c_failed_attempts INT DEFAULT 0" },
        { name: 'c_lockout_until', sql: "ALTER TABLE cwr038_member ADD COLUMN c_lockout_until DATETIME NULL" },
        { name: 'c_password_changed_at', sql: "ALTER TABLE cwr038_member ADD COLUMN c_password_changed_at DATETIME NULL" },
        { name: 'c_account_start_date', sql: "ALTER TABLE cwr038_member ADD COLUMN c_account_start_date DATE NULL" },
        { name: 'c_account_end_date', sql: "ALTER TABLE cwr038_member ADD COLUMN c_account_end_date DATE NULL" },
        { name: 'c_must_change_password', sql: "ALTER TABLE cwr038_member ADD COLUMN c_must_change_password TINYINT DEFAULT 0" },
        { name: 'c_last_login', sql: "ALTER TABLE cwr038_member ADD COLUMN c_last_login DATETIME NULL" },
        { name: 'c_profile_photo', sql: "ALTER TABLE cwr038_member ADD COLUMN c_profile_photo VARCHAR(255) NULL" }
    ];

    securityColumns.forEach(col => {
        connection.query(col.sql, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
                    // Column already exists, this is fine
                } else {
                    console.error(`Error adding column ${col.name}:`, err.message);
                }
            } else {
                console.log(`Added security column: ${col.name}`);
            }
        });
    });
    console.log('Security columns check completed');

    // Create password history table for policy 5.2.3.6 (no reuse of last 5 passwords)
    const createPasswordHistoryTable = `
        CREATE TABLE IF NOT EXISTS cwr038_password_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_emp_id VARCHAR(20) NOT NULL,
            c_password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_emp_id (c_emp_id)
        )
    `;
    connection.query(createPasswordHistoryTable, (err) => {
        if (err) {
            console.error('Error creating password history table:', err);
        } else {
            console.log('Password history table ready');
        }
    });

    // Create login attempts log table for audit trail (policy 5.2.3.6)
    const createLoginLogTable = `
        CREATE TABLE IF NOT EXISTS cwr038_login_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_username VARCHAR(100),
            c_emp_id VARCHAR(20),
            c_ip_address VARCHAR(45),
            c_user_agent TEXT,
            c_status VARCHAR(20),
            c_failure_reason VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_username (c_username),
            INDEX idx_created_at (created_at)
        )
    `;
    connection.query(createLoginLogTable, (err) => {
        if (err) {
            console.error('Error creating login log table:', err);
        } else {
            console.log('Login log table ready');
        }
    });

    // Create page access log table (Policy 5.2.3.6 - track pages accessed)
    const createPageAccessLogTable = `
        CREATE TABLE IF NOT EXISTS cwr038_page_access_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_emp_id VARCHAR(20),
            c_username VARCHAR(100),
            c_page_path VARCHAR(255),
            c_page_title VARCHAR(255),
            c_ip_address VARCHAR(45),
            c_user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_emp_id (c_emp_id),
            INDEX idx_created_at (created_at),
            INDEX idx_page_path (c_page_path)
        )
    `;
    connection.query(createPageAccessLogTable, (err) => {
        if (err) {
            console.error('Error creating page access log table:', err);
        } else {
            console.log('Page access log table ready');
        }
    });

    // Create logout log table (Policy 5.2.3.6 - track logouts)
    const createLogoutLogTable = `
        CREATE TABLE IF NOT EXISTS cwr038_logout_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_username VARCHAR(100),
            c_emp_id VARCHAR(20),
            c_ip_address VARCHAR(45),
            c_user_agent TEXT,
            c_logout_reason VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_username (c_username),
            INDEX idx_created_at (created_at)
        )
    `;
    connection.query(createLogoutLogTable, (err) => {
        if (err) {
            console.error('Error creating logout log table:', err);
        } else {
            console.log('Logout log table ready');
        }
    });

    // Create OTP table for password reset
    const createOtpTable = `
        CREATE TABLE IF NOT EXISTS cwr038_password_otp (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_emp_id VARCHAR(20) NOT NULL,
            c_username VARCHAR(100),
            c_email VARCHAR(255),
            c_otp VARCHAR(6) NOT NULL,
            c_expires_at DATETIME NOT NULL,
            c_verified TINYINT DEFAULT 0,
            c_used TINYINT DEFAULT 0,
            c_invalidated TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_emp_id (c_emp_id),
            INDEX idx_otp (c_otp),
            INDEX idx_expires (c_expires_at)
        )
    `;
    connection.query(createOtpTable, (err) => {
        if (err) {
            console.error('Error creating OTP table:', err);
        } else {
            console.log('Password OTP table ready');
            // Migrate existing installs that predate c_invalidated
            connection.query(
                "ALTER TABLE cwr038_password_otp ADD COLUMN c_invalidated TINYINT DEFAULT 0",
                (alterErr) => {
                    if (alterErr && alterErr.code !== 'ER_DUP_FIELDNAME' && !String(alterErr.message || '').includes('Duplicate column')) {
                        console.error('Error adding c_invalidated column:', alterErr.message);
                    }
                }
            );
        }
    });

    // Revenue projection rows per project (one row per year)
    const createRevenueProjectionTable = `
        CREATE TABLE IF NOT EXISTS cwr038_project_revenue_projection (
            id INT AUTO_INCREMENT PRIMARY KEY,
            c_project_id INT NOT NULL,
            c_year INT NOT NULL,
            c_return DECIMAL(18,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_project_year (c_project_id, c_year),
            INDEX idx_project (c_project_id)
        )
    `;
    connection.query(createRevenueProjectionTable, (err) => {
        if (err) {
            console.error('Error creating revenue projection table:', err);
        } else {
            console.log('Revenue projection table ready');
        }
    });
});

// Create test user endpoint (run once)
app.get('/create-test-user', function (req, res) {
    // Hash password: test1234 using PHP logic: md5(base64_encode(md5(sha1(trim(password)))))
    const password = 'test1234';
    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex');
    const md5OfSha1 = crypto.createHash('md5').update(sha1Hash).digest('hex');
    const base64Encoded = Buffer.from(md5OfSha1).toString('base64');
    const hashedPassword = crypto.createHash('md5').update(base64Encoded).digest('hex');

    console.log('Creating test user with hashed password:', hashedPassword);

    // Check if user already exists
    connection.query(
        'SELECT * FROM cwr038_member WHERE c_username = ?',
        ['test'],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            if (results.length > 0) {
                // Update existing user's password
                connection.query(
                    'UPDATE cwr038_member SET c_password = ? WHERE c_username = ?',
                    [hashedPassword, 'test'],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to update user', details: err.message });
                        }
                        res.json({ message: 'Test user password updated', username: 'test', password: 'test1234' });
                    }
                );
            } else {
                // Create new user with numeric emp_id
                connection.query(
                    `INSERT INTO cwr038_member (c_emp_id, c_username, c_password, c_name, c_lastname, c_email)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [999999, 'test', hashedPassword, 'Test', 'User', 'test@test.com'],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create user', details: err.message });
                        }
                        res.json({ message: 'Test user created', username: 'test', password: 'test1234' });
                    }
                );
            }
        }
    );
});

// ============ SECURITY HELPER FUNCTIONS (Central War Room Security Policy) ============

// Log login attempt for audit trail (Policy 5.2.3.6)
function logLoginAttempt(username, empId, ipAddress, userAgent, status, failureReason) {
    const query = `
        INSERT INTO cwr038_login_log (c_username, c_emp_id, c_ip_address, c_user_agent, c_status, c_failure_reason)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [username, empId, ipAddress, userAgent, status, failureReason], (err) => {
        if (err) console.error('Error logging login attempt:', err);
    });
}

// Log logout for audit trail (Policy 5.2.3.6)
function logLogout(username, empId, ipAddress, userAgent, reason) {
    const query = `
        INSERT INTO cwr038_logout_log (c_username, c_emp_id, c_ip_address, c_user_agent, c_logout_reason)
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(query, [username, empId, ipAddress, userAgent, reason], (err) => {
        if (err) console.error('Error logging logout:', err);
    });
}

// Log page access for audit trail (Policy 5.2.3.6)
function logPageAccess(empId, username, pagePath, pageTitle, ipAddress, userAgent) {
    const query = `
        INSERT INTO cwr038_page_access_log (c_emp_id, c_username, c_page_path, c_page_title, c_ip_address, c_user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [empId, username, pagePath, pageTitle, ipAddress, userAgent], (err) => {
        if (err) console.error('Error logging page access:', err);
    });
}

// Password validation (Policy 5.2.3.6 - min 8 chars, letters, numbers, special chars)
function validatePasswordStrength(password) {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasLetter) {
        return { valid: false, message: 'Password must contain at least one letter' };
    }
    if (!hasNumber) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true };
}

// Legacy hash password function (for backward compatibility with existing passwords)
function hashPasswordLegacy(password) {
    const trimmedPassword = password.trim();
    const sha1Hash = crypto.createHash('sha1').update(trimmedPassword).digest('hex');
    const md5OfSha1 = crypto.createHash('md5').update(sha1Hash).digest('hex');
    const base64Encoded = Buffer.from(md5OfSha1).toString('base64');
    return crypto.createHash('md5').update(base64Encoded).digest('hex');
}

// Secure hash password using bcrypt (Policy 5.2.3.6 - proper password storage)
async function hashPasswordSecure(password) {
    const trimmedPassword = password.trim();
    return await bcrypt.hash(trimmedPassword, BCRYPT_ROUNDS);
}

// Verify password - supports both bcrypt and legacy hash
async function verifyPassword(inputPassword, storedHash) {
    const trimmedPassword = inputPassword.trim();

    // Check if stored hash is bcrypt format (starts with $2a$, $2b$, or $2y$)
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
        return await bcrypt.compare(trimmedPassword, storedHash);
    }

    // Fallback to legacy hash comparison
    const legacyHash = hashPasswordLegacy(inputPassword);
    return legacyHash.toLowerCase() === storedHash.toLowerCase();
}

// Check if password needs migration to bcrypt
function needsPasswordMigration(storedHash) {
    return !(storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$'));
}

// Migrate password to bcrypt after successful legacy login
async function migratePasswordToBcrypt(username, plainPassword) {
    try {
        const bcryptHash = await hashPasswordSecure(plainPassword);
        connection.query(
            'UPDATE cwr038_member SET c_password = ? WHERE c_username = ?',
            [bcryptHash, username],
            (err) => {
                if (err) {
                    console.error('Error migrating password to bcrypt:', err);
                } else {
                    console.log(`Password migrated to bcrypt for user: ${username}`);
                }
            }
        );
    } catch (err) {
        console.error('Error in password migration:', err);
    }
}

// ============ SECURE LOGIN ENDPOINT (Central War Room Security Policy) ============

app.post('/login', jsonParser, async function (req, res, next) {
    const username = String(req.body.c_username || '').trim();
    const password = String(req.body.c_password || '');
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Policy 5.2.3.6: Check for empty credentials
    if (!username || !password) {
        logLoginAttempt(username, null, ipAddress, userAgent, 'FAILED', 'Empty credentials');
        return res.json({ status: 'error', message: 'Username and password are required' });
    }

    // Policy 5.2.3.1: Username is case-sensitive (BINARY comparison)
    connection.execute(
        'SELECT * FROM cwr038_member WHERE BINARY c_username=?',
        [username],
        async function (err, cwr038_member, fields) {
            if (err) {
                console.error('Login error:', err);
                logLoginAttempt(username, null, ipAddress, userAgent, 'ERROR', 'Database error');
                return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
            }

            if (cwr038_member.length == 0) {
                logLoginAttempt(username, null, ipAddress, userAgent, 'FAILED', 'User not found');
                return res.json({ status: 'error', message: 'Invalid username or password' });
            }

            const user = cwr038_member[0];
            const empId = user.c_emp_id;

            // Policy 5.3.1.9: Check if account is locked (3 failed attempts, 10 min lockout)
            if (user.c_lockout_until) {
                const lockoutUntil = new Date(user.c_lockout_until);
                const now = new Date();
                if (now < lockoutUntil) {
                    const remainingMinutes = Math.ceil((lockoutUntil - now) / 60000);
                    logLoginAttempt(username, empId, ipAddress, userAgent, 'BLOCKED', 'Account locked');
                    return res.json({
                        status: 'error',
                        message: `Account is locked. Please try again in ${remainingMinutes} minute(s).`,
                        locked: true
                    });
                } else {
                    // Lockout period expired, reset failed attempts
                    connection.query(
                        'UPDATE cwr038_member SET c_failed_attempts = 0, c_lockout_until = NULL WHERE c_username = ?',
                        [username]
                    );
                }
            }

            // Policy 5.2.3.6: Check account expiration dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (user.c_account_start_date) {
                const startDate = new Date(user.c_account_start_date);
                if (today < startDate) {
                    logLoginAttempt(username, empId, ipAddress, userAgent, 'FAILED', 'Account not yet active');
                    return res.json({ status: 'error', message: 'Your account is not yet active. Please contact administrator.' });
                }
            }

            if (user.c_account_end_date) {
                const endDate = new Date(user.c_account_end_date);
                if (today > endDate) {
                    logLoginAttempt(username, empId, ipAddress, userAgent, 'FAILED', 'Account expired');
                    return res.json({ status: 'error', message: 'Your account has expired. Please contact administrator.' });
                }
            }

            // Verify password using bcrypt or legacy hash (Policy 5.2.3.6)
            const dbPassword = String(user.c_password || '');

            try {
                const isPasswordValid = await verifyPassword(password, dbPassword);

                if (isPasswordValid) {
                    // Migrate to bcrypt if using legacy hash
                    if (needsPasswordMigration(dbPassword)) {
                        await migratePasswordToBcrypt(username, password);
                    }

                    // Successful login - reset failed attempts and update last login
                    connection.query(
                        'UPDATE cwr038_member SET c_failed_attempts = 0, c_lockout_until = NULL, c_last_login = NOW() WHERE c_username = ?',
                        [username]
                    );

                    // Policy 5.2.3.6: Check if password needs to be changed
                    let mustChangePassword = user.c_must_change_password === 1;

                    // First login - never changed password before (c_password_changed_at is NULL)
                    if (!user.c_password_changed_at) {
                        mustChangePassword = true;
                    } else {
                        // Check if password is older than 12 months
                        const passwordChangedAt = new Date(user.c_password_changed_at);
                        const twelveMonthsAgo = new Date();
                        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
                        if (passwordChangedAt < twelveMonthsAgo) {
                            mustChangePassword = true;
                        }
                    }

                    // Policy 5.2.3.9: Token expires in 30 minutes for session timeout
                    var token = jwt.sign({
                        c_username: user.c_username,
                        c_emp_id: user.c_emp_id
                    }, secret, { expiresIn: '30m' });

                    // Single Session Enforcement: Invalidate previous session if exists
                    const existingSession = activeSessions.get(username);
                    if (existingSession) {
                        // Blacklist the old token
                        tokenBlacklist.add(existingSession.token);
                        console.log(`Previous session invalidated for user: ${username}`);
                    }

                    // Store new session as the only valid session for this user
                    activeSessions.set(username, {
                        token: token,
                        loginTime: new Date(),
                        ipAddress: ipAddress,
                        userAgent: userAgent
                    });

                    logLoginAttempt(username, empId, ipAddress, userAgent, 'SUCCESS', null);

                    res.json({
                        status: 'ok',
                        user: cwr038_member,
                        token,
                        mustChangePassword: mustChangePassword,
                        sessionTimeout: 30 // minutes
                    });
                } else {
                    // Failed login - increment failed attempts
                    const newFailedAttempts = (user.c_failed_attempts || 0) + 1;

                    // Policy 5.3.1.9: Lock after 3 failed attempts for 10 minutes
                    if (newFailedAttempts >= 3) {
                        const lockoutUntil = new Date();
                        lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 10);

                        connection.query(
                            'UPDATE cwr038_member SET c_failed_attempts = ?, c_lockout_until = ? WHERE c_username = ?',
                            [newFailedAttempts, lockoutUntil, username]
                        );

                        logLoginAttempt(username, empId, ipAddress, userAgent, 'FAILED', 'Wrong password - Account locked');
                        return res.json({
                            status: 'error',
                            message: 'Too many failed attempts. Account locked for 10 minutes.',
                            locked: true
                        });
                    } else {
                        connection.query(
                            'UPDATE cwr038_member SET c_failed_attempts = ? WHERE c_username = ?',
                            [newFailedAttempts, username]
                        );

                        const remainingAttempts = 3 - newFailedAttempts;
                        logLoginAttempt(username, empId, ipAddress, userAgent, 'FAILED', 'Wrong password');
                        return res.json({
                            status: 'error',
                            message: `Invalid username or password. ${remainingAttempts} attempt(s) remaining.`
                        });
                    }
                }
            } catch (err) {
                console.error('Password verification error:', err);
                logLoginAttempt(username, empId, ipAddress, userAgent, 'ERROR', 'Password verification error');
                return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
            }
        }
    );
})

// ============ PASSWORD CHANGE ENDPOINT (Central War Room Security Policy 5.2.3.6) ============

app.post('/change-password', jsonParser, async function (req, res) {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
        return res.json({ status: 'error', message: 'All fields are required' });
    }

    // Policy 5.2.3.6: Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
        return res.json({ status: 'error', message: passwordValidation.message });
    }

    // Get user from database
    connection.execute(
        'SELECT * FROM cwr038_member WHERE c_username = ?',
        [username],
        async function (err, results) {
            if (err || results.length === 0) {
                return res.json({ status: 'error', message: 'User not found' });
            }

            const user = results[0];

            try {
                // Verify current password using bcrypt or legacy
                const isCurrentPasswordValid = await verifyPassword(currentPassword, user.c_password);
                if (!isCurrentPasswordValid) {
                    return res.json({ status: 'error', message: 'Current password is incorrect' });
                }

                // Policy 5.2.3.6: Check password is not same as current
                const isSameAsCurrent = await verifyPassword(newPassword, user.c_password);
                if (isSameAsCurrent) {
                    return res.json({ status: 'error', message: 'New password cannot be the same as current password' });
                }

                // Policy 5.2.3.6: Check password history (last 5 passwords)
                connection.query(
                    'SELECT c_password_hash FROM cwr038_password_history WHERE c_emp_id = ? ORDER BY created_at DESC LIMIT 5',
                    [user.c_emp_id],
                    async function (err, history) {
                        if (err) {
                            console.error('Error checking password history:', err);
                        }

                        // Check if new password matches any of last 5 passwords
                        if (history && history.length > 0) {
                            for (const h of history) {
                                const isReused = await verifyPassword(newPassword, h.c_password_hash);
                                if (isReused) {
                                    return res.json({
                                        status: 'error',
                                        message: 'You cannot reuse any of your last 5 passwords'
                                    });
                                }
                            }
                        }

                        // Policy 5.2.3.6: Check if user already changed password within 24 hours
                        if (user.c_password_changed_at) {
                            const lastChange = new Date(user.c_password_changed_at);
                            const oneDayAgo = new Date();
                            oneDayAgo.setHours(oneDayAgo.getHours() - 24);
                            if (lastChange > oneDayAgo) {
                                return res.json({
                                    status: 'error',
                                    message: 'You can only change your password once every 24 hours'
                                });
                            }
                        }

                        try {
                            // Hash new password with bcrypt (Policy 5.2.3.6)
                            const hashedNewPassword = await hashPasswordSecure(newPassword);

                            // Save current password to history
                            connection.query(
                                'INSERT INTO cwr038_password_history (c_emp_id, c_password_hash) VALUES (?, ?)',
                                [user.c_emp_id, user.c_password],
                                function (err) {
                                    if (err) {
                                        console.error('Error saving password history:', err);
                                    }
                                }
                            );

                            // Update password with bcrypt hash
                            connection.query(
                                'UPDATE cwr038_member SET c_password = ? WHERE c_username = ?',
                                [hashedNewPassword, username],
                                function (err) {
                                    if (err) {
                                        console.error('Error updating password:', err);
                                        return res.json({ status: 'error', message: 'Failed to update password' });
                                    }

                                    // Update password_changed_at
                                    connection.query(
                                        'UPDATE cwr038_member SET c_password_changed_at = NOW(), c_must_change_password = 0 WHERE c_username = ?',
                                        [username],
                                        function (err2) {
                                            if (err2) {
                                                console.error('Note: Could not update password_changed_at:', err2.message);
                                            }
                                        }
                                    );

                                    res.json({ status: 'ok', message: 'Password changed successfully' });
                                }
                            );
                        } catch (hashErr) {
                            console.error('Error hashing new password:', hashErr);
                            return res.json({ status: 'error', message: 'Failed to process password' });
                        }
                    }
                );
            } catch (verifyErr) {
                console.error('Error verifying password:', verifyErr);
                return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
            }
        }
    );
});

// ============ FORGOT PASSWORD WITH OTP ENDPOINT ============
// This endpoint generates OTP and sends it to user's email

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/forgot-password', jsonParser, function (req, res) {
    const { username, email } = req.body;

    if (!username && !email) {
        return res.json({ status: 'error', message: 'Please provide username or email' });
    }

    // Build query based on what was provided
    let query = 'SELECT c_emp_id, c_username, c_email, c_name, c_lastname FROM cwr038_member WHERE ';
    let params = [];

    if (username && email) {
        query += 'BINARY c_username = ? OR c_email = ?';
        params = [username, email];
    } else if (username) {
        query += 'BINARY c_username = ?';
        params = [username];
    } else {
        query += 'c_email = ?';
        params = [email];
    }

    connection.query(query, params, function (err, results) {
        if (err) {
            console.error('Forgot password error:', err);
            return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
        }

        if (results.length === 0) {
            // For security, don't reveal if user exists or not
            return res.json({
                status: 'error',
                message: 'No account found with the provided username or email.'
            });
        }

        const user = results[0];

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

        // Invalidate any existing unused OTPs for this user (superseded by new one).
        // Must complete BEFORE inserting the new OTP — otherwise on a connection pool
        // the INSERT can finish first and the UPDATE will catch the brand-new row.
        connection.query(
            'UPDATE cwr038_password_otp SET c_invalidated = 1 WHERE c_emp_id = ? AND c_used = 0 AND c_invalidated = 0',
            [user.c_emp_id],
            function (invalidateErr) {
                if (invalidateErr) {
                    console.error('Error invalidating prior OTPs:', invalidateErr);
                    return res.json({ status: 'error', message: 'Failed to generate OTP. Please try again.' });
                }

                // Store OTP in database
                const insertOtpQuery = `
                    INSERT INTO cwr038_password_otp (c_emp_id, c_username, c_email, c_otp, c_expires_at)
                    VALUES (?, ?, ?, ?, ?)
                `;

                connection.query(insertOtpQuery, [user.c_emp_id, user.c_username, user.c_email, otp, expiresAt], function (err) {
            if (err) {
                console.error('Error storing OTP:', err);
                return res.json({ status: 'error', message: 'Failed to generate OTP. Please try again.' });
            }

            // Log OTP to console for testing (REMOVE IN PRODUCTION)
            console.log('===========================================');
            console.log(`OTP for ${user.c_username}: ${otp}`);
            console.log(`Expires at: ${expiresAt}`);
            console.log('===========================================');

            // Send OTP email
            if (user.c_email) {
                const mailOptions = {
                    from: process.env.SMTP_FROM || '"GPBS PMS" <noreply@example.com>',
                    to: user.c_email,
                    subject: 'Your OTP Code - GPBS PMS Password Reset',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background-color: #1565C0; padding: 20px; text-align: center;">
                                <h1 style="color: white; margin: 0;">GPBS PMS</h1>
                            </div>
                            <div style="padding: 30px; background-color: #f9f9f9;">
                                <h2 style="color: #333;">Password Reset OTP</h2>
                                <p style="color: #666; line-height: 1.6;">
                                    Dear ${user.c_name || 'User'} ${user.c_lastname || ''},
                                </p>
                                <p style="color: #666; line-height: 1.6;">
                                    You have requested to reset your password. Use the following OTP code:
                                </p>
                                <div style="background-color: #1565C0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                                    <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
                                </div>
                                <p style="color: #666; line-height: 1.6;">
                                    This code will expire in <strong>10 minutes</strong>.
                                </p>
                                <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
                                    <strong style="color: #e65100;">Security Notice:</strong><br>
                                    <span style="color: #666;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</span>
                                </div>
                            </div>
                            <div style="background-color: #333; padding: 15px; text-align: center;">
                                <p style="color: #999; margin: 0; font-size: 12px;">
                                    This is an automated message from GPBS PMS. Please do not reply to this email.
                                </p>
                            </div>
                        </div>
                    `
                };

                transporter.sendMail(mailOptions, function (emailErr, info) {
                    if (emailErr) {
                        console.error('Error sending OTP email:', emailErr);
                        // Still return success - OTP is logged to console for testing
                    } else {
                        console.log('OTP email sent to:', user.c_email);
                    }
                });
            }

            // Mask email for display (e.g., k***@truecorp.co.th)
            let maskedEmail = '';
            if (user.c_email) {
                const [localPart, domain] = user.c_email.split('@');
                maskedEmail = localPart.charAt(0) + '***@' + domain;
            }

            res.json({
                status: 'ok',
                message: `OTP has been sent to ${maskedEmail}. Please check your email.`,
                email: maskedEmail,
                emp_id: String(user.c_emp_id)
            });
        });
            }
        );
    });
});

// ============ VERIFY OTP ENDPOINT ============
app.post('/verify-otp', jsonParser, function (req, res) {
    const { emp_id, otp } = req.body;
    const empIdStr = String(emp_id || '');
    const otpStr = String(otp || '').trim();

    console.log('=== VERIFY OTP DEBUG ===');
    console.log('Received emp_id:', emp_id, '→ String:', empIdStr);
    console.log('Received otp:', otpStr);

    if (!empIdStr || !otpStr) {
        console.log('Missing emp_id or otp');
        return res.json({ status: 'error', message: 'Employee ID and OTP are required' });
    }

    // Check OTP
    const query = `
        SELECT * FROM cwr038_password_otp
        WHERE c_emp_id = ? AND c_otp = ? AND c_used = 0 AND c_invalidated = 0 AND c_expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
    `;

    connection.query(query, [empIdStr, otpStr], function (err, results) {
        if (err) {
            console.error('Error verifying OTP:', err);
            return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
        }

        console.log('Query results count:', results.length);

        if (results.length === 0) {
            // Diagnose why: used vs superseded vs expired vs wrong code
            connection.query(
                'SELECT c_used, c_invalidated, c_expires_at, NOW() as db_now FROM cwr038_password_otp WHERE c_emp_id = ? AND c_otp = ? ORDER BY created_at DESC LIMIT 1',
                [empIdStr, otpStr],
                function (debugErr, debugResults) {
                    if (debugResults && debugResults.length > 0) {
                        const record = debugResults[0];
                        if (record.c_used === 1) {
                            console.log('OTP already used');
                            return res.json({ status: 'error', message: 'This OTP has already been used. Please request a new one.' });
                        }
                        if (record.c_invalidated === 1) {
                            console.log('OTP superseded by newer request');
                            return res.json({ status: 'error', message: 'A newer OTP was sent. Please enter the most recent code from your email.' });
                        }
                        if (new Date(record.c_expires_at) < new Date(record.db_now)) {
                            console.log('OTP expired');
                            return res.json({ status: 'error', message: 'OTP has expired. Please request a new one.' });
                        }
                    }
                    console.log('OTP verification failed - no matching record');
                    return res.json({ status: 'error', message: 'Invalid OTP. Please check and try again.' });
                }
            );
            return;
        }

        // Mark OTP as verified
        connection.query(
            'UPDATE cwr038_password_otp SET c_verified = 1 WHERE id = ?',
            [results[0].id]
        );

        res.json({
            status: 'ok',
            message: 'OTP verified successfully. You can now reset your password.',
            otp_id: results[0].id
        });
    });
});

// ============ RESET PASSWORD WITH OTP ENDPOINT ============
app.post('/reset-password-otp', jsonParser, async function (req, res) {
    const { emp_id, otp, newPassword } = req.body;
    const empIdStr = String(emp_id || '');
    const otpStr = String(otp || '').trim();

    if (!empIdStr || !otpStr || !newPassword) {
        return res.json({ status: 'error', message: 'All fields are required' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
        return res.json({ status: 'error', message: passwordValidation.message });
    }

    // Verify OTP again and check if it's verified
    const otpQuery = `
        SELECT * FROM cwr038_password_otp
        WHERE c_emp_id = ? AND c_otp = ? AND c_verified = 1 AND c_used = 0 AND c_invalidated = 0 AND c_expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
    `;

    connection.query(otpQuery, [empIdStr, otpStr], async function (err, otpResults) {
        if (err) {
            console.error('Error verifying OTP for reset:', err);
            return res.json({ status: 'error', message: 'An error occurred. Please try again.' });
        }

        if (otpResults.length === 0) {
            return res.json({ status: 'error', message: 'Invalid or expired OTP. Please request a new one.' });
        }

        try {
            // Hash new password with bcrypt
            const hashedNewPassword = await hashPasswordSecure(newPassword);

            // Get user info for password history
            connection.query(
                'SELECT c_password FROM cwr038_member WHERE c_emp_id = ?',
                [empIdStr],
                function (err, userResults) {
                    if (err || userResults.length === 0) {
                        return res.json({ status: 'error', message: 'User not found' });
                    }

                    // Save current password to history
                    connection.query(
                        'INSERT INTO cwr038_password_history (c_emp_id, c_password_hash) VALUES (?, ?)',
                        [empIdStr, userResults[0].c_password]
                    );

                    // Update password
                    connection.query(
                        'UPDATE cwr038_member SET c_password = ?, c_password_changed_at = NOW(), c_must_change_password = 0 WHERE c_emp_id = ?',
                        [hashedNewPassword, empIdStr],
                        function (err) {
                            if (err) {
                                console.error('Error updating password:', err);
                                return res.json({ status: 'error', message: 'Failed to update password' });
                            }

                            // Mark OTP as used
                            connection.query(
                                'UPDATE cwr038_password_otp SET c_used = 1 WHERE id = ?',
                                [otpResults[0].id]
                            );

                            console.log(`Password reset successful for emp_id: ${empIdStr}`);

                            res.json({
                                status: 'ok',
                                message: 'Password has been reset successfully. You can now login with your new password.'
                            });
                        }
                    );
                }
            );
        } catch (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.json({ status: 'error', message: 'Failed to process password' });
        }
    });
});

// ============ RESEND OTP ENDPOINT ============
app.post('/resend-otp', jsonParser, function (req, res) {
    const { emp_id } = req.body;
    const empIdStr = String(emp_id || '');

    if (!empIdStr) {
        return res.json({ status: 'error', message: 'Employee ID is required' });
    }

    // Get user info
    connection.query(
        'SELECT c_emp_id, c_username, c_email, c_name, c_lastname FROM cwr038_member WHERE c_emp_id = ?',
        [empIdStr],
        function (err, results) {
            if (err || results.length === 0) {
                return res.json({ status: 'error', message: 'User not found' });
            }

            const user = results[0];

            // Generate new OTP
            const otp = generateOTP();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);

            // Invalidate existing unused OTPs (superseded by resend).
            // Chain INSERT inside the callback so pool races can't invalidate the new row.
            connection.query(
                'UPDATE cwr038_password_otp SET c_invalidated = 1 WHERE c_emp_id = ? AND c_used = 0 AND c_invalidated = 0',
                [empIdStr],
                function (invalidateErr) {
                    if (invalidateErr) {
                        console.error('Error invalidating prior OTPs:', invalidateErr);
                        return res.json({ status: 'error', message: 'Failed to generate OTP' });
                    }

            // Store new OTP
            connection.query(
                'INSERT INTO cwr038_password_otp (c_emp_id, c_username, c_email, c_otp, c_expires_at) VALUES (?, ?, ?, ?, ?)',
                [user.c_emp_id, user.c_username, user.c_email, otp, expiresAt],
                function (err) {
                    if (err) {
                        return res.json({ status: 'error', message: 'Failed to generate OTP' });
                    }

                    // Log OTP to console
                    console.log('===========================================');
                    console.log(`RESEND OTP for ${user.c_username}: ${otp}`);
                    console.log(`Expires at: ${expiresAt}`);
                    console.log('===========================================');

                    // Send email
                    if (user.c_email) {
                        const mailOptions = {
                            from: process.env.SMTP_FROM || '"GPBS PMS" <noreply@example.com>',
                            to: user.c_email,
                            subject: 'Your New OTP Code - GPBS PMS Password Reset',
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <div style="background-color: #1565C0; padding: 20px; text-align: center;">
                                        <h1 style="color: white; margin: 0;">GPBS PMS</h1>
                                    </div>
                                    <div style="padding: 30px; background-color: #f9f9f9;">
                                        <h2 style="color: #333;">New OTP Code</h2>
                                        <p style="color: #666;">Here is your new OTP code:</p>
                                        <div style="background-color: #1565C0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                                            <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
                                        </div>
                                        <p style="color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
                                    </div>
                                </div>
                            `
                        };

                        transporter.sendMail(mailOptions, function (emailErr) {
                            if (emailErr) {
                                console.error('Error sending OTP email:', emailErr);
                            }
                        });
                    }

                    res.json({
                        status: 'ok',
                        message: 'New OTP has been sent to your email.'
                    });
                }
            );
                }
            );
        }
    );
});

// ============ ADMIN UNLOCK ALL ACCOUNTS ============
app.post('/admin-unlock-all', jsonParser, function (req, res) {
    const { adminKey } = req.body;

    if (adminKey !== ADMIN_RESET_KEY) {
        return res.json({ status: 'error', message: 'Unauthorized' });
    }

    connection.query(
        'UPDATE cwr038_member SET c_failed_attempts = 0, c_lockout_until = NULL WHERE c_failed_attempts > 0 OR c_lockout_until IS NOT NULL',
        function (err, result) {
            if (err) {
                console.error('Error unlocking accounts:', err);
                return res.json({ status: 'error', message: 'Failed to unlock accounts' });
            }
            console.log(`Unlocked ${result.affectedRows} accounts`);
            res.json({ status: 'ok', message: `${result.affectedRows} account(s) unlocked successfully.` });
        }
    );
});

// ============ ADMIN FIX DEFAULT PASSWORDS ============
// Fixes all first-time users (c_must_change_password=1) who have the wrong bcrypt hash
app.post('/admin-fix-default-passwords', jsonParser, async function (req, res) {
    const { adminKey } = req.body;

    if (adminKey !== ADMIN_RESET_KEY) {
        return res.json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        const correctHash = await hashPasswordSecure('Gpbs2026!');

        connection.query(
            'UPDATE cwr038_member SET c_password = ?, c_failed_attempts = 0, c_lockout_until = NULL WHERE c_must_change_password = 1',
            [correctHash],
            function (err, result) {
                if (err) {
                    console.error('Error fixing passwords:', err);
                    return res.json({ status: 'error', message: 'Failed to fix passwords' });
                }
                console.log(`Fixed default passwords for ${result.affectedRows} users`);
                res.json({ status: 'ok', message: `${result.affectedRows} user(s) fixed with correct default password (Gpbs2026!) and accounts unlocked.` });
            }
        );
    } catch (err) {
        console.error('Error hashing password:', err);
        return res.json({ status: 'error', message: 'Failed to process password' });
    }
});

// ============ ADMIN RESET PASSWORD ENDPOINT ============
// This endpoint allows admin to reset a user's password without knowing the current password

app.post('/admin-reset-password', jsonParser, async function (req, res) {
    const { username, newPassword, adminKey } = req.body;

    // Use admin key from environment variable (Policy 5.2.3.6)
    if (adminKey !== ADMIN_RESET_KEY) {
        return res.json({ status: 'error', message: 'Unauthorized' });
    }

    if (!username || !newPassword) {
        return res.json({ status: 'error', message: 'Username and new password are required' });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
        return res.json({ status: 'error', message: passwordValidation.message });
    }

    try {
        // Hash with bcrypt (Policy 5.2.3.6)
        const hashedNewPassword = await hashPasswordSecure(newPassword);

        connection.query(
            'UPDATE cwr038_member SET c_password = ? WHERE c_username = ?',
            [hashedNewPassword, username],
            function (err, result) {
                if (err) {
                    console.error('Error resetting password:', err);
                    return res.json({ status: 'error', message: 'Failed to reset password' });
                }

                if (result.affectedRows === 0) {
                    return res.json({ status: 'error', message: 'User not found' });
                }

                // Update password_changed_at, set must_change_password = 1, and unlock account
                connection.query(
                    'UPDATE cwr038_member SET c_password_changed_at = NOW(), c_must_change_password = 1, c_failed_attempts = 0, c_lockout_until = NULL WHERE c_username = ?',
                    [username]
                );

                console.log(`Password reset by admin for user: ${username}`);
                res.json({ status: 'ok', message: 'Password reset successfully. Account unlocked. User will be required to change password on next login.' });
            }
        );
    } catch (err) {
        console.error('Error hashing password:', err);
        return res.json({ status: 'error', message: 'Failed to process password' });
    }
});

// Admin set password (without forcing password change on next login)
app.post('/admin-set-password', jsonParser, async function (req, res) {
    const { username, newPassword, adminKey } = req.body;

    if (adminKey !== ADMIN_RESET_KEY) {
        return res.json({ status: 'error', message: 'Unauthorized' });
    }

    if (!username || !newPassword) {
        return res.json({ status: 'error', message: 'Username and new password are required' });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
        return res.json({ status: 'error', message: passwordValidation.message });
    }

    try {
        const hashedNewPassword = await hashPasswordSecure(newPassword);

        connection.query(
            'UPDATE cwr038_member SET c_password = ?, c_password_changed_at = NOW(), c_must_change_password = 0, c_failed_attempts = 0, c_lockout_until = NULL WHERE c_username = ?',
            [hashedNewPassword, username],
            function (err, result) {
                if (err) {
                    console.error('Error setting password:', err);
                    return res.json({ status: 'error', message: 'Failed to set password' });
                }

                if (result.affectedRows === 0) {
                    return res.json({ status: 'error', message: 'User not found' });
                }

                console.log(`Password set by admin for user: ${username} (no force change)`);
                res.json({ status: 'ok', message: 'Password set successfully. User can login directly without changing password.' });
            }
        );
    } catch (err) {
        console.error('Error hashing password:', err);
        return res.json({ status: 'error', message: 'Failed to process password' });
    }
});

// ============ TOKEN VERIFICATION MIDDLEWARE ============

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access token required' });
    }

    // Check if token is blacklisted (server-side logout)
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({
            status: 'error',
            message: 'Session has been terminated. Please login again.',
            sessionExpired: true
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Session expired. Please login again.',
                    sessionExpired: true
                });
            }
            return res.status(403).json({ status: 'error', message: 'Invalid token' });
        }

        // Single Session Enforcement: Check if this is the active session for this user
        const activeSession = activeSessions.get(decoded.c_username);
        if (activeSession && activeSession.token !== token) {
            return res.status(401).json({
                status: 'error',
                message: 'Your session has been terminated because you logged in from another device.',
                sessionExpired: true,
                reason: 'another_device_login'
            });
        }

        req.user = decoded;
        req.token = token; // Store token for potential blacklisting
        next();
    });
}

// Token refresh endpoint (for extending session)
app.post('/refresh-token', verifyToken, function (req, res) {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const newToken = jwt.sign({
        c_username: req.user.c_username,
        c_emp_id: req.user.c_emp_id
    }, secret, { expiresIn: '30m' });

    // Update active session with new token (Single Session Enforcement)
    activeSessions.set(req.user.c_username, {
        token: newToken,
        loginTime: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent
    });

    // Blacklist old token
    tokenBlacklist.add(req.token);

    res.json({ status: 'ok', token: newToken });
});

// Verify token endpoint (for checking session validity)
app.get('/verify-token', verifyToken, function (req, res) {
    res.json({ status: 'ok', user: req.user });
});

// ============ SERVER-SIDE LOGOUT ENDPOINT (Policy 5.2.3.6) ============
app.post('/logout', verifyToken, function (req, res) {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const reason = req.body.reason || 'User initiated logout';

    // Add token to blacklist
    tokenBlacklist.add(req.token);

    // Remove from active sessions (Single Session Enforcement)
    activeSessions.delete(req.user.c_username);

    // Log the logout
    logLogout(req.user.c_username, req.user.c_emp_id, ipAddress, userAgent, reason);

    console.log(`User logged out: ${req.user.c_username}`);
    res.json({ status: 'ok', message: 'Logged out successfully' });
});

// ============ PAGE ACCESS LOG ENDPOINT (Policy 5.2.3.6) ============
app.post('/log-page-access', verifyToken, function (req, res) {
    const { pagePath, pageTitle } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    logPageAccess(req.user.c_emp_id, req.user.c_username, pagePath, pageTitle, ipAddress, userAgent);

    res.json({ status: 'ok' });
});

// Get page access logs (requires authentication)
app.get('/page-access-logs', verifyToken, function (req, res) {
    const limit = parseInt(req.query.limit) || 100;
    const empId = req.query.emp_id || null;

    let query = `
        SELECT * FROM cwr038_page_access_log
        ${empId ? 'WHERE c_emp_id = ?' : ''}
        ORDER BY created_at DESC
        LIMIT ?
    `;
    const params = empId ? [empId, limit] : [limit];

    connection.query(query, params, function (err, results) {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch page access logs' });
        }
        res.json(results);
    });
});

// Get logout logs (requires authentication)
app.get('/logout-logs', verifyToken, function (req, res) {
    const limit = parseInt(req.query.limit) || 100;
    const query = `
        SELECT * FROM cwr038_logout_log
        ORDER BY created_at DESC
        LIMIT ?
    `;
    connection.query(query, [limit], function (err, results) {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch logout logs' });
        }
        res.json(results);
    });
});

// Get login logs for audit (requires authentication - Policy 5.2.3.6)
app.get('/login-logs', verifyToken, function (req, res) {
    const limit = parseInt(req.query.limit) || 100;
    const query = `
        SELECT * FROM cwr038_login_log
        ORDER BY created_at DESC
        LIMIT ?
    `;
    connection.query(query, [limit], function (err, results) {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch login logs' });
        }
        res.json(results);
    });
});

// Diagnostic endpoint to check MySQL server time and timezone
app.get('/debug/db-time', verifyToken, function (req, res) {
    const query = `
        SELECT
            NOW() as server_time,
            @@global.time_zone as global_timezone,
            @@session.time_zone as session_timezone,
            (SELECT COUNT(*) FROM cwr038_login_log WHERE YEAR(created_at) = 2026) as logs_2026,
            (SELECT COUNT(*) FROM cwr038_login_log WHERE YEAR(created_at) = 2025) as logs_2025,
            (SELECT MAX(created_at) FROM cwr038_login_log) as latest_login_log,
            (SELECT MAX(created_at) FROM cwr038_page_access_log) as latest_page_log
    `;
    connection.query(query, function (err, results) {
        if (err) {
            return res.status(500).json({ error: 'Failed to check DB time', details: err.message });
        }
        res.json(results[0]);
    });
});

app.post('/projects', verifyToken, function (req, res) {
    const {
        projectName,
        projectObjective,
        projectDescription,
        projectInvestment,
        investmentDetail,
        projectStartDate,
        projectEndDate,
        impact,
        possibility,
        members,
        roi,
        projectLeader,
        projectLeaderRole,
        projectGroupId
    } = req.body;

    const insertQuery = `
        INSERT INTO cwr038_project (
            c_name, c_objective, c_detail, c_budget, c_budget_detail,
            c_project_start, c_project_finish, c_impact, c_urgent,
            c_create_by, c_roi_kpi_type, c_roi_type, c_roi_description, c_roi_year, c_roi_tgt,
            c_roi_beneficiary, c_roi_description_type,
            c_approve, c_status, c_project_group_id, c_create_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // Map roi type to numeric values: 1 = Quantitative, 2 = Qualitative
    let roiKpiTypeValue = null;
    console.log('ROI data received:', roi);
    if (roi?.type === 'quantitative') {
        roiKpiTypeValue = 1;
    } else if (roi?.type === 'qualitative') {
        roiKpiTypeValue = 2;
    }
    console.log('ROI KPI Type value to save:', roiKpiTypeValue);

    const values = [
        projectName,
        projectObjective,
        projectDescription,
        projectInvestment,
        investmentDetail,
        projectStartDate,
        projectEndDate,
        impact,
        possibility,
        projectLeader || null,           // c_create_by
        roiKpiTypeValue,
        roi?.roiType || null,
        roi?.description || null,
        roi?.year || null,
        roi?.target || null,
        roi?.beneficiary || null,
        roi?.roiDescriptionType || null,
        0, // c_approve: 0 = draft/unapproved, 1 = approved
        1, // c_status: 1 = draft, 0 = active
        projectGroupId ? parseInt(projectGroupId) : null  // c_project_group_id: 1 = Media, 2 = Content
    ];

    console.log('Creating project with group ID:', projectGroupId, '-> parsed:', projectGroupId ? parseInt(projectGroupId) : null);

    connection.query(insertQuery, values, function (err, result) {
        if (err) {
            console.error('Error inserting project:', err);
            return res.status(500).json({ error: 'Failed to insert project' });
        }

        const projectId = result.insertId;
        console.log('Project created with ID:', projectId);

        // Insert project team members into cwr038_project_member table
        // This table is used by the team-members endpoint
        const allMembers = [];

        // Add project owner first
        console.log('Project leader:', projectLeader, 'Role:', projectLeaderRole);
        if (projectLeader) {
            allMembers.push([projectId, String(projectLeader), projectLeaderRole || 'Responsibility']);
        }

        // Add additional team members
        console.log('Members received from frontend:', JSON.stringify(members));
        if (Array.isArray(members) && members.length > 0) {
            members.forEach(m => {
                console.log('Processing member:', JSON.stringify(m));
                if (m.empId) {
                    // Store empId as string to match c_emp_id type in cwr038_member
                    allMembers.push([projectId, String(m.empId), m.role || 'Supporting']);
                }
            });
        }

        console.log('All members to insert:', JSON.stringify(allMembers));

        if (allMembers.length > 0) {
            const memberQuery = `
                INSERT INTO cwr038_project_member (c_project_id, c_member_id, c_role)
                VALUES ?
            `;

            console.log('Executing member insert query with values:', JSON.stringify(allMembers));

            connection.query(memberQuery, [allMembers], function (memberErr) {
                if (memberErr) {
                    console.error('=== ERROR INSERTING MEMBERS ===');
                    console.error('Error code:', memberErr.code);
                    console.error('Error errno:', memberErr.errno);
                    console.error('SQL State:', memberErr.sqlState);
                    console.error('SQL Message:', memberErr.sqlMessage);
                    console.error('Full error:', memberErr);
                } else {
                    console.log('Successfully inserted', allMembers.length, 'team members');
                }

                return res.json({ message: 'Project and team members saved successfully', projectId: projectId });
            });
        } else {
            console.log('No members to insert');
            return res.json({ message: 'Project saved successfully (no members)', projectId: projectId });
        }
    });
});

app.get('/projects', verifyToken, function (req, res, next) {
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        ORDER BY p.id DESC
    `;

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Projects fetched:', results.length);
        res.json(results);
    });
});

// Get single project by ID
app.get('/projects/:id', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.id = ?
    `;

    connection.query(query, [projectId], function (err, results) {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(results[0]);
    });
});

app.get('/small_group', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_stvs_project',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching small group:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

app.get('/members', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_member WHERE c_status = 0',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching members:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

// New endpoint for members with project counts (excluding admin users, only active members)
app.get('/members-with-counts', verifyToken, function (req, res, next) {
    // Get year from query parameter, default to current year
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const query = `
        SELECT
            m.c_emp_id,
            m.c_username,
            m.c_name,
            m.c_lastname,
            m.c_email,
            COUNT(DISTINCT p_owned.id) as all_projects,
            COUNT(DISTINCT p_owned.id) as project_owner_count,
            COUNT(DISTINCT CASE WHEN LOWER(p_owned.c_project_status) = 'green' THEN p_owned.id END) as completed_count,
            COUNT(DISTINCT CASE WHEN LOWER(p_owned.c_project_status) = 'yellow' THEN p_owned.id END) as processing_count,
            COUNT(DISTINCT CASE WHEN LOWER(p_owned.c_project_status) = 'orange' THEN p_owned.id END) as delayed_count,
            COUNT(DISTINCT CASE WHEN LOWER(p_owned.c_project_status) = 'red' THEN p_owned.id END) as cancelled_count,
            COUNT(DISTINCT CASE WHEN LOWER(p_owned.c_project_status) = 'grey' OR LOWER(p_owned.c_project_status) = 'gray' THEN p_owned.id END) as not_started_count
        FROM cwr038_member m
        LEFT JOIN cwr038_project p_owned ON m.c_emp_id = p_owned.c_create_by
            AND YEAR(p_owned.c_project_finish) >= ${year}
        WHERE m.c_username != 'admin'
            AND m.c_name != 'admin'
            AND m.c_status = 0
        GROUP BY m.c_emp_id, m.c_username, m.c_name, m.c_lastname, m.c_email
        ORDER BY all_projects DESC, m.c_name ASC
    `;

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.error('Error fetching members with counts:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Members with project counts fetched for year', year, ':', results.length);
        res.json(results);
    });
});

// Debug: List all members with their emp_id and photo URL for verification
app.get('/debug/member-photos', verifyToken, function (req, res) {
    const query = `
        SELECT c_emp_id, c_username, c_name, c_lastname
        FROM cwr038_member
        WHERE c_username != 'admin'
            AND c_name != 'admin'
            AND c_status = 0
        ORDER BY c_name ASC
    `;
    connection.query(query, function (err, results) {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const membersWithPhotos = results.map(m => ({
            c_emp_id: m.c_emp_id,
            username: m.c_username,
            name: `${m.c_name} ${m.c_lastname}`,
            photo_url: `https://ibsdo.com/tvs/ltvs/emp_pic/${m.c_emp_id}.jpg`
        }));
        res.json(membersWithPhotos);
    });
});

// Debug: Find duplicate/redundant members (same name or username appearing multiple times)
app.get('/debug/duplicate-members', verifyToken, function (req, res) {
    const query = `
        SELECT m1.c_emp_id, m1.c_username, m1.c_name, m1.c_lastname, m1.c_status, m1.c_permission_group_id, m1.c_email,
               m1.c_last_login
        FROM cwr038_member m1
        INNER JOIN (
            SELECT c_name, c_lastname
            FROM cwr038_member
            GROUP BY c_name, c_lastname
            HAVING COUNT(*) > 1
        ) dups ON m1.c_name = dups.c_name AND m1.c_lastname = dups.c_lastname
        ORDER BY m1.c_name, m1.c_lastname, m1.c_emp_id
    `;
    connection.query(query, function (err, results) {
        if (err) {
            console.error('Error finding duplicates:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Also check for duplicate usernames
        const usernameQuery = `
            SELECT c_emp_id, c_username, c_name, c_lastname, c_status, c_permission_group_id, c_email,
                   c_last_login
            FROM cwr038_member
            WHERE c_username IN (
                SELECT c_username FROM cwr038_member GROUP BY c_username HAVING COUNT(*) > 1
            )
            ORDER BY c_username, c_emp_id
        `;
        connection.query(usernameQuery, function (err2, usernameResults) {
            if (err2) {
                console.error('Error finding username duplicates:', err2);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Also get all members with c_status != 0
            const inactiveQuery = `
                SELECT c_emp_id, c_username, c_name, c_lastname, c_status, c_permission_group_id, c_email
                FROM cwr038_member
                WHERE c_status != 0 OR c_status IS NULL
                ORDER BY c_name
            `;
            connection.query(inactiveQuery, function (err3, inactiveResults) {
                if (err3) {
                    console.error('Error finding inactive members:', err3);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.json({
                    duplicate_names: results,
                    duplicate_usernames: usernameResults,
                    inactive_members: inactiveResults,
                    total_duplicates_by_name: results.length,
                    total_duplicates_by_username: usernameResults.length,
                    total_inactive: inactiveResults.length
                });
            });
        });
    });
});

// Debug: Delete a specific redundant member by emp_id
app.delete('/debug/delete-member/:empId', verifyToken, function (req, res) {
    const empId = req.params.empId;

    // Safety check: don't delete admin
    if (empId === '1' || empId === 1) {
        return res.status(400).json({ error: 'Cannot delete admin user' });
    }

    // Check if member exists and has projects as owner
    connection.query(
        'SELECT COUNT(*) as project_count FROM cwr038_project WHERE c_create_by = ?',
        [empId],
        function (err, results) {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const projectCount = results[0].project_count;

            // Delete member
            connection.query(
                'DELETE FROM cwr038_member WHERE c_emp_id = ?',
                [empId],
                function (err2, deleteResult) {
                    if (err2) {
                        console.error('Error deleting member:', err2);
                        return res.status(500).json({ error: 'Failed to delete member' });
                    }
                    res.json({
                        message: `Member ${empId} deleted`,
                        affected_rows: deleteResult.affectedRows,
                        warning: projectCount > 0 ? `This member owned ${projectCount} project(s)` : null
                    });
                }
            );
        }
    );
});

// Return all media projects - frontend will filter by year
app.get('/project_media', verifyToken, function (req, res, next) {
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_project_group_id = 1
        AND p.c_approve = 1
        AND p.c_status = 0
        ORDER BY p.id DESC
    `;

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.error('Error fetching project media:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Project media fetched:', results.length);

        // DEBUG: Log the first project to see owner data
        if (results.length > 0) {
            console.log('DEBUG Sample project media data:', {
                id: results[0].id,
                name: results[0].c_name,
                create_by: results[0].c_create_by,
                owner_name: results[0].owner_name,
                owner_lastname: results[0].owner_lastname,
                full_owner_name: results[0].full_owner_name
            });
        }

        res.json(results);
    });
});

// Return all content projects - frontend will filter by year
app.get('/project_content', verifyToken, function (req, res, next) {
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_project_group_id = 2
        AND p.c_approve = 1
        AND p.c_status = 0
        ORDER BY p.id DESC
    `;

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.error('Error fetching project content:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Project content fetched:', results.length);
        res.json(results);
    });
});

app.get('/project_owner', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_member WHERE c_status = 0',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching project owners:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

app.get('/small_group_media', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_stvs_project WHERE c_project_group_id = 1 AND c_approve = 1 AND c_status = 0 AND 2024 BETWEEN YEAR(c_project_start) AND YEAR(c_project_finish)',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching small group media:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

app.get('/small_group_content', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_stvs_project WHERE c_project_group_id = 2 AND c_approve = 1 AND c_status = 0 AND 2024 BETWEEN YEAR(c_project_start) AND YEAR(c_project_finish)',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching small group content:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

app.get('/small_group_warroom', verifyToken, function (req, res, next) {
    connection.query(
        'SELECT * FROM cwr038_stvs_project WHERE c_project_group_id = 3 AND c_approve = 1 AND c_status = 0 AND 2024 BETWEEN YEAR(c_project_start) AND YEAR(c_project_finish)',
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching small group warroom:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(results);
        }
    );
});

// Health check endpoint
app.get('/health', function (req, res) {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all projects from media and content teams for prioritization matrix
app.get('/prioritization', verifyToken, function (req, res, next) {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_approve = 1
        AND p.c_status = 0
        AND p.c_project_group_id IN (1, 2)
        AND YEAR(p.c_project_finish) >= ?
        ORDER BY p.c_project_group_id, p.id DESC
    `;

    connection.query(query, [year], function (err, results, fields) {
        if (err) {
            console.error('Error fetching prioritization projects:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Prioritization projects fetched:', results.length);
        res.json(results);
    });
});

// Get individual project by ID
app.get('/project/:id', verifyToken, function (req, res, next) {
    const projectId = req.params.id;

    // Show all published projects (c_status = 0), whether approved or pending approval
    // Join with member table to get owner name
    const query = `
        SELECT
            p.*,
            m.c_name as owner_first_name,
            m.c_lastname as owner_last_name,
            CONCAT(m.c_name, ' ', m.c_lastname) as owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.id = ? AND p.c_status = 0
    `;

    connection.query(query, [projectId], function (err, results, fields) {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        console.log('Project fetched:', results[0].c_name);
        res.json(results[0]);
    });
});

// Get draft projects (for draft management)
app.get('/projects/drafts', verifyToken, function (req, res, next) {
    const query = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_approve = 0
        ORDER BY p.id DESC
    `;

    connection.query(query, function (err, results, fields) {
        if (err) {
            console.error('Error fetching draft projects:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('Draft projects fetched:', results.length);
        res.json(results);
    });
});


// Get user's projects (as owner and team member)
app.get('/my-projects/:empId', verifyToken, function (req, res) {
    const empId = req.params.empId;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    // Get projects where user is owner (approved or pending approval, not drafts)
    const ownerQuery = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name,
            'owner' as user_role
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_create_by = ?
        AND p.c_status = 0
        AND YEAR(p.c_project_finish) >= ?
        ORDER BY p.id DESC
    `;

    // Get projects where user is team member
    const memberQuery = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name,
            pt.role as user_role
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        INNER JOIN cwr038_project_team pt ON p.id = pt.project_id
        WHERE pt.emp_id = ?
        AND p.c_create_by != ?
        AND p.c_status = 0
        AND YEAR(p.c_project_finish) >= ?
        ORDER BY p.id DESC
    `;

    // Get draft projects (c_status = 1 means draft, not yet submitted)
    const draftQuery = `
        SELECT
            p.*,
            m.c_name as owner_name,
            m.c_lastname as owner_lastname,
            CONCAT(m.c_name, ' ', m.c_lastname) as full_owner_name,
            'draft' as user_role
        FROM cwr038_project p
        LEFT JOIN cwr038_member m ON p.c_create_by = m.c_emp_id
        WHERE p.c_create_by = ?
        AND p.c_status = 1
        ORDER BY p.id DESC
    `;

    connection.query(ownerQuery, [empId, year], function (err, ownerProjects) {
        if (err) {
            console.error('Error fetching owner projects:', err);
            return res.status(500).json({ error: 'Failed to fetch owner projects' });
        }

        connection.query(memberQuery, [empId, empId, year], function (err, memberProjects) {
            if (err) {
                console.error('Error fetching member projects:', err);
                return res.status(500).json({ error: 'Failed to fetch member projects' });
            }

            connection.query(draftQuery, [empId], function (err, draftProjects) {
                if (err) {
                    console.error('Error fetching draft projects:', err);
                    return res.status(500).json({ error: 'Failed to fetch draft projects' });
                }

                res.json({
                    ownerProjects: ownerProjects,
                    memberProjects: memberProjects,
                    draftProjects: draftProjects
                });
            });
        });
    });
});

// Delete a project (draft)
app.delete('/projects/:id', verifyToken, function (req, res) {
    const projectId = req.params.id;

    connection.query(
        'DELETE FROM cwr038_project WHERE id = ?',
        [projectId],
        function (err, result) {
            if (err) {
                console.error('Error deleting project:', err);
                return res.status(500).json({ error: 'Failed to delete project' });
            }

            // Also delete team members
            connection.query(
                'DELETE FROM cwr038_project_team WHERE project_id = ?',
                [projectId],
                function (err) {
                    if (err) {
                        console.error('Error deleting project team:', err);
                    }
                    res.json({ message: 'Project deleted successfully' });
                }
            );
        }
    );
});

// ============ ACTION PLAN ENDPOINTS ============

// Create action_plans table if not exists (without foreign key for flexibility)
const createActionPlansTable = `
    CREATE TABLE IF NOT EXISTS cwr038_action_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        plan_description TEXT,
        responsible_emp_id VARCHAR(20),
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'Yellow',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_project_id (project_id)
    )
`;

connection.query(createActionPlansTable, function(err) {
    if (err) {
        console.error('Error creating action_plans table:', err);
    } else {
        console.log('Action plans table ready');
    }
});

// Get project team members (owner + team members)
// Team members handler function (shared between routes)
const getTeamMembersHandler = function (req, res) {
    const projectId = req.params.id;
    console.log('Fetching team members for project:', projectId);

    // Query team members from cwr038_project_member table (old system table)
    // Join with cwr038_member to get full member details
    // Use CAST to ensure type-safe JOIN (c_member_id may be INT while c_emp_id may be VARCHAR or vice versa)
    const teamQuery = `
        SELECT
            pm.c_member_id as c_emp_id,
            pm.c_role as role,
            m.c_name,
            m.c_lastname
        FROM cwr038_project_member pm
        LEFT JOIN cwr038_member m ON CAST(pm.c_member_id AS CHAR) = CAST(m.c_emp_id AS CHAR)
        WHERE pm.c_project_id = ?
        ORDER BY
            CASE pm.c_role
                WHEN 'Project Owner - Accountability' THEN 1
                WHEN 'Accountability' THEN 2
                WHEN 'Responsibility' THEN 3
                WHEN 'Supporting' THEN 4
                ELSE 5
            END
    `;

    connection.query(teamQuery, [projectId], function (err, teamResults) {
        if (err) {
            console.error('Error fetching team members from cwr038_project_member:', err);
            return res.status(500).json({ error: 'Failed to fetch team members' });
        }
        // Deduplicate members by c_emp_id (keep first occurrence)
        const seen = new Set();
        const deduped = teamResults.filter(m => {
            if (seen.has(m.c_emp_id)) return false;
            seen.add(m.c_emp_id);
            return true;
        });
        console.log('Team results from cwr038_project_member:', deduped);
        res.json(deduped);
    });
};

// Support both plural and singular routes for team members
app.get('/projects/:id/team-members', verifyToken, getTeamMembersHandler);
app.get('/project/:id/team-members', verifyToken, getTeamMembersHandler);

// Debug endpoint - get all tables to find team member table
app.get('/debug/tables', verifyToken, function (req, res) {
    connection.query('SHOW TABLES', function (err, results) {
        if (err) {
            console.error('Error fetching tables:', err);
            return res.status(500).json({ error: 'Failed to fetch tables' });
        }
        res.json(results);
    });
});

// Debug endpoint - describe table structure
app.get('/debug/describe/:table', verifyToken, function (req, res) {
    const table = req.params.table;
    connection.query(`DESCRIBE ${table}`, function (err, results) {
        if (err) {
            console.error('Error describing table:', err);
            return res.status(500).json({ error: 'Failed to describe table' });
        }
        res.json(results);
    });
});

// Debug endpoint - sample data from a table
app.get('/debug/sample/:table', verifyToken, function (req, res) {
    const table = req.params.table;
    connection.query(`SELECT * FROM ${table} LIMIT 10`, function (err, results) {
        if (err) {
            console.error('Error fetching sample:', err);
            return res.status(500).json({ error: 'Failed to fetch sample' });
        }
        res.json(results);
    });
});

// Debug endpoint - check project members for a specific project
app.get('/debug/project-members/:projectId', verifyToken, function (req, res) {
    const projectId = req.params.projectId;
    connection.query(
        'SELECT * FROM cwr038_project_member WHERE c_project_id = ?',
        [projectId],
        function (err, results) {
            if (err) {
                console.error('Error fetching project members:', err);
                return res.status(500).json({ error: 'Failed to fetch project members' });
            }
            res.json({ projectId, members: results });
        }
    );
});

// Get action plans for a project
app.get('/projects/:id/action-plans', verifyToken, function (req, res) {
    const projectId = req.params.id;

    const query = `
        SELECT ap.*,
               m.c_name as responsible_name,
               m.c_lastname as responsible_lastname,
               CONCAT(m.c_name, ' ', m.c_lastname) as responsible_fullname,
               m.c_emp_id
        FROM cwr038_action_plans ap
        LEFT JOIN cwr038_member m ON ap.responsible_emp_id = m.c_emp_id
        WHERE ap.project_id = ?
        ORDER BY ap.id ASC
    `;

    connection.query(query, [projectId], function (err, results) {
        if (err) {
            console.error('Error fetching action plans:', err);
            return res.status(500).json({ error: 'Failed to fetch action plans' });
        }
        res.json(results);
    });
});

// Create new action plan
app.post('/projects/:id/action-plans', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { plan_description, responsible_emp_id, start_date, end_date, status } = req.body;

    const query = `
        INSERT INTO cwr038_action_plans (project_id, plan_description, responsible_emp_id, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [projectId, plan_description, responsible_emp_id, start_date, end_date, status || 'Yellow'], function (err, result) {
        if (err) {
            console.error('Error creating action plan:', err);
            return res.status(500).json({ error: 'Failed to create action plan' });
        }
        res.json({ message: 'Action plan created successfully', id: result.insertId });
    });
});

// Update action plan
app.put('/action-plans/:id', verifyToken, function (req, res) {
    const actionPlanId = req.params.id;
    const { plan_description, responsible_emp_id, start_date, end_date, status } = req.body;

    const query = `
        UPDATE cwr038_action_plans
        SET plan_description = ?, responsible_emp_id = ?, start_date = ?, end_date = ?, status = ?
        WHERE id = ?
    `;

    connection.query(query, [plan_description, responsible_emp_id, start_date, end_date, status, actionPlanId], function (err, result) {
        if (err) {
            console.error('Error updating action plan:', err);
            return res.status(500).json({ error: 'Failed to update action plan' });
        }
        res.json({ message: 'Action plan updated successfully' });
    });
});

// Delete action plan
app.delete('/action-plans/:id', verifyToken, function (req, res) {
    const actionPlanId = req.params.id;

    connection.query('DELETE FROM cwr038_action_plans WHERE id = ?', [actionPlanId], function (err, result) {
        if (err) {
            console.error('Error deleting action plan:', err);
            return res.status(500).json({ error: 'Failed to delete action plan' });
        }
        res.json({ message: 'Action plan deleted successfully' });
    });
});

// Bulk create/update action plans
app.post('/projects/:id/action-plans/bulk', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { actionPlans } = req.body;

    console.log('Received action plans for project', projectId, ':', JSON.stringify(actionPlans, null, 2));

    if (!Array.isArray(actionPlans) || actionPlans.length === 0) {
        return res.status(400).json({ error: 'No action plans provided' });
    }

    // Delete existing action plans for this project first
    connection.query('DELETE FROM cwr038_action_plans WHERE project_id = ?', [projectId], function (err) {
        if (err) {
            console.error('Error deleting existing action plans:', err);
            console.error('SQL Error:', err.sqlMessage);
            return res.status(500).json({ error: 'Failed to update action plans', details: err.sqlMessage });
        }

        console.log('Deleted existing action plans for project', projectId);

        // Insert new action plans
        const values = actionPlans
            .filter(ap => ap.plan_description && ap.plan_description.trim() !== '')
            .map(ap => [
                parseInt(projectId),
                ap.plan_description,
                ap.responsible_emp_id || null,
                ap.start_date || null,
                ap.end_date || null,
                ap.status || 'Yellow'
            ]);

        console.log('Values to insert:', JSON.stringify(values, null, 2));

        if (values.length === 0) {
            return res.json({ message: 'No valid action plans to save' });
        }

        const insertQuery = `
            INSERT INTO cwr038_action_plans (project_id, plan_description, responsible_emp_id, start_date, end_date, status)
            VALUES ?
        `;

        connection.query(insertQuery, [values], function (err, result) {
            if (err) {
                console.error('Error inserting action plans:', err);
                console.error('SQL Error:', err.sqlMessage);
                console.error('SQL State:', err.sqlState);
                return res.status(500).json({ error: 'Failed to save action plans', details: err.sqlMessage });
            }
            console.log('Successfully inserted', result.affectedRows, 'action plans');
            logProjectActivity(projectId, 'Update Action Plans', req.user?.c_emp_id);
            res.json({ message: 'Action plans saved successfully', count: result.affectedRows });
        });
    });
});

// ============ END ACTION PLAN ENDPOINTS ============

// ============ ACTIVITY LOG HELPER ============
function logProjectActivity(projectId, actionType, actionBy) {
    const logQuery = `INSERT INTO cwr038_project_logs (project_id, action_type, action_by) VALUES (?, ?, ?)`;
    connection.query(logQuery, [projectId, actionType, actionBy], function (err) {
        if (err) console.error('Error logging activity:', err);
    });
}

// ============ NOTE ENDPOINTS ============

// Create notes table if not exists
const createNotesTable = `
    CREATE TABLE IF NOT EXISTS cwr038_project_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        note_content TEXT,
        created_by VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_project_id (project_id)
    )
`;

connection.query(createNotesTable, function(err) {
    if (err) {
        console.error('Error creating notes table:', err);
    } else {
        console.log('Project notes table ready');
    }
});

// Add c_cancel_reason column to project table if not exists
connection.query(`ALTER TABLE cwr038_project ADD COLUMN c_cancel_reason TEXT`, function(err) {
    if (err && !err.message.includes('Duplicate column')) {
        // Column already exists or other error - ignore
    }
});

// Create logs table if not exists
const createLogsTable = `
    CREATE TABLE IF NOT EXISTS cwr038_project_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        action_type VARCHAR(100),
        action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        action_by VARCHAR(20),
        INDEX idx_project_id (project_id)
    )
`;

connection.query(createLogsTable, function(err) {
    if (err) {
        console.error('Error creating logs table:', err);
    } else {
        console.log('Project logs table ready');
    }
});

// Get notes for a project
app.get('/projects/:id/notes', verifyToken, function (req, res) {
    const projectId = req.params.id;

    const query = `
        SELECT n.*,
               m.c_name as author_name,
               m.c_lastname as author_lastname,
               CONCAT(m.c_name, ' ', m.c_lastname) as author_fullname,
               m.c_emp_id
        FROM cwr038_project_notes n
        LEFT JOIN cwr038_member m ON n.created_by = m.c_emp_id
        WHERE n.project_id = ?
        ORDER BY n.created_at DESC
    `;

    connection.query(query, [projectId], function (err, results) {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).json({ error: 'Failed to fetch notes' });
        }
        res.json(results);
    });
});

// Create new note
app.post('/projects/:id/notes', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { note_content, created_by } = req.body;

    const query = `
        INSERT INTO cwr038_project_notes (project_id, note_content, created_by)
        VALUES (?, ?, ?)
    `;

    connection.query(query, [projectId, note_content, created_by], function (err, result) {
        if (err) {
            console.error('Error creating note:', err);
            return res.status(500).json({ error: 'Failed to create note' });
        }

        // Also log this action
        logProjectActivity(projectId, 'Add Note', created_by);

        res.json({ message: 'Note created successfully', id: result.insertId });
    });
});

// Delete note
app.delete('/notes/:id', verifyToken, function (req, res) {
    const noteId = req.params.id;

    connection.query('DELETE FROM cwr038_project_notes WHERE id = ?', [noteId], function (err, result) {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).json({ error: 'Failed to delete note' });
        }
        res.json({ message: 'Note deleted successfully' });
    });
});

// Get logs for a project
app.get('/projects/:id/logs', verifyToken, function (req, res) {
    const projectId = req.params.id;

    const query = `
        SELECT l.*,
               m.c_name as user_name,
               m.c_lastname as user_lastname,
               CONCAT(m.c_name, ' ', m.c_lastname) as user_fullname
        FROM cwr038_project_logs l
        LEFT JOIN cwr038_member m ON l.action_by = m.c_emp_id
        WHERE l.project_id = ?
        ORDER BY l.action_date DESC
    `;

    connection.query(query, [projectId], function (err, results) {
        if (err) {
            console.error('Error fetching logs:', err);
            return res.status(500).json({ error: 'Failed to fetch logs' });
        }
        res.json(results);
    });
});

// Add a log entry (can be called from other endpoints or directly)
app.post('/projects/:id/logs', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { action_type, action_by } = req.body;

    const query = `
        INSERT INTO cwr038_project_logs (project_id, action_type, action_by)
        VALUES (?, ?, ?)
    `;

    connection.query(query, [projectId, action_type, action_by], function (err, result) {
        if (err) {
            console.error('Error creating log:', err);
            return res.status(500).json({ error: 'Failed to create log' });
        }
        res.json({ message: 'Log created successfully', id: result.insertId });
    });
});

// ============ END NOTE & LOG ENDPOINTS ============

// Publish a draft project (set c_status = 0 to make it active)
app.put('/projects/:id/publish', verifyToken, function (req, res) {
    const projectId = req.params.id;

    connection.query(
        'UPDATE cwr038_project SET c_status = 0, c_approve = 1 WHERE id = ?',
        [projectId],
        function (err, result) {
            if (err) {
                console.error('Error publishing project:', err);
                return res.status(500).json({ error: 'Failed to publish project' });
            }

            logProjectActivity(projectId, 'Publish Project', req.user?.c_emp_id);
            res.json({ message: 'Project published successfully' });
        }
    );
});

// Update project details (for project owner)
app.put('/projects/:id', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const data = req.body;

    console.log('Received update data:', JSON.stringify(data, null, 2));

    // Build dynamic update query with only provided fields
    // Only include columns that definitely exist in cwr038_project table (from INSERT statement)
    const allowedFields = [
        'c_name', 'c_detail', 'c_objective', 'c_impact', 'c_urgent',
        'c_project_start', 'c_project_finish', 'c_budget', 'c_budget_detail',
        'c_roi_kpi_type', 'c_roi_type', 'c_roi_description', 'c_roi_year', 'c_roi_tgt'
    ];

    // Date fields that need conversion from ISO to MySQL format
    const dateFields = ['c_project_start', 'c_project_finish'];

    const updates = [];
    const values = [];

    allowedFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null) {
            updates.push(`${field} = ?`);
            let value = data[field];

            // Convert ISO date strings to MySQL date format
            if (dateFields.includes(field) && value) {
                const date = new Date(value);
                value = date.toISOString().slice(0, 10); // YYYY-MM-DD format
            }

            values.push(value);
        }
    });

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('c_update = NOW()');
    values.push(projectId);

    const updateQuery = `UPDATE cwr038_project SET ${updates.join(', ')} WHERE id = ?`;

    console.log('Update query:', updateQuery);
    console.log('Values:', values);

    connection.query(updateQuery, values, function (err, result) {
        if (err) {
            console.error('Error updating project:', err);
            console.error('SQL Error:', err.sqlMessage);
            return res.status(500).json({ error: 'Failed to update project', details: err.sqlMessage });
        }

        res.json({ message: 'Project updated successfully' });
    });
});

// Update project detail
app.put('/projects/:id/detail', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const {
        projectName,
        projectObjective,
        projectDescription,
        projectInvestment,
        investmentDetail,
        projectStartDate,
        projectEndDate,
        projectGroupId,
        impact,
        possibility
    } = req.body;

    const updateQuery = `
        UPDATE cwr038_project SET
            c_name = ?,
            c_objective = ?,
            c_detail = ?,
            c_budget = ?,
            c_budget_detail = ?,
            c_project_start = ?,
            c_project_finish = ?,
            c_project_group_id = ?,
            c_impact = ?,
            c_urgent = ?
        WHERE id = ?
    `;

    const values = [
        projectName,
        projectObjective,
        projectDescription,
        projectInvestment,
        investmentDetail,
        projectStartDate,
        projectEndDate,
        projectGroupId ? parseInt(projectGroupId) : null,
        impact,
        possibility,
        projectId
    ];

    connection.query(updateQuery, values, function (err, result) {
        if (err) {
            console.error('Error updating project detail:', err);
            return res.status(500).json({ error: 'Failed to update project detail' });
        }
        logProjectActivity(projectId, 'Update Project Detail', req.user?.c_emp_id);
        res.json({ message: 'Project detail updated successfully' });
    });
});

// Update project ROI (including actual values)
app.put('/projects/:id/roi', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { kpiType, roiType, roiDescription, roiBeneficiary, roiDescriptionType, roiYear, roiTarget, roiActual, budgetActual } = req.body;

    // Convert kpiType to numeric value: 1 = Quantitative, 2 = Qualitative
    let roiKpiTypeValue = null;
    if (kpiType === 'quantitative') {
        roiKpiTypeValue = 1;
    } else if (kpiType === 'qualitative') {
        roiKpiTypeValue = 2;
    }

    // Empty strings must become NULL — numeric columns (c_roi_year, c_roi_tgt, c_roi_act)
    // reject '' under MySQL strict mode.
    const toNullIfEmpty = v => (v === '' || v == null ? null : v);

    const updateQuery = `
        UPDATE cwr038_project SET
            c_roi_kpi_type = ?,
            c_roi_type = ?,
            c_roi_description = ?,
            c_roi_beneficiary = ?,
            c_roi_description_type = ?,
            c_roi_year = ?,
            c_roi_tgt = ?,
            c_roi_act = ?,
            c_budget_act = ?
        WHERE id = ?
    `;

    const values = [
        roiKpiTypeValue,
        toNullIfEmpty(roiType),
        toNullIfEmpty(roiDescription),
        toNullIfEmpty(roiBeneficiary),
        toNullIfEmpty(roiDescriptionType),
        toNullIfEmpty(roiYear),
        toNullIfEmpty(roiTarget),
        toNullIfEmpty(roiActual),
        toNullIfEmpty(budgetActual),
        projectId
    ];

    connection.query(updateQuery, values, function (err, result) {
        if (err) {
            console.error('Error updating project ROI:', err);
            return res.status(500).json({ error: 'Failed to update project ROI' });
        }
        logProjectActivity(projectId, 'Update ROI', req.user?.c_emp_id);
        res.json({ message: 'Project ROI updated successfully' });
    });
});

// Get revenue projection rows for a project
app.get('/project/:id/revenue-projection', verifyToken, function (req, res) {
    const projectId = req.params.id;
    connection.query(
        'SELECT c_year AS year, c_return AS returnAmount FROM cwr038_project_revenue_projection WHERE c_project_id = ? ORDER BY c_year ASC',
        [projectId],
        function (err, results) {
            if (err) {
                console.error('Error fetching revenue projection:', err);
                return res.status(500).json({ error: 'Failed to fetch revenue projection' });
            }
            res.json(results);
        }
    );
});

// Replace revenue projection rows for a project (owner only)
app.put('/project/:id/revenue-projection', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { rows } = req.body;

    if (!Array.isArray(rows)) {
        return res.status(400).json({ error: 'rows must be an array' });
    }

    const normalized = [];
    const seenYears = new Set();
    for (const row of rows) {
        const year = parseInt(row?.year, 10);
        const amount = Number(row?.returnAmount);
        if (!Number.isInteger(year) || year < 1900 || year > 9999) {
            return res.status(400).json({ error: `Invalid year: ${row?.year}` });
        }
        if (!Number.isFinite(amount) || amount < 0) {
            return res.status(400).json({ error: `Invalid return amount for year ${year}` });
        }
        if (seenYears.has(year)) {
            return res.status(400).json({ error: `Duplicate year: ${year}` });
        }
        seenYears.add(year);
        normalized.push([projectId, year, amount]);
    }

    // Verify caller is the project owner
    connection.query(
        'SELECT c_create_by FROM cwr038_project WHERE id = ?',
        [projectId],
        function (ownerErr, ownerRows) {
            if (ownerErr) {
                console.error('Error checking project owner:', ownerErr);
                return res.status(500).json({ error: 'Failed to save revenue projection' });
            }
            if (!ownerRows.length) {
                return res.status(404).json({ error: 'Project not found' });
            }
            const ownerId = String(ownerRows[0].c_create_by);
            const callerId = String(req.user?.c_emp_id);
            if (!callerId || callerId !== ownerId) {
                return res.status(403).json({ error: 'Only the project owner can edit revenue projection' });
            }

            connection.query(
                'DELETE FROM cwr038_project_revenue_projection WHERE c_project_id = ?',
                [projectId],
                function (delErr) {
                    if (delErr) {
                        console.error('Error clearing revenue projection:', delErr);
                        return res.status(500).json({ error: 'Failed to save revenue projection' });
                    }
                    if (normalized.length === 0) {
                        logProjectActivity(projectId, 'Update Revenue Projection', req.user?.c_emp_id);
                        return res.json({ message: 'Revenue projection cleared' });
                    }
                    connection.query(
                        'INSERT INTO cwr038_project_revenue_projection (c_project_id, c_year, c_return) VALUES ?',
                        [normalized],
                        function (insErr) {
                            if (insErr) {
                                console.error('Error inserting revenue projection:', insErr);
                                return res.status(500).json({ error: 'Failed to save revenue projection' });
                            }
                            logProjectActivity(projectId, 'Update Revenue Projection', req.user?.c_emp_id);
                            res.json({ message: 'Revenue projection saved', count: normalized.length });
                        }
                    );
                }
            );
        }
    );
});

// Update project team members
app.put('/projects/:id/team', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { members } = req.body;

    // First get the project owner to preserve them
    connection.query(
        'SELECT c_create_by FROM cwr038_project WHERE id = ?',
        [projectId],
        function (err, projectResult) {
            if (err) {
                console.error('Error getting project:', err);
                return res.status(500).json({ error: 'Failed to update team' });
            }

            const projectOwner = projectResult[0]?.c_create_by;

            // Delete existing team members (except owner) from cwr038_project_member
            connection.query(
                'DELETE FROM cwr038_project_member WHERE c_project_id = ? AND c_member_id != ?',
                [projectId, projectOwner],
                function (deleteErr) {
                    if (deleteErr) {
                        console.error('Error deleting team members:', deleteErr);
                        return res.status(500).json({ error: 'Failed to update team' });
                    }

                    // Insert new team members into cwr038_project_member (exclude owner to prevent duplicates)
                    const filteredMembers = Array.isArray(members) ? members.filter(m => m.c_emp_id && m.c_emp_id.toString() !== projectOwner?.toString()) : [];
                    if (filteredMembers.length > 0) {
                        const memberValues = filteredMembers.map(m => [projectId, String(m.c_emp_id), m.role]);
                        const memberQuery = `
                            INSERT INTO cwr038_project_member (c_project_id, c_member_id, c_role)
                            VALUES ?
                        `;

                        connection.query(memberQuery, [memberValues], function (memberErr) {
                            if (memberErr) {
                                console.error('Error inserting team members:', memberErr);
                                return res.status(500).json({ error: 'Failed to save team members' });
                            }
                            logProjectActivity(projectId, 'Update Team Members', req.user?.c_emp_id);
                            res.json({ message: 'Team updated successfully' });
                        });
                    } else {
                        logProjectActivity(projectId, 'Update Team Members', req.user?.c_emp_id);
                        res.json({ message: 'Team updated successfully (no members)' });
                    }
                }
            );
        }
    );
});

// Update project status and progress (with auto-approve logic)
app.put('/projects/:id/update', verifyToken, function (req, res) {
    const projectId = req.params.id;
    const { projectStatus, percentProgress, obstruction, solution, whatYouHaveDone, cancelReason } = req.body;

    // Auto-approve logic: if status is not grey (not start) and progress > 0, set c_approve = 1
    const progress = parseFloat(percentProgress) || 0;
    const shouldAutoApprove = projectStatus && projectStatus !== 'grey' && progress > 0;

    const updateQuery = `
        UPDATE cwr038_project SET
            c_project_status = ?,
            c_percent_progress = ?,
            c_obstruction = ?,
            c_solution = ?,
            c_what_you_have_done = ?
            ${cancelReason ? ', c_cancel_reason = ?' : ''}
            ${shouldAutoApprove ? ', c_approve = 1' : ''}
        WHERE id = ?
    `;

    const values = [projectStatus, percentProgress, obstruction, solution, whatYouHaveDone];
    if (cancelReason) values.push(cancelReason);
    values.push(projectId);

    connection.query(updateQuery, values, function (err, result) {
        if (err) {
            console.error('Error updating project status:', err);
            return res.status(500).json({ error: 'Failed to update project status' });
        }
        logProjectActivity(projectId, 'Update Project Status: ' + (projectStatus || 'N/A'), req.user?.c_emp_id);
        res.json({
            message: 'Project update saved successfully',
            autoApproved: shouldAutoApprove
        });
    });
});

// ==================== Profile Photo Upload ====================

// Upload profile photo (user uploads their own photo)
app.post('/profile/upload-photo', verifyToken, function (req, res) {
    profileUpload.single('photo')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ status: 'error', message: 'File size must be less than 5MB' });
            }
            return res.status(400).json({ status: 'error', message: err.message });
        } else if (err) {
            return res.status(400).json({ status: 'error', message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const empId = req.user.c_emp_id;
        const photoFilename = req.file.filename;

        // Update the member record with the photo filename
        connection.query(
            'UPDATE cwr038_member SET c_profile_photo = ? WHERE c_emp_id = ?',
            [photoFilename, empId],
            function (err) {
                if (err) {
                    console.error('Error updating profile photo:', err);
                    return res.status(500).json({ status: 'error', message: 'Failed to save photo' });
                }
                res.json({
                    status: 'ok',
                    message: 'Profile photo updated successfully',
                    photo: photoFilename
                });
            }
        );
    });
});

// Get profile photo info for a member
app.get('/profile/photo/:empId', verifyToken, function (req, res) {
    const empId = req.params.empId;
    connection.query(
        'SELECT c_profile_photo FROM cwr038_member WHERE c_emp_id = ?',
        [empId],
        function (err, results) {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Member not found' });
            }
            res.json({
                status: 'ok',
                photo: results[0].c_profile_photo || null
            });
        }
    );
});

// Get profile photos for all members (batch)
app.get('/profile/photos/all', verifyToken, function (req, res) {
    connection.query(
        'SELECT c_emp_id, c_profile_photo FROM cwr038_member WHERE c_profile_photo IS NOT NULL AND c_profile_photo != ""',
        function (err, results) {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Database error' });
            }
            const photoMap = {};
            results.forEach(r => {
                photoMap[r.c_emp_id] = r.c_profile_photo;
            });
            res.json({ status: 'ok', photos: photoMap });
        }
    );
});

// Serve React app for all other routes in production (must be last)
if (process.env.NODE_ENV === 'production') {
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(PORT, '0.0.0.0', function () {
    console.log('CORS-enabled web server listening on port ' + PORT)
    console.log('Server accessible at:')
    console.log('- http://localhost:' + PORT)
    console.log('- http://ibsdo.com:' + PORT)
})