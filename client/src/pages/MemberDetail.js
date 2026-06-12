import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import {
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import {
    FormControl,
    Select,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Box,
    Button
} from "@mui/material";
import Sidebar from '../components/Sidebar';
import { apiGet, API_BASE_URL } from '../utils/api';

export default function MemberDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [member, setMember] = useState(null);
    const [ownerProjects, setOwnerProjects] = useState([]);
    const [memberProjects, setMemberProjects] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [customPhotos, setCustomPhotos] = useState({});

    // Year options: 2 years before and 2 years after current year
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    // Fetch custom profile photos
    useEffect(() => {
        apiGet('/profile/photos/all')
            .then(data => {
                if (data.photos) setCustomPhotos(data.photos);
            })
            .catch(() => {});
    }, []);

    // Fetch member and projects data
    useEffect(() => {
        setLoading(true);

        Promise.all([
            apiGet('/members-with-counts'),
            apiGet(`/my-projects/${id}?year=${selectedYear}`)
        ]).then(([members, projectsData]) => {
            // Find the specific member by c_emp_id
            const foundMember = members.find(m =>
                m.c_emp_id === parseInt(id) ||
                String(m.c_emp_id) === id
            );
            setMember(foundMember);

            // Set owner and member projects from API
            setOwnerProjects(projectsData.ownerProjects || []);
            setMemberProjects(projectsData.memberProjects || []);

            // Combine all projects for dashboard
            const all = [...(projectsData.ownerProjects || []), ...(projectsData.memberProjects || [])];
            setAllProjects(all);

            console.log('Found member:', foundMember);
            console.log('Owner projects:', projectsData.ownerProjects);
            console.log('Member projects:', projectsData.memberProjects);

            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    }, [id, selectedYear]);

    // Get member profile photo URL - check custom upload first, then TVS
    const getMemberPhotoUrl = (empId) => {
        if (customPhotos[empId]) {
            return `${API_BASE_URL}/uploads/profiles/${customPhotos[empId]}`;
        }
        return `https://ibsdo.com/tvs/ltvs/emp_pic/${empId}.jpg`;
    };

    // Fallback: try BSDO path, then default image
    const handlePhotoError = (e, empId) => {
        const bsdoUrl = `https://ibsdo.com/bsdo/emp_pic/${empId}.jpg`;
        const defaultUrl = process.env.PUBLIC_URL + '/assets/project-owner.jpg';

        if (e.target.src.includes('/tvs/')) {
            e.target.src = bsdoUrl;
        } else {
            e.target.src = defaultUrl;
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Get status display info
    const getStatusInfo = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'green':
                return { color: '#4CAF50', text: 'Completed' };
            case 'yellow':
                return { color: '#FFEB3B', text: 'OnProcessing' };
            case 'red':
                return { color: '#f44336', text: 'Incomplete' };
            case 'orange':
                return { color: '#FF9800', text: 'Delay' };
            case 'grey':
            case 'gray':
            default:
                return { color: '#9E9E9E', text: 'Not Start' };
        }
    };

    // Calculate project counts by type (c_project_group_id: 1 = media, 2 = content)
    const mediaProjects = allProjects.filter(p =>
        p.c_project_group_id === 1 || p.c_project_group_id === '1'
    );
    const contentProjects = allProjects.filter(p =>
        p.c_project_group_id === 2 || p.c_project_group_id === '2'
    );

    // Calculate project counts by status
    const getStatusCounts = (projectList) => {
        return {
            complete: projectList.filter(p => p.c_project_status?.toLowerCase() === 'green').length,
            onProcess: projectList.filter(p => p.c_project_status?.toLowerCase() === 'yellow').length,
            incomplete: projectList.filter(p => p.c_project_status?.toLowerCase() === 'red').length,
            notStart: projectList.filter(p =>
                p.c_project_status?.toLowerCase() === 'grey' ||
                p.c_project_status?.toLowerCase() === 'gray' ||
                !p.c_project_status
            ).length
        };
    };

    const mediaStatus = getStatusCounts(mediaProjects);
    const contentStatus = getStatusCounts(contentProjects);

    // Donut chart for project types
    const typeChartOptions = {
        chart: { type: 'donut' },
        labels: ['MEDIA', 'CONTENT'],
        colors: ['#2196F3', '#9C27B0'],
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => allProjects.length
                        }
                    }
                }
            }
        }
    };

    // Status pie chart options
    const statusChartOptions = {
        chart: { type: 'donut' },
        labels: ['Complete', 'On process', 'Incomplete', 'Not Start'],
        colors: ['#4CAF50', '#FFEB3B', '#f44336', '#9E9E9E'],
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%'
                }
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    {/* Header with back button and member name */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <IconButton
                                onClick={() => navigate('/members')}
                                style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                    src={getMemberPhotoUrl(member?.c_emp_id)}
                                    alt={member?.c_name}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #3498db'
                                    }}
                                    onError={(e) => handlePhotoError(e, member?.c_emp_id)}
                                />
                                <div className='body-title' style={{ margin: 0, marginRight: '20px' }}>
                                    {member?.c_name} {member?.c_lastname}
                                </div>
                            </div>
                        </div>
                        <FormControl size="small">
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={{ backgroundColor: 'white', minWidth: '100px' }}
                            >
                                {yearOptions.map(year => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .Mui-selected': { color: '#e91e63 !important' },
                                '& .MuiTabs-indicator': { backgroundColor: '#e91e63' }
                            }}
                        >
                            <Tab label="Project Overall Dashboard" />
                            <Tab label="Project Owner" />
                            <Tab label="Project Member" />
                        </Tabs>
                    </Box>

                    {activeTab === 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '24px',
                            width: '100%'
                        }}>
                            {/* Number of Projects by Type */}
                            <div style={{
                                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                    <span style={{ fontSize: '18px' }}>☰</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'white' }}>Number of Project</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '220px', height: '220px' }}>
                                        <Chart
                                            options={typeChartOptions}
                                            series={[mediaProjects.length, contentProjects.length]}
                                            type="donut"
                                            height={220}
                                        />
                                    </div>
                                    <div style={{ minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '40px', height: '15px', backgroundColor: '#2196F3', borderRadius: '3px' }}></div>
                                            <span style={{ fontWeight: 'bold', color: '#2196F3', minWidth: '80px' }}>MEDIA</span>
                                            <span style={{ fontWeight: 'bold', color: 'white' }}>{mediaProjects.length}</span>
                                            <span style={{ color: '#999' }}>Project</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '40px', height: '15px', backgroundColor: '#9C27B0', borderRadius: '3px' }}></div>
                                            <span style={{ fontWeight: 'bold', color: '#9C27B0', minWidth: '80px' }}>CONTENT</span>
                                            <span style={{ fontWeight: 'bold', color: 'white' }}>{contentProjects.length}</span>
                                            <span style={{ color: '#999' }}>Project</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px', marginTop: '10px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'white', minWidth: '120px' }}>Total</span>
                                            <span style={{ fontWeight: 'bold', color: '#2196F3', fontSize: '18px' }}>{allProjects.length}</span>
                                            <span style={{ color: '#999' }}>Project</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Status by Category */}
                            <div style={{
                                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                            }}>
                                <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '18px' }}>📊</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'white' }}>Number of Project</span>
                                        <span style={{ color: 'white', marginLeft: '10px' }}>Total</span>
                                        <span style={{ fontWeight: 'bold', color: '#2196F3', fontSize: '18px' }}>{allProjects.length}</span>
                                        <span style={{ color: '#999' }}>Project</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '10px', height: '10px', backgroundColor: '#4CAF50', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white' }}>Complete</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '10px', height: '10px', backgroundColor: '#FFEB3B', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white' }}>On process</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '10px', height: '10px', backgroundColor: '#f44336', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white' }}>Incomplete</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '10px', height: '10px', backgroundColor: '#9E9E9E', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white' }}>Not Start</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '15px' }}>
                                    {/* Media Projects */}
                                    <div style={{ textAlign: 'center', flex: '1' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ width: '24px', height: '6px', backgroundColor: '#2196F3', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>MEDIA</span>
                                        </div>
                                        {mediaProjects.length > 0 ? (
                                            <Chart
                                                options={statusChartOptions}
                                                series={[mediaStatus.complete, mediaStatus.onProcess, mediaStatus.incomplete, mediaStatus.notStart]}
                                                type="donut"
                                                height={140}
                                            />
                                        ) : (
                                            <div style={{
                                                height: '140px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#999',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}>
                                                N/A
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Projects */}
                                    <div style={{ textAlign: 'center', flex: '1' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ width: '24px', height: '6px', backgroundColor: '#9C27B0', borderRadius: '2px' }}></div>
                                            <span style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>CONTENT</span>
                                        </div>
                                        {contentProjects.length > 0 ? (
                                            <Chart
                                                options={statusChartOptions}
                                                series={[contentStatus.complete, contentStatus.onProcess, contentStatus.incomplete, contentStatus.notStart]}
                                                type="donut"
                                                height={140}
                                            />
                                        ) : (
                                            <div style={{
                                                height: '140px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#999',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}>
                                                N/A
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div style={{ width: '100%' }}>
                            {/* MEDIA Projects */}
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                                MEDIA
                            </div>
                            <TableContainer style={{ marginBottom: '30px', backgroundColor: 'rgba(200, 220, 240, 0.95)', borderRadius: '8px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'rgba(180, 200, 220, 0.95)' }}>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '60px' }}>No.</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Name</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Owner</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>Start Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>End Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px', textAlign: 'center' }}>Over All Status</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '80px', textAlign: 'center' }}>View</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '100px', textAlign: 'center' }}>Approve Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ownerProjects.filter(p => p.c_project_group_id === 1 || p.c_project_group_id === '1').length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} style={{ textAlign: 'center', color: '#666' }}>
                                                    No MEDIA projects as owner
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            ownerProjects.filter(p => p.c_project_group_id === 1 || p.c_project_group_id === '1').map((project, idx) => {
                                                const statusInfo = getStatusInfo(project.c_project_status);
                                                return (
                                                    <TableRow key={project.id} hover style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }}>
                                                        <TableCell style={{ color: '#333' }}>{idx + 1}.</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{project.c_name || 'N/A'}</TableCell>
                                                        <TableCell style={{ color: '#3498db' }}>{project.full_owner_name || `${member?.c_name || ''} ${member?.c_lastname || ''}`}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_start)}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_finish)}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: statusInfo.color, marginBottom: '4px' }} />
                                                                <span style={{ fontSize: '11px', color: '#333' }}>{statusInfo.text}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => navigate(`/project/${project.id}`)}
                                                                style={{ backgroundColor: '#3498db', color: 'white', minWidth: '60px' }}
                                                            >
                                                                <SearchIcon fontSize="small" style={{ marginRight: '4px' }} />
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <CheckCircleIcon style={{ color: '#4CAF50' }} />
                                                                <span style={{ fontSize: '11px', color: '#4CAF50' }}>Approved</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* CONTENT Projects */}
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                                CONTENT
                            </div>
                            <TableContainer style={{ backgroundColor: 'rgba(200, 220, 240, 0.95)', borderRadius: '8px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'rgba(180, 200, 220, 0.95)' }}>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '60px' }}>No.</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Name</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Owner</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>Start Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>End Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px', textAlign: 'center' }}>Over All Status</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '80px', textAlign: 'center' }}>View</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '100px', textAlign: 'center' }}>Approve Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ownerProjects.filter(p => p.c_project_group_id === 2 || p.c_project_group_id === '2').length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} style={{ textAlign: 'center', color: '#666' }}>
                                                    No CONTENT projects as owner
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            ownerProjects.filter(p => p.c_project_group_id === 2 || p.c_project_group_id === '2').map((project, idx) => {
                                                const statusInfo = getStatusInfo(project.c_project_status);
                                                return (
                                                    <TableRow key={project.id} hover style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }}>
                                                        <TableCell style={{ color: '#333' }}>{idx + 1}.</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{project.c_name || 'N/A'}</TableCell>
                                                        <TableCell style={{ color: '#3498db' }}>{project.full_owner_name || `${member?.c_name || ''} ${member?.c_lastname || ''}`}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_start)}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_finish)}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: statusInfo.color, marginBottom: '4px' }} />
                                                                <span style={{ fontSize: '11px', color: '#333' }}>{statusInfo.text}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => navigate(`/project/${project.id}`)}
                                                                style={{ backgroundColor: '#3498db', color: 'white', minWidth: '60px' }}
                                                            >
                                                                <SearchIcon fontSize="small" style={{ marginRight: '4px' }} />
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <CheckCircleIcon style={{ color: '#4CAF50' }} />
                                                                <span style={{ fontSize: '11px', color: '#4CAF50' }}>Approved</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}

                    {activeTab === 2 && (
                        <div style={{ width: '100%' }}>
                            {/* MEDIA Projects as Member */}
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                                MEDIA
                            </div>
                            <TableContainer style={{ marginBottom: '30px', backgroundColor: 'rgba(200, 220, 240, 0.95)', borderRadius: '8px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'rgba(180, 200, 220, 0.95)' }}>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '60px' }}>No.</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Name</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Owner</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>Start Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>End Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px', textAlign: 'center' }}>Over All Status</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '80px', textAlign: 'center' }}>View</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '100px', textAlign: 'center' }}>Approve Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {memberProjects.filter(p => p.c_project_group_id === 1 || p.c_project_group_id === '1').length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} style={{ textAlign: 'center', color: '#666' }}>
                                                    No MEDIA projects as member
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            memberProjects.filter(p => p.c_project_group_id === 1 || p.c_project_group_id === '1').map((project, idx) => {
                                                const statusInfo = getStatusInfo(project.c_project_status);
                                                return (
                                                    <TableRow key={project.id} hover style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }}>
                                                        <TableCell style={{ color: '#333' }}>{idx + 1}.</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{project.c_name || 'N/A'}</TableCell>
                                                        <TableCell style={{ color: '#3498db' }}>{project.full_owner_name || '-'}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_start)}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_finish)}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: statusInfo.color, marginBottom: '4px' }} />
                                                                <span style={{ fontSize: '11px', color: '#333' }}>{statusInfo.text}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => navigate(`/project/${project.id}`)}
                                                                style={{ backgroundColor: '#3498db', color: 'white', minWidth: '60px' }}
                                                            >
                                                                <SearchIcon fontSize="small" style={{ marginRight: '4px' }} />
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <CheckCircleIcon style={{ color: '#4CAF50' }} />
                                                                <span style={{ fontSize: '11px', color: '#4CAF50' }}>Approved</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* CONTENT Projects as Member */}
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                                CONTENT
                            </div>
                            <TableContainer style={{ backgroundColor: 'rgba(200, 220, 240, 0.95)', borderRadius: '8px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: 'rgba(180, 200, 220, 0.95)' }}>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '60px' }}>No.</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Name</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333' }}>Project Owner</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>Start Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px' }}>End Date</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '120px', textAlign: 'center' }}>Over All Status</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '80px', textAlign: 'center' }}>View</TableCell>
                                            <TableCell style={{ fontWeight: 'bold', color: '#333', width: '100px', textAlign: 'center' }}>Approve Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {memberProjects.filter(p => p.c_project_group_id === 2 || p.c_project_group_id === '2').length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} style={{ textAlign: 'center', color: '#666' }}>
                                                    No CONTENT projects as member
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            memberProjects.filter(p => p.c_project_group_id === 2 || p.c_project_group_id === '2').map((project, idx) => {
                                                const statusInfo = getStatusInfo(project.c_project_status);
                                                return (
                                                    <TableRow key={project.id} hover style={{ backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }}>
                                                        <TableCell style={{ color: '#333' }}>{idx + 1}.</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{project.c_name || 'N/A'}</TableCell>
                                                        <TableCell style={{ color: '#3498db' }}>{project.full_owner_name || '-'}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_start)}</TableCell>
                                                        <TableCell style={{ color: '#333' }}>{formatDate(project.c_project_finish)}</TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: statusInfo.color, marginBottom: '4px' }} />
                                                                <span style={{ fontSize: '11px', color: '#333' }}>{statusInfo.text}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => navigate(`/project/${project.id}`)}
                                                                style={{ backgroundColor: '#3498db', color: 'white', minWidth: '60px' }}
                                                            >
                                                                <SearchIcon fontSize="small" style={{ marginRight: '4px' }} />
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <CheckCircleIcon style={{ color: '#4CAF50' }} />
                                                                <span style={{ fontSize: '11px', color: '#4CAF50' }}>Approved</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
