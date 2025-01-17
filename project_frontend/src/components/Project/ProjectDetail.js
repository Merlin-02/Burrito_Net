import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const [project, setProject] = useState(null);
  const [fileContent, setFileContent] = useState(null); // Para almacenar el contenido del archivo
  const [comment, setComment] = useState(""); // Estado para el comentario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/projects/${id}/project`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Construir la URL para la imagen si filePath existe
        const projectData = response.data;
        if (projectData.filePath) {
          projectData.fileUrl = `http://localhost:5000/${projectData.filePath.replace(
            /\\/g,
            "/"
          )}`;

          // Si el archivo es de tipo "text/*" o "application/*", obtener su contenido
          if (
            projectData.fileType?.startsWith("text/") ||
            projectData.fileType?.startsWith("application/")
          ) {
            const fileResponse = await axios.get(
              `http://localhost:5000/projects/file-content`,
              {
                params: { filePath: projectData.filePath },
                headers: {
                  Authorization: `Bearer ${token}`, // Agregar el token aquí
                },
              }
            );
            setFileContent(fileResponse.data.content); // Almacenar el contenido del archivo
          }
        }

        setProject(projectData);
      } catch (error) {
        console.error("Error al obtener los detalles del proyecto:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleBackToList = () => {
    navigate("/dashboard"); // Redirigir a la lista de proyectos
  };

  const handleViewCommits = () => {
    navigate('/historialcommits', { state: { projectId: id } }); // Pasar el ID del proyecto en el estado
  };
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/projects/${id}/commits`,
        { message: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Comentario enviado exitosamente.");
      setComment(""); // Limpiar el campo de comentario
    } catch (error) {
      console.error("Error al enviar el comentario:", error.message);
      alert("Hubo un error al enviar el comentario.");
    }
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

            {/* Sección para mostrar el archivo */}
            {project.fileUrl && (
              <div className="file-section">
                {fileContent ? (
                  <div className="code-section">
                    <h3>Contenido del Archivo:</h3>
                    <pre className="code-block">{fileContent}</pre>
                  </div>
                ) : project.fileType?.startsWith("image/") ? (
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

            {/* Zona de Comentarios */}
            <div className="comment-section">
              <h3>Deja un comentario</h3>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  placeholder="Escribe tu comentario aquí..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="comment-input"
                />
                <button type="submit" className="comment-submit-btn">
                  Enviar Comentario
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p className="loading-text">Cargando detalles...</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
