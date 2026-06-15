import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import ProjectList from '../components/projectList';
import Projects from '../components/projects';
import { apiGet } from '../utils/api';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';

export default function Project() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [project_media, setProjectMedia] = useState([])
    const [project_content, setProjectContent] = useState([])
    const [activeTeam, setActiveTeam] = useState('media'); // Track which team is selected
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear); // Year filter state
    const currentUser = getUser();
    const isAdmin = currentUser?.c_username === 'admin' || currentUser?.c_name === 'admin';

    // Generate year options (from 2023 to current year + 1)
    const yearOptions = [];
    for (let year = 2023; year <= currentYear + 1; year++) {
        yearOptions.push(year);
    }

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

    // Filter media and content by selected year
    const filteredMedia = project_media.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );
    const filteredContent = project_content.filter(
        project => new Date(project.c_project_finish).getFullYear() >= selectedYear
    );

    // Get the current team's projects based on selection
    const currentTeamProjects = activeTeam === 'media' ? filteredMedia : filteredContent;

    // Calculate status counts from current team's projects only (case-insensitive)
    const greenProjects = currentTeamProjects.filter(project => project.c_project_status?.toLowerCase() === "green").length;
    const yellowProjects = currentTeamProjects.filter(project => project.c_project_status?.toLowerCase() === "yellow").length;
    const greyProjects = currentTeamProjects.filter(project => project.c_project_status?.toLowerCase() === "gray" || project.c_project_status?.toLowerCase() === "grey").length;
    const redProjects = currentTeamProjects.filter(project => project.c_project_status?.toLowerCase() === "red").length;
    const orangeProjects = currentTeamProjects.filter(project => project.c_project_status?.toLowerCase() === "orange").length;

    // Handle team change from Projects component
    const handleTeamChange = (team) => {
        setActiveTeam(team);
    };

    const ProjectStatus = () => {
        const chartOptions = {
            chart: {
                id: 'donut-chart',
            },
            title: {
                text: 'PROJECT STATUS',
                align: 'center',
                style: {
                    fontSize: '18px',
                    color: '#243044',
                },
            },
            labels: ['Completed', 'On Process', 'Not Start', 'Incompleted', 'Delay'],
            colors: ['#33ff33', '#FAFF1C', '#A1A1A1', '#FF0000', '#FF4906'],
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#000000', '#000000', '#000000', '#ffffff', '#000000'],
                },
                dropShadow: {
                    enabled: false,
                },
            },
            legend: {
                position: 'bottom',
                labels: {
                    colors: ['#243044'],
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

        // Dynamic project status data based on selected team: [Completed, On Process, Not Start, Incompleted, Delay]
        const projectStatusData = [greenProjects, yellowProjects, greyProjects, redProjects, orangeProjects];

        return (
            <Chart
                options={chartOptions}
                series={projectStatusData}
                type="donut"
                width="100%"
                height={300}
            />
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
                    <div className='project-title-flex'>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div className='project-title'>MEDIA : {filteredMedia.length} Projects</div>
                            <div className='project-title'>CONTENT : {filteredContent.length} Projects</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ color: '#243044', fontWeight: 'bold' }}>Year:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#fff',
                                        cursor: 'pointer',
                                        minWidth: '100px'
                                    }}
                                >
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {!isAdmin && (
                            <Link className='create-project' to='/create-project'>
                                <img className='add-btn' src={process.env.PUBLIC_URL + "/assets/add-btn.png"} alt="" />
                                <div className='create-project-btn'>Create Project</div>
                            </Link>
                        )}
                    </div>
                    <div className='project-status-grid'>
                        <div className='project-chart-grid'>
                            <div className='project-card'>
                                <div className='chart-center'>
                                    {ProjectStatus()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Projects onTeamChange={handleTeamChange} selectedYear={selectedYear} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}