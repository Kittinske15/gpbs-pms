import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Chart from "react-apexcharts";
import Sidebar from '../components/Sidebar';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';
import { getUser } from '../utils/auth';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

export default function Finance() {
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
    const [currentUser, setCurrentUser] = useState(null);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [customPhotos, setCustomPhotos] = useState({});

    // Get current user on mount
    useEffect(() => {
        const user = getUser();
        setCurrentUser(user);
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

    // Calculate totals from year-filtered data
    const totalInvestmentTarget = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget) || 0), 0);
    const totalInvestmentActual = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget_act) || 0), 0);
    const totalReturnTarget = allProjects.reduce((sum, p) => sum + (parseFloat(p.c_roi_tgt) || 0), 0);
    // Calculate actual return based on c_roi_year matching selected year
    const totalReturnActual = allProjects
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Calculate return by ROI type (Direct Revenue = 1, Indirect Revenue = 2, Cost Saving = 3)
    // Filter by c_roi_year matching selected year for actual values
    const directRevenue = allProjects
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 1 || p.c_roi_type === '1' || p.c_roi_type?.toLowerCase() === 'direct revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const indirectRevenue = allProjects
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 2 || p.c_roi_type === '2' || p.c_roi_type?.toLowerCase() === 'indirect revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const costSaving = allProjects
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 3 || p.c_roi_type === '3' || p.c_roi_type?.toLowerCase() === 'cost saving')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Calculate return by team (filter by c_roi_year matching selected year)
    const mediaDirectRevenue = filteredMedia
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 1 || p.c_roi_type === '1' || p.c_roi_type?.toLowerCase() === 'direct revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const mediaIndirectRevenue = filteredMedia
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 2 || p.c_roi_type === '2' || p.c_roi_type?.toLowerCase() === 'indirect revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const mediaCostSaving = filteredMedia
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 3 || p.c_roi_type === '3' || p.c_roi_type?.toLowerCase() === 'cost saving')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    const contentDirectRevenue = filteredContent
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 1 || p.c_roi_type === '1' || p.c_roi_type?.toLowerCase() === 'direct revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const contentIndirectRevenue = filteredContent
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 2 || p.c_roi_type === '2' || p.c_roi_type?.toLowerCase() === 'indirect revenue')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);
    const contentCostSaving = filteredContent
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .filter(p => p.c_roi_type === 3 || p.c_roi_type === '3' || p.c_roi_type?.toLowerCase() === 'cost saving')
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Format number to M (millions) with commas
    const formatToM = (value) => {
        const m = value / 1000000;
        return m.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Format number to MB for charts
    const formatToMB = (value) => {
        return (value / 1000000).toFixed(2);
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

    // Sorting handler
    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
        setPage(0);
    };

    // Sort projects based on column and direction
    const sortProjects = (projects) => {
        if (!sortColumn) return projects;

        return [...projects].sort((a, b) => {
            let valueA, valueB;

            switch (sortColumn) {
                case 'name':
                    valueA = (a.c_name || '').toLowerCase();
                    valueB = (b.c_name || '').toLowerCase();
                    break;
                case 'status':
                    valueA = (a.c_project_status || '').toLowerCase();
                    valueB = (b.c_project_status || '').toLowerCase();
                    break;
                case 'owner':
                    valueA = (a.owner_name || '').toLowerCase();
                    valueB = (b.owner_name || '').toLowerCase();
                    break;
                case 'group':
                    valueA = a.c_project_group_id || 0;
                    valueB = b.c_project_group_id || 0;
                    break;
                case 'return_tgt':
                    valueA = parseFloat(a.c_roi_tgt) || 0;
                    valueB = parseFloat(b.c_roi_tgt) || 0;
                    break;
                case 'return_act':
                    valueA = parseFloat(a.c_roi_act) || 0;
                    valueB = parseFloat(b.c_roi_act) || 0;
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

    // Styled header cells for Return columns
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

    // Donut chart for YTD Benefit return by type
    const chartCategoriesOptions = {
        chart: {
            type: "donut",
            toolbar: {
                show: false,
            },
        },
        legend: {
            labels: {
                colors: '#243044',
            },
            position: 'bottom',
            formatter: function(seriesName) {
                return seriesName;
            }
        },
        series: [
            parseFloat(formatToMB(directRevenue)) || 0,
            parseFloat(formatToMB(indirectRevenue)) || 0,
            parseFloat(formatToMB(costSaving)) || 0
        ],
        labels: ["Direct Revenue", "Indirect Revenue", "Cost Saving"],
        colors: ["#52be80", "#f5b041", "#3498db"],
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: false,
                        }
                    }
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                return val.toFixed(1) + '%';
            }
        },
        title: {
            text: 'YTD Benefit return by type (MB)',
            align: 'center',
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#243044',
            },
        },
    };

    // Stacked bar chart for YTD Benefit Return by category
    const stackedBarChart = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
            }
        },
        title: {
            text: 'YTD Benefit Return (MB)',
            align: 'center',
            style: {
                color: '#243044',
                fontWeight: 'bold'
            },
        },
        xaxis: {
            categories: ['MEDIA TEAM', 'CONTENT TEAM'],
            labels: {
                style: {
                    colors: '#243044',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#243044',
                },
                formatter: function(val) {
                    return val.toLocaleString();
                }
            },
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: '#243044'
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                if (val === 0) return '';
                return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
            },
            style: {
                fontSize: '10px'
            }
        },
        colors: ['#52be80', '#f5b041', '#3498db'],
    };

    const stackedBarSeries = [
        {
            name: 'Direct Revenue',
            data: [
                parseFloat(formatToMB(mediaDirectRevenue)) || 0,
                parseFloat(formatToMB(contentDirectRevenue)) || 0
            ]
        },
        {
            name: 'Indirect Revenue',
            data: [
                parseFloat(formatToMB(mediaIndirectRevenue)) || 0,
                parseFloat(formatToMB(contentIndirectRevenue)) || 0
            ]
        },
        {
            name: 'Cost Saving',
            data: [
                parseFloat(formatToMB(mediaCostSaving)) || 0,
                parseFloat(formatToMB(contentCostSaving)) || 0
            ]
        }
    ];

    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='body-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>CURRENT YTD RETURN</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#243044', fontWeight: 'bold', fontSize: '14px' }}>Year:</span>
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
                        <div className='gauge-title'>
                            YTD Benefit Return in {selectedYear}: {formatToM(totalReturnActual)} MB
                        </div>
                        <div className='finance-gauge-grid'>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Chart
                                    options={chartCategoriesOptions}
                                    series={chartCategoriesOptions.series}
                                    type="donut"
                                    width="400"
                                    height="350"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Chart
                                    options={stackedBarChart}
                                    series={stackedBarSeries}
                                    type="bar"
                                    width="450"
                                    height="350"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='gauge'>
                        <div className='gauge-title' style={{ marginBottom: '15px' }}>
                            YTD Benefit Return in {selectedYear} ( {allProjects.length} Projects )
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
                            <Table className="member-table" aria-label="return table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '50px' }}>No.</TableCell>
                                        <TableCell align="left">
                                            <TableSortLabel
                                                active={sortColumn === 'name'}
                                                direction={sortColumn === 'name' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('name')}
                                            >
                                                Project Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '130px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'status'}
                                                direction={sortColumn === 'status' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('status')}
                                            >
                                                Project Status
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '150px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'owner'}
                                                direction={sortColumn === 'owner' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('owner')}
                                            >
                                                Project Owner
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ width: '100px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'group'}
                                                direction={sortColumn === 'group' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('group')}
                                            >
                                                Project Group
                                            </TableSortLabel>
                                        </TableCell>
                                        <TgtHeaderCell align="center" style={{ width: '130px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'return_tgt'}
                                                direction={sortColumn === 'return_tgt' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('return_tgt')}
                                                sx={{ '& .MuiTableSortLabel-icon': { color: 'white !important' }, color: 'white' }}
                                            >
                                                RETURN TGT
                                            </TableSortLabel>
                                        </TgtHeaderCell>
                                        <ActHeaderCell align="center" style={{ width: '130px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'return_act'}
                                                direction={sortColumn === 'return_act' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('return_act')}
                                                sx={{ '& .MuiTableSortLabel-icon': { color: 'white !important' }, color: 'white' }}
                                            >
                                                RETURN ACT
                                            </TableSortLabel>
                                        </ActHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortProjects(filteredProjects).slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((project, index) => {
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
                                                    {formatNumber(project.c_roi_tgt)}
                                                </TableCell>
                                                <TableCell align="center" style={{
                                                    backgroundColor: 'rgba(34, 139, 34, 0.15)',
                                                    color: '#90ee90',
                                                    fontWeight: '600',
                                                    borderLeft: '2px solid rgba(34, 139, 34, 0.4)'
                                                }}>
                                                    {formatNumber(project.c_roi_act)}
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
