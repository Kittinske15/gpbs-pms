import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

export default function Investment() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [project_media, setProjectMedia] = useState([]);
    const [project_content, setProjectContent] = useState([]);
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const rowsPerPage = 10;
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    const [customPhotos, setCustomPhotos] = useState({});

    // Get custom photos on mount
    useEffect(() => {
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    useEffect(() => {
        apiGet('/project_media')
            .then((data) => {
                setProjectMedia(data);
            })
            .catch((error) => console.error('Error fetching project media:', error));
    }, []);

    useEffect(() => {
        apiGet('/project_content')
            .then((data) => {
                setProjectContent(data);
            })
            .catch((error) => console.error('Error fetching project content:', error));
    }, []);

    useEffect(() => {
        apiGet('/members-with-counts')
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => console.error('Error fetching member data:', error));
    }, []);

    // Filter projects by selected year
    const filteredMedia = project_media.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );
    const filteredContent = project_content.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );

    // Combine year-filtered projects
    const allProjects = [...filteredMedia, ...filteredContent];

    // Filter projects by search term
    const filteredProjects = allProjects.filter(project => {
        const searchLower = searchTerm.toLowerCase();
        const projectName = project.c_name?.toLowerCase() || '';
        const ownerName = `${project.owner_name || ''} ${project.owner_lastname || ''}`.toLowerCase();
        return projectName.includes(searchLower) || ownerName.includes(searchLower);
    });

    // Calculate totals from real data
    const totalInvestmentTarget = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget) || 0), 0);
    const totalInvestmentActual = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget_act) || 0), 0);
    const totalReturnTarget = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_roi_tgt) || 0), 0);
    const totalReturnActual = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Format number to M (millions) with commas
    const formatToM = (value) => {
        const m = value / 1000000;
        return m.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Format number with commas
    const formatNumber = (value) => {
        const num = parseFloat(value) || 0;
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Get project status display
    const getStatusDisplay = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'green') return { text: 'Completed', color: '#2ecc71', bgColor: '#d5f4e6' };
        if (statusLower === 'yellow') return { text: 'On Processing', color: '#f39c12', bgColor: '#fef9e7' };
        if (statusLower === 'orange') return { text: 'Project Delay', color: '#e67e22', bgColor: '#fdebd0' };
        if (statusLower === 'red') return { text: 'Cancel', color: '#e74c3c', bgColor: '#fadbd8' };
        if (statusLower === 'grey' || statusLower === 'gray') return { text: 'Not Start', color: '#95a5a6', bgColor: '#eaeded' };
        return { text: status || 'Unknown', color: '#95a5a6', bgColor: '#eaeded' };
    };

    // Get project group display
    const getProjectGroup = (groupId) => {
        return groupId === 1 ? 'MEDIA' : 'CONTENT';
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Styled header cells for Investment columns
    const TgtHeaderCell = styled(TableCell)({
        backgroundColor: '#b8860b',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '2px solid #8b6914',
    });

    const ActHeaderCell = styled(TableCell)({
        backgroundColor: '#228b22',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '13px',
        borderBottom: '2px solid #1a6b1a',
    });

    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='body-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>PROJECT YTD INVESTMENT</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>Year:</span>
                            <FormControl size="small">
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    style={{ backgroundColor: '#fff', minWidth: '100px' }}
                                >
                                    {yearOptions.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='card-grid'>
                        <div className='card'>
                            <div>
                                <div className='card-title'>NO. OF PROJECT</div>
                                <div className='card-subtitle'>{allProjects.length} Projects</div>
                            </div>
                            <Link className='card-img-flex' to='/project'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>YTD INVESTMENT</div>
                                <div className='card-subtitle'>TGT: {formatToM(totalInvestmentTarget)} MB</div>
                                <div className='card-subtitle'>ACT: {formatToM(totalInvestmentActual)} MB</div>
                            </div>
                            <Link className='card-img-flex' to='/investment'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>YTD RETURN</div>
                                <div className='card-subtitle'>TGT: {formatToM(totalReturnTarget)} MB</div>
                                <div className='card-subtitle'>ACT: {formatToM(totalReturnActual)} MB</div>
                            </div>
                            <Link className='card-img-flex' to='/finance'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div style={{ marginBottom: '10px' }}>
                                <div className='card-title'>MEMBER(S)</div>
                                <div className='card-subtitle'>{members.length} Members</div>
                            </div>
                            <Link className='card-img-flex' to='/members'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                    </div>
                    <div className='gauge'>
                        <div className='gauge-title' style={{ marginBottom: '15px' }}>
                            YTD Investment in {selectedYear} ( {allProjects.length} Projects )
                        </div>

                        {/* Search Box */}
                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                            <TextField
                                size="small"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(0);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon style={{ color: '#999' }} />
                                        </InputAdornment>
                                    ),
                                    style: { backgroundColor: 'white', borderRadius: '4px' }
                                }}
                                style={{ width: '300px' }}
                            />
                        </div>

                        <TableContainer>
                            <Table className="member-table" aria-label="investment table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '50px' }}>No.</TableCell>
                                        <TableCell align="left">Project Name</TableCell>
                                        <TableCell align="center" style={{ width: '130px' }}>Project Status</TableCell>
                                        <TableCell align="center" style={{ width: '150px' }}>Project Owner</TableCell>
                                        <TableCell align="center" style={{ width: '100px' }}>Project Group</TableCell>
                                        <TgtHeaderCell align="center" style={{ width: '130px' }}>Investment TGT</TgtHeaderCell>
                                        <ActHeaderCell align="center" style={{ width: '130px' }}>Investment Act</ActHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProjects.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((project, index) => {
                                        const status = getStatusDisplay(project.c_project_status);
                                        return (
                                            <TableRow key={project.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1 + page * rowsPerPage}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Link
                                                        to={`/project/${project.id}`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <div style={{ fontWeight: 'bold', color: '#3498db', cursor: 'pointer' }}>
                                                            {project.c_name}
                                                        </div>
                                                    </Link>
                                                    <div style={{ fontSize: '12px', color: '#e74c3c' }}>
                                                        Period {formatDate(project.c_project_start)} To {formatDate(project.c_project_finish)}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span style={{
                                                        backgroundColor: status.bgColor,
                                                        color: status.color,
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                        display: 'inline-block'
                                                    }}>
                                                        {status.text}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                        <img
                                                            src={getMemberPhotoUrl(project.c_create_by, customPhotos)}
                                                            alt="owner"
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover'
                                                            }}
                                                            onError={(e) => handlePhotoError(e, project.c_create_by)}
                                                        />
                                                        <span>{project.owner_name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span style={{
                                                        backgroundColor: project.c_project_group_id === 1 ? '#3498db' : '#27ae60',
                                                        color: 'white',
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        fontWeight: 'bold',
                                                        fontSize: '12px'
                                                    }}>
                                                        {getProjectGroup(project.c_project_group_id)}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center" style={{
                                                    backgroundColor: 'rgba(184, 134, 11, 0.15)',
                                                    color: '#ffd700',
                                                    fontWeight: '600',
                                                    borderLeft: '2px solid rgba(184, 134, 11, 0.4)'
                                                }}>
                                                    {formatNumber(project.c_budget)}
                                                </TableCell>
                                                <TableCell align="center" style={{
                                                    backgroundColor: 'rgba(34, 139, 34, 0.15)',
                                                    color: '#90ee90',
                                                    fontWeight: '600',
                                                    borderLeft: '2px solid rgba(34, 139, 34, 0.4)'
                                                }}>
                                                    {formatNumber(project.c_budget_act)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <TablePagination
                                style={{ color: 'white' }}
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={filteredProjects.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                            />
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div >
    );
}
