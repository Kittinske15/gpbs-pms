-- GPBS PMS — demo user seed
-- Default password: Gpbs2026!  (forces change on first login — c_must_change_password=1)
-- Bcrypt hash below is the password "Gpbs2026!" hashed with cost 12.
-- Generate a fresh one if you want a different password:
--   node -e "console.log(require('bcrypt').hashSync('YourPassword!', 12))"

INSERT IGNORE INTO cwr038_member
    (c_emp_id, c_username, c_password, c_name, c_lastname, c_nick_name, c_email, c_project_group, c_permission_group_id, c_must_change_password)
VALUES
    (1, 'admin',  '$2b$12$REPLACE_WITH_FRESH_BCRYPT_HASH', 'GPBS',  'Admin',   'Admin',  'admin@example.com',  0, 10, 1),
    (2, 'demo',   '$2b$12$REPLACE_WITH_FRESH_BCRYPT_HASH', 'Demo',  'User',    'Demo',   'demo@example.com',   0, 9,  1);
