-- ============================================================
-- STEP 1: VIEW DUPLICATES (Run this first to see the problem)
-- ============================================================

-- Find all duplicate usernames (same person appearing multiple times)
SELECT m1.id, m1.c_emp_id, m1.c_username, m1.c_name, m1.c_lastname,
       m1.c_permission_group_id, m1.c_status
FROM cwr038_member m1
INNER JOIN (
    SELECT c_username
    FROM cwr038_member
    GROUP BY c_username
    HAVING COUNT(*) > 1
) dups ON m1.c_username = dups.c_username
ORDER BY m1.c_username, m1.id;

-- ============================================================
-- STEP 2: DELETE DUPLICATE ROWS (keep original, delete newer)
-- For each duplicate username, delete the row with the HIGHER id
-- (the one created by create_users.sql)
-- ============================================================

DELETE FROM cwr038_member
WHERE id NOT IN (
    SELECT min_id FROM (
        SELECT MIN(id) as min_id
        FROM cwr038_member
        GROUP BY c_username
    ) AS keep_rows
);

-- ============================================================
-- STEP 3: UPDATE ALL MEMBERS TO SHOW IN MEMBER LIST
-- Set c_permission_group_id = 9 and c_status = 0 for all
-- members (except admin) so they show up in the Members page
-- This fixes missing members like kittinv
-- ============================================================

UPDATE cwr038_member
SET c_permission_group_id = 9, c_status = 0
WHERE c_username != 'admin'
  AND c_name != 'admin';

-- ============================================================
-- STEP 4: DELETE TEST USER (optional - remove if not needed)
-- ============================================================

-- DELETE FROM cwr038_member WHERE c_username = 'test';

-- ============================================================
-- STEP 5: VERIFY - Check final member list
-- ============================================================

SELECT id, c_emp_id, c_username, c_name, c_lastname,
       c_permission_group_id, c_status
FROM cwr038_member
ORDER BY c_name ASC;
