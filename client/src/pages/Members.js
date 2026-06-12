import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    TableSortLabel,
    FormControl,
    Select,
    MenuItem
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { apiGet, API_BASE_URL } from '../utils/api';
import { getUser } from '../utils/auth';

export default function Members() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    const [customPhotos, setCustomPhotos] = useState({});

    // Get current user on mount
    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);

        // Fetch custom profile photos
        apiGet('/profile/photos/all')
            .then(data => {
                if (data.photos) setCustomPhotos(data.photos);
            })
            .catch(() => {});
    }, []);


    useEffect(() => {
        apiGet(`/members-with-counts?year=${selectedYear}`)
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => console.error('Error fetching member data:', error));

        // Fetch projects for summary cards
        Promise.all([
            apiGet('/project_media'),
            apiGet('/project_content')
        ]).then(([media, content]) => {
            // Filter projects by selected year
            const allProjects = [...media, ...content];
            const filtered = allProjects.filter(p => {
                if (!p.c_project_finish) return true;
                const projectYear = new Date(p.c_project_finish).getFullYear();
                return projectYear >= selectedYear;
            });
            setProjects(filtered);
        }).catch((error) => console.error('Error fetching projects:', error));
    }, [selectedYear]);

    // Filter members by search term
    const filteredMembers = members.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        const name = `${member.c_name || ''} ${member.c_lastname || ''}`.toLowerCase();
        const username = member.c_username?.toLowerCase() || '';
        return name.includes(searchLower) || username.includes(searchLower);
    });

    // Calculate project totals from members data (more accurate for this page)
    const totalMemberProjects = members.reduce((sum, m) => sum + (m.project_owner_count || 0), 0);
    const completedProjects = members.reduce((sum, m) => sum + (m.completed_count || 0), 0);
    const processingProjects = members.reduce((sum, m) => sum + (m.processing_count || 0), 0);
    const activeProjects = completedProjects + processingProjects;
    const nonActiveProjects = totalMemberProjects - activeProjects;

    // Calculate YTD Return from projects data
    const totalReturnTarget = projects.reduce((sum, p) => sum + (parseFloat(p.c_roi_tgt) || 0), 0);
    const totalReturnActual = projects.reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Format number to MB
    const formatToMB = (value) => {
        const mb = value / 1000000;
        return mb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Sorting handler
    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
        setPage(0);
    };

    // Priority members: pinned to top in this order
    const getPriorityOrder = (member) => {
        const name = `${member.c_name || ''} ${member.c_lastname || ''}`.toLowerCase();
        if (name.startsWith('birathon')) return 1;
        if (name.startsWith('ongard')) return 2;
        return 3;
    };

    // Sort members based on column and direction
    const getSortedMembers = (membersToSort) => {
        // Default sort: Birathon first, Ongard second, rest alphabetically
        if (!sortColumn) {
            return [...membersToSort].sort((a, b) => {
                const priorityA = getPriorityOrder(a);
                const priorityB = getPriorityOrder(b);
                if (priorityA !== priorityB) return priorityA - priorityB;
                // Both are same priority (non-pinned), sort alphabetically
                const nameA = `${a.c_name || ''} ${a.c_lastname || ''}`.toLowerCase();
                const nameB = `${b.c_name || ''} ${b.c_lastname || ''}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }

        return [...membersToSort].sort((a, b) => {
            let valueA, valueB;

            switch (sortColumn) {
                case 'name':
                    valueA = `${a.c_name || ''} ${a.c_lastname || ''}`.toLowerCase();
                    valueB = `${b.c_name || ''} ${b.c_lastname || ''}`.toLowerCase();
                    break;
                case 'all_projects':
                    valueA = a.all_projects || 0;
                    valueB = b.all_projects || 0;
                    break;
                case 'project_owner':
                    valueA = a.project_owner_count || 0;
                    valueB = b.project_owner_count || 0;
                    break;
                case 'completed':
                    valueA = a.completed_count || 0;
                    valueB = b.completed_count || 0;
                    break;
                case 'on_processing':
                    valueA = a.on_processing_count || 0;
                    valueB = b.on_processing_count || 0;
                    break;
                case 'cancelled':
                    valueA = a.cancelled_count || 0;
                    valueB = b.cancelled_count || 0;
                    break;
                case 'not_started':
                    valueA = a.not_started_count || 0;
                    valueB = b.not_started_count || 0;
                    break;
                default:
                    return 0;
            }

            if (typeof valueA === 'string') {
                return sortDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        });
    };

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

    // Handle member click to view their projects
    const handleMemberClick = (member) => {
        // Navigate to member detail page using c_emp_id
        navigate(`/members/${member.c_emp_id}`);
    };

    // Status cell styles
    const statusCellStyle = (color) => ({
        backgroundColor: color,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '12px 8px'
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
                        <span>MEMBER</span>
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

                    {/* Summary Cards */}
                    <div className='card-grid' style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className='card'>
                            <div>
                                <div className='card-title'>NUMBER OF PROJECT</div>
                                <div className='card-subtitle'>{totalMemberProjects} Projects</div>
                                <div style={{ fontSize: '11px', marginTop: '5px' }}>
                                    <span style={{ color: '#2ecc71' }}>ACTIVE : {activeProjects} PROJECTS</span>
                                    <span style={{ margin: '0 5px' }}>/</span>
                                    <span style={{ color: '#e74c3c' }}>NON-ACTIVE : {nonActiveProjects} PROJECTS</span>
                                </div>
                            </div>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>CURRENT YTD RETURN</div>
                                <div className='card-subtitle'>TGT : {formatToMB(totalReturnTarget)} MB</div>
                                <div className='card-subtitle'>ACT : {formatToMB(totalReturnActual)} MB</div>
                            </div>
                            <Link className='card-img-flex' to='/finance'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>MEMBER</div>
                                <div className='card-subtitle'>{members.length} Members</div>
                            </div>
                        </div>
                    </div>

                    <div className='gauge'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div className='gauge-title'>
                                Member ( {members.length} Members )
                            </div>
                            {/* Search Box */}
                            <TextField
                                size="small"
                                placeholder="Search..."
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
                                style={{ width: '250px' }}
                            />
                        </div>

                        <TableContainer>
                            <Table className="member-table" aria-label="members table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '50px', fontWeight: 'bold' }}>#</TableCell>
                                        <TableCell align="left" style={{ fontWeight: 'bold' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'name'}
                                                direction={sortColumn === 'name' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('name')}
                                                style={{ color: 'inherit' }}
                                            >
                                                NAME
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', width: '100px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'all_projects'}
                                                direction={sortColumn === 'all_projects' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('all_projects')}
                                                style={{ color: 'inherit' }}
                                            >
                                                ALL PROJECT
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', width: '120px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'project_owner'}
                                                direction={sortColumn === 'project_owner' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('project_owner')}
                                                style={{ color: 'inherit' }}
                                            >
                                                PROJECT OWNER
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ ...statusCellStyle('#4CAF50'), width: '100px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'completed'}
                                                direction={sortColumn === 'completed' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('completed')}
                                                style={{ color: 'white' }}
                                            >
                                                COMPLETED
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ ...statusCellStyle('#FFC107'), width: '120px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'on_processing'}
                                                direction={sortColumn === 'on_processing' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('on_processing')}
                                                style={{ color: 'white' }}
                                            >
                                                ONPROCESSING
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ ...statusCellStyle('#f44336'), width: '100px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'cancelled'}
                                                direction={sortColumn === 'cancelled' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('cancelled')}
                                                style={{ color: 'white' }}
                                            >
                                                CANCELLED
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ ...statusCellStyle('#9E9E9E'), width: '100px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'not_started'}
                                                direction={sortColumn === 'not_started' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('not_started')}
                                                style={{ color: 'white' }}
                                            >
                                                NOTSTARTED
                                            </TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getSortedMembers(filteredMembers).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member, index) => {
                                        return (
                                            <TableRow key={member.c_emp_id} hover>
                                                <TableCell component="th" scope="row">
                                                    {index + 1 + page * rowsPerPage}.
                                                </TableCell>
                                                <TableCell align="left">
                                                    <div
                                                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                                                        onClick={() => handleMemberClick(member)}
                                                    >
                                                        <img
                                                            src={getMemberPhotoUrl(member.c_emp_id)}
                                                            alt={member.c_name}
                                                            style={{
                                                                width: '45px',
                                                                height: '45px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: '2px solid rgba(100, 150, 200, 0.5)'
                                                            }}
                                                            onError={(e) => handlePhotoError(e, member.c_emp_id)}
                                                        />
                                                        <div style={{ fontWeight: 'bold', color: '#3498db' }}>
                                                            {member.c_name} {member.c_lastname}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" style={{ fontWeight: '500' }}>
                                                    {member.all_projects || 0}
                                                </TableCell>
                                                <TableCell align="center" style={{ color: '#3498db', fontWeight: 'bold' }}>
                                                    {member.project_owner_count || 0}
                                                </TableCell>
                                                <TableCell align="center" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', fontWeight: 'bold' }}>
                                                    {member.completed_count || 0}
                                                </TableCell>
                                                <TableCell align="center" style={{ backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#FFA000', fontWeight: 'bold' }}>
                                                    {member.on_processing_count || 0}
                                                </TableCell>
                                                <TableCell align="center" style={{ backgroundColor: 'rgba(244, 67, 54, 0.15)', color: '#f44336', fontWeight: 'bold' }}>
                                                    {member.cancelled_count || 0}
                                                </TableCell>
                                                <TableCell align="center" style={{ backgroundColor: 'rgba(158, 158, 158, 0.15)', color: '#9E9E9E', fontWeight: 'bold' }}>
                                                    {member.not_started_count || 0}
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
                                count={filteredMembers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
