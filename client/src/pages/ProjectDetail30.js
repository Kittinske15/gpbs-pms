import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ActionPlan from '../components/actionPlan';
import Log from '../components/log';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ProjectDetail30() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [customPhotos, setCustomPhotos] = useState({});

    useEffect(() => { fetchCustomPhotos().then(setCustomPhotos); }, []);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const originalRows = [
        {
            id: '1', type: 'Update', date: 'Wed 15 Feb 2023 20:26:59', by: 'Ongard Prapakamol',
        },
        {
            id: '2', type: 'Update', date: 'Wed 15 Feb 2023 20:31:27', by: 'Ongard Prapakamol',
        },
        {
            id: '3', type: 'Update', date: 'Thu 27 Apr 2023 14:38:25', by: 'Ongard Prapakamol',
        },
        {
            id: '4', type: 'Update', date: 'Tue 16 May 2023 18:20:46', by: 'Ongard Prapakamol',
        },
        {
            id: '5', type: 'Update', date: 'Tue 16 May 2023 18:23:08', by: 'Ongard Prapakamol',
        },
        {
            id: '6', type: 'Update', date: 'Fri 19 May 2023 15:52:25', by: 'Ongard Prapakamol',
        },
        {
            id: '7', type: 'Update', date: 'Fri 19 May 2023 16:31:48', by: 'Ongard Prapakamol',
        },
        {
            id: '8', type: 'Update', date: 'Fri 19 May 2023 23:54:35', by: 'Ongard Prapakamol',
        },
        {
            id: '9', type: 'Update', date: 'Tue 18 Jul 2023 08:53:56', by: 'Ongard Prapakamol',
        },
        {
            id: '10', type: 'Update', date: 'Tue 18 Jul 2023 09:06:25', by: 'Ongard Prapakamol',
        },
        {
            id: '11', type: 'Update', date: 'Tue 18 Jul 2023 14:08:11', by: 'Ongard Prapakamol',
        },
        {
            id: '12', type: 'Update', date: 'Tue 18 Jul 2023 14:09:25', by: 'Ongard Prapakamol',
        },
        {
            id: '13', type: 'Update', date: 'Fri 08 Sep 2023 15:57:41', by: 'Ongard Prapakamol',
        },
        {
            id: '14', type: 'Update', date: 'Thu 05 Oct 2023 08:05:47', by: 'Ongard Prapakamol',
        },
        {
            id: '15', type: 'Update', date: 'Thu 05 Oct 2023 08:06:58', by: 'Ongard Prapakamol',
        },
        {
            id: '16', type: 'Update', date: 'Tue 24 Oct 2023 16:34:28', by: 'Ongard Prapakamol',
        },
        {
            id: '17', type: 'Update', date: 'Thu 16 Nov 2023 10:50:41', by: 'Ongard Prapakamol',
        },
        {
            id: '18', type: 'Update', date: 'Thu 16 Nov 2023 10:52:03', by: 'Ongard Prapakamol',
        },
        {
            id: '19', type: 'Update', date: 'Thu 23 Nov 2023 11:46:41', by: 'Ongard Prapakamol',
        },
        {
            id: '20', type: 'Update', date: 'Wed 29 Nov 2023 13:13:48', by: 'Ongard Prapakamol',
        },
        {
            id: '21', type: 'Update', date: 'Mon 04 Dec 2023 16:18:50', by: 'Ongard Prapakamol',
        },
        {
            id: '22', type: 'Update', date: 'Wed 14 Feb 2024 11:11:34', by: 'Ongard Prapakamol',
        },
        {
            id: '23', type: 'Update', date: 'Wed 14 Feb 2024 11:12:17', by: 'Ongard Prapakamol',
        },
    ];

    const [rows, setRows] = useState(originalRows);

    const tableData = [
        ['2025', '200,000,000'],
        ['2026', '400,000,000'],
        ['2027', '500,000,000'],
    ];

    const tableROI = [
        ['ROI Type', 'Direct Return'],
        ['Year', '2024'],
        ['Target', '100,000,000 Baht'],
        ['Actual', 'TBD'],
        ['Description', ' -พัฒนา application TVS NOW รองรับช่องทาง IOS, Android, Smart TV, OTT โดยใช้ Backend ของ True ID'],
    ];

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        color: 'black'
    };

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Project Progress</div>
                <div className='project-description-detail'>% Progress : 100 %</div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'>
                    <p><strong>OPEN</strong></p><ul><li>-</li></ul><p><strong>CLOSED</strong></p><ul><li>Need k.Sharad to approve the contract before release it to k.Soopakij to sign the contract with Vendor</li><li>7 Addition&nbsp;Man Power approval from CMO : HR Start offering the candidates</li><li>Budget Approval to start kick-off the implementation with Solution Provider</li><li>Decision to use Solution Provider as a baseline platform to speed up development (3X timeframe)</li><li>Alignment of direction of TrueVisions app. Can it be standalone app or required to be under TrueID app?</li><li>Direction is now clear. We will go with TrueVisions app as standalone app.</li></ul>
                </div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'><p>Use OTT solution provider to be the base platform to shorten timeframe and use it to create Smart TV app, Android TV app, PC web, iOS app and Android app.</p></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Prioritization</div>
                    <div className='project-objective-detail'>Possibility : High</div>
                    <div className='project-objective-detail'>Impact : High</div>

                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Team Member</div>
                    <div className='project-objective-detail'>1. Ongard Prapakamol (Project Owner - Accountability)</div>
                    <div className='project-objective-detail'>2. Soothi Na-Ranong (Responsibility)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>24/01/2023-31/12/2024</div>

                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : 60,000,000 Baht</div>
                    <div className='project-objective-detail'>Actual : 60,000,000 </div>
                    <div className='project-objective-detail'>Investment Detail: N/A</div>
                </div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>ROI</div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={cellStyle}>KPI Type</th>
                            <th style={cellStyle}>Quantitative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableROI.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} style={cellStyle}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>;
    } else if (selectedMenuItem === 'actionPlan') {
        content = <ActionPlan />;
    } else if (selectedMenuItem === 'roi') {
        content =
            <div className='roi-flex'>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        KPI Type
                    </div>
                    <div className='project-roi-detail'>
                        Quantitative
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        ROI Type
                    </div>
                    <div className='project-roi-detail'>
                        Cost saving
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Year
                    </div>
                    <div className='project-roi-detail'>
                        2024
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Target
                    </div>
                    <div className='project-roi-detail'>
                        500,000,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        <ul><li>พัฒนา application TVS NOW รองรับช่องทาง IOS, Android, Smart TV, OTT&nbsp;โดยใช้ Backend ของ True ID</li><li>Transform from Linear channels to VOD</li><li>Reduce Cost of payment (Partner with TrueMoney)</li><li>ยอดรายได้ จะได้จาก project&nbsp;<a href="https://ibsdo.com/tvs/stvs/project_plan_update.php?proID=61">New TVS NOW packages to competitive with AIS play</a>&nbsp;&nbsp;&nbsp;</li></ul><p>ส่วนต่อขยายพัฒนาเพิ่มเติม</p><ul><li>Content ควรมีตัวอย่าง Teaser เพื่อดึงดูดความสนใจให้ลูกค้ากดรับเพื่อเข้าชมภาพยนตร์เต็มเรื่อง &nbsp;</li><li>ให้ศึกษาการชำระค่าบริการ Streaming Server แก่ True โดย True Visions ชำระค่าบริการเกินค่ามาตรฐานตลาดหรือไม่</li></ul>
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'attachment') {
        content =
            <div className='roi-flex'>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 1
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 2
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 3
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 4
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='insert-note-flex'>
                    <div className='insert-note'>
                        <img className='insert-img' src={process.env.PUBLIC_URL + "/assets/plus.png"} />
                        <div>
                            Upload File
                        </div>
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'note') {
        content =
            <div>
                <TextField
                    style={{ textAlign: 'left', width: '100%', marginBottom: '15px' }}
                    hintText="Message Field"
                    floatingLabelText="MultiLine and FloatingLabel"
                    multiline
                    rows={15}
                />
                <div className='insert-note-flex'>
                    <div className='insert-note'>
                        <img className='insert-img' src={process.env.PUBLIC_URL + "/assets/plus.png"} />
                        <div>
                            Insert Note
                        </div>
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'log') {
        content =
            <Paper>
                <TableContainer>
                    <Table className="project-table" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell align="center">Action Type</TableCell>
                                <TableCell align="center">Action Date</TableCell>
                                <TableCell align="center">Action By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center">{row.type}</TableCell>
                                    <TableCell align="center">{row.date}</TableCell>
                                    <TableCell align="center">{row.by}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
    }

    return (
        <div className="App">
            <Sidebar onToggle={setSidebarOpen} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='project-detail-title-flex'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img className='ball-detial-processing' />
                            <div className='project-detail-title'>Project : แผนงานพัฒนาแอพพลิเคชั่นของ True Visions</div>
                        </div>
                        <div className='download-model-box'>
                            <img className='subtract-icon' src={process.env.PUBLIC_URL + "/assets/subtract.png"} />
                            <div className='download-model'>Download Business Model</div>
                        </div>
                    </div>
                    <div className='project-owner-grid'>
                        <div className='project-owner-box'>
                            <div className='project-owner-box-flex'>
                                <div className='project-owner-title'>
                                    PROJECT OWNER
                                </div>
                                <img className='project-owner-img' src={getMemberPhotoUrl("100", customPhotos)} onError={(e) => handlePhotoError(e, "100")} />
                                <div className='project-owner-name'>
                                    Ongard Prapakamol
                                </div>
                                <div className='project-owner-detail-box'>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Description</div>
                                        <div className='project-description-detail'><ul><li>พัฒนา application TVS NOW รองรับช่องทาง IOS, Android, Smart TV, OTT&nbsp;โดยใช้ Backend ของ True ID</li><li>Transform from Linear channels to VOD</li><li>Reduce Cost of payment (Partner with TrueMoney)</li><li>ยอดรายได้ จะได้จาก project&nbsp;<a href="https://ibsdo.com/tvs/stvs/project_plan_update.php?proID=61">New TVS NOW packages to competitive with AIS play</a>&nbsp;&nbsp;&nbsp;</li></ul><p>ส่วนต่อขยายพัฒนาเพิ่มเติม</p><ul><li>Content ควรมีตัวอย่าง Teaser เพื่อดึงดูดความสนใจให้ลูกค้ากดรับเพื่อเข้าชมภาพยนตร์เต็มเรื่อง &nbsp;</li><li>ให้ศึกษาการชำระค่าบริการ Streaming Server แก่ True โดย True Visions ชำระค่าบริการเกินค่ามาตรฐานตลาดหรือไม่</li></ul></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'><p>สร้าง TVS NOW application รองรับการให้บริการแบบ Streaming service และ TVS connect</p><ul><li>World Class OTT Platform</li><li>Home of Streaming App Partners</li><li>Platform for International Growth</li></ul></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'>
                                            <p>Latest Update - 15 Aug 2024</p><ul><li>July : WeTV is now available</li><li>July : Prime package is now available</li><li>Charge to TMH, TOL bill is now scheduled to be ready in October</li><li>VIU is now on Hold and shift priority to HBO MAX</li><li>HBO Max will be available in November</li><li>Free Offering TVSNOW pack to mirror TVS Rental will be available in October&nbsp;</li><li>Register New feature &quot;Content ควรมีตัวอย่าง Teaser เพื่อดึงดูดความสนใจให้ลูกค้ากดรับเพื่อเข้าชมภาพยนตร์เต็มเรื่อง&quot; to backlog plan for next year 2025</li></ul><p>ให้ศึกษาการชำระค่าบริการ Streaming Server แก่ True โดย True Visions ชำระค่าบริการเกินค่ามาตรฐานตลาดหรือไม่</p><ul><li>จากการศึกษาตลาดผู้ใหบริการ Streaming Platform ระดับ Global ได้แก่ Amazon Web Service, Google Cloud และ Akamai ทั้ง 3 เจ้า มี Business Model เป็นแบบ Software As A Service กล่าวคือ ไม่มี CAPEX upfront และเป็นเก็บค่าบริการตามการใช้งานจริง ตามปริมาณจำนวนลูกค้าที่เข้ามาใช้บริการ และจำนวนช่องรายการร่วมถึงปริมาณ VOD file ที่เราจะให้บริการ โดยจะมี Model การคิดราคาแบบยิงมีการใช้งานมาก ค่าบริการก็จะถูกลงเป็นแบบขั้นบันได โดยได้ทำการศึกษาวิธีการคิดค่าบริการของ Amazon แบบลงรายละเอียดจะมีค่าบริการประมาณการดังนี้</li><li>จำนวนผู้ใช้ต่อเดือน 30,000 คน คิดราคาต่อหัวที่ THB 79.60</li><li>จำนวนผู้ใช้ต่อเดือน 60,000 คน คิดราคาต่อหัวที่ THB 42.27</li><li>จำนวนผู้ใช้ต่อเดือน 100,000 คน คิดราคาต่อหัวที่ THB31.23</li><li>จำนวนผู้ใช้ต่อเดือน&nbsp;200,000 คน คิดราคาต่อหัวที่ THB19.40</li><li>จำนวนผู้ใช้ต่อเดือน&nbsp;500,000 คน คิดราคาต่อหัวที่ THB13.54</li><li>จำนวนผู้ใช้ต่อเดือน&nbsp;1,000,000 คน คิดราคาต่อหัวที่ THB11.58</li><li>จำนวนผู้ใช้ต่อเดือน&nbsp;2,000,000 คน คิดราคาต่อหัวที่ THB3.80</li></ul><p>=== Archived ===</p><ol><li>Global players study&nbsp;</li><li>Explore OTT solution provider&nbsp;</li><li>Discuss with first solution provider Mirada from Spain</li><li>Explore more solution provider as alternative and compare the price</li><li>Estimate project investment and development options&nbsp;</li><li>Final short list of solution providers: Setplex, Mirada&nbsp;&nbsp;</li><li>Live demo from both providers&nbsp;</li><li>RFP sent to both providers&nbsp;</li><li>Q&amp;A with both providers&nbsp;</li><li>Solution Partners evaluation&nbsp;</li><li>The winner from evaluation is Setplex winning</li><li>Technical Deep Dive with Solution Provider&nbsp;&nbsp;</li><li>Proof of concept with Solution Provider&nbsp;</li><li>Procurement Process and Negotiation&nbsp;</li><li>Financial Feasibility with Financial Team&nbsp;</li><li>Internal Team Workshop to work on business model&nbsp;</li><li>Preparing New App Requirements&nbsp;</li><li>Start discussed with Payment partners (True, TrueMoney, 2C2P)&nbsp;</li><li>Budget approval signed by chairman, k.SK&nbsp;</li><li>Direction aligned with k.SC&nbsp;</li><li>Recruiting 7 additional man power to help operate new platform&nbsp;</li><li>Finalize scope of MVP phase to launch App in Q2&nbsp;</li><li>Finalize UX/UI Design for MVP phase&nbsp;</li><li>New TVS package design is on progress<strong>&nbsp;</strong></li><li>Start set-up infrastructure&nbsp;</li><li>Planning with TrueID to do integration&nbsp;</li><li>Working with Procurment to release PO to vendor&nbsp;</li><li>Working with Legal to complete Contract with vendor&nbsp;</li><li>HR Start offering the candidates&nbsp;</li><li>Fund Code is no ready&nbsp;</li><li>Designing Content Integestion&nbsp;</li><li>Working with Payment Gateway and TrueMoney for payment options&nbsp;</li><li>First payment will be issue to vendor in March 2024 for Setup fee (3M baht)&nbsp;</li><li>SAAS payment will be issue each month start in April 2024 based on number of subscribers&nbsp;</li></ol><p>As of Feb 2024</p><ul><li>Company : Panther but need to change the name</li><li>Legal &amp; Contract : In progress&nbsp;</li><li>App Register : In Progress</li><li>New 3 team members joined : Senior Product Manager, Customer Experience, Product Analytic<br />* 3 headcount remain : In interview process.</li><li>OTT Platform infrastructure : DONE&nbsp;</li><li>OTT Platform Deployment : DONE</li><li>Package Design : DONE</li><li>Package Setup : In progress</li><li>App Development : In Progress</li><li>Payment Integration : In Progress</li><li>TrueID integration&nbsp;<ul><li>Login : DONE</li><li>Streaming : DONE</li><li>DRM : DONE</li><li>Profile : In Progress</li><li>Content Ingestion : In progress</li></ul></li></ul><p>As of Mar 2024</p><ul><li>Company : Brite Now</li><li>Legal &amp; Contract : In progress&nbsp;</li><li>App Register : In Progress</li><li>New 3 team members joined : Senior Product Manager, Customer Experience, Product Analytic, OTT Specialist<ul><li>2 headcount remain : In interview process.</li></ul></li><li>Package Setup : In progress</li><li>Shelf Setup : In progress</li><li>App Development : DONE</li><li>Payment Integration : DONE</li><li>TrueID integration&nbsp;<ul><li>Profile : DONE</li><li>Content Ingestion : DONE</li></ul></li><li>Close Beta Testing : In Progress</li></ul><p>As of Apr 2024</p><ul><li>App Register : DONE</li><li>Legal &amp; Contract : In progress&nbsp;</li><li>Google Play Store Register : In Progress</li><li>Package Setup : In progress</li><li>Shelf Setup : In progress</li><li>TrueID integration&nbsp;<ul><li>Mirror Package : In Progress</li></ul></li><li>Close Beta Testing : In Progress</li><li>App Submission to App Store: Target 12 Apr</li><li>Open Beta Testing : Target 23 Apr</li><li>Commercial Launch : Target 7 May&nbsp;</li></ul><p>&nbsp;</p><p>As of May 2024</p><ul><li>Google Play Store Register : DONE</li><li>Package Setup : DONE</li><li>Shelf Setup : DONE</li><li>TrueID integration&nbsp;<ul><li>Mirror Package : DONE</li></ul></li><li>Close Beta Testing : DONE</li><li>App Submission to App Store: DONE</li><li>Open Beta Testing : DONE</li><li>Commercial Launch : DONE</li><li>Legal &amp; Contract : In Progress</li></ul><p>&nbsp;</p><p>Latest Update - 21 May 2024</p><ul><li>The project is consider as delivered.</li><li>All app released on every platform : App Store, Play Store, Samsung Store, LG Store</li><li>All content have ingested to the system.</li><li>Package : Pop, Plus, EPL add-on are avalilable to purchase.</li><li>Partner App : iQIYI are available.</li><li>All Major / Critical Bugs have been fixed.</li><li>TrueMoney &amp; Credit Card are available for payment method.</li></ul><p>&nbsp;</p><p>&nbsp;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>Create Date : 19 Dec 2022 15:30:38 | Create By : Ongard Prapakamol</div>
                                <div className='project-update-time'>Last Update : 14 May 2023 15:52:56 | Update By : Ongard Prapakamol</div>
                            </div>
                        </div>
                        <div className='project-description-box'>
                            <div className='project-description-menu'>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('overall')}>Overall</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('')}>Action Plan</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('roi')}>ROI</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('attachment')}>Attachment</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('note')}>Note</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('log')}>Log</div>
                            </div>
                            <div className='project-description-detail-box'>
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
