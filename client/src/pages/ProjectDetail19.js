import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ActionPlan from '../components/actionPlan';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ProjectDetail19() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [customPhotos, setCustomPhotos] = useState({});

    useEffect(() => { fetchCustomPhotos().then(setCustomPhotos); }, []);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    const originalRows = [
        {
            id: '1', type: 'Wait for approve', date: 'Wed 15 Feb 2023 20:26:59', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '2', type: 'Update', date: 'Wed 15 Feb 2023 20:31:27', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '3', type: 'Update', date: 'Thu 27 Apr 2023 14:38:25', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '4', type: 'Update', date: 'Tue 16 May 2023 18:20:46', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '5', type: 'Update', date: 'Tue 16 May 2023 18:23:08', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '6', type: 'Update', date: 'Fri 19 May 2023 15:52:25', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '7', type: 'Update', date: 'Fri 19 May 2023 16:31:48', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '8', type: 'Update', date: 'Fri 19 May 2023 23:54:35', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '9', type: 'Update', date: 'Tue 18 Jul 2023 08:53:56', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '10', type: 'Update', date: 'Tue 18 Jul 2023 09:06:25', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '11', type: 'Update', date: 'Tue 18 Jul 2023 14:08:11', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '12', type: 'Update', date: 'Tue 18 Jul 2023 14:09:25', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '13', type: 'Update', date: 'Fri 08 Sep 2023 15:57:41', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '14', type: 'Update', date: 'Thu 05 Oct 2023 08:05:47', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '15', type: 'Update', date: 'Thu 05 Oct 2023 08:06:58', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '16', type: 'Update', date: 'Tue 24 Oct 2023 16:34:28', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '17', type: 'Update', date: 'Thu 16 Nov 2023 10:50:41', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '18', type: 'Update', date: 'Thu 16 Nov 2023 10:52:03', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '19', type: 'Update', date: 'Thu 23 Nov 2023 11:46:41', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '20', type: 'Update', date: 'Wed 29 Nov 2023 13:13:48', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '21', type: 'Update', date: 'Mon 04 Dec 2023 16:18:50', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '22', type: 'Update', date: 'Wed 14 Feb 2024 11:11:34', by: 'Birathon Kasemsri Na Ayudhaya',
        },
        {
            id: '23', type: 'Update', date: 'Wed 14 Feb 2024 11:12:17', by: 'Birathon Kasemsri Na Ayudhaya',
        },
    ];

    const [rows, setRows] = useState(originalRows);

    const tableData = [
        ['2024', '96,580,000'],
    ];

    const tableROI = [
        ['ROI Type', 'Direct Return'],
        ['Year', '2024'],
        ['Target', 'TBD'],
        ['Actual', 'TBD'],
        ['Description', 'Invest by TDG'],
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
                    <div className='project-objective-detail'>2. Sinsinee Na Ranong (Responsibility)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        08/07/2022-31/12/2024
                    </div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : 36,800,000 Baht</div>
                    <div className='project-objective-detail'>Actual :36,800,000 Baht </div>
                    <div className='project-objective-detail'>Investment Detail: Investment approved by Content Investment Committee 36.8m THB</div>
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
        content = <ActionPlan />;
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
                        2024
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        Invest by TDG
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
                            <div className='project-detail-title'>Project : TVS Strategic Partnership - To Scale True Original Content</div>
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
                                        <div className='project-description-detail'><p>Expand Partnership with Original Content Studios &nbsp;e.g. JUVE9(spin off from JSL)&nbsp;</p><p><strong>Current Progress</strong></p><p><strong>-97% Shooting&nbsp;for True Original Series &#39;Homeroom&#39; Target to on-air 15 Nov 2024</strong></p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'><p>To scale quality content production capability for business impact and revenue opportunity from both Thailand and global market</p><p>&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'><p><em><strong>***ON-GOING PROJECT UNDER CPG STRUCTURE***</strong></em></p><p>&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>% Progress : 50 %</div>
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
