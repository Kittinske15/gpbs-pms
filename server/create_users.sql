-- Create users from admin_bsdo database
-- Default password: TrueVision123!
-- Excluding: admin, nottp, pakornw, wisarutd, preemcharatk, nathapholr, theerapatj

INSERT IGNORE INTO cwr038_member (c_emp_id, c_username, c_password, c_name, c_lastname, c_nick_name, c_email, c_project_group, c_permission_group_id, c_must_change_password)
VALUES
(2, 'pattarapongb', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Pattarapong', 'Bhannasiri', 'Dr.Pat', 'Pattarapong_Bha@truecorp.co.th', 0, 9, 1),
(3, 'ruangtipj', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Ruangtip', 'Jirapanpipat', 'Tip', 'Ruangtip_Jir@truecorp.co.th', 0, 9, 1),
(5, 'sanongp', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Sanong', 'Pitatung', 'Noi', 'Sanong_Pit@truecorp.co.th', 0, 10, 1),
(6, 'suwitchas', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Suwitcha', 'Snkitprachai', 'Pang', 'suwitcha_sri@truecorp.co.th', 0, 9, 1),
(7, 'thanaratana', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Thanaratana', 'Akarakul', 'Ning', 'thanaratana_aka@truecorp.co.th', 0, 9, 1),
(9, 'chuchartm', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Chuchart', 'Maleeyam', 'Chart', 'Chuchart_Mal@truecorp.co.th', 0, 10, 1),
(10, 'pinkamonk', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Pinkamon', 'Kotchakosai', 'Pingpong', 'Pinkamon_kot@truecorp.co.th', 0, 10, 1),
(11, 'apiwoott', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Apiwoot', 'Thongsodsang', 'Au', 'apiwoot_tho@truecorp.co.th', 0, 9, 1),
(16, 'peerawatd', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Peerawat', 'Dentananan', 'Bright', 'peerawat_den@truecorp.co.th', 0, 9, 1),
(18, 'pimnidap', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Pimnida', 'Pichitpongchai', 'Proud', 'pimnida_pic@truecorp.co.th', 0, 9, 1),
(19, 'chalisan', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Chalisa', 'Noibunterm', 'Wa', 'Chalisa.Noibunterm@truecorp.co.th', 0, 9, 1),
(20, 'natthakritk', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Natthakrit', 'Kulareerat', 'Oak', 'Natthakrit.Kulareerat@truecorp.co.th', 0, 9, 1),
(21, 'thanawata', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Thanawat', 'Anansuthivara', 'Beer', 'thanawat.anan@gmail.com', 0, 9, 1),
(24, 'natchayak', '$2b$12$WyFj544NOLMmZ88VHu6.UuN8Zh.FAQIcEOvr5XPsVRfEDWloG3LjC', 'Natchaya', 'Kiatphaisan', 'Tao', 'natnetji@gmail.com', 0, 9, 1);
