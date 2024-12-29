import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

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
            <button onClick={handleBackToList}>Volver a la Lista</button>
          </li>
          <li>
            <button onClick={handleViewCommits}>Commits</button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h1>Detalles del Proyecto</h1>
        {project ? (
          <div>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <h3>Tags</h3>
            <ul>
              {project.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
            {project.fileType?.startsWith("image/") && (
              <img
                src={project.fileUrl}
                alt={project.name}
                className="project-image"
              />
            )}
            {project.fileUrl && (
              <a href={project.fileUrl} download={project.fileName}>
                <button className="submit-btn">Descargar Archivo</button>
              </a>
            )}
          </div>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
