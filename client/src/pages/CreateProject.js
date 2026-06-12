import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';

export default function CreateProject() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('detail');
    const [members, setMembers] = useState([{ id: 1, name: '', empId: '', role: '' }]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Project Detail states
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
    const [projectOwnerRole, setProjectOwnerRole] = useState('Responsibility');

    // ROI states
    const [kpiType, setKpiType] = useState('');
    const [roiType, setRoiType] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [roiDescription, setRoiDescription] = useState('');

    // Beneficiary options
    const beneficiaryOptions = [
        'CP Group', 'CPF', 'CP All', 'CP Plant', 'CP Engineering', 'CPLI',
        'CP Freshmart', 'CP Goods', 'CP China', 'CP Medical Center', 'CT Bright',
        'True Visions Group', 'True Group', 'Zhengyuan', 'DT Group', 'MQDC',
        'Super Brand Mall', 'China Retail', 'Tesco', 'Lotus Super Center', 'Makro', 'etc'
    ];

    // ROI Description options
    const roiDescriptionOptions = ['Commission', 'Sale', 'Capital Gain', 'Net Profit'];

    const currentYear = new Date().getFullYear();
    const startYear = projectStartDate ? new Date(projectStartDate).getFullYear() : currentYear;
    const years = [];
    for (let year = startYear; year <= startYear + 5; year++) {
        years.push(year);
    }

    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);

        const fetchUsers = async () => {
            try {
                const response = await apiRequest("/members");
                if (response.ok) {
                    const data = await response.json();
                    setAllUsers(data);
                }
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        // Validate dates
        if (projectStartDate && projectEndDate && projectStartDate > projectEndDate) {
            alert('Start Date cannot be after End Date. Please fix the Project Period.');
            setActiveTab('detail');
            return;
        }

        const roiData = {};

        if (kpiType === "option2") {
            roiData.type = "qualitative";
            const descEl = document.getElementById("qualitativeDescription");
            const yearEl = document.getElementById("qualitativeYear");
            roiData.description = descEl ? descEl.value : '';
            roiData.year = yearEl ? yearEl.value : '';
        } else if (kpiType === "option3") {
            roiData.type = "quantitative";
            const roiTypeEl = document.getElementById("roiTypeDropdown");
            const descEl = document.getElementById("quantitativeDescription");
            const yearEl = document.getElementById("quantitativeYear");
            const targetEl = document.getElementById("quantitativeTarget");
            roiData.roiType = roiTypeEl ? roiTypeEl.value : '';
            roiData.description = descEl ? descEl.value : '';
            roiData.year = yearEl ? yearEl.value : '';
            roiData.target = targetEl ? targetEl.value : '';
            if (roiType === 'indirect_return') {
                roiData.beneficiary = beneficiary;
                roiData.roiDescriptionType = roiDescription;
            }
        }

        const formData = {
            projectName,
            projectObjective,
            projectDescription,
            projectInvestment,
            investmentDetail,
            projectStartDate,
            projectEndDate,
            impact,
            possibility,
            members: members.filter(m => m.empId && m.role),
            roi: roiData,
            projectLeader: currentUser?.c_emp_id || null,
            projectLeaderRole: projectOwnerRole,
            projectGroupId: projectGroupId || null
        };

        try {
            setIsSubmitting(true);
            const response = await apiRequest("/projects", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Project created successfully! It has been saved as a draft. You can publish it from My Project > Project Draft.");
                navigate('/my-project?tab=draft');
            } else {
                alert("Failed to submit the project.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting the project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMember = () => {
        setMembers([...members, { id: members.length + 1, name: '', empId: '', role: '' }]);
    };

    const handleRemoveMember = (id) => {
        if (members.length <= 1) return;
        setMembers(members.filter(m => m.id !== id));
    };

    const handleNameChange = (id, empId) => {
        const selectedUser = allUsers.find(u => u.c_emp_id.toString() === empId);
        const fullName = selectedUser ? `${selectedUser.c_name} ${selectedUser.c_lastname}` : '';
        setMembers(prev =>
            prev.map(member =>
                member.id === id ? { ...member, name: fullName, empId: empId } : member
            )
        );
    };

    const getAvailableUsers = (currentMemberId) => {
        const selectedEmpIds = members
            .filter(m => m.id !== currentMemberId && m.empId)
            .map(m => m.empId);
        return allUsers.filter(user =>
            !selectedEmpIds.includes(user.c_emp_id.toString()) &&
            user.c_emp_id !== currentUser?.c_emp_id
        );
    };

    const handleRoleChange = (id, value) => {
        setMembers(prev =>
            prev.map(member =>
                member.id === id ? { ...member, role: value } : member
            )
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
                    <div className='edit-project-header'>
                        <h1>Create Project</h1>
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
                                <div className='form-actions'>
                                    <button className='btn-cancel' onClick={() => navigate('/my-project')}>
                                        Cancel
                                    </button>
                                    <button className='btn-save' onClick={() => setActiveTab('team')}>
                                        Next: Project Team
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className='edit-form'>
                                <div className='team-member-row owner'>
                                    <label>Project Owner:</label>
                                    <span className='owner-name'>
                                        {currentUser ? `${currentUser.c_name} ${currentUser.c_lastname}` : 'Loading...'}
                                    </span>
                                    <select
                                        value={projectOwnerRole}
                                        onChange={(e) => setProjectOwnerRole(e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Accountability">Accountability</option>
                                        <option value="Responsibility">Responsibility</option>
                                        <option value="Supporting">Supporting</option>
                                        <option value="Informed">Informed</option>
                                    </select>
                                </div>

                                {members.map((member) => (
                                    <div key={member.id} className='team-member-row'>
                                        <label>Member {member.id}:</label>
                                        <select
                                            value={member.empId}
                                            onChange={(e) => handleNameChange(member.id, e.target.value)}
                                        >
                                            <option value="">- Please Select Member -</option>
                                            {getAvailableUsers(member.id).map((user) => (
                                                <option key={user.c_emp_id} value={user.c_emp_id}>
                                                    {user.c_name} {user.c_lastname}
                                                </option>
                                            ))}
                                            {member.empId && !getAvailableUsers(member.id).find(u => u.c_emp_id.toString() === member.empId) && (
                                                <option value={member.empId}>{member.name}</option>
                                            )}
                                        </select>
                                        <span>Role:</span>
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Accountability">Accountability</option>
                                            <option value="Responsibility">Responsibility</option>
                                            <option value="Supporting">Supporting</option>
                                            <option value="Informed">Informed</option>
                                        </select>
                                        {members.length > 1 && (
                                            <button className='btn-remove' onClick={() => handleRemoveMember(member.id)}>
                                                Delete Member
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className='team-rules'>
                                    <p><span className='rule-letter'>- R Responsibility:</span> The person who has the responsibility to initiate the action and who is charged with ensuring it is carried out.</p>
                                    <p><span className='rule-letter'>- A Accountability:</span> The person who is accountable includes those whose approval is required or who have the power to veto the decision. This could be the responsible person's superiors.</p>
                                    <p><span className='rule-letter'>- S Supporting:</span> Those who can provide support and resources to help the action to take place.</p>
                                    <p><span className='rule-letter'>- I Informed:</span> Those who merely need to be informed or consulted but who cannot veto the action.</p>
                                </div>

                                <div className='form-actions'>
                                    <button className='btn-add' onClick={handleAddMember}>Add Member</button>
                                    <button className='btn-cancel' onClick={() => setActiveTab('detail')}>
                                        Back
                                    </button>
                                    <button className='btn-save' onClick={() => setActiveTab('roi')}>
                                        Next: Project ROI
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'roi' && (
                            <div className='edit-form'>
                                <div className='form-group'>
                                    <label>KPI Type:</label>
                                    <select value={kpiType} onChange={(e) => setKpiType(e.target.value)}>
                                        <option value="">--Please Select KPI Type--</option>
                                        <option value="option2">Qualitative</option>
                                        <option value="option3">Quantitative</option>
                                    </select>
                                </div>

                                {kpiType === 'option2' && (
                                    <>
                                        <div className='form-group'>
                                            <label>Description:</label>
                                            <input type="text" id="qualitativeDescription" placeholder="Description *" />
                                        </div>
                                        <div className='form-group'>
                                            <label>Year:</label>
                                            <select id="qualitativeYear">
                                                <option value="">Please Select Year</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {kpiType === 'option3' && (
                                    <>
                                        <div className='form-group'>
                                            <label>ROI Type:</label>
                                            <select id="roiTypeDropdown" value={roiType} onChange={(e) => setRoiType(e.target.value)}>
                                                <option value="">Please Select ROI Type *</option>
                                                <option value="direct_return">Direct Return</option>
                                                <option value="indirect_return">Indirect Return</option>
                                                <option value="cost_saving">Cost Saving</option>
                                                <option value="credit_return">Credit Return</option>
                                            </select>
                                        </div>

                                        {roiType === 'indirect_return' && (
                                            <>
                                                <div className='form-group'>
                                                    <label>Beneficiary:</label>
                                                    <select
                                                        id="beneficiaryDropdown"
                                                        value={beneficiary}
                                                        onChange={(e) => setBeneficiary(e.target.value)}
                                                    >
                                                        <option value="">Please Select Beneficiary *</option>
                                                        {beneficiaryOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='form-group'>
                                                    <label>ROI Description:</label>
                                                    <select
                                                        id="roiDescriptionDropdown"
                                                        value={roiDescription}
                                                        onChange={(e) => setRoiDescription(e.target.value)}
                                                    >
                                                        <option value="">Please Select ROI Description *</option>
                                                        {roiDescriptionOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        <div className='form-group'>
                                            <label>Description:</label>
                                            <input type="text" id="quantitativeDescription" placeholder="Description *" />
                                        </div>
                                        <div className='form-group'>
                                            <label>Year:</label>
                                            <select id="quantitativeYear">
                                                <option value="">Please Select Year</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label>ROI Target:</label>
                                            <input type="number" id="quantitativeTarget" placeholder="Baht" min="0" />
                                        </div>
                                    </>
                                )}

                                <div className='form-actions'>
                                    <button className='btn-cancel' onClick={() => setActiveTab('team')}>
                                        Back
                                    </button>
                                    <button className='btn-save' onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating Project...' : 'Submit Project'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
