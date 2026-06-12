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

export default function ProjectDetail73() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [customPhotos, setCustomPhotos] = useState({});

    useEffect(() => { fetchCustomPhotos().then(setCustomPhotos); }, []);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const tableData = [
        ['ROI Type', 'Direct Return'],
        ['Year', '2024'],
        ['Target', 'TBD'],
        ['Actual', 'TBD'],
        ['Description', 'TVR 0.500% + Online 5M views'],
    ];

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        color: 'black'
    };

    const originalRows = [
        {
            id: '1', type: 'Wait for approve', date: 'Fri 16 Feb 2024 20:45:31', by: 'Ongard Prapakamol'
        },
        {
            id: '2', type: 'Update', date: 'Fri 16 Feb 2024 20:57:49', by: 'Ongard Prapakamol'
        },
    ];

    const actionPlan = [
        {
            id: '1', plan: 'วางแผนดำเนินงานและงบประมาณกับผู้ผลิต', response: 'Ongard Prapakamol', start: '01 Feb 2024', end: '29 Feb 2024'
        },
        {
            id: '2', plan: 'ทำสัญญากับผู้ผลิต', response: 'Ongard Prapakamol', start: '01 Feb 2024', end: '31 Mar 2024'
        },
        {
            id: '3', plan: 'วางแผนขายสปอนเซอร์ และจัดทำแพคเกจเสนอลูกค้า', response: 'Ongard Prapakamol', start: '01 Feb 2024', end: '30 Apr 2024'
        },
        {
            id: '4', plan: 'เตรียมงานผลิต บทภาพยนตร์ นักแสดง สถานที่ ทีมงาน และงานโฆษณาสินค้า', response: 'Ongard Prapakamol', start: '01 Feb 2024', end: '30 Apr 2024'
        },
        {
            id: '5', plan: 'การถ่ายทำภาพยนตร์', response: 'Ongard Prapakamol', start: '01 May 2024', end: '31 Jul 2024'
        },
        {
            id: '6', plan: 'เตรียมงานหลังการถ่ายทำ ตัดต่อ บันทึกเสียง เทคนิคพิเศษ', response: 'Ongard Prapakamol', start: '01 May 2024', end: '31 Jul 2024'
        },
        {
            id: '7', plan: 'เตรียมงานโปรโมทภาพยนตร์', response: 'Ongard Prapakamol', start: '01 Aug 2024', end: '30 Sep 2024'
        },
        {
            id: '8', plan: 'เตรียมงานออกอากาศภาพยนตร์ทั้งทีวีและออนไลน์', response: 'Ongard Prapakamol', start: '01 Aug 2024', end: '30 Sep 2024'
        },
    ];

    const [rows, setRows] = useState(originalRows);
    const [rowsAction, setRowsAction] = useState(actionPlan);

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'><p>-</p></div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'><p>
                    -</p></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Prioritization</div>
                    <div className='project-objective-detail'>Possibility : High</div>
                    <div className='project-objective-detail'>Impact : Low</div>

                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Team Member</div>
                    <div className='project-objective-detail'>1. Ongard Prapakamol (Project Owner - Accountability)</div>
                    <div className='project-objective-detail'>2. Attaphon Na Bangxang (Responsibility)</div>
                    <div className='project-objective-detail'>3. Teeradech Pornkawinthip (Accountability)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        01/04/2024-31/12/2024
                    </div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : 7,500,000 Baht</div>
                    <div className='project-objective-detail'>Actual : N/A </div>
                    <div className='project-objective-detail'>Investment Detail: ค่าจ้างผลิตหนัง 5 เรื่อง</div>
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
            <Paper>
                <TableContainer>
                    <Table className="project-table" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell align="center">Action Plan</TableCell>
                                <TableCell align="center">Responsibility</TableCell>
                                <TableCell align="center">Start Date</TableCell>
                                <TableCell align="center">End Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsAction.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center">{row.plan}</TableCell>
                                    <TableCell align="center">{row.response}</TableCell>
                                    <TableCell align="center">{row.start}</TableCell>
                                    <TableCell align="center">{row.end}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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
                        100,000,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Actual
                    </div>
                    <div className='project-roi-detail'>
                        N/A
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        subscription fees
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
                            <div className='project-detail-title'>Project : T4U Original Content</div>
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
                                            <ul><li>โครงการสร้างหนังไทยสำหรับออกอากาศทางทีวี และออนไลน์&nbsp;จำนวน&nbsp;5 เรื่อง</li><li>รูปแบบภาพยนตร์โทรทัศน์ แนวตลกล้อเลียน มีความแตกต่างจากหนังอื่นๆ ในตลาดที่มีอยู่ในปัจจุบัน</li><li>แสดงและกำกับโดยเหล่าศิลปินตลกชั้นนำของเมืองไทย อาทิ นุ้ย เชิญยิ้ม, บอล เชิญยิ้ม เป็นต้น</li><li>ผลิตโดยบริษัท ไรท์ บียอนด์ จำกัด ผู้ดำเนินธุรกิจภาพยนตร์ในเมืองไทยกว่า 20 ปี</li></ul>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'>
                                            <ul><li>เพื่อสร้างเรตติ้งให้กับช่อง</li><li>ขยายฐานผู้ชมให้ครอบคลุมทั้งออนแอร์และออนไลน์</li><li>สร้างโอกาสในการหารายได้จากทางช่องใหม่ๆ</li></ul>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'><ol><li>วางแผนการผลิตและงบประมาณกับผู้ผลิต</li><li>พัฒนาบทภาพยนตร์ วางตัวนักแสดงหลัก กำหนดสถานที่ถ่ายทำ</li><li>จัดหาอินฟลูเอนเซอร์มารับเชิญในภาพยนตร์เพื่องานโปรโมทและเพิ่มมูลค่าแพคเกจสปอนเซอร์</li></ol></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>% Progress : 10 %</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>Create Date : 16 Feb 2024 20:45:31 | Create By : K. Ongard Prapakamol</div>
                                <div className='project-update-time'>Last Update : 16 Feb 2024 20:57:49 | Update By : K. Ongard Prapakamol</div>
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
