import React from 'react';
import ReactDOM from 'react-dom/client';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Project from './pages/Project.js';
import Finance from './pages/Finance.js';
import Investment from './pages/Investment.js';
import CreateProject from './pages/CreateProject.js';
import Prioritization from './pages/Prioritization.js';
import DynamicProjectDetail from './pages/DynamicProjectDetail.js';
import SmallGroup from './pages/SmallGroup.js';
import Login from './pages/Login.js';
import ChangePassword from './pages/ChangePassword.js';
import ForgotPassword from './pages/ForgotPassword.js';
import MyProject from './pages/MyProject.js';
import EditProject from './pages/EditProject.js';
import Members from './pages/Members.js';
import Analyst from './pages/Analyst.js';
import MemberDetail from './pages/MemberDetail.js';
import ProfileEdit from './pages/ProfileEdit.js';
import './styles/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router basename="/gpbs-pms">
    <ScrollToTop />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes - require authentication */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/my-project" element={<ProtectedRoute><MyProject /></ProtectedRoute>} />
      <Route path="/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
      <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
      <Route path="/small-group" element={<ProtectedRoute><SmallGroup /></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path="/prioritization" element={<ProtectedRoute><Prioritization /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
      <Route path="/analyst" element={<ProtectedRoute><Analyst /></ProtectedRoute>} />
      <Route path="/investment" element={<ProtectedRoute><Investment /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
      <Route path="/members/:id" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><DynamicProjectDetail /></ProtectedRoute>} />
    </Routes>
  </Router>,
);
