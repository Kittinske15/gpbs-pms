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
    TextField,
    InputAdornment,
    IconButton,
    TableSortLabel,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { getUser } from '../utils/auth';

const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: 'unset',
    width: '100%'
}));

const Projects = ({ onTeamChange, selectedYear }) => {

    // Get current user
    const currentUser = getUser();

    // State for original data
    const [projectMedia, setProjectMedia] = useState([]);
    const [projectContent, setProjectContent] = useState([]);
    const [projectOwners, setProjectOwners] = useState([]);

    // State for filtered data (used for display)
    const [filteredMediaProjects, setFilteredMediaProjects] = useState([]);
    const [filteredContentProjects, setFilteredContentProjects] = useState([]);

    // UI state
    const [searched, setSearched] = useState("");
    const [showMedia, setShowMedia] = useState(true);
    const [activeButton, setActiveButton] = useState('media');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sorting state
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    // Year filter state - use prop or internal state
    const currentYear = new Date().getFullYear();
    const [internalYear, setInternalYear] = useState(selectedYear || currentYear);
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    const filterYear = selectedYear || internalYear;

    // Status filter state
    const [statusFilter, setStatusFilter] = useState('all');
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'green', label: 'Completed' },
        { value: 'yellow', label: 'On Processing' },
        { value: 'orange', label: 'Project Delay' },
        { value: 'red', label: 'Cancelled' },
        { value: 'gray', label: 'Not Started' }
    ];

    console.log("filterYear:", filterYear);
    console.log("projectMedia:", projectMedia);
    console.log("projectContent:", projectContent);
    console.log("filteredMediaProjects:", filteredMediaProjects);
    console.log("filteredContentProjects:", filteredContentProjects);

    const handleMediaClick = () => {
        setShowMedia(true);
        handleButtonClick('media');
        if (onTeamChange) onTeamChange('media');
    };

    const handleContentClick = () => {
        setShowMedia(false);
        handleButtonClick('content');
        if (onTeamChange) onTeamChange('content');
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const requestSearch = (searchedVal) => {
        setSearched(searchedVal);

        if (searchedVal === "") {
            // Reset to original data
            setFilteredMediaProjects(projectMedia);
            setFilteredContentProjects(projectContent);
        } else {
            // Filter media projects
            const filteredMedia = projectMedia.filter((project) => {
                return project.c_name.toLowerCase().includes(searchedVal.toLowerCase());
            });

            // Filter content projects
            const filteredContent = projectContent.filter((project) => {
                return project.c_name.toLowerCase().includes(searchedVal.toLowerCase());
            });

            setFilteredMediaProjects(filteredMedia);
            setFilteredContentProjects(filteredContent);
        }
    };

    const cancelSearch = () => {
        setSearched("");
        setFilteredMediaProjects(projectMedia);
        setFilteredContentProjects(projectContent);
    };

    // Sorting handler
    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
    };

    // Year filter handler
    const handleYearChange = (event) => {
        setInternalYear(event.target.value);
    };

    // Status filter handler
    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
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
                case 'owner':
                    valueA = (a.full_owner_name || a.owner_name || '').toLowerCase();
                    valueB = (b.full_owner_name || b.owner_name || '').toLowerCase();
                    break;
                case 'start_date':
                    valueA = new Date(a.c_project_start || 0).getTime();
                    valueB = new Date(b.c_project_start || 0).getTime();
                    break;
                case 'end_date':
                    valueA = new Date(a.c_project_finish || 0).getTime();
                    valueB = new Date(b.c_project_finish || 0).getTime();
                    break;
                case 'progress':
                    valueA = parseFloat(a.c_percent_progress) || 0;
                    valueB = parseFloat(b.c_percent_progress) || 0;
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

    // Filter projects by selected year (projects ending in or after selected year)
    const filterByYear = (projects) => {
        return projects.filter(project => {
            const finishYear = new Date(project.c_project_finish).getFullYear();
            return finishYear >= filterYear;
        });
    };

    // Filter projects by status
    const filterByStatus = (projects) => {
        if (statusFilter === 'all') return projects;
        return projects.filter(project => {
            const status = project.c_project_status?.toLowerCase();
            if (statusFilter === 'gray') {
                return status === 'gray' || status === 'grey';
            }
            return status === statusFilter;
        });
    };

    // Fetch projects from API using original endpoints
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);

                // Fetch media projects
                const mediaResponse = await apiRequest('/project_media');
                // Fetch content projects
                const contentResponse = await apiRequest('/project_content');

                if (mediaResponse.ok && contentResponse.ok) {
                    const mediaProjects = await mediaResponse.json();
                    const contentProjects = await contentResponse.json();

                    console.log('Fetched media projects:', mediaProjects);
                    console.log('Fetched content projects:', contentProjects);

                    setProjectMedia(mediaProjects);
                    setProjectContent(contentProjects);
                    setFilteredMediaProjects(mediaProjects);
                    setFilteredContentProjects(contentProjects);
                } else {
                    setError('Failed to fetch projects');
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to fetch projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Update filtered data when search is applied and original data changes
    useEffect(() => {
        if (searched === "") {
            setFilteredMediaProjects(projectMedia);
        } else {
            const filtered = projectMedia.filter((project) => {
                return project.c_name.toLowerCase().includes(searched.toLowerCase());
            });
            setFilteredMediaProjects(filtered);
        }
    }, [projectMedia, searched]);

    useEffect(() => {
        if (searched === "") {
            setFilteredContentProjects(projectContent);
        } else {
            const filtered = projectContent.filter((project) => {
                return project.c_name.toLowerCase().includes(searched.toLowerCase());
            });
            setFilteredContentProjects(filtered);
        }
    }, [projectContent, searched]);

    const getProjectOwnerName = (project) => {
        return project.full_owner_name || project.owner_name || 'Unknown';
    };

    const MediaContent = () => {
        const projectsToShow = sortProjects(filterByStatus(filterByYear(filteredMediaProjects)));

        return (
            <TableBody>
                {projectsToShow
                    .map((project, index) => (
                        <TableRow key={project.id || index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="left" style={{ fontSize: "16px" }}>{project.c_name}</TableCell>
                            <TableCell align="center" style={{ fontSize: "16px" }}>
                                {getProjectOwnerName(project)}
                            </TableCell>
                            <TableCell align="center">
                                {project.c_project_start ? new Date(project.c_project_start).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                                {project.c_project_finish ? new Date(project.c_project_finish).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                                <div className="ball-container">
                                    {project.c_project_status?.toLowerCase() === "orange" ? (
                                        <div className="ball-delay" />
                                    ) : project.c_project_status?.toLowerCase() === "yellow" ? (
                                        <div className="ball-processing" />
                                    ) : project.c_project_status?.toLowerCase() === "green" ? (
                                        <div className="ball-success" />
                                    ) : project.c_project_status?.toLowerCase() === "gray" || project.c_project_status?.toLowerCase() === "grey" ? (
                                        <div className="ball-not-start" />
                                    ) : project.c_project_status?.toLowerCase() === "red" ? (
                                        <div className="ball-reject" />
                                    ) : (
                                        <div className="ball-not-start" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell align="center">{project.c_percent_progress || 0} %</TableCell>
                            <TableCell align="center">
                                <div className="project-manage-grid">
                                    <Link to={`/project/${project.id}`} className="project-view">
                                        <img className="project-view-img" src={process.env.PUBLIC_URL + "/assets/view.png"} alt="View" />
                                        <div className="project-view-title">View</div>
                                    </Link>
                                    {(currentUser?.c_emp_id === project.c_create_by || String(currentUser?.c_emp_id) === String(project.c_create_by)) && project.c_project_status?.toLowerCase() !== 'green' && project.c_project_status?.toLowerCase() !== 'red' ? (
                                        <Link to={`/edit-project/${project.id}`} className="project-edit">
                                            <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} alt="Edit" />
                                            <div className='project-edit-title'>Edit</div>
                                        </Link>
                                    ) : (
                                        <div className="project-edit project-edit-disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                            <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} alt="Edit" />
                                            <div className='project-edit-title'>Edit</div>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        );
    };

    const ContentContent = () => {
        const projectsToShow = sortProjects(filterByStatus(filterByYear(filteredContentProjects)));

        return (
            <TableBody>
                {projectsToShow
                    .map((project, index) => (
                        <TableRow key={project.id || index}>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="left" style={{ fontSize: "16px" }}>{project.c_name}</TableCell>
                            <TableCell align="center" style={{ fontSize: "16px" }}>
                                {getProjectOwnerName(project)}
                            </TableCell>
                            <TableCell align="center">
                                {project.c_project_start ? new Date(project.c_project_start).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                                {project.c_project_finish ? new Date(project.c_project_finish).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="center">
                                <div className="ball-container">
                                    {project.c_project_status?.toLowerCase() === "orange" ? (
                                        <div className="ball-delay" />
                                    ) : project.c_project_status?.toLowerCase() === "yellow" ? (
                                        <div className="ball-processing" />
                                    ) : project.c_project_status?.toLowerCase() === "green" ? (
                                        <div className="ball-success" />
                                    ) : project.c_project_status?.toLowerCase() === "gray" || project.c_project_status?.toLowerCase() === "grey" ? (
                                        <div className="ball-not-start" />
                                    ) : project.c_project_status?.toLowerCase() === "red" ? (
                                        <div className="ball-reject" />
                                    ) : (
                                        <div className="ball-not-start" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell align="center">{project.c_percent_progress || 0} %</TableCell>
                            <TableCell align="center">
                                <div className="project-manage-grid">
                                    <Link to={`/project/${project.id}`} className="project-view">
                                        <img className="project-view-img" src={process.env.PUBLIC_URL + "/assets/view.png"} alt="View" />
                                        <div className="project-view-title">View</div>
                                    </Link>
                                    {(currentUser?.c_emp_id === project.c_create_by || String(currentUser?.c_emp_id) === String(project.c_create_by)) && project.c_project_status?.toLowerCase() !== 'green' && project.c_project_status?.toLowerCase() !== 'red' ? (
                                        <Link to={`/edit-project/${project.id}`} className="project-edit">
                                            <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} alt="Edit" />
                                            <div className='project-edit-title'>Edit</div>
                                        </Link>
                                    ) : (
                                        <div className="project-edit project-edit-disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                            <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} alt="Edit" />
                                            <div className='project-edit-title'>Edit</div>
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        );
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error loading projects: {error}</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <button
                    className="project-button"
                    style={{ backgroundColor: activeButton === 'media' ? '#36454F' : '#71797E' }}
                    onClick={handleMediaClick}
                >
                    Media Team
                </button>
                <button
                    className="project-button"
                    style={{ backgroundColor: activeButton === 'content' ? '#36454F' : '#71797E' }}
                    onClick={handleContentClick}
                >
                    Content Team
                </button>
            </div>

            <Paper>
                <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search projects..."
                        value={searched}
                        onChange={(e) => {
                            setSearched(e.target.value);
                            requestSearch(e.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searched && (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            setSearched("");
                                            cancelSearch();
                                        }}
                                        edge="end"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <TableContainer>
                    <StyledTable className="project-table" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>No.</TableCell>
                                <TableCell align="left" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sortColumn === 'name'}
                                        direction={sortColumn === 'name' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('name')}
                                    >
                                        Project Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sortColumn === 'owner'}
                                        direction={sortColumn === 'owner' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('owner')}
                                    >
                                        Project Owner
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sortColumn === 'start_date'}
                                        direction={sortColumn === 'start_date' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('start_date')}
                                    >
                                        Start Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sortColumn === 'end_date'}
                                        direction={sortColumn === 'end_date' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('end_date')}
                                    >
                                        End Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Overall Status</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={sortColumn === 'progress'}
                                        direction={sortColumn === 'progress' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('progress')}
                                    >
                                        % Progress
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Manage</TableCell>
                            </TableRow>
                        </TableHead>
                        {showMedia ? <MediaContent /> : <ContentContent />}
                    </StyledTable>
                </TableContainer>
            </Paper>
        </>
    );
};

export default Projects;