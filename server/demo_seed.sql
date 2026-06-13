-- ============================================================
--  GPBS PMS — Demo seed data
-- ============================================================
--  Run this AFTER you've inserted the admin user (emp_id=1).
--  Paste into phpMyAdmin → gpbs_db → SQL tab, then click Go.
--
--  All demo logins use the SAME bcrypt hash (= password "Gpbs2026!")
--  as the admin user — that way you can sign in as any of them to
--  test multi-user flows.
--
--  Re-running is safe: every INSERT uses INSERT IGNORE.
-- ============================================================

-- ---------- 1. Demo members (7 extra users) ----------
INSERT IGNORE INTO cwr038_member
    (c_emp_id, c_username, c_password, c_name, c_lastname, c_nick_name, c_email,
     c_project_group, c_permission_group_id, c_must_change_password, c_status)
VALUES
    (2, 'somchai',  '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Somchai',  'Jaidee',     'Chai',  'somchai@example.com',  0, 9, 0, 0),
    (3, 'nattaya',  '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Nattaya',  'Suksai',     'Nat',   'nattaya@example.com',  0, 9, 0, 0),
    (4, 'prasit',   '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Prasit',   'Wongthong',  'Sit',   'prasit@example.com',   0, 9, 0, 0),
    (5, 'kanya',    '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Kanya',    'Boonyarat',  'Kan',   'kanya@example.com',    0, 9, 0, 0),
    (6, 'thirawat', '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Thirawat', 'Pongsak',    'Ti',    'thirawat@example.com', 0, 9, 0, 0),
    (7, 'pimchanok','$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Pimchanok','Sirikul',    'Pim',   'pimchanok@example.com',0, 9, 0, 0),
    (8, 'apinya',   '$2b$12$rJf..KuDDSy4c5Z0SxD9HuxOMZrKKPalRGkHFznzh996Ar0MZn6q2', 'Apinya',   'Chairat',    'Pin',   'apinya@example.com',   0, 9, 0, 0);


-- ---------- 2. Demo projects (10 across all status colors) ----------
-- c_project_status drives the dashboard gauge:
--   green = completed, yellow = on processing, orange = delayed,
--   red = cancelled, grey = not started
-- c_project_group_id: 0 = CONTENT, 1 = MEDIA (for category pie chart)

INSERT IGNORE INTO cwr038_project
    (id, c_name, c_objective, c_detail, c_budget, c_budget_detail,
     c_project_start, c_project_finish, c_impact, c_urgent,
     c_create_by, c_project_status, c_project_group_id,
     c_roi_kpi_type, c_roi_type, c_roi_description, c_roi_year, c_roi_tgt,
     c_roi_beneficiary, c_roi_description_type, c_approve, c_status, c_create_date)
VALUES
    (1001, 'Customer Portal Revamp',
        'Modernise customer-facing portal for GPBS clients',
        'Rebuild the legacy customer portal with a new React UI and improved UX.',
        2500000, 'Includes design, dev, and QA budget',
        '2026-01-15', '2026-08-30', 5, 4,
        1, 'green', 0, 1, 'Revenue', 'Revenue Increase', 2026, 5000000, 'GPBS', 'Net Profit', 1, 0, NOW()),

    (1002, 'Internal Knowledge Base',
        'Centralised wiki for engineering and ops teams',
        'Replace scattered Google Docs with a Notion-based knowledge base.',
        450000, 'Mostly tooling and licensing',
        '2026-02-01', '2026-07-15', 3, 3,
        2, 'yellow', 0, 2, 'Efficiency', 'Efficiency Improvement', 2026, 0, 'Internal', 'Cost Saving', 1, 0, NOW()),

    (1003, 'Mobile App MVP',
        'Launch GPBS mobile companion app',
        'Native mobile (iOS + Android) for the customer portal — Phase 1.',
        3800000, 'Includes hardware and DevOps',
        '2026-03-10', '2026-12-20', 5, 5,
        3, 'yellow', 1, 1, 'Revenue', 'Sale', 2026, 8000000, 'Client A', 'Revenue Increase', 1, 0, NOW()),

    (1004, 'Data Warehouse Migration',
        'Move legacy MySQL data to BigQuery',
        'Migrate historical project + finance data into a unified warehouse for analytics.',
        1200000, 'Cloud + consulting fees',
        '2026-01-05', '2026-05-30', 4, 4,
        4, 'orange', 0, 1, 'Cost', 'Cost Saving', 2026, 1500000, 'Internal', 'Cost Saving', 1, 0, NOW()),

    (1005, 'Marketing Automation Pilot',
        'Pilot Salesforce Marketing Cloud for top accounts',
        'Six-month pilot to evaluate uplift on email-driven leads.',
        850000, 'Tool licenses + agency support',
        '2026-04-01', '2026-09-30', 4, 3,
        5, 'green', 1, 1, 'Revenue', 'Revenue Increase', 2026, 2200000, 'Client B', 'Revenue Increase', 1, 0, NOW()),

    (1006, 'Security Compliance Audit',
        'ISO 27001 readiness assessment',
        'Engage external auditor to map current controls to ISO 27001 Annex A.',
        650000, 'Auditor fees + remediation',
        '2026-05-15', '2026-11-30', 5, 5,
        1, 'yellow', 0, 2, 'Risk', 'Compliance', 2026, 0, 'GPBS', 'Net Profit', 1, 0, NOW()),

    (1007, 'Office Network Refresh',
        'Replace ageing routers and switches',
        'Replace end-of-life network gear across the HQ and one branch office.',
        320000, 'Mostly hardware',
        '2026-02-20', '2026-04-30', 2, 3,
        6, 'red', 0, 2, 'Cost', 'Cost Saving', 2026, 0, 'Internal', 'Cost Saving', 1, 0, NOW()),

    (1008, 'AI Customer Support Bot',
        'Deploy LLM-backed first-line support bot',
        'Reduce tier-1 ticket volume with an LLM chat agent on the portal.',
        1600000, 'Vendor + integration',
        '2026-06-01', '2027-02-28', 5, 4,
        7, 'grey', 1, 1, 'Cost', 'Cost Saving', 2026, 3000000, 'Internal', 'Cost Saving', 1, 0, NOW()),

    (1009, 'Vendor Onboarding Workflow',
        'Streamline new vendor approval process',
        'Replace email-based vendor onboarding with a workflow tool.',
        280000, 'Tool + integration',
        '2026-03-15', '2026-08-15', 3, 2,
        8, 'green', 0, 2, 'Efficiency', 'Efficiency Improvement', 2026, 600000, 'Internal', 'Cost Saving', 1, 0, NOW()),

    (1010, 'Quarterly Town Hall Platform',
        'Live-stream platform for all-hands meetings',
        'Pick and deploy a town-hall streaming + Q&A platform.',
        180000, 'Annual license',
        '2026-04-10', '2026-06-30', 2, 2,
        2, 'grey', 1, 2, 'Efficiency', 'Engagement', 2026, 0, 'Internal', 'Cost Saving', 1, 0, NOW());


