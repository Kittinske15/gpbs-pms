import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import SGLists from '../components/SGLists';
import Projects from '../components/projects';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';

export default function SmallGroup() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentUser = getUser();
    const isAdmin = currentUser?.c_username === 'admin' || currentUser?.c_name === 'admin';

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
                    color: '#fff', // Title text color
                },
            },
            labels: ['Completed', 'On Process', 'Not Start', 'Incompleted', 'Delay'],
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

        const projectStatusData = [0, 24, 0, 0, 0]

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

    const ProjectGroup = () => {
        const chartOptions = {
            chart: {
                id: 'donut-chart',
            },
            title: {
                text: 'PROJECT GROUP',
                align: 'center',
                style: {
                    fontSize: '18px',
                    color: '#fff',
                },
            },
            labels: ['NEW S CURVE', 'TURNAROUND'],
            colors: ['#f47fff', '#df4382'],
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

        const projectStatusData = [0, 8]

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
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className='project-title'>MEDIA TEAM : 10 Projects</div>
                            <div className='project-title'>CONTENT TEAM : 2 Projects</div>
                            <div className='project-title'>WARROOM : 12 Projects</div>
                        </div>
                        {!isAdmin && (
                            <a className='create-project' href='/create-project'>
                                <img className='add-btn' src={process.env.PUBLIC_URL + "/assets/add-btn.png"} />
                                <div className='create-project-btn'>Create Project</div>
                            </a>
                        )}
                    </div>
                    <div className='project-status-grid'>
                        <div className='project-card'>
                            {ProjectStatus()}
                        </div>
                        <div>
                            <SGLists />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}