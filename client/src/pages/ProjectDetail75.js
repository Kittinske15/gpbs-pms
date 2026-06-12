import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import ActionPlan from '../components/actionPlan';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from '../components/Sidebar';

export default function ProjectDetail75() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [customPhotos, setCustomPhotos] = useState({});

    useEffect(() => { fetchCustomPhotos().then(setCustomPhotos); }, []);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const originalRows = [
        {
            id: '1', type: 'Update', date: 'Tue 20 Feb 2024 21:16:09', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '2', type: 'Update', date: 'Tue 20 Feb 2024 21:16:45', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '3', type: 'Update', date: 'Tue 20 Feb 2024 21:17:41', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '4', type: 'Update', date: 'Tue 20 Feb 2024 21:18:34', by: 'Birathon Kasemsri Na Ayudhaya',
        },
    ];

    const [rows, setRows] = useState(originalRows);

    const roiTable = [
        ['KPI Type', 'Quantitative'],
        ['ROI Type', 'Direct Return'],
        ['Year', '2024'],
        ['Target', '2,600,000 Baht'],
        ['Actual', '2,260,000 Baht'],
        ['Description', 'True4U'],
    ];

    const tableData = [
        ['2024', '2,600,000'],
    ];

    const actionPlanData = [
        [
            '1.',
            'One Day Trip ครั้งที่ 1 จังหวัดเพชรบุรี',
            'Juthamas Yorkhan',
            '01 Feb 2024',
            '20 Mar 2024',
            <div className="ball-container">
                <div className="ball-success" />
            </div>
        ],
        [
            '2.'
            , 'Mini Workshop ครั้งที่ 1 ถ่ายภาพจากมือถือ',
            'Juthamas Yorkhan',
            '01 Apr 2024',
            '23 May 2024',
            <div className="ball-container">
                <div className="ball-success" />
            </div>
        ],
        [
            '3.',
             'One Day Trip ครั้งที่ 2 : จ.อยุธยา - วางแผน Concept การจัดทริป - สรุปสถานที่ และ Budget - สรุปรายได้',
            'Juthamas Yorkhan',
            '01 May 2024',
            '08 Aug 2024',
            <div className="ball-container">
                <div className="ball-success" />
            </div>
        ],
        [
            '4.', 
            'Mini Workshop ครั้งที่ 2 : Your Signature Drink สำหรับ Enjoy Home Cafe ด้วยตัวคุณเอง - สรุปสถานที่ และ Budget - สรุปรายได้',
            'Juthamas Yorkhan',
            '01 May 2024',
            '21 Nov 2024	',
            <div className="ball-container">
                <div className="ball-processing" />
            </div>
        ],
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
                <div className='project-description-detail'>% Progress : 75 %</div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'>-</div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'>-</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Prioritization</div>
                    <div className='project-objective-detail'>Possibility : High</div>
                    <div className='project-objective-detail'>Impact : Medium</div>

                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Team Member</div>
                    <div className='project-objective-detail'>1. Ongard Prapakamol (Project Owner - Accountability)</div>
                    <div className='project-objective-detail'>2. Anchana Sinhaseni (Accountability)</div>
                    <div className='project-objective-detail'>3. Juthamas Yorkhan (Accountability)</div>
                    <div className='project-objective-detail'>4. Saichai Kraisrisinsuk (Supporting)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        01/01/2024-31/12/2024
                    </div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : 1,160,000 Baht</div>
                    <div className='project-objective-detail'>Actual : 401,647 Baht </div>
                    <div className='project-objective-detail'>Investment Detail: ค่าดำเนินงานโครงการ</div>
                </div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>ROI</div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <tbody>
                        {roiTable.map((row, rowIndex) => (
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
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Revenue Projection</div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={cellStyle}>Year</th>
                            <th style={cellStyle}>Return (THB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
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
        content =
            <div>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={cellStyle}>No.</th>
                            <th style={cellStyle}>Action Plan</th>
                            <th style={cellStyle}>Responsibility</th>
                            <th style={cellStyle}>Start Date</th>
                            <th style={cellStyle}>End  Date</th>
                            <th style={cellStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actionPlanData.map((row, rowIndex) => (
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
                        Direct Return
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
                        2,600,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Actual
                    </div>
                    <div className='project-roi-detail'>
                        2,260,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        True4U
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
                            <div className='project-detail-title'>Project : True4U Activity&Event</div>
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
                                        <div className='project-description-detail'>
                                            <p>ในปี&nbsp;2024 ทางช่อง True4U จะจัดกิจกรรมเพื่อเป็นการสร้างรายได้และรักษาฐานผู้ชมช่อง True4U ในการมีส่วนร่วมในกิจกรรมต่างๆจากทางช่อง โดยจะจัดกิจกรรมไตรมาสละ 1 ครั้ง รวมทั้งหมด 4 ครั้ง&nbsp;ประกอบด้วย</p><ul><li>One Day Trip จำนวน 2 ครั้ง</li><li>Mini Workshop จำนวน 2 ครั้ง</li></ul>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'>
                                            <ul><li>หาช่องทางในการเพิ่มรายได้ให้กับทางช่อง True4U นอกเหนือจากการขายโฆษณา</li><li>เป็นการสร้างโอกาสในการรักษาฐานผู้ชมสำหรับช่อง True4U ผ่านกิจกรรมต่างๆในปี 2024</li></ul>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'>
                                            <p><strong>#1 One Day Trip&nbsp;วันที่ 20 มีนาคม 2567</strong></p><p>- ได้จัดกิจกรรม One Day Trip ครั้งที่ 1 ที่จังหวัดเพชรบุรี เรียบร้อย</p><p>- Revenue 600,000 Baht Cost 130,000 Baht&nbsp;Net Profit 470,000 Baht&nbsp;&nbsp;= 78%</p><p>&nbsp;</p><p><strong>#2 Mini Workshop&nbsp;&nbsp;วันพฤหัสบดีที่ 23 พฤษภาคม 2567</strong></p><p><strong>Enjoy with Photo ... เคล็ดลับถ่ายภาพ(สวย)ด้วยมือถือ</strong></p><p>รายได้จาก ทั้งหมด 960,000 บาท&nbsp; (แบ่งเป็น 3rd party 660,000 บาท และ True 300,000 บาท)</p><p><strong>Revenue 660,000 Baht Cost 120,237&nbsp;Baht&nbsp;Net Profit 539,763&nbsp;Baht&nbsp;&nbsp;= 81.78%&nbsp;</strong></p><p>&nbsp;</p><p><strong>#3 One Day Trip วันที่ 3 สิงหาคม 2567</strong></p><p><strong>Happy Mom Happy Me</strong></p><p>รายได้จาก ทั้งหมด 1,300,000 บาท&nbsp; (แบ่งเป็น 3rd party 1,000,000 บาท และ True 300,000 บาท)</p><p><strong>Revenue 1,000,000 Baht Cost 151,410 Baht&nbsp;Net Profit 848,590&nbsp;Baht&nbsp;&nbsp;= 84.85%&nbsp;</strong></p><p>&nbsp;</p><p><strong>#4&nbsp; One Day Trip&nbsp;</strong>(Tentative Oct.24 Revenue Forecast 600,000 บาท Cost 130,000 บาท Profit 470,000 บาท = 78%)</p><p>One Day Trip Bangsan</p><p>&nbsp;</p><p>หมด 4 กิจกรรม&nbsp;</p><p>- ประมาณการรายได้ 2.6 MB&nbsp;</p><p>- ประมาณค่าใช้จ่าย 0.54&nbsp;MB</p><p>- กำไร 2.06&nbsp;MB คิดเป็น&nbsp; 80%</p><p>&nbsp;</p><p>Synergy Project</p><p>1. True4U x Lemon Shot / Online Station</p><p>ได้มีการประสานงานขอ List Influencer ที่จะมาร่วม One Day Trip :</p><p>วันเดย์ทริปบางแสน เที่ยวแบบไฉไล งานญี่ปุ่นก็มา ในเดือนตุลาคม 2567</p><p>Action Plan</p><p>&bull; ได้ประสานงานกับทีม&nbsp;Online Station เพื่อขอ List Influencer เพื่อมาร่วมทริปและทำกิจกรรม One Day Trip กับ True4U&nbsp;และได้รับข้อมูลเรียบร้อยแล้ว ในวันที่ 5 สิงหาคม 2567</p><p>&bull; สรุปค่าใช้จ่าย-ต้นทุน และรูปแบบกิจกรรมครั้งนี้ ภายใน 30 สิงหาคม 2567</p><p>&bull; สรุปการขายภายใน 20 กันยายน 2567</p><p>&bull; เริ่มโปรโมทกิจกรรมต้นเดือนตุลาคม 2567</p><p>&nbsp;</p><p>2. True4U x TRUE CJ : Project Thailand Music Countdown</p><p>Action Plan</p><p>&bull; ประสานงานกับทางทีม True CJ เพื่อขอข้อมูลของ Project TMC และได้รับข้อมูลเรียบร้อยแล้ว</p><p>&bull; ข้อจำกัดและเงื่อนไขรวมถึงต้นทุนในการจัดกิจกรรมราคาสูงมาก&nbsp;ทีมอยู่ระหว่างนำเสนอลูกค้าที่มี Potential รวมถึงมี Budget ที่สามารถสนับสนุน Package ได้ เพื่อประเมินความคุ้มค่าในเรื่อง Revenue &amp;&nbsp;Cost ว่าสามารถจัดได้หรือไม่ สรุปภายในเดือน กันยายน 2567 เพื่อจัดกิจกรรมสำหรับปี&nbsp;2568</p><p>&nbsp;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>Create Date : 25 Apr 2022 22:14:25 | Create By : Ongard Prapakamol</div>
                                <div className='project-update-time'>Last Update : 20 Feb 2024 16:12:24 | Update By : Ongard Prapakamol</div>
                            </div>
                        </div>
                        <div className='project-description-box'>
                            <div className='project-description-menu'>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('overall')}>Overall</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('actionPlan')}>Action Plan</div>
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
