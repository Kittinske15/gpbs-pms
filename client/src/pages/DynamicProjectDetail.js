import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser } from '../utils/auth';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';
import ActionPlan from '../components/actionPlan';
import ProjectNote from '../components/ProjectNote';
import ProjectLog from '../components/ProjectLog';
import Sidebar from '../components/Sidebar';

export default function DynamicProjectDetail() {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');
    const [projectData, setProjectData] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [customPhotos, setCustomPhotos] = useState({});
    const [revenueRows, setRevenueRows] = useState([]);
    const [editingRevenue, setEditingRevenue] = useState(false);
    const [draftRevenueRows, setDraftRevenueRows] = useState([]);
    const [savingRevenue, setSavingRevenue] = useState(false);
    const [revenueError, setRevenueError] = useState(null);

    // Get current user
    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    // Fetch project data from API
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true);
                const response = await apiRequest(`/project/${id}`);

                if (!response.ok) {
                    throw new Error(`Project not found (${response.status})`);
                }

                const data = await response.json();
                setProjectData(data);

                // Fetch team members (use singular /project/ to match the project detail endpoint)
                try {
                    const teamResponse = await apiRequest(`/project/${id}/team-members`);
                    console.log('Team members response status:', teamResponse.status);
                    if (teamResponse.ok) {
                        const teamData = await teamResponse.json();
                        console.log('Team members data:', teamData);
                        setTeamMembers(teamData);
                    } else {
                        console.error('Team members fetch failed:', teamResponse.status);
                    }
                } catch (teamErr) {
                    console.error('Error fetching team members:', teamErr);
                }
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProjectData();
        }
    }, [id]);

    // Fetch saved revenue projection rows
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await apiRequest(`/project/${id}/revenue-projection`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data)) {
                    setRevenueRows(data.map(r => ({ year: r.year, returnAmount: Number(r.returnAmount) })));
                }
            } catch (e) {
                console.error('Error fetching revenue projection:', e);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    // Get owner image URL based on emp_id
    const getOwnerImageUrl = () => {
        return getMemberPhotoUrl(projectData?.c_create_by, customPhotos);
    };

    // Get owner name
    const getOwnerName = () => {
        if (currentUser && projectData?.c_create_by === currentUser.c_emp_id) {
            return `${currentUser.c_name} ${currentUser.c_lastname}`;
        }
        return projectData?.owner_name || projectData?.c_leader_name || 'Project Owner';
    };

    const cellStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        color: 'black'
    };

    // Loading state
    if (loading) {
        return (
            <div className="App">
                <Sidebar onToggle={setSidebarOpen} />
                <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                    <div className='header_container'>
                        <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                    </div>
                    <div className="body_container">
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h2>Loading project details...</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="App">
                <Sidebar onToggle={setSidebarOpen} />
                <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                    <div className='header_container'>
                        <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                    </div>
                    <div className="body_container">
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h2>Error loading project</h2>
                            <p>{error}</p>
                            <button onClick={() => navigate('/project')}>Back to Projects</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Format number with commas
    const formatNumber = (num) => {
        if (!num) return '-';
        return Number(num).toLocaleString();
    };

    // Format date consistently as "DD Mon YYYY"
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Helper function to render HTML content safely
    const renderHtmlContent = (htmlContent) => {
        if (!htmlContent || htmlContent === '-') return '-';
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    // Helper function to map KPI type from number to text
    const getKpiTypeText = (kpiType) => {
        if (kpiType === 1 || kpiType === '1' || kpiType === 'quantitative') {
            return 'Quantitative';
        } else if (kpiType === 2 || kpiType === '2' || kpiType === 'qualitative') {
            return 'Qualitative';
        }
        return kpiType || '-';
    };

    // Helper function to get team member role text
    const getRoleText = (role) => {
        const roleLower = (role || '').toLowerCase();
        switch (roleLower) {
            case 'owner':
                return 'Project Owner - Accountability';
            case 'accountability':
                return 'Accountability';
            case 'responsibility':
                return 'Responsibility';
            case 'supporting':
                return 'Supporting';
            default:
                return role || 'Team Member';
        }
    };

    // Helper function to get member display name
    const getMemberDisplayName = (member) => {
        // If c_lastname exists and is not empty, combine c_name + c_lastname (for owner)
        // Otherwise, c_name already contains the full name (for team members)
        if (member.c_lastname && member.c_lastname.trim() !== '') {
            return `${member.c_name} ${member.c_lastname}`;
        }
        return member.c_name || 'Unknown';
    };

    // Revenue Projection table data — prefer saved rows, else derive from ROI fields
    const generateRevenueProjection = () => {
        if (revenueRows.length > 0) {
            return revenueRows.map(r => [String(r.year), formatNumber(r.returnAmount)]);
        }

        const roiYear = projectData?.c_roi_year ? parseInt(projectData.c_roi_year) : null;
        const roiTarget = projectData?.c_roi_tgt ? Number(projectData.c_roi_tgt) : null;
        const startDate = projectData?.c_project_start ? new Date(projectData.c_project_start) : null;
        const endDate = projectData?.c_project_finish ? new Date(projectData.c_project_finish) : null;

        if (!roiYear || !roiTarget) {
            return [['-', '-']];
        }

        // If project spans multiple years, generate a row for each year
        if (startDate && endDate) {
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            if (endYear > startYear) {
                const rows = [];
                for (let year = startYear; year <= endYear; year++) {
                    rows.push([year.toString(), formatNumber(roiTarget)]);
                }
                return rows;
            }
        }

        return [[roiYear.toString(), formatNumber(roiTarget)]];
    };
    const tableData = generateRevenueProjection();

    // Seed the edit draft from either saved rows or the derived fallback
    const seedDraftRows = () => {
        if (revenueRows.length > 0) {
            return revenueRows.map(r => ({ year: String(r.year), returnAmount: String(r.returnAmount) }));
        }
        const roiYear = projectData?.c_roi_year ? parseInt(projectData.c_roi_year) : null;
        const roiTarget = projectData?.c_roi_tgt != null ? Number(projectData.c_roi_tgt) : null;
        const startDate = projectData?.c_project_start ? new Date(projectData.c_project_start) : null;
        const endDate = projectData?.c_project_finish ? new Date(projectData.c_project_finish) : null;

        if (startDate && endDate) {
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            if (endYear > startYear) {
                const rows = [];
                for (let year = startYear; year <= endYear; year++) {
                    rows.push({ year: String(year), returnAmount: roiTarget != null ? String(roiTarget) : '' });
                }
                return rows;
            }
        }
        if (roiYear) {
            return [{ year: String(roiYear), returnAmount: roiTarget != null ? String(roiTarget) : '' }];
        }
        return [{ year: String(new Date().getFullYear()), returnAmount: '' }];
    };

    const startEditRevenue = () => {
        setRevenueError(null);
        setDraftRevenueRows(seedDraftRows());
        setEditingRevenue(true);
    };

    const cancelEditRevenue = () => {
        setEditingRevenue(false);
        setRevenueError(null);
        setDraftRevenueRows([]);
    };

    const updateDraftRow = (index, field, value) => {
        setDraftRevenueRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    };

    const removeDraftRow = (index) => {
        setDraftRevenueRows(prev => prev.filter((_, i) => i !== index));
    };

    const addDraftRow = () => {
        setDraftRevenueRows(prev => {
            const existingYears = prev.map(r => parseInt(r.year, 10)).filter(y => Number.isInteger(y));
            const nextYear = existingYears.length ? Math.max(...existingYears) + 1 : new Date().getFullYear();
            return [...prev, { year: String(nextYear), returnAmount: '' }];
        });
    };

    const saveRevenueProjection = async () => {
        setRevenueError(null);

        const payload = [];
        const seen = new Set();
        for (const row of draftRevenueRows) {
            const year = parseInt(row.year, 10);
            const amount = Number(String(row.returnAmount).replace(/,/g, ''));
            if (!Number.isInteger(year) || year < 1900 || year > 9999) {
                setRevenueError('Every row needs a valid year (e.g. 2026).');
                return;
            }
            if (!Number.isFinite(amount) || amount < 0) {
                setRevenueError(`Enter a non-negative return for year ${year}.`);
                return;
            }
            if (seen.has(year)) {
                setRevenueError(`Year ${year} appears more than once.`);
                return;
            }
            seen.add(year);
            payload.push({ year, returnAmount: amount });
        }

        try {
            setSavingRevenue(true);
            const res = await apiRequest(`/project/${id}/revenue-projection`, {
                method: 'PUT',
                body: JSON.stringify({ rows: payload }),
            });
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody.error || `Save failed (${res.status})`);
            }
            setRevenueRows(payload.sort((a, b) => a.year - b.year));
            setEditingRevenue(false);
            setDraftRevenueRows([]);
        } catch (e) {
            setRevenueError(e.message || 'Failed to save.');
        } finally {
            setSavingRevenue(false);
        }
    };

    // ROI table data from database
    const tableROI = [
        ['KPI Type', getKpiTypeText(projectData?.c_roi_kpi_type)],
        ['ROI Type', projectData?.c_roi_type || '-'],
        ['Year', projectData?.c_roi_year || '-'],
        ['ROI Target', projectData?.c_roi_tgt ? `${formatNumber(projectData.c_roi_tgt)} Baht` : '-'],
        ['ROI Actual', projectData?.c_roi_act ? `${formatNumber(projectData.c_roi_act)} Baht` : '-'],
        ['Description', renderHtmlContent(projectData?.c_roi_description)],
    ];

    // Check if current user is the project owner
    const isOwner = currentUser?.c_emp_id === projectData?.c_create_by || String(currentUser?.c_emp_id) === String(projectData?.c_create_by);

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'>{renderHtmlContent(projectData?.c_obstruction)}</div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'>{renderHtmlContent(projectData?.c_solution)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Prioritization</div>
                    <div className='project-objective-detail'>Possibility : {projectData?.c_possibility || 'High'}</div>
                    <div className='project-objective-detail'>Impact : {projectData?.c_impact || 'High'}</div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Team Member</div>
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <div key={member.c_emp_id || index} className='project-objective-detail'>
                                {index + 1}. {getMemberDisplayName(member)} ({getRoleText(member.role)})
                            </div>
                        ))
                    ) : (
                        <div className='project-objective-detail'>1. {projectData?.c_leader_name || projectData?.full_owner_name || 'Project Owner'} (Project Owner - Accountability)</div>
                    )}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Period</div>
                    <div className='project-objective-detail'>
                        {formatDate(projectData?.c_project_start)} - {formatDate(projectData?.c_project_finish)}
                    </div>
                </div>
                <div className='detail-box' style={{ marginBottom: '20px' }}>
                    <div className='project-objective'>Project Investment</div>
                    <div className='project-objective-detail'>Budget : {projectData?.c_budget ? formatNumber(projectData.c_budget) : '-'} Baht</div>
                    <div className='project-objective-detail'>Actual : {projectData?.c_budget_act ? formatNumber(projectData.c_budget_act) : '-'} Baht</div>
                    <div className='project-objective-detail'>Detail: {renderHtmlContent(projectData?.c_budget_detail)}</div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div className='project-objective' style={{ marginBottom: 0 }}>Revenue Projection</div>
                        {isOwner && !editingRevenue && (
                            <button
                                type="button"
                                onClick={startEditRevenue}
                                style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                Edit
                            </button>
                        )}
                        {isOwner && editingRevenue && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    type="button"
                                    onClick={cancelEditRevenue}
                                    disabled={savingRevenue}
                                    style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveRevenueProjection}
                                    disabled={savingRevenue}
                                    style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    {savingRevenue ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                    {editingRevenue ? (
                        <>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={cellStyle}>Year</th>
                                        <th style={cellStyle}>Return (THB)</th>
                                        <th style={{ ...cellStyle, width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {draftRevenueRows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td style={cellStyle}>
                                                <input
                                                    type="number"
                                                    value={row.year}
                                                    onChange={(e) => updateDraftRow(rowIndex, 'year', e.target.value)}
                                                    style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', color: 'black' }}
                                                />
                                            </td>
                                            <td style={cellStyle}>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.returnAmount}
                                                    onChange={(e) => updateDraftRow(rowIndex, 'returnAmount', e.target.value)}
                                                    style={{ width: '100%', textAlign: 'center', border: 'none', background: 'transparent', color: 'black' }}
                                                />
                                            </td>
                                            <td style={{ ...cellStyle, width: '40px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDraftRow(rowIndex)}
                                                    title="Remove row"
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#b91c1c', fontWeight: 'bold' }}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={addDraftRow}
                                    style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    + Add Year
                                </button>
                                {revenueError && (
                                    <span style={{ color: '#b91c1c', fontSize: '12px' }}>{revenueError}</span>
                                )}
                            </div>
                        </>
                    ) : (
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
                    )}
                </div>
            </div>
        </>;
    } else if (selectedMenuItem === 'actionPlan') {
        content = <ActionPlan projectId={id} isOwner={isOwner} />;
    } else if (selectedMenuItem === 'roi') {
        content = (
            <div className='roi-flex'>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>KPI Type</div>
                    <div className='project-roi-detail'>{getKpiTypeText(projectData?.c_roi_kpi_type)}</div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>ROI Type</div>
                    <div className='project-roi-detail'>{projectData?.c_roi_type || '-'}</div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>Year</div>
                    <div className='project-roi-detail'>{projectData?.c_roi_year || '-'}</div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>ROI Target</div>
                    <div className='project-roi-detail'>{projectData?.c_roi_tgt ? `${formatNumber(projectData.c_roi_tgt)} Baht` : '-'}</div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>ROI Actual</div>
                    <div className='project-roi-detail'>{projectData?.c_roi_act ? `${formatNumber(projectData.c_roi_act)} Baht` : '-'}</div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>Description</div>
                    <div className='project-roi-detail'>{renderHtmlContent(projectData?.c_roi_description)}</div>
                </div>
            </div>
        );
    } else if (selectedMenuItem === 'attachment') {
        content = (
            <div className='roi-flex'>
                {isOwner ? (
                    <>
                        <div className='roi-menu-flex'>
                            <div className='project-attachment-title'>File 1</div>
                            <div className='project-roi-detail'>
                                <form action="/action_page.php">
                                    <input type="file" id="myFile" name="filename" />
                                </form>
                            </div>
                        </div>
                        <div className='insert-note-flex'>
                            <div className='insert-note'>
                                <img className='insert-img' src={process.env.PUBLIC_URL + "/assets/plus.png"} />
                                <div>Upload File</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                        No attachments available.
                    </div>
                )}
            </div>
        );
    } else if (selectedMenuItem === 'note') {
        content = <ProjectNote projectId={id} currentUser={currentUser} isOwner={isOwner} />;
    } else if (selectedMenuItem === 'log') {
        content = <ProjectLog projectId={id} />;
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
                            {projectData?.c_project_status?.toLowerCase() === "orange" ? (
                                <div className="ball-delay" />
                            ) : projectData?.c_project_status?.toLowerCase() === "yellow" ? (
                                <div className="ball-processing" />
                            ) : projectData?.c_project_status?.toLowerCase() === "green" ? (
                                <div className="ball-success" />
                            ) : projectData?.c_project_status?.toLowerCase() === "gray" || projectData?.c_project_status?.toLowerCase() === "grey" ? (
                                <div className="ball-not-start" />
                            ) : projectData?.c_project_status?.toLowerCase() === "red" ? (
                                <div className="ball-reject" />
                            ) : (
                                <div className="ball-not-start" />
                            )}
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap' }}>Project: {projectData?.c_name || 'Loading...'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {isOwner && projectData?.c_project_status?.toLowerCase() !== 'green' && projectData?.c_project_status?.toLowerCase() !== 'red' && (
                                <button
                                    onClick={() => navigate(`/edit-project/${id}`)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#2196f3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Edit Project
                                </button>
                            )}
                            <div className='download-model-box'>
                                <img className='subtract-icon' src={process.env.PUBLIC_URL + "/assets/subtract.png"} />
                                <div className='download-model'>Download Business Model</div>
                            </div>
                        </div>
                    </div>
                    <div className='project-owner-grid'>
                        <div className='project-owner-box'>
                            <div className='project-owner-box-flex'>
                                <div className='project-owner-title'>
                                    PROJECT OWNER
                                </div>
                                <img className='project-owner-img' src={getOwnerImageUrl()} onError={(e) => handlePhotoError(e, projectData?.c_create_by)} />
                                <div className='project-owner-name'>
                                    {getOwnerName()}
                                </div>
                                <div className='project-owner-detail-box'>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Description</div>
                                        <div className='project-description-detail'>
                                            {renderHtmlContent(projectData?.c_detail) || 'Project description not available.'}
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'>
                                            {renderHtmlContent(projectData?.c_objective) || 'Project objective not available.'}
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done?</div>
                                        <div className='project-objective-detail'>
                                            {renderHtmlContent(projectData?.c_what_you_have_done) || 'Progress information not available.'}
                                        </div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>% Progress : {projectData?.c_percent_progress || 0} %</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>
                                    Create Date : {formatDate(projectData?.c_project_start)} | Create By : {projectData?.full_owner_name || projectData?.owner_name || 'System'}
                                </div>
                                <div className='project-update-time'>
                                    Last Update : {projectData?.c_update ? new Date(projectData.c_update).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'} | Update By : {projectData?.full_owner_name || projectData?.owner_name || 'System'}
                                </div>
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