// Script to update password for user ruangtipj
const crypto = require('crypto');
const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ibsdo',
    password: process.env.DB_PASSWORD || '#wyT6G5iQg36',
    database: process.env.DB_NAME || 'tvs_db_dup',
    port: process.env.DB_PORT || 3306
});

// Hash password using the same algorithm as the app
function hashPassword(password) {
    const sha1Hash = crypto.createHash('sha1').update(password.trim()).digest('hex');
    const md5OfSha1 = crypto.createHash('md5').update(sha1Hash).digest('hex');
    const base64Encoded = Buffer.from(md5OfSha1).toString('base64');
    const hashedPassword = crypto.createHash('md5').update(base64Encoded).digest('hex');
    return hashedPassword;
}

const username = 'ruangtipj';
const newPassword = 'icentral#2025';
const hashedPassword = hashPassword(newPassword);

console.log('Updating password for user:', username);
console.log('New password hash:', hashedPassword);

console.log('Attempting to connect to database...');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('User:', process.env.DB_USER || 'ibsdo');
console.log('Database:', process.env.DB_NAME || 'tvs_db_dup');
console.log('Port:', process.env.DB_PORT || 3306);

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed:', err.code, err.message);
        process.exit(1);
    }

    console.log('Connected to database');

    // Update the password
    connection.query(
        'UPDATE cwr038_member SET c_password = ? WHERE c_username = ?',
        [hashedPassword, username],
        function (err, results) {
            if (err) {
                console.error('Failed to update password:', err.message);
                connection.end();
                process.exit(1);
            }

            if (results.affectedRows === 0) {
                console.log('No user found with username:', username);
            } else {
                console.log('Password updated successfully for user:', username);
                console.log('Affected rows:', results.affectedRows);
            }

            connection.end();
            process.exit(0);
        }
    );
});
