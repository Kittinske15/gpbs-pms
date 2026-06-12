import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Log from '../components/log';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from '../components/Sidebar';

export default function ProjectDetail70() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [customPhotos, setCustomPhotos] = useState({});

    useEffect(() => { fetchCustomPhotos().then(setCustomPhotos); }, []);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const originalRows = [
        {
            id: '1', plan: 'Dinner Talk', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '2', plan: 'Talk ka Hoon #1', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '3', plan: 'Talk ka Hoon #2', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '4', plan: 'TNN Wealth Forum', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '5', plan: 'TNN Wealth Forum', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '6', plan: 'TNN Wealth Forum', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
        {
            id: '7', plan: 'TNN Wealth Forum', response: 'Ongard Prapakamol', start: '29 Jan 2024', end: '29 Jan 2024'
        },
    ];

    const [rows, setRows] = useState(originalRows);

    const tableData = [
        ['ROI Type', 'Direct Return'],
        ['Year', '2024'],
        ['Target', '30,000,000 Baht'],
        ['Actual', 'TBD'],
        ['Description', 'Evaluating the success of events and seminars is not just about return on investment; these activities can bring various benefits, like building a positive brand image, engaging with loyal customers and enhancing company s reputation.'],
    ];

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        color: 'black',
    };

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'><p>Require to finish TrueVisions App first to start collecting customer behavior data then we can use AI to start recommend content and service to customers.</p></div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'><p>Use OTT solution provider to be the base platform to shorten timeframe and use it to create Smart TV app, Android TV app, PC web, iOS app and Android app.</p></div>
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
                    <div className='project-objective-detail'>2. Wongwarit Sinliamthong (Accountability)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        01/01/2024-31/12/2024</div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : N/A</div>
                    <div className='project-objective-detail'>Actual : N/A </div>
                    <div className='project-objective-detail'>Investment Detail: To seek solution and direction</div>
                </div>
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
                            {rows.map((row) => (
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
                        Qualitative
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Year
                    </div>
                    <div className='project-roi-detail'>
                        2023
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        พัฒนาระบบข้อมูลพฤติกรรมการรับชมช่องรายการ, รายการ TVS NOW เพื่อรองรับการทำ segmentation, investment channel and contents, advertising etc.
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
        content = <Log />
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
                            <div className='project-detail-title'>Project : TNN Seminar</div>
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
                                        <div className='project-description-detail'><p><strong>&nbsp;Target 12-15 events per year are the following&nbsp;</strong></p><p>1. Dinner Talk,</p><p>2. Talk ka Hoon ( 2 times)</p><p>3. TNN Wealth Forum</p><p>4. TNN Earth Workshop</p><p>5. TNN Health Workshop</p><p>6. TNN Birthday</p><p>7. Seminar content pillar, TNN Tech</p><p>8. Seminar content pillar, TNN Health</p><p>9. Exclusive trips aboard,&nbsp; China, Japan, Korea ( 3 countries)&nbsp;</p><p>10. Oneday trip local&nbsp;</p><p>11. CounDown NewYear&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'><p>To generate&nbsp;revenue from Seminars, Events and Marketing activities&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'><p>Jan: Dinner talk completed 6.5M ( booking sponsorship)&nbsp;</p><p>Feb:&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>% Progress : 15 %</div>
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
