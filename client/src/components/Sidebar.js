import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
    AccountCircleRounded,
    AttachMoneyRounded,
    BarChartRounded,
    DashboardRounded,
    TocRounded,
} from "@mui/icons-material";
import GridViewIcon from '@mui/icons-material/GridView';
import FolderSharedRounded from '@mui/icons-material/FolderSharedRounded';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Item from './item';
import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { apiRequest, API_BASE_URL } from '../utils/api';

const sideContainerVariants = {
    false: {
        transition: {
            delay: 0.6,
        },
    },
};

const sidebarVariants = {
    true: {},
    false: {
        width: "3rem",
        transition: {
            delay: 0.4,
        },
    },
};

const profileVariants = {
    true: {
        alignSelf: "center",
        width: "4rem",
    },
    false: {
        alignSelf: "flex-start",
        marginTop: "2rem",
        width: "3rem",
    },
};

export default function Sidebar({ onToggle }) {
    const [open, setOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const currentUser = getUser();

    const handleToggle = () => {
        const newOpen = !open;
        setOpen(newOpen);
        if (onToggle) onToggle(newOpen);
    };

    const [customPhoto, setCustomPhoto] = useState(null);

    useEffect(() => {
        if (currentUser?.c_emp_id) {
            apiRequest(`/profile/photo/${currentUser.c_emp_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.photo) {
                        setCustomPhoto(`${API_BASE_URL}/uploads/profiles/${data.photo}`);
                    }
                })
                .catch(() => {});
        }
    }, []);

    const getUserProfileImage = () => {
        if (customPhoto) return customPhoto;
        if (currentUser?.c_emp_id) {
            return `https://ibsdo.com/tvs/ltvs/emp_pic/${currentUser.c_emp_id}.jpg`;
        }
        return process.env.PUBLIC_URL + '/assets/project-owner.jpg';
    };

    return (
        <>
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <motion.div
                data-Open={open}
                variants={sideContainerVariants}
                initial={`${open}`}
                animate={`${open}`}
                className={`sidebar_container ${mobileMenuOpen ? 'mobile-open' : ''}`}
            >
                <motion.div
                    className="sidebar"
                    initial={`${open}`}
                    animate={`${open}`}
                    variants={sidebarVariants}
                >
                    <motion.div
                        whileHover={{
                            cursor: "pointer",
                            scale: 1.2,
                            rotate: 180,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(3.5px)",
                            WebkitBackdropFilter: "blur(3.5px)",
                            border: "1px solid rgba( 255, 255, 255, 0.18 )",
                            transition: {
                                delay: 0.2,
                                duration: 0.4,
                            },
                        }}
                        onClick={handleToggle}
                        className="lines_icon"
                    >
                        <TocRounded />
                    </motion.div>
                    <motion.div
                        layout
                        initial={`${open}`}
                        animate={`${open}`}
                        variants={profileVariants}
                        className="profile"
                        transition={{ duration: 0.4 }}
                        whileHover={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                            backdropFilter: "blur(5.5px)",
                            WebkitBackdropFilter: "blur(5.5px)",
                            border: "1px solid rgba( 255, 255, 255, 0.18 )",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={getUserProfileImage()}
                            alt="profile_img"
                            onError={(e) => { e.target.src = process.env.PUBLIC_URL + '/assets/project-owner.jpg'; }}
                        />
                    </motion.div>
                    <div className='scroll-container'>
                        <div className="groups">
                            <div className="group">
                                <Link className='nav-item' to='/home'>
                                    <motion.h3
                                        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
                                    >
                                        TRUE VISIONS WAR ROOM
                                    </motion.h3>
                                </Link>
                                <Link className='nav-item' to="/home">
                                    <Item icon={<DashboardRounded />} name="Overall" />
                                </Link>
                                <Link className='nav-item' to="/project">
                                    <Item icon={<BarChartRounded />} name="Project" />
                                </Link>
                                <Link className='nav-item' to="/prioritization">
                                    <Item icon={<GridViewIcon />} name="Project Prioritization" />
                                </Link>
                                <Link className='nav-item' to="/finance">
                                    <Item icon={<AttachMoneyRounded />} name="ROI" />
                                </Link>
                                <Link className='nav-item' to='/members'>
                                    <Item icon={<AccountCircleRounded />} name="Members" />
                                </Link>
                                <Link className='nav-item' to='/my-project'>
                                    <Item icon={<FolderSharedRounded />} name="My Project" />
                                </Link>
                            </div>
                        </div>
                        <div className="group">
                            <motion.h3
                                animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
                            >
                                COMPETITOR ANALYSIS
                            </motion.h3>
                            <Link className='nav-item' to="/analyst">
                                <Item icon={<SmartToyIcon />} name="AI Analyst" />
                            </Link>
                            <a className='nav-item'>
                                <Item icon={<TravelExploreIcon />} name="Global case study" />
                            </a>
                        </div>
                        <div className="group">
                            <motion.h3
                                animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
                            >
                                BALANCED SCORECARD
                            </motion.h3>
                            <a className='nav-item' target="_blank" href={`http://ibsdo.com:3303?token=${localStorage.getItem('token')}`}>
                                <Item icon={<TravelExploreIcon />} name="iCentral War Room" />
                            </a>
                            <a className='nav-item' style={{ pointerEvents: 'none', opacity: 0.5 }}>
                                <Item icon={<AutoGraphIcon />} name="Forecasting" />
                            </a>
                            <Link className='nav-item' to='/profile'>
                                <Item icon={<EditIcon />} name="Edit Profile" />
                            </Link>
                            <Link className='nav-item' to='/change-password'>
                                <Item icon={<LockResetIcon />} name="Change Password" />
                            </Link>
                            <Link className='nav-item' to='/' onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                localStorage.removeItem('sessionTimeout');
                                localStorage.removeItem('lastActivity');
                            }}>
                                <Item icon={<LogoutIcon />} name="Logout" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
