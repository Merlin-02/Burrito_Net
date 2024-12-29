import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="project-list-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li>
            <Link to="/createproject">Crear Nuevo Proyecto</Link>
          </li>
          <li>
            <Link to="/dashboard">Ir al Dashboard</Link>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="project-list-content">
        <h1>Lista de Proyectos</h1>
        <div className="project-items">
          {projects.map((project) => (
            <div key={project._id} className="project-item">
              <h3>{project.name}</h3>
              <p>{project.description.slice(0, 50)}...</p> {/* Muestra solo los primeros 50 caracteres */}
              <button
                className="view-details-btn"
                onClick={() => navigate(`/projectdetails/${project._id}`)}
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