-- ---------- 3. Project members (assign team to each project) ----------
INSERT IGNORE INTO cwr038_project_member (c_project_id, c_member_id, c_role) VALUES
    (1001, 1, 'Owner'),   (1001, 2, 'Member'), (1001, 3, 'Member'),
    (1002, 2, 'Owner'),   (1002, 4, 'Member'),
    (1003, 3, 'Owner'),   (1003, 5, 'Member'), (1003, 6, 'Member'),
    (1004, 4, 'Owner'),   (1004, 7, 'Member'),
    (1005, 5, 'Owner'),   (1005, 1, 'Member'),
    (1006, 1, 'Owner'),   (1006, 8, 'Member'),
    (1007, 6, 'Owner'),   (1007, 4, 'Member'),
    (1008, 7, 'Owner'),   (1008, 3, 'Member'), (1008, 5, 'Member'),
    (1009, 8, 'Owner'),   (1009, 2, 'Member'),
    (1010, 2, 'Owner'),   (1010, 7, 'Member');


-- ---------- 4. ROI / revenue projection per year ----------
INSERT IGNORE INTO cwr038_project_revenue_projection (c_project_id, c_year, c_return) VALUES
    (1001, 2026, 5000000),
    (1001, 2027, 7500000),
    (1003, 2026, 8000000),
    (1003, 2027, 14000000),
    (1004, 2026, 1500000),
    (1005, 2026, 2200000),
    (1005, 2027, 3300000),
    (1008, 2026, 3000000),
    (1008, 2027, 4500000),
    (1009, 2026, 600000);


-- ---------- 5. A couple of action plans (sample) ----------
-- status uses color names: Green = done, Yellow = in progress, Red = blocked
INSERT IGNORE INTO cwr038_action_plans
    (project_id, plan_description, responsible_emp_id, start_date, end_date, status)
VALUES
    (1001, 'Finalise UI mockups in Figma',              2, '2026-01-20', '2026-02-28', 'Green'),
    (1001, 'Implement authentication flow',             2, '2026-03-01', '2026-04-15', 'Green'),
    (1001, 'Integrate billing API',                     3, '2026-05-01', '2026-06-30', 'Green'),
    (1002, 'Pick KB platform (Notion vs Confluence)',   4, '2026-02-05', '2026-03-15', 'Green'),
    (1002, 'Migrate engineering docs',                  4, '2026-04-01', '2026-05-30', 'Yellow'),
    (1003, 'Native iOS prototype',                      5, '2026-04-15', '2026-07-30', 'Yellow'),
    (1004, 'Schema mapping legacy -> BQ',               7, '2026-02-01', '2026-04-15', 'Yellow'),
    (1005, 'Configure top-30 customer segments',        1, '2026-04-10', '2026-06-30', 'Green'),
    (1008, 'Vendor evaluation matrix',                  3, '2026-06-15', '2026-07-15', 'Yellow');


-- ============================================================
--  Done. Refresh https://ibsdo.com/gpbs-pms/ — the dashboard
--  should now show: 10 projects, mixed statuses, member counts,
--  and ROI numbers in the gauges.
-- ============================================================
