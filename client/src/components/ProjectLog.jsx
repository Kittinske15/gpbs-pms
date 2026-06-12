import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { apiRequest } from '../utils/api';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

const StyledTable = styled(Table)(({ theme }) => ({
    minWidth: 650,
}));

const ProjectLog = ({ projectId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customPhotos, setCustomPhotos] = useState({});

    // Fetch custom photos
    useEffect(() => {
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    // Fetch logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                if (projectId) {
                    const res = await apiRequest(`/projects/${projectId}/logs`);
                    if (res.ok) {
                        const data = await res.json();
                        setLogs(data);
                    }
                }
            } catch (err) {
                console.error('Error fetching logs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [projectId]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getMemberImageUrl = (empId) => {
        return getMemberPhotoUrl(empId, customPhotos);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: '#e8eef7' }}>
                <Typography variant="h6" sx={{ color: '#1a365d', mb: 2, fontWeight: 'bold' }}>
                    Activity Log
                </Typography>

                <TableContainer>
                    <StyledTable aria-label="activity log table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#c5d5e8' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d', width: '60px' }}>No.</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d', width: '120px' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d', width: '100px' }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d' }}>Action</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#1a365d', width: '200px' }}>By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#666' }}>
                                        No activity logs yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log, index) => (
                                    <TableRow
                                        key={log.id}
                                        sx={{ backgroundColor: index % 2 === 0 ? '#f5f8fc' : '#ffffff' }}
                                    >
                                        <TableCell sx={{ fontWeight: 'bold', color: '#8b0000' }}>
                                            {index + 1}.
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(log.action_date)}
                                        </TableCell>
                                        <TableCell>
                                            {formatTime(log.action_date)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#1a365d' }}>
                                            {log.action_type}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar
                                                    src={getMemberImageUrl(log.action_by)}
                                                    alt={log.user_fullname}
                                                    sx={{ width: 32, height: 32 }}
                                                    onError={(e) => handlePhotoError(e, log.action_by)}
                                                />
                                                <Typography variant="body2" sx={{ color: '#0066cc' }}>
                                                    {log.user_fullname || log.action_by || '-'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </StyledTable>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default ProjectLog;
