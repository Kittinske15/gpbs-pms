import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextareaAutosize,
    Select,
    MenuItem,
    FormControl,
    Box,
    Avatar
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { apiRequest } from '../utils/api';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

const StyledTable = styled(Table)(({ theme }) => ({
    width: '100%',
    tableLayout: 'fixed'
}));

const StatusBall = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'Green': return '#4CAF50';
            case 'Yellow': return '#FFC107';
            case 'Red': return '#F44336';
            case 'Gray': return '#9E9E9E';
            default: return '#FFC107';
        }
    };

    return (
        <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            margin: '0 auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
    );
};

const ActionPlan = ({ projectId, isOwner = false }) => {
    const [actionPlans, setActionPlans] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState([
        { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' },
        { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' },
        { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' },
        { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' },
        { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' },
    ]);
    const [loading, setLoading] = useState(true);
    const [customPhotos, setCustomPhotos] = useState({});

    // Fetch custom photos
    useEffect(() => {
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    // Fetch action plans and team members
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (projectId) {
                    // Fetch project team members (owner + team)
                    const teamRes = await apiRequest(`/projects/${projectId}/team-members`);
                    if (teamRes.ok) {
                        const teamData = await teamRes.json();
                        setTeamMembers(teamData);
                    }

                    // Fetch action plans for this project
                    const plansRes = await apiRequest(`/projects/${projectId}/action-plans`);
                    if (plansRes.ok) {
                        const plansData = await plansRes.json();
                        setActionPlans(plansData);

                        // Pre-fill edit data if there are existing plans
                        if (plansData.length > 0) {
                            const filledData = plansData.map(plan => ({
                                id: plan.id,
                                plan_description: plan.plan_description || '',
                                responsible_emp_id: plan.responsible_emp_id || '',
                                start_date: plan.start_date ? plan.start_date.split('T')[0] : '',
                                end_date: plan.end_date ? plan.end_date.split('T')[0] : '',
                                status: plan.status || 'Yellow'
                            }));
                            // Pad with empty rows to have at least 5
                            while (filledData.length < 5) {
                                filledData.push({ plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' });
                            }
                            setEditData(filledData);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleEditChange = (index, field, value) => {
        setEditData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
    };

    const handleAddRow = () => {
        setEditData(prev => [...prev, { plan_description: '', responsible_emp_id: '', start_date: '', end_date: '', status: 'Yellow' }]);
    };

    const handleSave = async () => {
        try {
            const response = await apiRequest(`/projects/${projectId}/action-plans/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actionPlans: editData })
            });

            if (response.ok) {
                // Refresh data
                const plansRes = await apiRequest(`/projects/${projectId}/action-plans`);
                if (plansRes.ok) {
                    const plansData = await plansRes.json();
                    setActionPlans(plansData);
                }
                setIsEditing(false);
                alert('Action plans saved successfully!');
            } else {
                alert('Failed to save action plans');
            }
        } catch (err) {
            console.error('Error saving action plans:', err);
            alert('Error saving action plans');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getMemberImageUrl = (empId) => {
        return getMemberPhotoUrl(empId, customPhotos);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: '#e8eef7' }}>
                <TableContainer>
                    <StyledTable className="project-table" aria-label="action plan table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#c5d5e8' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d', width: '36px' }}>No.</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1a365d' }}>Action Plan</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1a365d', width: '140px' }}>Responsibility</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1a365d', width: '110px' }}>Start Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1a365d', width: '110px' }}>End Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1a365d', width: '80px' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isEditing ? (
                                // Edit Mode - Show input form
                                editData.map((row, index) => (
                                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f5f8fc' : '#ffffff' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#8b0000', verticalAlign: 'top', pt: 2 }}>{index + 1}.</TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <TextareaAutosize
                                                minRows={3}
                                                maxRows={8}
                                                value={row.plan_description}
                                                onChange={(e) => handleEditChange(index, 'plan_description', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    fontSize: '13px',
                                                    fontFamily: 'inherit',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box',
                                                    lineHeight: '1.4'
                                                }}
                                                placeholder="Enter action plan..."
                                            />
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={row.responsible_emp_id}
                                                    onChange={(e) => handleEditChange(index, 'responsible_emp_id', e.target.value)}
                                                    displayEmpty
                                                    sx={{ backgroundColor: 'white' }}
                                                >
                                                    <MenuItem value="">- Please Select Member -</MenuItem>
                                                    {teamMembers.map((member) => (
                                                        <MenuItem key={member.c_emp_id} value={member.c_emp_id}>
                                                            {member.c_name} {member.c_lastname} {member.role ? `(${member.role})` : ''}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <input
                                                type="date"
                                                value={row.start_date}
                                                onChange={(e) => handleEditChange(index, 'start_date', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <input
                                                type="date"
                                                value={row.end_date}
                                                onChange={(e) => handleEditChange(index, 'end_date', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={row.status}
                                                    onChange={(e) => handleEditChange(index, 'status', e.target.value)}
                                                    sx={{ backgroundColor: 'white' }}
                                                >
                                                    <MenuItem value="Yellow">Yellow</MenuItem>
                                                    <MenuItem value="Green">Green</MenuItem>
                                                    <MenuItem value="Red">Red</MenuItem>
                                                    <MenuItem value="Gray">Gray</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                // Display Mode - Show saved data
                                actionPlans.length > 0 ? (
                                    actionPlans.map((row, index) => (
                                        <TableRow key={row.id} sx={{ backgroundColor: index % 2 === 0 ? '#f5f8fc' : '#ffffff' }}>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#8b0000' }}>{index + 1}.</TableCell>
                                            <TableCell>{row.plan_description}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={getMemberImageUrl(row.responsible_emp_id)}
                                                        alt={row.responsible_fullname}
                                                        sx={{ width: 40, height: 40 }}
                                                        onError={(e) => handlePhotoError(e, row.responsible_emp_id)}
                                                    />
                                                    <span style={{ color: '#0066cc' }}>{row.responsible_fullname || '-'}</span>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">{formatDate(row.start_date)}</TableCell>
                                            <TableCell align="center">{formatDate(row.end_date)}</TableCell>
                                            <TableCell align="center"><StatusBall status={row.status} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#666' }}>
                                            No action plans yet. Click "New Action Plan" to add.
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </StyledTable>
                </TableContainer>

                {/* Action Buttons - Only show for project owner */}
                {isOwner && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        borderColor: '#8b0000',
                                        color: '#8b0000',
                                        '&:hover': { borderColor: '#660000', backgroundColor: '#fff5f5' }
                                    }}
                                >
                                    New Action Plan
                                </Button>
                                {actionPlans.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditing(true)}
                                        sx={{
                                            borderColor: '#1a365d',
                                            color: '#1a365d',
                                            '&:hover': { borderColor: '#0d1b2a', backgroundColor: '#f0f4f8' }
                                        }}
                                    >
                                        Edit Action Plan
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleAddRow}
                                    sx={{
                                        borderColor: '#8b0000',
                                        color: '#8b0000',
                                        '&:hover': { borderColor: '#660000', backgroundColor: '#fff5f5' }
                                    }}
                                >
                                    Add Row
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<CheckIcon />}
                                    onClick={handleSave}
                                    sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' }
                                    }}
                                >
                                    Update Action Plan
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    sx={{
                                        borderColor: '#666',
                                        color: '#666',
                                        '&:hover': { borderColor: '#333', backgroundColor: '#f5f5f5' }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ActionPlan;
