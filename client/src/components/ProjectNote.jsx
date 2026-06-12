import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Divider,
    IconButton
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiRequest } from '../utils/api';
import { fetchCustomPhotos, getMemberPhotoUrl, handlePhotoError } from '../utils/photoUrl';

const ProjectNote = ({ projectId, currentUser, isOwner = false }) => {
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [customPhotos, setCustomPhotos] = useState({});

    // Fetch custom photos
    useEffect(() => {
        fetchCustomPhotos().then(photos => setCustomPhotos(photos));
    }, []);

    // Fetch notes
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                if (projectId) {
                    const res = await apiRequest(`/projects/${projectId}/notes`);
                    if (res.ok) {
                        const data = await res.json();
                        setNotes(data);
                    }
                }
            } catch (err) {
                console.error('Error fetching notes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [projectId]);

    const handleInsertNote = async () => {
        if (!noteContent.trim()) {
            alert('Please enter a note');
            return;
        }

        try {
            const response = await apiRequest(`/projects/${projectId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    note_content: noteContent,
                    created_by: currentUser?.c_emp_id || null
                })
            });

            if (response.ok) {
                // Refresh notes
                const res = await apiRequest(`/projects/${projectId}/notes`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data);
                }
                setNoteContent('');
                alert('Note added successfully!');
            } else {
                alert('Failed to add note');
            }
        } catch (err) {
            console.error('Error adding note:', err);
            alert('Error adding note');
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const response = await apiRequest(`/notes/${noteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setNotes(notes.filter(n => n.id !== noteId));
            } else {
                alert('Failed to delete note');
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Error deleting note');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatThaiDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                          'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // Buddhist year
        return `${day} ${month} ${year}`;
    };

    const getMemberImageUrl = (empId) => {
        return getMemberPhotoUrl(empId, customPhotos);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Note Input Section - Only show for project owner */}
            {isOwner && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e8eef7' }}>
                    <Typography variant="h6" sx={{ color: '#1a365d', mb: 2, fontWeight: 'bold' }}>
                        Note
                    </Typography>

                    {/* Simple toolbar styling */}
                    <Box sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px 4px 0 0',
                        backgroundColor: '#f5f5f5',
                        p: 1,
                        display: 'flex',
                        gap: 1
                    }}>
                        <Button size="small" sx={{ minWidth: 'auto', fontWeight: 'bold' }}>B</Button>
                        <Button size="small" sx={{ minWidth: 'auto', fontStyle: 'italic' }}>I</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button size="small" sx={{ minWidth: 'auto' }}>1.</Button>
                        <Button size="small" sx={{ minWidth: 'auto' }}>•</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button size="small" sx={{ minWidth: 'auto' }}>🔗</Button>
                        <Button size="small" sx={{ minWidth: 'auto' }}>✂</Button>
                    </Box>

                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Enter your note here..."
                        style={{
                            width: '100%',
                            minHeight: '150px',
                            padding: '12px',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            border: '1px solid #ccc',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleInsertNote}
                            sx={{
                                borderColor: '#8b0000',
                                color: '#8b0000',
                                '&:hover': { borderColor: '#660000', backgroundColor: '#fff5f5' }
                            }}
                        >
                            Insert Note
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Notes List */}
            <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" sx={{ color: '#1a365d', mb: 2, fontWeight: 'bold' }}>
                    Note
                </Typography>

                {notes.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: '#666', py: 4 }}>
                        No notes yet.
                    </Typography>
                ) : (
                    notes.map((note, index) => (
                        <Box key={note.id} sx={{ mb: 3 }}>
                            {/* Author info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                    src={getMemberImageUrl(note.created_by)}
                                    alt={note.author_fullname}
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                    onError={(e) => handlePhotoError(e, note.created_by)}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: '#1a365d', fontWeight: 'bold' }}>
                                        {note.author_name ? `K.${note.author_fullname}` : 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        Last update : {formatDate(note.created_at)}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography sx={{ color: '#1a365d' }}>
                                        Note : {notes.length - index}
                                    </Typography>
                                    {isOwner && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteNote(note.id)}
                                            sx={{ color: '#8b0000' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            {/* Date header */}
                            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                {formatThaiDate(note.created_at)}
                            </Typography>

                            {/* Note content */}
                            <Typography sx={{
                                color: '#8b0000',
                                whiteSpace: 'pre-wrap',
                                pl: 2,
                                borderLeft: '3px solid #1a365d'
                            }}>
                                {note.note_content}
                            </Typography>

                            {/* Separator */}
                            <Typography sx={{ textAlign: 'center', color: '#ccc', my: 2 }}>
                                =====================================
                            </Typography>
                        </Box>
                    ))
                )}
            </Paper>
        </Box>
    );
};

export default ProjectNote;
