import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Chart from "react-apexcharts";
import ProjectList from "../components/projectList";
import { apiRequest } from "../utils/api";
import Sidebar from '../components/Sidebar';
import { FormControl, Select, MenuItem } from "@mui/material";

export default function Prioritization() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  useEffect(() => {
    const fetchPrioritizationData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/prioritization?year=${selectedYear}`);

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setError("Failed to fetch prioritization data");
        }
      } catch (err) {
        console.error("Error fetching prioritization data:", err);
        setError("Failed to fetch prioritization data");
      } finally {
        setLoading(false);
      }
    };

    fetchPrioritizationData();
  }, [selectedYear]);

  const mediaProjects = projects.filter((p) => p.c_project_group_id === 1);
  const contentProjects = projects.filter((p) => p.c_project_group_id === 2);

  const getProjectOwnerName = (project) => {
    return project.full_owner_name || project.owner_name || "Unknown";
  };

  // Filter projects by impact and possibility for each quadrant
  const getProjectsByCategory = (impact, possibility) => {
    return projects.filter(p =>
      p.c_impact?.toLowerCase() === impact.toLowerCase() &&
      p.c_urgent?.toLowerCase() === possibility.toLowerCase()
    );
  };

  // Get project number in overall list
  const getProjectNumber = (projectId) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    return projectIndex + 1;
  };

  return (
    <div className="App">
      <Sidebar onToggle={setSidebarOpen} />
      <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
        <div className='header_container'>
          <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
        </div>
        <div className="body_container">
          <div className="prioritization-body">
          <div className="prioritization-body-title" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>Project Prioritization : {selectedYear}</span>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  "& .MuiSelect-select": {
                    padding: "8px 14px",
                  },
                }}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {loading ? (
            <div>Loading high priority projects...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div className="prioritization-seperate">
              <div className="prioritization-describtion">
                <div style={{ marginBottom: "16px", fontWeight: "bold" }}>
                  Project list : {projects.length} projects (All Media + Content Teams)
                </div>

                {mediaProjects.length > 0 && (
                  <>
                    <div
                      style={{
                        marginBottom: "16px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      MEDIA TEAM
                    </div>
                    {mediaProjects.map((project, index) => (
                      <div key={project.id}>
                        {index + 1}. {project.c_name}
                      </div>
                    ))}
                  </>
                )}

                {contentProjects.length > 0 && (
                  <>
                    <div
                      style={{
                        marginBottom: "16px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      CONTENT TEAM
                    </div>
                    {contentProjects.map((project, index) => (
                      <div key={project.id}>
                        {mediaProjects.length + index + 1}. {project.c_name}
                      </div>
                    ))}
                  </>
                )}

                {projects.length === 0 && (
                  <div>
                    No projects found from Media and Content teams.
                  </div>
                )}
              </div>
              <div className="prioritization-grid">
                <div
                  className="prioritization-title"
                  style={{ alignItems: "flex-start" }}
                >
                  High
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#a9e65c" }}
                >
                  {/* Low Impact + High Possibility */}
                  {getProjectsByCategory('Low', 'High').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#88d511" }}
                >
                  {/* Medium Impact + High Possibility */}
                  {getProjectsByCategory('Medium', 'High').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#0fb304" }}
                >
                  {/* High Impact + High Possibility */}
                  {getProjectsByCategory('High', 'High').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div className="prioritization-title">
                  Possibility &nbsp;&nbsp; Medium
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#f16c0b" }}
                >
                  {/* Low Impact + Medium Possibility */}
                  {getProjectsByCategory('Low', 'Medium').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#f5dc04" }}
                >
                  {/* Medium Impact + Medium Possibility */}
                  {getProjectsByCategory('Medium', 'Medium').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#88d511" }}
                >
                  {/* High Impact + Medium Possibility */}
                  {getProjectsByCategory('High', 'Medium').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-title"
                  style={{ alignItems: "flex-end" }}
                >
                  Low
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#f80e21" }}
                >
                  {/* Low Impact + Low Possibility */}
                  {getProjectsByCategory('Low', 'Low').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#f16c0b" }}
                >
                  {/* Medium Impact + Low Possibility */}
                  {getProjectsByCategory('Medium', 'Low').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div
                  className="prioritization-box"
                  style={{ background: "#a9e65c" }}
                >
                  {/* High Impact + Low Possibility */}
                  {getProjectsByCategory('High', 'Low').map((project) => (
                    <Link
                      key={project.id}
                      className="prioritize-circle"
                      to={`/project/${project.id}`}
                      title={`${project.c_name} - Owner: ${getProjectOwnerName(
                        project
                      )}`}
                    >
                      {getProjectNumber(project.id)}
                    </Link>
                  ))}
                </div>
                <div className="prioritization-title"></div>
                <div
                  className="prioritization-title"
                  style={{ justifyContent: "flex-end", margin: "16px 0 0 0" }}
                >
                  Low
                </div>
                <div
                  className="prioritization-title"
                  style={{ justifyContent: "center", margin: "16px 0 20px 0" }}
                >
                  Medium
                </div>
                <div
                  className="prioritization-title"
                  style={{ justifyContent: "flex-start", margin: "16px 0 0 0" }}
                >
                  High
                </div>
                <div className="prioritization-title"></div>
                <div className="prioritization-title"></div>
                <div
                  className="prioritization-title"
                  style={{ justifyContent: "center" }}
                >
                  Impact
                </div>
                <div className="prioritization-title"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
