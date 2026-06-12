import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getUser } from '../utils/auth';
import { apiRequest, API_BASE_URL } from '../utils/api';
import { clearPhotoCache } from '../utils/photoUrl';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProfileEdit() {
    const navigate = useNavigate();
    const currentUser = getUser();
    const fileInputRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentPhoto, setCurrentPhoto] = useState(null);

    // Load current profile photo
    useEffect(() => {
        if (currentUser?.c_emp_id) {
            apiRequest(`/profile/photo/${currentUser.c_emp_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.photo) {
                        setCurrentPhoto(`${API_BASE_URL}/uploads/profiles/${data.photo}`);
                    }
                })
                .catch(() => {});
        }
    }, []);

    const getDisplayPhoto = () => {
        if (preview) return preview;
        if (currentPhoto) return currentPhoto;
        if (currentUser?.c_emp_id) {
            return `https://ibsdo.com/tvs/ltvs/emp_pic/${currentUser.c_emp_id}.jpg`;
        }
        return process.env.PUBLIC_URL + '/assets/project-owner.jpg';
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Only image files (JPG, PNG, GIF, WEBP) are allowed.' });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
            return;
        }

        setSelectedFile(file);
        setMessage({ type: '', text: '' });

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Please select a photo first.' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/profile/upload-photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.status === 'ok') {
                setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
                setCurrentPhoto(`${API_BASE_URL}/uploads/profiles/${data.photo}?t=${Date.now()}`);
                setSelectedFile(null);
                setPreview(null);
                clearPhotoCache(); // Clear cache so other pages pick up the new photo
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to upload photo.' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload photo. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='body-title' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ArrowBackIcon
                            style={{ cursor: 'pointer', fontSize: '28px' }}
                            onClick={() => navigate(-1)}
                        />
                        <span>EDIT PROFILE</span>
                    </div>

                    <div className='gauge' style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '30px 20px'
                        }}>
                            {/* User Info */}
                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                                    {currentUser?.c_name} {currentUser?.c_lastname}
                                </div>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                    ID: {currentUser?.c_emp_id}
                                </div>
                            </div>

                            {/* Profile Photo */}
                            <div
                                style={{
                                    position: 'relative',
                                    width: '180px',
                                    height: '180px',
                                    margin: '20px 0',
                                    cursor: 'pointer'
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <img
                                    src={getDisplayPhoto()}
                                    alt="Profile"
                                    style={{
                                        width: '180px',
                                        height: '180px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid rgba(100, 150, 200, 0.5)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                    }}
                                    onError={(e) => {
                                        if (e.target.src.includes('/tvs/')) {
                                            e.target.src = `https://ibsdo.com/bsdo/emp_pic/${currentUser?.c_emp_id}.jpg`;
                                        } else {
                                            e.target.src = process.env.PUBLIC_URL + '/assets/project-owner.jpg';
                                        }
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    right: '5px',
                                    backgroundColor: '#3498db',
                                    borderRadius: '50%',
                                    width: '42px',
                                    height: '42px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    border: '3px solid #1a1a2e'
                                }}>
                                    <CameraAltIcon style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />

                            <div style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '12px',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                Click the photo to select a new image<br />
                                Max file size: 5MB (JPG, PNG, GIF, WEBP)
                            </div>

                            {/* Selected file info */}
                            {selectedFile && (
                                <div style={{
                                    backgroundColor: 'rgba(52, 152, 219, 0.15)',
                                    border: '1px solid rgba(52, 152, 219, 0.3)',
                                    borderRadius: '8px',
                                    padding: '12px 20px',
                                    marginBottom: '20px',
                                    color: '#3498db',
                                    fontSize: '14px',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                                </div>
                            )}

                            {/* Message */}
                            {message.text && (
                                <div style={{
                                    backgroundColor: message.type === 'success'
                                        ? 'rgba(46, 204, 113, 0.15)'
                                        : 'rgba(231, 76, 60, 0.15)',
                                    border: `1px solid ${message.type === 'success' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
                                    borderRadius: '8px',
                                    padding: '12px 20px',
                                    marginBottom: '20px',
                                    color: message.type === 'success' ? '#2ecc71' : '#e74c3c',
                                    fontSize: '14px',
                                    width: '100%',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                    {message.type === 'success' && <CheckCircleIcon style={{ fontSize: '18px' }} />}
                                    {message.text}
                                </div>
                            )}

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                style={{
                                    backgroundColor: selectedFile ? '#3498db' : 'rgba(255,255,255,0.1)',
                                    color: selectedFile ? '#fff' : 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '14px 40px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: selectedFile ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                {uploading ? 'Uploading...' : 'Save Profile Photo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}