import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chart from 'react-apexcharts';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { apiGet } from '../utils/api';
import Sidebar from '../components/Sidebar';

const ProjectPersonal = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [project_media, setProjectMedia] = useState([])
    const [project_content, setProjectContent] = useState([])
    const [searched, setSearched] = useState("");
    const [showMedia, setShowMedia] = useState(true);
    const [showMember, setShowMember] = useState(true);
    const [activeButton, setActiveButton] = useState('overall');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleMediaClick = () => {
        setShowMedia(true);
        handleButtonClick('overall');
    };

    const handleContentClick = () => {
        setShowMedia(false);
        handleButtonClick('owner');
    };

    const handleMemberClick = () => {
        setShowMember(false);
        handleButtonClick('member');
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
        apiGet('/projects')
            .then((data) => setProjects(data))
            .catch((error) => console.error('Error fetching data:', error));
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

    const ProjectNumber = () => {
        const chartOptions = {
            chart: {
                id: 'donut-chart',
            },
            title: {
                text: 'Number of Project',
                align: 'center',
                style: {
                    fontSize: '18px',
                    color: '#fff', // Title text color
                },
            },
            labels: ['MEDIA', 'CONTENT'],
            colors: ['#3498db', '#af7ac5'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: ['#fff'],
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        const projectStatusData = [25, 0]

        return (
            <Chart
                options={chartOptions}
                series={projectStatusData}
                type="donut"
                width="100%"
                height={400}
            />
        );
    };

    const ProjectNumberByItem = () => {
        const chartOptions = {
            chart: {
                id: 'donut-chart',
            },
            title: {
                text: 'Number of Project',
                align: 'center',
                style: {
                    fontSize: '18px',
                    color: '#fff', // Title text color
                },
            },
            labels: ['Completed', 'On Process', 'Not Start', 'Incomplete', 'Delay'],
            colors: ['#33ff33', '#FAFF1C', '#A1A1A1', '#FF0000', '#FF4906'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: ['#fff'],
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };

        const projectStatusData = [1, 19, 3, 1, 1]

        return (
            <Chart
                options={chartOptions}
                series={projectStatusData}
                type="donut"
                width="100%"
                height={400}
            />
        );
    };


    const MediaContent = ({ project_media }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', height: '600px' }}>
                {ProjectNumber()}
                {ProjectNumberByItem()}
            </div>
        )
    }
    const ContentContent = ({ project_media }) => {
        return (
            <Paper>
                <TableContainer>
                    <Table className="project-table" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: "18px", fontWeight: 'bold' }}>No.</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Project Name</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Project Owner</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Start Date</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>End Date</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Overall Status</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>% Progress</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: 'bold' }}>Manage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    1
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>แผนงานพัฒนาแอพพลิเคชั่นของ True Visions	</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>24 Jan 2023</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>100 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/30`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    2
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>True4U Activity&Event</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Jan 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>75 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/75`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    3
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>	แผนงานพัฒนาแอพพลิเคชั่นของ True Visions</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>24 Jan 2023</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>100 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/30`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    4
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>	หาบริษัทที่มีความเชี่ยวชาญด้าน AI</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>24 Jan 2023</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Aug 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>90 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/68`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    5
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>	Global market : Content to China (TVS NOW application)</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Jan 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>25 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/69`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    6
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>PPV on TVS NOW</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Apr 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>55 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/70`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    7
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>TNN Publisher</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Jan 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>50 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/70`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    8
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>TNN Seminar</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Jan 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>50 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/70`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    9
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Application Partnership</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>07 May 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>06 May 2026</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>80 %</TableCell>

                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/18`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    10
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>True4U Original Content</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Feb 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-processing" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>25 %</TableCell>

                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/19`} className="project-view">
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
                            <TableRow>
                                <TableCell component="th" scope="row" style={{ fontSize: "18px" }}>
                                    11
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>ถ่ายทอดสดมวยไทย 5 วันต่อ สัปดาห์</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>Ongard Prapakamol</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>01 Jan 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>31 Dec 2024</TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>
                                    <div className="ball-container">
                                        <div className="ball-success" />
                                    </div >
                                </TableCell>
                                <TableCell align="center" style={{ fontSize: "18px" }}>100 %</TableCell>
                                <TableCell align="center">
                                    <div className="project-manage-grid">
                                        <Link to={`/project/20`} className="project-view">
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
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

    console.log('projects: ', projects)
    console.log('project_media: ', project_media)

    return (
        <div className="App">
            <Sidebar onToggle={setSidebarOpen} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='project-status-grid'>
                        <button className="project-button" style={{ backgroundColor: activeButton === 'overall' ? '#36454F' : '#71797E' }} onClick={handleMediaClick}>Project Overall Dashboard</button>
                        <button className="project-button" style={{ backgroundColor: activeButton === 'owner' ? '#36454F' : '#71797E' }} onClick={handleContentClick}>Project Owner</button>
                        <button className="project-button" style={{ backgroundColor: activeButton === 'member' ? '#36454F' : '#71797E' }} onClick={handleContentClick}>Project Member</button>
                        {showMedia ? (
                            <MediaContent project_media={project_media} />
                        ) : (
                            <ContentContent project_media={project_content} />
                        )
                        }
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPersonal;
