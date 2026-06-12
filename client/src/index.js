import React from 'react';
import ReactDOM from 'react-dom/client';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Test from './pages/Test.js';
import Project from './pages/Project.js';
import ProjectList from './components/projectList.jsx';
import ProjectDetail from './pages/ProjectDetail.js';
import Finance from './pages/Finance.js';
import Investment from './pages/Investment.js';
import CreateProject from './pages/CreateProject.js';
import Prioritization from './pages/Prioritization.js';
import ProjectDetail30 from './pages/ProjectDetail30.js';
import ProjectDetail31 from './pages/ProjectDetail31.js';
import ProjectDetail18 from './pages/ProjectDetail18.js';
import ProjectDetail19 from './pages/ProjectDetail19.js';
import ProjectDetail20 from './pages/ProjectDetail20.js';
import ProjectDetail68 from './pages/ProjectDetail68.js';
import ProjectDetail69 from './pages/ProjectDetail69.js';
import ProjectDetail70 from './pages/ProjectDetail70.js';
import ProjectDetail71 from './pages/ProjectDetail71.js';
import ProjectDetail72 from './pages/ProjectDetail72.js';
import ProjectDetail73 from './pages/ProjectDetail73.js';
import ProjectDetail74 from './pages/ProjectDetail74.js';
import ProjectDetail75 from './pages/ProjectDetail75.js';
import ProjectDetail78 from './pages/ProjectDetail78.js';
import DynamicProjectDetail from './pages/DynamicProjectDetail.js';
import SmallGroup from './pages/SmallGroup.js';
import ProjectPersonal from './pages/ProjectPersonal.js';
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
  <Router basename="/true-visions-pms">
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
      <Route path="/project/detail" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><DynamicProjectDetail /></ProtectedRoute>} />
      <Route path="/project/18" element={<ProtectedRoute><ProjectDetail18 /></ProtectedRoute>} />
      <Route path="/project/19" element={<ProtectedRoute><ProjectDetail19 /></ProtectedRoute>} />
      <Route path="/project/20" element={<ProtectedRoute><ProjectDetail20 /></ProtectedRoute>} />
      <Route path="/project/30" element={<ProtectedRoute><ProjectDetail30 /></ProtectedRoute>} />
      <Route path="/project/31" element={<ProtectedRoute><ProjectDetail31 /></ProtectedRoute>} />
      <Route path="/project/68" element={<ProtectedRoute><ProjectDetail68 /></ProtectedRoute>} />
      <Route path="/project/69" element={<ProtectedRoute><ProjectDetail69 /></ProtectedRoute>} />
      <Route path="/project/70" element={<ProtectedRoute><ProjectDetail70 /></ProtectedRoute>} />
      <Route path="/project/71" element={<ProtectedRoute><ProjectDetail71 /></ProtectedRoute>} />
      <Route path="/project/72" element={<ProtectedRoute><ProjectDetail72 /></ProtectedRoute>} />
      <Route path="/project/73" element={<ProtectedRoute><ProjectDetail73 /></ProtectedRoute>} />
      <Route path="/project/74" element={<ProtectedRoute><ProjectDetail74 /></ProtectedRoute>} />
      <Route path="/project/75" element={<ProtectedRoute><ProjectDetail75 /></ProtectedRoute>} />
      <Route path="/project/78" element={<ProtectedRoute><ProjectDetail78 /></ProtectedRoute>} />
      <Route path="/Ongard" element={<ProtectedRoute><ProjectPersonal /></ProtectedRoute>} />
      <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
    </Routes>
  </Router>,
);
