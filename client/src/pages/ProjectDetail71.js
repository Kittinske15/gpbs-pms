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

export default function ProjectDetail71() {
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
        ['Target', '1,000,000 Baht'],
        ['Actual', 'TBD'],
        ['Description', 'Number of transactions'],
    ];

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        color: 'black'
    };

    const actionPlanTable = [
        {
            actionPlan: 'Availability of events in the market',
            responsibility: 'Attaphon Na Bangxang',
            startDate: '01 Feb 2024',
            endDate: '30 Apr 2024',
            status: (
                <div className="ball-container">
                    <div className="ball-success" />
                </div>
            ),
        },
        {
            actionPlan: 'Short list of events',
            responsibility: 'Attaphon Na Bangxang',
            startDate: '18 Mar 2024',
            endDate: '30 Apr 2024',
            status: (
                <div className="ball-container">
                    <div className="ball-success" />
                </div>
            ),
        },
        {
            actionPlan: 'Estimated budget',
            responsibility: 'Attaphon Na Bangxang',
            startDate: '25 Mar 2024',
            endDate: '30 Apr 2024',
            status: (
                <div className="ball-container">
                    <div className="ball-success" />
                </div>
            ),
        },
        {
            actionPlan: 'budget approval and allocation',
            responsibility: 'Attaphon Na Bangxang',
            startDate: '01 Apr 2024',
            endDate: '30 Apr 2024',
            status: (
                <div className="ball-container">
                    <div className="ball-processing" />
                </div>
            ),
        },
        {
            actionPlan: 'Negotiation / contract / payment',
            responsibility: 'Attaphon Na Bangxang',
            startDate: '01 May 2024',
            endDate: '30 Apr 2024',
            status: (
                <div className="ball-container">
                    <div className="ball-processing" />
                </div>
            ),
        },
    ]

    const originalRows = [
        {
            id: '1', type: 'Wait for approve', date: 'Fri 16 Feb 2024 20:20:54', by: 'Ongard Prapakamol'
        },
        {
            id: '2', type: 'Update Project Action plan', date: 'Fri 16 Feb 2024 20:22:34', by: 'Ongard Prapakamol'
        },
        {
            id: '3', type: 'Update', date: 'Fri 16 Feb 2024 20:26:32', by: 'Ongard Prapakamol'
        },
        {
            id: '4', type: 'Update', date: 'Fri 16 Feb 2024 20:30:40', by: 'Ongard Prapakamol'
        },
        {
            id: '5', type: 'Update', date: 'Wed 06 Mar 2024 23:41:59', by: 'Ongard Prapakamol'
        },
        {
            id: '6', type: 'Update Project Action plan', date: 'Wed 06 Mar 2024 23:45:40', by: 'Ongard Prapakamol'
        },
        {
            id: '7', type: 'Update', date: 'Thu 28 Mar 2024 18:30:12', by: 'Ongard Prapakamol'
        },
        {
            id: '8', type: 'Update', date: 'Thu 28 Mar 2024 18:30:59', by: 'Ongard Prapakamol'
        },
        {
            id: '9', type: 'Update', date: 'Wed 03 Apr 2024 22:45:51', by: 'Ongard Prapakamol'
        },
        {
            id: '10', type: 'Update', date: 'Thu 04 Apr 2024 13:51:49', by: 'Ongard Prapakamol'
        },
    ];

    const [rows, setRows] = useState(originalRows);

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'><p>To find the rights owner of live sports&nbsp; events&nbsp;<br /><br />The subscriber count must be adequate to provide flexibility and ensure coverage of the return on investment.</p><p>The distributors can&#39;t separate sell boxing matches fight by fight.&nbsp;</p></div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'><p>Keep searching live sports&nbsp; for PPV business&nbsp;</p><p>Keep an eye on the report for subscriber base in TVS NOW updates.</p><p>Learning PPV business from overseas.</p><p>Working closely with the Develop team to prepare the PPV function on the TVS NOW app&nbsp;</p><p>We are looking and discussing to acquire the boxing rights match by match.&nbsp;</p></div>
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
                    <div className='project-objective-detail'>2. Nantanee Wongumnitkul (Responsibility)</div>
                    <div className='project-objective-detail'>3. Attaphon Na Bangxang (Responsibility)</div>
                    <div className='project-objective-detail'>4. Soothi Na-Ranong (Supporting)</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        01/04/2024-31/05/2025
                    </div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Target : N/A</div>
                    <div className='project-objective-detail'>Actual : N/A </div>
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
        content = <TableContainer>
            <Table className="action-plan-table" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell align="center">Action Plan</TableCell>
                        <TableCell align="center">Responsibility</TableCell>
                        <TableCell align="center">Start Date</TableCell>
                        <TableCell align="center">End Date</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {actionPlanTable.map((member, index) => (
                        <TableRow key={member.id}>
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="center">{member.actionPlan}</TableCell>
                            <TableCell align="center">{member.responsibility}</TableCell>
                            <TableCell align="center">{member.startDate}</TableCell>
                            <TableCell align="center">{member.endDate}</TableCell>
                            <TableCell align="center">{member.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>;
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
                        1,000,000 Baht
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
                        Number of transactions
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
                            <div className='project-detail-title'>Project : PPV on TVS NOW</div>
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
                                            <p>
                                                Secure exclusive LIVE events for PPV window
                                            </p>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'>
                                            <p>
                                                Maintain King of sports leadership
                                            </p>
                                            <p>
                                                Opportunity to generate more revenue
                                            </p>
                                            <p>
                                                Drive E-Sports to new content in Pay Per View
                                            </p>
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'><p>Gathering what is available in the market</p><p>List of potential events</p><p>Proposal</p><p>Find the right content to fit the sports pay-per-view package (boxing is a good&nbsp;choice)</p><p>Forecast revenue to cover the cost with a pay-per-view&nbsp;package.</p><p>Revenue 1m baht under subject to lunching and subscribers number in the app.<br /><br />E-Sports didn&#39;t match with the PPV model because more E-Sport content is free to watch on YouTube example: The MSI 2024 event, streamed live from Chengdu, garnered 1.7 million views on YouTube, not including views from other rounds. This popularity is why distributors prefer to stream on YouTube, as they generate more revenue from the online platform.</p><p>Next action: Keep track&nbsp;and evaluate the number of users to see if there are sufficient numbers to conduct business.<br /><br />Next action: Estimating the minimum subscription target for boxing enthusiasts.</p><p>&nbsp;</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>% Progress : 56 %</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>Create Date : 16 Feb 2024 20:20:54 | Create By : K. Ongard Prapakamol</div>
                                <div className='project-update-time'>Last Update : 28 Feb 2025 09:28:35 | Update By : K. Ongard Prapakamol</div>
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
