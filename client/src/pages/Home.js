import React, { useEffect, useState } from 'react';
import GaugeChart from "react-gauge-chart";
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
    FormControl,
    Select,
    MenuItem,
    TextField,
    InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [project_media, setProjectMedia] = useState([])
    const [project_content, setProjectContent] = useState([])
    const [allProjects, setAllProjects] = useState([]);
    // averageProgress is now calculated dynamically based on selectedYear
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [memberSearchTerm, setMemberSearchTerm] = useState('');
    const [customPhotos, setCustomPhotos] = useState({});

    // Fetch custom photos on mount
    useEffect(() => {
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    useEffect(() => {
        apiGet('/project_media')
            .then((data) => {
                setProjectMedia(data);
            })
            .catch((error) => console.error('Error fetching project data:', error));
    }, []);

    useEffect(() => {
        apiGet('/project_content')
            .then((data) => {
                setProjectContent(data);
            })
            .catch((error) => console.error('Error fetching project data:', error));
    }, []);

    useEffect(() => {
        apiGet(`/members-with-counts?year=${selectedYear}`)
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => console.error('Error fetching member data:', error));
    }, [selectedYear]);

    console.log("member: ", members)

    useEffect(() => {
        setAllProjects([...project_media, ...project_content]);
    }, [project_media, project_content]);

    const totalProjects = allProjects.length;

    const filteredContent = project_content.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );

    const filteredMedia = project_media.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );

    // Filter all projects by selected year
    const filteredAllProjects = allProjects.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );

    // Calculate average progress based on filtered projects.
    // Fall back to a status-derived estimate when c_percent_progress is
    // missing/blank, so the gauge never reads 0% on demo data.
    const progressFromStatus = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'green': return 100;
            case 'yellow': return 60;
            case 'orange': return 42;
            case 'red': return 28;
            default: return 16;
        }
    };
    const filteredProgressValues = filteredAllProjects
        .map(project => {
            const p = parseFloat(project.c_percent_progress);
            return (!isNaN(p) && p > 0) ? p : progressFromStatus(project.c_project_status);
        })
        .filter(value => !isNaN(value));
    const calculatedAverageProgress = filteredProgressValues.length > 0
        ? filteredProgressValues.reduce((sum, value) => sum + value, 0) / filteredProgressValues.length
        : 0;

    console.log("selectedYear:", selectedYear);
    console.log("filteredAllProjects count:", filteredAllProjects.length);
    console.log("calculatedAverageProgress:", calculatedAverageProgress);

    // Use filteredAllProjects for status counts
    const yellowProjects = filteredAllProjects.filter(
        project => project.c_project_status?.toLowerCase() === "yellow"
    ).length;

    const redProjects = filteredAllProjects.filter(
        project => project.c_project_status?.toLowerCase() === "red"
    ).length;

    const greyProjects = filteredAllProjects.filter(
        project => project.c_project_status?.toLowerCase() === "gray" ||
                   project.c_project_status?.toLowerCase() === "grey"
    ).length;

    const greenProjects = filteredAllProjects.filter(
        project => project.c_project_status?.toLowerCase() === "green"
    ).length;

    const orangeProjects = filteredAllProjects.filter(
        project => project.c_project_status?.toLowerCase() === "orange"
    ).length;

    // Dynamic member data is now fetched from API in the members state

    useEffect(() => {
        apiGet('/projects')
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const filtered = projects.filter((project) => {
            const endDateYear = new Date(project.c_project_finish).getFullYear();
            return endDateYear >= selectedYear;
        });
        setFilteredProjects(filtered);
    }, [projects, selectedYear]);

    let sumOfStatus = 0;
    let projectCount = filteredProjects.length;

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

    // Sort members based on column and direction
    // Always keep Birathon as #1, Ongard as #2, then sort alphabetically
    const getSortedMembers = (membersToSort) => {
        return [...membersToSort].sort((a, b) => {
            const nameA = (a.c_name || '').toLowerCase();
            const nameB = (b.c_name || '').toLowerCase();

            // Birathon always first
            if (nameA.includes('birathon')) return -1;
            if (nameB.includes('birathon')) return 1;

            // Ongard always second
            if (nameA.includes('ongard')) return -1;
            if (nameB.includes('ongard')) return 1;

            // If sorting by a specific column
            if (sortColumn) {
                let valueA, valueB;

                switch (sortColumn) {
                    case 'name':
                        valueA = `${a.c_name || ''} ${a.c_lastname || ''}`.toLowerCase();
                        valueB = `${b.c_name || ''} ${b.c_lastname || ''}`.toLowerCase();
                        break;
                    case 'all_projects':
                        valueA = a.project_owner_count || 0;
                        valueB = b.project_owner_count || 0;
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
                        valueA = a.processing_count || 0;
                        valueB = b.processing_count || 0;
                        break;
                    case 'project_delay':
                        valueA = a.delayed_count || 0;
                        valueB = b.delayed_count || 0;
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
                        // Default to alphabetical
                        valueA = `${a.c_name || ''} ${a.c_lastname || ''}`.toLowerCase();
                        valueB = `${b.c_name || ''} ${b.c_lastname || ''}`.toLowerCase();
                }

                if (typeof valueA === 'string') {
                    return sortDirection === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // Default: sort alphabetically by name
            const fullNameA = `${a.c_name || ''} ${a.c_lastname || ''}`.toLowerCase();
            const fullNameB = `${b.c_name || ''} ${b.c_lastname || ''}`.toLowerCase();
            return fullNameA.localeCompare(fullNameB);
        });
    };

    // Filter members by search term
    const filteredMembers = members.filter(member => {
        const searchLower = memberSearchTerm.toLowerCase();
        const name = `${member.c_name || ''} ${member.c_lastname || ''}`.toLowerCase();
        const username = member.c_username?.toLowerCase() || '';
        return name.includes(searchLower) || username.includes(searchLower);
    });

    for (const project of filteredProjects) {
        sumOfStatus += project.c_status;
    }

    const averageStatus = (sumOfStatus / projectCount).toFixed(2);

    const GreenTableCell = styled(TableCell)({
        backgroundColor: '#2ecc71',
    });

    const GreenBodyCell = styled(TableCell)({
        backgroundColor: 'rgba(46, 204, 113, 0.5)',
        color: '#243044',
        fontWeight: 'bold'
    });

    const YellowTableCell = styled(TableCell)({
        backgroundColor: '#f5f253',
    });

    const YellowBodyCell = styled(TableCell)({
        backgroundColor: 'rgba(245, 242, 83, 0.5)',
        color: '#243044',
        fontWeight: 'bold'
    });

    const OrangeTableCell = styled(TableCell)({
        backgroundColor: '#ef7830',
    });

    const OrangeBodyCell = styled(TableCell)({
        backgroundColor: 'rgba(239, 120, 48, 0.5)',
        color: '#243044',
        fontWeight: 'bold'
    });

    const RedTableCell = styled(TableCell)({
        backgroundColor: '#fd7270',
    });

    const RedBodyCell = styled(TableCell)({
        backgroundColor: 'rgba(253, 114, 112, 0.5)',
        color: '#243044',
        fontWeight: 'bold'
    });

    const GreyTableCell = styled(TableCell)({
        backgroundColor: '#cacaca',
    });

    const GreyBodyCell = styled(TableCell)({
        backgroundColor: 'rgba(202, 202, 202, 0.5)',
        color: '#243044',
        fontWeight: 'bold'
    });

    // Total filtered projects count
    const totalFilteredProjects = filteredMedia.length + filteredContent.length;

    // Calculate YTD Investment and Return from filtered projects
    // c_budget = Investment Target, c_budget_act = Investment Actual
    // c_roi_tgt = Return/Benefit Target, c_roi_act = Return/Benefit Actual
    const totalInvestmentTarget = filteredAllProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget) || 0), 0);
    const totalInvestmentActual = filteredAllProjects.reduce((sum, p) => sum + (parseFloat(p.c_budget_act) || 0), 0);
    const totalReturnTarget = filteredAllProjects.reduce((sum, p) => sum + (parseFloat(p.c_roi_tgt) || 0), 0);
    // Calculate actual return based on c_roi_year matching selected year
    const totalReturnActual = filteredAllProjects
        .filter(p => parseInt(p.c_roi_year) === selectedYear)
        .reduce((sum, p) => sum + (parseFloat(p.c_roi_act) || 0), 0);

    // Format number to MB with commas
    const formatToMB = (value) => {
        const mb = value / 1000000;
        return mb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const chartOptions = {
        chart: {
            type: "donut",
        },
        legend: {
            labels: {
                colors: '#243044',
            },
            position: 'bottom',
            fontSize: '12px',
        },
        series: [filteredContent.length, filteredMedia.length],
        labels: ["CONTENT", "MEDIA"],
        colors: ["#df4382", "#f47fff"],
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
            },
        },
        title: {
            text: '% by project category',
            align: 'center',
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#243044',
            },
        },
    };

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
            fontSize: '11px',
            itemMargin: {
                horizontal: 8,
                vertical: 3,
            },
        },
        series: [yellowProjects, greenProjects, greyProjects, redProjects, orangeProjects],
        labels: ["On processing", "Completed", "Not Start", "Incompleted", "Project Delay"],
        colors: ["#F3F358", "#33ff33", "#adadad", "#FF0000", "#ff8d39"],
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '11px',
                colors: ['#000000', '#000000', '#000000', '#ffffff', '#000000'],
            },
            dropShadow: {
                enabled: false,
            },
        },
        title: {
            text: 'Overall Project status',
            align: 'center',
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#243044',
            },
        },
    };

    const data = [
        {
            category: 'MEDIA TEAM',
            series1: 0,
            series2: 40,
            series3: 0,
            series4: 0,
            series5: 1,
        },
        {
            category: 'CONTENT TEAM',
            series1: 0,
            series2: 4,
            series3: 0,
            series4: 0,
            series5: 0,
        },
    ];

    const stackedBar = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        title: {
            text: 'Project Status by Business Group',
            align: 'center',
            style: {
                fontWeight: 'bold',
                color: '#243044',
            },
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: '#243044'
            }
        },
        dataLabels: {
            enabled: true
        },
        xaxis: {
            categories: data.map(item => item.category),
            title: {
                text: 'No. of projects',
                style: {
                    color: '#243044',
                    fontWeight: 'bold'
                }
            },
            labels: {
                style: {
                    colors: '#243044'
                }
            }
        },
        yaxis: {
            title: {
                text: '',
            },
            labels: {
                style: {
                    colors: '#243044'
                }
            }
        },
        colors: ['#33ff33', '#f7f70a', '#e87a36', '#ff3333', '#adadad']
    };


    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} />
                </div>
                <div className="body_container">
                    <div className='body-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>Overall Dashboard</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#243044', fontWeight: 'bold', fontSize: '14px' }}>Year:</span>
                            <FormControl size="small">
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    style={{ backgroundColor: '#243044', minWidth: '100px' }}
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
                                <div className='card-subtitle'>{totalFilteredProjects} Projects</div>
                            </div>
                            <Link className='card-img-flex' to='/project'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>YTD INVESTMENT</div>
                                <div className='card-subtitle'>TGT: {formatToMB(totalInvestmentTarget)} MB</div>
                                <div className='card-subtitle'>ACT: {formatToMB(totalInvestmentActual)} MB</div>
                            </div>
                            <Link className='card-img-flex' to='/investment'>
                                <div className='more-detail'>Detail</div>
                            </Link>
                        </div>
                        <div className='card'>
                            <div>
                                <div className='card-title'>YTD RETURN</div>
                                <div className='card-subtitle'>TGT: {formatToMB(totalReturnTarget)} MB</div>
                                <div className='card-subtitle'>ACT: {formatToMB(totalReturnActual)} MB</div>
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
                    <div className='gauge-flex'>
                        <div className='gauge'>
                            <div className='gauge-title'>
                                Project Summary
                            </div>
                            <div className='gauge-grid'>
                                <div className='gauge-container'>
                                    <GaugeChart
                                        key={`gauge-${Math.round(calculatedAverageProgress)}`}
                                        className='gauge-card'
                                        id="gauge-chart2"
                                        nrOfLevels={5}
                                        colors={["#e2433b", "#f2c200", "#36c46b"]}
                                        arcWidth={0.2}
                                        percent={calculatedAverageProgress / 100}
                                        textColor="#243044"
                                        animate={false}
                                    />
                                </div>
                                <div className='chart-container project-status-chart'>
                                    <Chart
                                        options={chartCategoriesOptions}
                                        series={chartCategoriesOptions.series}
                                        type="donut"
                                        width="100%"
                                        height="300"
                                    />
                                </div>
                            </div>
                            <div className='gauge-subtitle'>average of percent progress</div>
                        </div>
                        <div className='gauge'>
                            <div className='gauge-title'>
                                Project Category
                            </div>
                            <div className='chart-container'>
                                <Chart
                                    options={chartOptions}
                                    series={chartOptions.series}
                                    type="donut"
                                    width="100%"
                                    height="300"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='project_by_project'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <div className='project_by_project-title'>
                                Member
                            </div>
                            <TextField
                                size="small"
                                placeholder="Search by name..."
                                value={memberSearchTerm}
                                onChange={(e) => {
                                    setMemberSearchTerm(e.target.value);
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
                            <Table className="member-table" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontSize: '20px' }}>No.</TableCell>
                                        <TableCell align="center" style={{ fontSize: '20px' }}></TableCell>
                                        <TableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'name'}
                                                direction={sortColumn === 'name' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('name')}
                                                style={{ color: 'inherit' }}
                                            >
                                                Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'all_projects'}
                                                direction={sortColumn === 'all_projects' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('all_projects')}
                                                style={{ color: 'inherit' }}
                                            >
                                                All Projects
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'project_owner'}
                                                direction={sortColumn === 'project_owner' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('project_owner')}
                                                style={{ color: 'inherit' }}
                                            >
                                                Project Owner
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center" style={{ fontSize: '20px' }}>Project Member</TableCell>
                                        <GreenTableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'completed'}
                                                direction={sortColumn === 'completed' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('completed')}
                                                hideSortIcon={true}
                                                style={{ color: 'black', cursor: 'pointer' }}
                                            >
                                                Completed
                                            </TableSortLabel>
                                        </GreenTableCell>
                                        <YellowTableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'on_processing'}
                                                direction={sortColumn === 'on_processing' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('on_processing')}
                                                hideSortIcon={true}
                                                style={{ color: 'black', cursor: 'pointer' }}
                                            >
                                                On Processing
                                            </TableSortLabel>
                                        </YellowTableCell>
                                        <OrangeTableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'project_delay'}
                                                direction={sortColumn === 'project_delay' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('project_delay')}
                                                hideSortIcon={true}
                                                style={{ color: 'black', cursor: 'pointer' }}
                                            >
                                                Project Delay
                                            </TableSortLabel>
                                        </OrangeTableCell>
                                        <RedTableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'cancelled'}
                                                direction={sortColumn === 'cancelled' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('cancelled')}
                                                hideSortIcon={true}
                                                style={{ color: 'black', cursor: 'pointer' }}
                                            >
                                                Cancelled
                                            </TableSortLabel>
                                        </RedTableCell>
                                        <GreyTableCell align="center" style={{ fontSize: '20px' }}>
                                            <TableSortLabel
                                                active={sortColumn === 'not_started'}
                                                direction={sortColumn === 'not_started' ? sortDirection : 'asc'}
                                                onClick={() => handleSort('not_started')}
                                                hideSortIcon={true}
                                                style={{ color: 'black', cursor: 'pointer' }}
                                            >
                                                Not Started
                                            </TableSortLabel>
                                        </GreyTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getSortedMembers(filteredMembers).slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((member, index) => (
                                        <TableRow key={member.c_emp_id}>
                                            <TableCell align="center" component="th" scope="row" style={{ fontSize: '18px' }}>
                                                {index + 1 + page * rowsPerPage}
                                            </TableCell>
                                            <TableCell align="center" style={{ padding: '8px' }}>
                                                <img
                                                    src={getMemberPhotoUrl(member.c_emp_id, customPhotos)}
                                                    alt={`${member.c_name}`}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => handlePhotoError(e, member.c_emp_id)}
                                                />
                                            </TableCell>
                                            <TableCell align="left" style={{ fontSize: '18px' }}>
                                                <Link to={`/members/${member.c_emp_id}`} style={{ textDecoration: 'none', color: "white" }}>
                                                    {member.c_name} {member.c_lastname}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center" style={{ fontSize: '18px' }}>{member.project_owner_count}
                                            </TableCell>
                                            <TableCell align="center" style={{ fontSize: '18px' }}>{member.project_owner_count}</TableCell>
                                            <TableCell align="center" style={{ fontSize: '18px' }}>0</TableCell>
                                            <GreenBodyCell align="center" style={{ fontSize: '18px' }}>{member.completed_count}</GreenBodyCell>
                                            <YellowBodyCell align="center" style={{ fontSize: '18px' }}>{member.processing_count}</YellowBodyCell>
                                            <OrangeBodyCell align="center" style={{ fontSize: '18px' }}>{member.delayed_count}</OrangeBodyCell>
                                            <RedBodyCell align="center" style={{ fontSize: '18px' }}>{member.cancelled_count}</RedBodyCell>
                                            <GreyBodyCell align="center" style={{ fontSize: '18px' }}>{member.not_started_count}</GreyBodyCell>
                                        </TableRow>
                                    ))}
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
        </div >
    );
}