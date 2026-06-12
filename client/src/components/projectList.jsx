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
    IconButton
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { apiGet } from '../utils/api';

const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: 650
}));

const ProjectList = () => {

    const [projects, setProjects] = useState([]);
    const [project_media, setProjectMedia] = useState([])
    const [project_content, setProjectContent] = useState([])
    const [searched, setSearched] = useState("");
    const [showMedia, setShowMedia] = useState(true);
    const [activeButton, setActiveButton] = useState('media');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            const data = await apiGet('/projects');
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const handleMediaClick = () => {
        setShowMedia(true);
        handleButtonClick('media');
    };

    const handleContentClick = () => {
        setShowMedia(false);
        handleButtonClick('content');
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const requestSearch = (searchedVal) => {
        const filteredProjects = projects.filter((project) => {
            return project.name.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setProjects(filteredProjects);
    };

    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };


    useEffect(() => {
        fetchProjects();
    }, []);


    useEffect(() => {
        apiGet('/project_media')
            .then((data) => setProjectMedia(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        apiGet('/project_content')
            .then((data) => setProjectContent(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    console.log("projects: ", projects)

    const MediaContent = ({ project_media }) => {
        return (
            <TableBody>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    project_media.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                {project.id}
                            </TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_name}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_leader_id === 100 ? "Ongard Prapakamol" : project.c_leader_id === 101 ? "Birathon Kasemsri Na Ayudhaya" : "Other Leader"}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_project_start.substring(0, 10)}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_project_finish.substring(0, 10)}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_update}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>
                                {project.c_project_status === 'Red' && (
                                    <div className="ball-container">
                                        <div className="ball-reject" />
                                    </div >
                                )}
                                {project.c_project_status === 'Orange' && (
                                    <div className="ball-container">
                                        <div className="ball-reject" />
                                    </div >
                                )}
                                {project.c_project_status === 'Gray' && (
                                    <div className="ball-container">
                                        <div className="ball-not-start" />
                                    </div >
                                )}
                                {project.c_project_status === 'Yellow' && (
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                )}
                                {project.c_project_status === 'Green' && (
                                    <div className="ball-container">
                                        <div className="ball-success" />
                                    </div >
                                )}
                            </TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_percent_progress} %</TableCell>
                            <TableCell align="center">
                                <div className="project-manage-grid">
                                    <Link to={`/project/${project.id}`} className="project-view">
                                        <img className="project-view-img" src={process.env.PUBLIC_URL + "/assets/view.png"} />
                                        <div className="project-view-title">View</div>
                                    </Link>
                                    <a className="project-edit">
                                        <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} />
                                        <div className='project-edit-title'>Edit</div>
                                    </a>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )
                }
            </TableBody>
        )
    }
    const ContentContent = ({ project_media }) => {
        return (
            <TableBody>
                {
                    project_media.map((project) => (
                        <TableRow key={project.id}>
                            <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                {project.id}
                            </TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_name}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_leader_id === 100 ? "Ongard Prapakamol" : project.c_leader_id === 101 ? "Birathon Kasemsri Na Ayudhaya" : "Other Leader"}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_project_start.substring(0, 10)}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_project_finish.substring(0, 10)}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_update.substring(0, 10)}</TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>
                                {project.c_project_status === 'Red' && (
                                    <div className="ball-container">
                                        <div className="ball-reject" />
                                    </div >
                                )}
                                {project.c_project_status === 'Gray' && (
                                    <div className="ball-container">
                                        <div className="ball-not-start" />
                                    </div >
                                )}
                                {project.c_project_status === 'Yellow' && (
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                )}
                                {project.c_project_status === 'Green' && (
                                    <div className="ball-container">
                                        <div className="ball-success" />
                                    </div >
                                )}
                            </TableCell>
                            <TableCell align="center" style={{ fontSize: "18px" }}>{project.c_percent_progress} %</TableCell>
                            <TableCell align="center">
                                <div className="project-manage-grid">
                                    <Link to={`/project/${project.id}`} className="project-view">
                                        <img className="project-view-img" src={process.env.PUBLIC_URL + "/assets/view.png"} />
                                        <div className="project-view-title">View</div>
                                    </Link>
                                    <a className="project-edit">
                                        <img className='project-edit-img' src={process.env.PUBLIC_URL + "/assets/edit.png"} />
                                        <div className='project-edit-title'>Edit</div>
                                    </a>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        )
    }

    console.log('project_media: ', project_media)

    return (
        <>
            <button className="project-button" style={{ backgroundColor: activeButton === 'media' ? '#36454F' : '#71797E' }} onClick={handleMediaClick}>Media Team</button>
            <button className="project-button" style={{ backgroundColor: activeButton === 'content' ? '#36454F' : '#71797E' }} onClick={handleContentClick}>Content Team</button>
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
                                <TableCell style={{ fontSize: "18px", fontWeight: 'bold' }}>No.</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Project Name</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Project Owner</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Start Date</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>End Date</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Last Update</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>% Progress</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Manage</TableCell>
                            </TableRow>
                        </TableHead>
                        {showMedia ? (
                            <MediaContent project_media={project_media} />
                        ) : (
                            <ContentContent project_media={project_content} />
                        )
                        }
                    </StyledTable>
                </TableContainer>
            </Paper>
        </>
    );
};

export default ProjectList;