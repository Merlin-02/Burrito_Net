// ProjectDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  // Obtener los detalles del proyecto
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del proyecto:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleBackToList = () => {
    navigate("/projectlist"); // Redirigir a la lista de proyectos
  };

  const handleViewCommits = () => {
    navigate(`/commits?projectId=${id}`); // Redirigir al historial de commits
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Opciones</h2>
        <ul>
          <li>
            <button onClick={handleBackToList} className="sidebar-button">
              Volver a la Lista
            </button>
          </li>
          <li>
            <button onClick={handleViewCommits} className="sidebar-button">
              Ver Commits
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h1 className="main-title">Detalles del Proyecto</h1>
        {project ? (
          <div className="project-detail">
            <h2 className="project-title">{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <h3 className="tags-title">Tags</h3>
            <div className="tags-container">
              {project.tags.map((tag, index) => (
                <span key={index} className="tag-chip">{tag}</span>
              ))}
            </div>
            {project.fileUrl && (
              <div className="file-section">
                {project.fileType?.startsWith("image/") ? (
                  <img
                    src={project.fileUrl}
                    alt={project.name}
                    className="project-image"
                  />
                ) : (
                  <p>Archivo disponible: {project.fileName}</p>
                )}
                <a href={project.fileUrl} download={project.fileName}>
                  <button className="project-btn">Descargar Archivo</button>
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="loading-text">Cargando detalles...</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
