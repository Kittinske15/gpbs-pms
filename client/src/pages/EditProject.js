import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';

export default function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('detail');
    const [currentUser, setCurrentUser] = useState(null);
    const [project, setProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Form states
    const [projectName, setProjectName] = useState('');
    const [projectObjective, setProjectObjective] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectInvestment, setProjectInvestment] = useState('');
    const [investmentDetail, setInvestmentDetail] = useState('');
    const [projectStartDate, setProjectStartDate] = useState('');
    const [projectEndDate, setProjectEndDate] = useState('');
    const [projectGroupId, setProjectGroupId] = useState('');
    const [impact, setImpact] = useState('');
    const [possibility, setPossibility] = useState('');

    // ROI states
    const [kpiType, setKpiType] = useState('');
    const [roiType, setRoiType] = useState('');
    const [roiDescription, setRoiDescription] = useState('');
    const [roiBeneficiary, setRoiBeneficiary] = useState('');
    const [roiDescriptionType, setRoiDescriptionType] = useState('');
    const [roiYear, setRoiYear] = useState('');
    const [roiTarget, setRoiTarget] = useState('');
    const [roiActual, setRoiActual] = useState('');
    const [budgetActual, setBudgetActual] = useState('');

    // Beneficiary options for Indirect Return (demo)
    const beneficiaryOptions = [
        'GPBS', 'Internal', 'Client A', 'Client B', 'Client C',
        'Partner', 'Subsidiary', 'External'
    ];

    // ROI Description options for Indirect Return
    const roiDescriptionOptions = [
        'Capital Gain', 'Cost Saving', 'Revenue Increase', 'Efficiency Improvement'
    ];

    // Update states
    const [projectStatus, setProjectStatus] = useState('');
    const [percentProgress, setPercentProgress] = useState('');
    const [obstruction, setObstruction] = useState('');
    const [solution, setSolution] = useState('');
    const [whatYouHaveDone, setWhatYouHaveDone] = useState('');
    const [cancelReason, setCancelReason] = useState('');

    const currentYear = new Date().getFullYear();
    // Generate years starting from project start year (not before), up to +5 years
    const startYear = projectStartDate ? new Date(projectStartDate).getFullYear() : currentYear;
    const years = [];
    for (let year = startYear; year <= startYear + 5; year++) {
        years.push(year);
    }

    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);
        fetchProject();
        fetchAllUsers();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await apiRequest(`/projects/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProject(data);

                // Set form values
                setProjectName(data.c_name || '');
                setProjectObjective(data.c_objective || '');
                setProjectDescription(data.c_detail || '');
                setProjectInvestment(data.c_budget || '');
                setInvestmentDetail(data.c_budget_detail || '');
                setProjectStartDate(data.c_project_start ? data.c_project_start.split('T')[0] : '');
                setProjectEndDate(data.c_project_finish ? data.c_project_finish.split('T')[0] : '');
                setProjectGroupId(data.c_project_group_id?.toString() || '');
                setImpact(data.c_impact || '');
                setPossibility(data.c_urgent || '');

                // ROI values - handle both string and number types from database
                console.log('ROI data from API:', {
                    c_roi_kpi_type: data.c_roi_kpi_type,
                    c_roi_type: data.c_roi_type,
                    c_roi_description: data.c_roi_description,
                    c_roi_year: data.c_roi_year,
                    c_roi_tgt: data.c_roi_tgt
                });
                const kpiTypeValue = parseInt(data.c_roi_kpi_type);
                console.log('Parsed kpiTypeValue:', kpiTypeValue);
                if (kpiTypeValue === 1 || data.c_roi_kpi_type === 'quantitative') {
                    console.log('Setting kpiType to quantitative');
                    setKpiType('quantitative');
                } else if (kpiTypeValue === 2 || data.c_roi_kpi_type === 'qualitative') {
                    console.log('Setting kpiType to qualitative');
                    setKpiType('qualitative');
                } else {
                    console.log('No matching kpiType found');
                }
                setRoiType(data.c_roi_type || '');
                setRoiDescription(data.c_roi_description || '');
                setRoiBeneficiary(data.c_roi_beneficiary || '');
                setRoiDescriptionType(data.c_roi_description_type || '');
                setRoiYear(data.c_roi_year || '');
                setRoiTarget(data.c_roi_tgt || '');
                setRoiActual(data.c_roi_act || '');
                setBudgetActual(data.c_budget_act || '');

                // Update values
                setProjectStatus(data.c_project_status || '');
                setPercentProgress(data.c_percent_progress || '');
                setObstruction(data.c_obstruction || '');
                setSolution(data.c_solution || '');
                setWhatYouHaveDone(data.c_what_you_have_done || '');

                // Fetch team members
                fetchTeamMembers();
            }
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await apiRequest(`/projects/${id}/team-members`);
            if (response.ok) {
                const data = await response.json();
                setTeamMembers(data);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await apiRequest('/members');
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSaveAll = async () => {
        // Validate dates
        if (projectStartDate && projectEndDate && projectStartDate > projectEndDate) {
            alert('Start Date cannot be after End Date. Please fix the Project Period.');
            setActiveTab('detail');
            return;
        }

        // Validate update status
        if (!isDraft) {
            if (projectStatus === 'green') {
                if (!window.confirm('You selected Green (Completed). After saving, this project will become view-only and can no longer be edited. Are you sure you want to submit?')) {
                    return;
                }
            }
            if (projectStatus === 'red') {
                if (!cancelReason.trim()) {
                    alert('Please enter a reason for marking this project as Incompleted.');
                    setActiveTab('update');
                    return;
                }
                if (!window.confirm('You selected Red (Incompleted). After saving, this project will become view-only and can no longer be edited. Are you sure you want to submit?')) {
                    return;
                }
            }
        }

        setSaving(true);
        try {
            // Save all sections in parallel
            const sections = [
                {
                    label: 'Project Detail',
                    request: apiRequest(`/projects/${id}/detail`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            projectName, projectObjective, projectDescription,
                            projectInvestment, investmentDetail,
                            projectStartDate, projectEndDate,
                            projectGroupId, impact, possibility
                        })
                    })
                },
                {
                    label: 'Team',
                    request: apiRequest(`/projects/${id}/team`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            members: teamMembers.filter(m => m.c_emp_id && m.role && m.c_emp_id?.toString() !== project?.c_create_by?.toString())
                        })
                    })
                },
                {
                    label: 'ROI',
                    request: apiRequest(`/projects/${id}/roi`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            kpiType, roiType, roiDescription,
                            roiBeneficiary, roiDescriptionType,
                            roiYear, roiTarget, roiActual, budgetActual
                        })
                    })
                }
            ];

            // Also save update section if not a draft
            if (!isDraft) {
                sections.push({
                    label: 'Project Update',
                    request: apiRequest(`/projects/${id}/update`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            projectStatus, percentProgress,
                            obstruction, solution, whatYouHaveDone,
                            cancelReason: projectStatus === 'red' ? cancelReason : null
                        })
                    })
                });
            }

            const results = await Promise.all(sections.map(s => s.request));
            const failedSections = sections.filter((_, i) => !results[i].ok).map(s => s.label);

            if (failedSections.length === 0) {
                alert('Project saved successfully!');
                // Green/Red = project becomes view-only, navigate away
                if (!isDraft && (projectStatus === 'green' || projectStatus === 'red')) {
                    navigate(`/project/${id}`);
                } else {
                    fetchProject();
                    fetchTeamMembers();
                }
            } else {
                alert(`Failed to save: ${failedSections.join(', ')}. Please try again.`);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = () => {
        setTeamMembers([...teamMembers, { c_emp_id: '', c_name: '', c_lastname: '', role: '' }]);
    };

    const handleRemoveMember = (index) => {
        const newMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(newMembers);
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...teamMembers];
        if (field === 'c_emp_id') {
            // Check if this member is the project owner
            if (value && project && value.toString() === project.c_create_by?.toString()) {
                alert('Cannot add project owner as a team member. They are already the owner.');
                return;
            }
            // Check if this member is already added
            const isDuplicate = newMembers.some((m, i) => i !== index && m.c_emp_id?.toString() === value);
            if (isDuplicate) {
                alert('This member is already added to the team.');
                return;
            }
            const selectedUser = allUsers.find(u => u.c_emp_id.toString() === value);
            if (selectedUser) {
                newMembers[index] = {
                    ...newMembers[index],
                    c_emp_id: selectedUser.c_emp_id,
                    c_name: selectedUser.c_name,
                    c_lastname: selectedUser.c_lastname
                };
            }
        } else {
            newMembers[index][field] = value;
        }
        setTeamMembers(newMembers);
    };

if (loading) {
        return <div className="loading">Loading project...</div>;
    }

    if (!project) {
        return <div className="error">Project not found</div>;
    }

    // Check if current user is the project owner
    const isOwner = currentUser && project &&
        (currentUser.c_emp_id === project.c_create_by ||
         currentUser.c_emp_id?.toString() === project.c_create_by?.toString());

    // Check if project is in draft mode (c_status = 1 means draft, 0 means published)
    const isDraft = project && project.c_status === 1;

    // Check if project is completed (green) or cancelled (red) = no more editing
    const isCompleted = project && (project.c_project_status === 'green' || project.c_project_status === 'red');

    // If not owner, show access denied message
    if (!isOwner) {
        return (
            <div className="App">
                <Sidebar onToggle={setSidebarOpen} />
                <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                    <div className='header_container'>
                        <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                    </div>
                    <div className="body_container">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '50vh',
                            color: 'white'
                        }}>
                            <h1 style={{ color: '#e74c3c', marginBottom: '20px' }}>Access Denied</h1>
                            <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                                You are not the owner of this project and cannot edit it.
                            </p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Link
                                    to={`/project/${id}`}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    View Project Details
                                </Link>
                                <Link
                                    to="/project"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#2ecc71',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Back to Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If project is completed (green) or cancelled (red), redirect to view-only page
    const isRed = project && project.c_project_status === 'red';
    if (isCompleted) {
        return (
            <div className="App">
                <Sidebar onToggle={setSidebarOpen} />
                <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                    <div className='header_container'>
                        <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                    </div>
                    <div className="body_container">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '50vh',
                            color: 'white'
                        }}>
                            <h1 style={{ color: isRed ? '#e74c3c' : '#2ecc71', marginBottom: '20px' }}>
                                {isRed ? 'Project Incompleted' : 'Project Completed'}
                            </h1>
                            <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                                {isRed
                                    ? 'This project has been marked as incompleted and can no longer be edited.'
                                    : 'This project has been marked as completed and can no longer be edited.'
                                }
                            </p>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Link
                                    to={`/project/${id}`}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    View Project
                                </Link>
                                <Link
                                    to="/my-project"
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#2ecc71',
                                        color: 'white',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Back to My Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <Sidebar onToggle={setSidebarOpen} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='edit-project-header'>
                        <h1>Edit Project</h1>
                    </div>

                    <div className='edit-project-tabs'>
                        <button
                            className={`tab-btn ${activeTab === 'detail' ? 'active' : ''}`}
                            onClick={() => setActiveTab('detail')}
                        >
                            Project Detail
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Project Team
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'roi' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roi')}
                        >
                            Project ROI
                        </button>
                        {!isDraft && (
                            <button
                                className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`}
                                onClick={() => setActiveTab('update')}
                            >
                                Project Update
                            </button>
                        )}
                    </div>

                    <div className='edit-project-content'>
                        {activeTab === 'detail' && (
                            <div className='edit-form'>
                                <div className='form-group'>
                                    <label>Project Name:</label>
                                    <input
                                        type='text'
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Project Objective:</label>
                                    <textarea
                                        value={projectObjective}
                                        onChange={(e) => setProjectObjective(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Project Description:</label>
                                    <textarea
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Project Investment:</label>
                                    <input
                                        type='number'
                                        value={projectInvestment}
                                        onChange={(e) => setProjectInvestment(e.target.value)}
                                        placeholder='Baht'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Investment Detail:</label>
                                    <textarea
                                        value={investmentDetail}
                                        onChange={(e) => setInvestmentDetail(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Project Period:</label>
                                    <div className='date-range'>
                                        <span>Start Date:</span>
                                        <input
                                            type='date'
                                            value={projectStartDate}
                                            max={projectEndDate || undefined}
                                            onChange={(e) => setProjectStartDate(e.target.value)}
                                        />
                                        <span>End Date:</span>
                                        <input
                                            type='date'
                                            value={projectEndDate}
                                            min={projectStartDate || undefined}
                                            onChange={(e) => setProjectEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Project Group:</label>
                                    <select value={projectGroupId} onChange={(e) => setProjectGroupId(e.target.value)}>
                                        <option value=''>--Please Select--</option>
                                        <option value='1'>Media</option>
                                        <option value='2'>Content</option>
                                    </select>
                                </div>
                                <div className='form-group'>
                                    <label>Possibility:</label>
                                    <select value={possibility} onChange={(e) => setPossibility(e.target.value)}>
                                        <option value=''>--Please Select--</option>
                                        <option value='high'>High</option>
                                        <option value='low'>Low</option>
                                    </select>
                                </div>
                                <div className='form-group'>
                                    <label>Impact:</label>
                                    <select value={impact} onChange={(e) => setImpact(e.target.value)}>
                                        <option value=''>--Please Select--</option>
                                        <option value='high'>High</option>
                                        <option value='low'>Low</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className='edit-form'>
                                <div className='team-member-row owner'>
                                    <label>Project Owner:</label>
                                    <span className='owner-name'>{project.full_owner_name || currentUser?.c_name + ' ' + currentUser?.c_lastname}</span>
                                    <span className='owner-role'>Responsibility</span>
                                    <span className='cannot-change'>* Can't change!</span>
                                </div>

                                {teamMembers.map((member, originalIndex) => {
                                    if (member.role === 'Owner' || member.c_emp_id?.toString() === project?.c_create_by?.toString()) {
                                        return null;
                                    }
                                    const displayIndex = teamMembers.slice(0, originalIndex).filter(m => m.role !== 'Owner' && m.c_emp_id?.toString() !== project?.c_create_by?.toString()).length;
                                    return (
                                        <div key={originalIndex} className='team-member-row'>
                                            <label>Member {displayIndex + 1}:</label>
                                            <select
                                                value={member.c_emp_id || ''}
                                                onChange={(e) => handleMemberChange(originalIndex, 'c_emp_id', e.target.value)}
                                            >
                                                <option value=''>- Please Select Member -</option>
                                                {allUsers.map(user => (
                                                    <option key={user.c_emp_id} value={user.c_emp_id}>
                                                        {user.c_name} {user.c_lastname}
                                                    </option>
                                                ))}
                                            </select>
                                            <span>Roles:</span>
                                            <select
                                                value={member.role || ''}
                                                onChange={(e) => handleMemberChange(originalIndex, 'role', e.target.value)}
                                            >
                                                <option value=''>Select Role</option>
                                                <option value='Accountability'>Accountability</option>
                                                <option value='Responsibility'>Responsibility</option>
                                                <option value='Supporting'>Supporting</option>
                                                <option value='Informed'>Informed</option>
                                            </select>
                                            <button className='btn-remove' onClick={() => handleRemoveMember(originalIndex)}>
                                                Delete Member
                                            </button>
                                        </div>
                                    );
                                })}

                                <div className='team-rules'>
                                    <p><span className='rule-letter'>- R Responsibility:</span> The person who has the responsibility to initiate the action and who is charged with ensuring it is carried out.</p>
                                    <p><span className='rule-letter'>- A Accountability:</span> The person who is accountable includes those whose approval is required or who have the power to veto the decision. This could be the responsible person's superiors.</p>
                                    <p><span className='rule-letter'>- S Supporting:</span> Those who can provide support and resources to help the action to take place.</p>
                                    <p><span className='rule-letter'>- I Informed:</span> Those who merely need to be informed or consulted but who cannot veto the action.</p>
                                </div>

                                <div className='form-actions'>
                                    <button className='btn-add' onClick={handleAddMember}>Add Member</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'roi' && (
                            <div className='edit-form'>
                                <div className='form-group'>
                                    <label>KPI Type:</label>
                                    <select value={kpiType} onChange={(e) => setKpiType(e.target.value)}>
                                        <option value=''>--Please Select--</option>
                                        <option value='qualitative'>Qualitative</option>
                                        <option value='quantitative'>Quantitative</option>
                                    </select>
                                </div>

                                {kpiType === 'quantitative' && (
                                    <>
                                        <div className='form-group'>
                                            <label>ROI Type:</label>
                                            <select value={roiType} onChange={(e) => setRoiType(e.target.value)}>
                                                <option value=''>--Please Select--</option>
                                                <option value='direct_return'>Direct Return</option>
                                                <option value='indirect_return'>Indirect Return</option>
                                                <option value='cost_saving'>Cost Saving</option>
                                                <option value='credit_return'>Credit Return</option>
                                            </select>
                                        </div>

                                        {roiType === 'indirect_return' && (
                                            <>
                                                <div className='form-group'>
                                                    <label>Beneficiary:</label>
                                                    <select value={roiBeneficiary} onChange={(e) => setRoiBeneficiary(e.target.value)}>
                                                        <option value=''>--Please Select Beneficiary--</option>
                                                        {beneficiaryOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='form-group'>
                                                    <label>ROI Description:</label>
                                                    <select value={roiDescriptionType} onChange={(e) => setRoiDescriptionType(e.target.value)}>
                                                        <option value=''>--Please Select ROI Description--</option>
                                                        {roiDescriptionOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        <div className='form-group'>
                                            <label>Description:</label>
                                            <input
                                                type='text'
                                                value={roiDescription}
                                                onChange={(e) => setRoiDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Year:</label>
                                            <select value={roiYear} onChange={(e) => setRoiYear(e.target.value)}>
                                                <option value=''>--Please Select--</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label>ROI Target:</label>
                                            <input
                                                type='number'
                                                value={roiTarget}
                                                onChange={(e) => setRoiTarget(e.target.value)}
                                                placeholder='Baht'
                                            />
                                        </div>
                                        {!isDraft && (
                                            <>
                                                <div className='form-group'>
                                                    <label>Actual ROI:</label>
                                                    <input
                                                        type='number'
                                                        value={roiActual}
                                                        onChange={(e) => setRoiActual(e.target.value)}
                                                        placeholder='Baht'
                                                    />
                                                </div>
                                                <div className='form-group'>
                                                    <label>Actual Investment:</label>
                                                    <input
                                                        type='number'
                                                        value={budgetActual}
                                                        onChange={(e) => setBudgetActual(e.target.value)}
                                                        placeholder='Baht'
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                {kpiType === 'qualitative' && (
                                    <>
                                        <div className='form-group'>
                                            <label>Description:</label>
                                            <input
                                                type='text'
                                                value={roiDescription}
                                                onChange={(e) => setRoiDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label>Year:</label>
                                            <select value={roiYear} onChange={(e) => setRoiYear(e.target.value)}>
                                                <option value=''>--Please Select--</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                            </div>
                        )}

                        {activeTab === 'update' && (
                            <div className='edit-form'>
                                <div className='form-group'>
                                    <label>Project Status:</label>
                                    <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                                        <option value=''>--Please Select--</option>
                                        <option value='grey'>Grey (Not Start)</option>
                                        <option value='yellow'>Yellow (On Processing)</option>
                                        <option value='green'>Green (Completed)</option>
                                        <option value='red'>Red (Incompleted)</option>
                                    </select>
                                </div>
                                {projectStatus === 'red' && (
                                    <div className='form-group'>
                                        <label style={{ color: '#e74c3c', fontWeight: 'bold' }}>Reason for Incompleted: *</label>
                                        <textarea
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            placeholder='Please enter the reason why this project is incompleted...'
                                            style={{ borderColor: !cancelReason.trim() ? '#e74c3c' : undefined }}
                                        />
                                    </div>
                                )}
                                <div className='form-group'>
                                    <label>% Progress:</label>
                                    <input
                                        type='number'
                                        min='0'
                                        max='100'
                                        value={percentProgress}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) val = '';
                                            else if (val < 0) val = 0;
                                            else if (val > 100) val = 100;
                                            setPercentProgress(val);
                                        }}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Obstruction:</label>
                                    <textarea
                                        value={obstruction}
                                        onChange={(e) => setObstruction(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Solution:</label>
                                    <textarea
                                        value={solution}
                                        onChange={(e) => setSolution(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Project Progress / What you have done?</label>
                                    <textarea
                                        value={whatYouHaveDone}
                                        onChange={(e) => setWhatYouHaveDone(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save/Cancel buttons outside tab content */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '20px 0 20px 0', width: '100%' }}>
                        <button className='btn-cancel' style={{ padding: '12px 40px', fontSize: '15px' }} onClick={() => navigate(isDraft ? '/my-project?tab=draft' : `/project/${id}`)}>
                            Cancel
                        </button>
                        <button className='btn-save' style={{ padding: '12px 40px', fontSize: '15px' }} onClick={handleSaveAll} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
