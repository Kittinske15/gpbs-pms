import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FormControl, Select, MenuItem } from "@mui/material";

export default function MyProject() {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'owner';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [currentUser, setCurrentUser] = useState(null);
    const [ownerProjects, setOwnerProjects] = useState([]);
    const [memberProjects, setMemberProjects] = useState([]);
    const [draftProjects, setDraftProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [draftTeamMembers, setDraftTeamMembers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    // Helper function to convert KPI type to text (handles both old string values and new numeric values)
    const getKpiTypeText = (kpiType) => {
        // Handle numeric values (new format)
        if (kpiType === 1) return 'Quantitative';
        if (kpiType === 2) return 'Qualitative';
        // Handle string values (old format)
        if (kpiType === 'quantitative') return 'Quantitative';
        if (kpiType === 'qualitative') return 'Qualitative';
        return '-';
    };

    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);

        if (user?.c_emp_id) {
            fetchMyProjects(user.c_emp_id, selectedYear);
        }
    }, [selectedYear]);

    const fetchMyProjects = async (empId, year) => {
        try {
            const response = await apiRequest(`/my-projects/${empId}?year=${year}`);
            if (response.ok) {
                const data = await response.json();
                setOwnerProjects(data.ownerProjects || []);
                setMemberProjects(data.memberProjects || []);
                setDraftProjects(data.draftProjects || []);
            }
        } catch (error) {
            console.error('Error fetching my projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
               ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (project) => {
        const progress = parseFloat(project.c_percent_progress) || 0;
        if (progress >= 100) {
            return <span className="status-badge complete">Complete</span>;
        } else if (progress > 0) {
            return <span className="status-badge in-progress">In Progress</span>;
        } else {
            return <span className="status-badge not-started">Not Started</span>;
        }
    };

    const getStatusIcon = (project) => {
        const status = project.c_project_status;
        if (status) {
            return <span className={`status-icon ${status}`}></span>;
        }
        return <span className="status-icon grey"></span>;
    };

    const getApproveStatus = (project) => {
        if (project.c_approve === 1 && project.c_status === 0) {
            return <span className="approve-badge approved">Approved</span>;
        } else if (project.c_approve === 0) {
            return <span className="approve-badge pending">Pending</span>;
        } else {
            return <span className="approve-badge draft">Draft</span>;
        }
    };

    // Group projects by project group (Media/Content)
    const getBusinessTypeName = (groupId) => {
        switch (groupId) {
            case 1: return 'Media Team';
            case 2: return 'Content Team';
            default: return 'Other';
        }
    };

    const groupProjectsByBusinessType = (projects) => {
        const grouped = {};
        projects.forEach(project => {
            const groupId = project.c_project_group_id || 0;
            const groupName = getBusinessTypeName(groupId);
            if (!grouped[groupName]) {
                grouped[groupName] = [];
            }
            grouped[groupName].push(project);
        });
        return grouped;
    };

    const fetchTeamMembers = async (projectId) => {
        try {
            const response = await apiRequest(`/projects/${projectId}/team-members`);
            if (response.ok) {
                const data = await response.json();
                setDraftTeamMembers(data);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
            setDraftTeamMembers([]);
        }
    };

    const handleViewDraft = (project) => {
        setSelectedDraft(project);
        fetchTeamMembers(project.id);
    };

    const handleDeleteDraft = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this draft?')) {
            try {
                const response = await apiRequest(`/projects/${projectId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setDraftProjects(prev => prev.filter(p => p.id !== projectId));
                    setSelectedDraft(null);
                    alert('Draft deleted successfully');
                } else {
                    alert('Failed to delete draft');
                }
            } catch (error) {
                console.error('Error deleting draft:', error);
                alert('Error deleting draft');
            }
        }
    };

    const handlePublishDraft = async (projectId) => {
        if (window.confirm('Are you sure you want to publish this project? It will be submitted for approval.')) {
            try {
                const response = await apiRequest(`/projects/${projectId}/publish`, {
                    method: 'PUT'
                });
                if (response.ok) {
                    // Move from draft to owner projects
                    const publishedProject = draftProjects.find(p => p.id === projectId);
                    if (publishedProject) {
                        publishedProject.c_approve = 1;
                        publishedProject.c_status = 0;
                        setOwnerProjects(prev => [...prev, publishedProject]);
                    }
                    setDraftProjects(prev => prev.filter(p => p.id !== projectId));
                    setSelectedDraft(null);
                    alert('Project published successfully!');
                } else {
                    alert('Failed to publish project');
                }
            } catch (error) {
                console.error('Error publishing project:', error);
                alert('Error publishing project');
            }
        }
    };

    const renderOwnerTable = (projects) => {
        if (projects.length === 0) {
            return <div className="no-projects">No projects found</div>;
        }

        const groupedProjects = groupProjectsByBusinessType(projects);

        return Object.entries(groupedProjects).map(([groupName, groupProjects]) => (
            <div key={groupName} className="business-group">
                <h3 className="business-group-title">{groupName}</h3>
                <table className="my-project-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Project Name</th>
                            <th>Project Owner</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Over All Status</th>
                            <th>Manage</th>
                            <th>Approve Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupProjects.map((project, index) => (
                            <tr key={project.id}>
                                <td>{index + 1}.</td>
                                <td>
                                    <Link to={`/project/${project.id}`} className="project-link">
                                        {project.c_name}
                                    </Link>
                                </td>
                                <td>{project.full_owner_name || '-'}</td>
                                <td>{formatDate(project.c_project_start)}</td>
                                <td>{formatDate(project.c_project_finish)}</td>
                                <td>{getStatusIcon(project)}</td>
                                <td className="manage-buttons">
                                    <Link to={`/project/${project.id}`} className="btn-view">View</Link>
                                    {project.c_project_status?.toLowerCase() !== 'green' && project.c_project_status?.toLowerCase() !== 'red' && (
                                        <Link to={`/edit-project/${project.id}`} className="btn-edit">Edit</Link>
                                    )}
                                </td>
                                <td>{getApproveStatus(project)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    const renderMemberTable = (projects) => {
        if (projects.length === 0) {
            return <div className="no-projects">No projects found</div>;
        }

        const groupedProjects = groupProjectsByBusinessType(projects);

        return Object.entries(groupedProjects).map(([groupName, groupProjects]) => (
            <div key={groupName} className="business-group">
                <h3 className="business-group-title">{groupName}</h3>
                <table className="my-project-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Project Name</th>
                            <th>Project Owner</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Over All Status</th>
                            <th>Manage</th>
                            <th>Approve Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupProjects.map((project, index) => (
                            <tr key={project.id}>
                                <td>{index + 1}.</td>
                                <td>
                                    <Link to={`/project/${project.id}`} className="project-link">
                                        {project.c_name}
                                    </Link>
                                </td>
                                <td>{project.full_owner_name || '-'}</td>
                                <td>{formatDate(project.c_project_start)}</td>
                                <td>{formatDate(project.c_project_finish)}</td>
                                <td>{getStatusIcon(project)}</td>
                                <td className="manage-buttons">
                                    <Link to={`/project/${project.id}`} className="btn-view">View</Link>
                                    {project.c_project_status?.toLowerCase() !== 'green' && project.c_project_status?.toLowerCase() !== 'red' && (
                                        <Link to={`/edit-project/${project.id}`} className="btn-edit">Edit</Link>
                                    )}
                                </td>
                                <td>{getApproveStatus(project)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    const renderDraftTable = () => {
        if (draftProjects.length === 0) {
            return <div className="no-projects">No draft projects found</div>;
        }

        return (
            <table className="my-project-table draft-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Project Name</th>
                        <th>Create Date<br/>Create By</th>
                        <th>Last Update<br/>Update By</th>
                        <th>Manage Draft</th>
                    </tr>
                </thead>
                <tbody>
                    {draftProjects.map((project, index) => (
                        <tr key={project.id}>
                            <td>{index + 1}.</td>
                            <td>{project.c_name}</td>
                            <td>
                                {formatDateTime(project.c_create_date || project.c_project_start)}<br/>
                                {project.full_owner_name || currentUser?.c_name + ' ' + currentUser?.c_lastname}
                            </td>
                            <td>-</td>
                            <td className="manage-buttons">
                                <button className="btn-view" onClick={() => handleViewDraft(project)}>View</button>
                                <Link to={`/edit-project/${project.id}`} className="btn-edit">Edit</Link>
                                <button className="btn-delete" onClick={() => handleDeleteDraft(project.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderDraftDetail = () => {
        if (!selectedDraft) return null;

        return (
            <div className="draft-detail-overlay">
                <div className="draft-detail-modal">
                    <div className="draft-detail-header">
                        <h2>Project Draft : {selectedDraft.c_name}</h2>
                        <button className="close-btn" onClick={() => { setSelectedDraft(null); setDraftTeamMembers([]); }}>X</button>
                    </div>
                    <div className="draft-detail-content">
                        <div className="draft-detail-grid">
                            <div className="detail-section">
                                <fieldset>
                                    <legend>Project Description</legend>
                                    <p>{selectedDraft.c_detail || '-'}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>Project Objective</legend>
                                    <p>{selectedDraft.c_objective || '-'}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>Project Progress / What you have done ?</legend>
                                    <p>{selectedDraft.c_what_you_have_done || '-'}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>Obstruction</legend>
                                    <p>{selectedDraft.c_obstruction || '-'}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>Solution</legend>
                                    <p>{selectedDraft.c_solution || '-'}</p>
                                </fieldset>
                            </div>
                            <div className="detail-section">
                                <fieldset>
                                    <legend>Project Prioritization</legend>
                                    <p>Possibility : {selectedDraft.c_urgent || '-'}</p>
                                    <p>Impact : {selectedDraft.c_impact || '-'}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>Team Member</legend>
                                    {(() => {
                                        const ownerMember = draftTeamMembers.find(m => m.c_emp_id?.toString() === selectedDraft?.c_create_by?.toString());
                                        const otherMembers = draftTeamMembers.filter((m, i, arr) =>
                                            m.c_emp_id?.toString() !== selectedDraft?.c_create_by?.toString() &&
                                            arr.findIndex(x => x.c_emp_id?.toString() === m.c_emp_id?.toString()) === i
                                        );
                                        return (
                                            <>
                                                <p style={{color: 'red'}}>
                                                    Project Owner: {ownerMember ? `${ownerMember.c_name} ${ownerMember.c_lastname}` : `${currentUser?.c_name} ${currentUser?.c_lastname}`} - Responsibility
                                                </p>
                                                {otherMembers.map((member, index) => (
                                                    <p key={index}>
                                                        {index + 1}. {member.c_name} {member.c_lastname} - {member.role}
                                                    </p>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </fieldset>
                                <fieldset>
                                    <legend>Project Period</legend>
                                    <p>{formatDate(selectedDraft.c_project_start)} - {formatDate(selectedDraft.c_project_finish)}</p>
                                </fieldset>
                                <fieldset>
                                    <legend>ROI</legend>
                                    <table className="roi-table">
                                        <tbody>
                                            <tr>
                                                <td className="roi-label">KPI Type</td>
                                                <td>{getKpiTypeText(selectedDraft.c_roi_kpi_type)}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">ROI Type</td>
                                                <td>{selectedDraft.c_roi_type || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">Beneficiary</td>
                                                <td>{selectedDraft.c_roi_beneficiary || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">Description Type</td>
                                                <td>{selectedDraft.c_roi_description_type || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">Year</td>
                                                <td>{selectedDraft.c_roi_year || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">ROI Target</td>
                                                <td>{selectedDraft.c_roi_tgt != null && selectedDraft.c_roi_tgt !== '' ? `${Number(selectedDraft.c_roi_tgt).toLocaleString()} Baht` : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">ROI Actual</td>
                                                <td>{selectedDraft.c_roi_act != null && selectedDraft.c_roi_act !== '' ? `${Number(selectedDraft.c_roi_act).toLocaleString()} Baht` : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">Budget Actual</td>
                                                <td>{selectedDraft.c_budget_act != null && selectedDraft.c_budget_act !== '' ? `${Number(selectedDraft.c_budget_act).toLocaleString()} Baht` : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="roi-label">Description</td>
                                                <td>{selectedDraft.c_roi_description ? <span dangerouslySetInnerHTML={{ __html: selectedDraft.c_roi_description }} /> : '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                        {currentUser?.c_username !== 'admin' && currentUser?.c_name !== 'admin' && (
                            <div className="draft-actions">
                                <button className="btn-create-project" onClick={() => handlePublishDraft(selectedDraft.id)}>
                                    + Create Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <Sidebar onToggle={setSidebarOpen} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='my-project-header'>
                        <h1>{currentUser ? `${currentUser.c_name} ${currentUser.c_lastname}` : 'My Projects'}</h1>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    '& .MuiSelect-select': {
                                        padding: '8px 14px',
                                    }
                                }}
                            >
                                {yearOptions.map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className='my-project-tabs'>
                        <button
                            className={`tab-btn ${activeTab === 'owner' ? 'active' : ''}`}
                            onClick={() => setActiveTab('owner')}
                        >
                            Project Owner
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'member' ? 'active' : ''}`}
                            onClick={() => setActiveTab('member')}
                        >
                            Project Member
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'draft' ? 'active' : ''}`}
                            onClick={() => setActiveTab('draft')}
                        >
                            Project Draft
                        </button>
                    </div>

                    <div className='my-project-content'>
                        {loading ? (
                            <div className="loading">Loading projects...</div>
                        ) : (
                            <>
                                {activeTab === 'owner' && renderOwnerTable(ownerProjects)}
                                {activeTab === 'member' && renderMemberTable(memberProjects)}
                                {activeTab === 'draft' && renderDraftTable()}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {selectedDraft && renderDraftDetail()}
        </div>
    );
}
