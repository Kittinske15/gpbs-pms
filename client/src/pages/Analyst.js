import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';

export default function Analyst() {
    return (
        <div className="project_container_main" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="body_container" style={{ flex: 1, padding: '40px' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #1565C0 0%, #00A859 100%)',
                    borderRadius: '12px',
                    color: 'white',
                }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                        AI Analyst
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Competitive analysis dashboard — coming soon.
                    </Typography>
                </Box>
            </div>
        </div>
    );
}
