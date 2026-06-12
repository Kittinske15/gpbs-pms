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

export default function ProjectDetail78() {
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
        ['Target', '660,520,000 Baht'],
        ['Actual', '192,300,000 Baht'],
        ['Description', 'Benchmarking profitability with industry standard. Not include Online Station actual revenue due to data accessibility'],
    ];

    const tableData = [
        ['2024', '660,520,000'],
    ];

    const actionPlanData = [
        [
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
                <div className='project-description-detail'>% Progress : 50 %</div>
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
                    <div className='project-objective-detail'>Impact : High</div>

                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Team Member</div>
                    <div className='project-objective-detail'>1. Birathon Kasemsri Na Ayudhaya (Project Owner - Accountability)</div>
                    <div className='project-objective-detail'>2. Napat Silaphan (Responsibility)</div>
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
                    <div className='project-objective-detail'>Target : N/A</div>
                    <div className='project-objective-detail'>Actual : N/A</div>
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
                {/* <table style={{ borderCollapse: 'collapse', width: '100%' }}>
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
                </table> */}
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
                        660,520,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Actual
                    </div>
                    <div className='project-roi-detail'>
                        192,300,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        Benchmarking profitability with industry standard. Not include Online Station actual revenue due to data accessibility
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
                            <div className='project-detail-title'>Project : Digital Content Business</div>
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
                                <img className='project-owner-img' src={getMemberPhotoUrl("101", customPhotos)} onError={(e) => handlePhotoError(e, "101")} />
                                <div className='project-owner-name'>
                                    Birathon Kasemsri Na Ayudhaya
                                </div>
                                <div className='project-owner-detail-box'>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Description</div>
                                        <div className='project-description-detail'>
                                            <p>Digital IP business</p>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'>
                                            <p>1. To adapt &amp; develop own IP based on digital format to consistently grow revenue &amp; profit in TH &amp; globally.<br /><br />2.&nbsp;To leverage IPs to lead internal platforms &amp; apply omnichannel to monetize fully.</p>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'>
                                            <p>1. <strong>The Lemon Shot</strong> : TikTok content &amp; social commerce<br /><br />2.&nbsp;<strong>Online Station</strong> : No.1 YouTube MCN in Thailand Partnership/ Strategic Investment in<br /><br />3.&nbsp;<strong>Bent Pixel</strong> : YouTube MCN network from US, to accelerate YouTube ads revenue &amp; international expansion<br /><br />Net Profit : -4.05&nbsp;MB. (Target 40.1&nbsp;MB.)<br />*Remarks&nbsp;: Online Staion&nbsp;loss, The Lemon Shot&#39;s significant MCN deals will&nbsp;reflect on financial performance in Q4</p>                                        </div>
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
