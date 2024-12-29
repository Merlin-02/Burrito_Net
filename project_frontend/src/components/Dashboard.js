import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const projectsResponse = await axios.get('http://localhost:5000/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProjects();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li>
            <Link to="/createproject">Subir Proyecto</Link>
          </li>
          <li>
            <Link to="/projectlist">Lista de Proyectos</Link>
          </li>
          <li>
            <Link to="/userprofile">Perfil de Usuario</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h2>Proyectos Recientes</h2>
        {loading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project._id} className="project-item">
                <h3>{project.name}</h3>
                <p>{project.description.substring(0, 100)}...</p>
                <p>Creado por: {project.createdByName || 'Usuario Desconocido'}</p>
                {project.fileUrl && (
                  <div className="project-file">
                    {project.fileType?.startsWith('image/') ? (
                      <img src={project.fileUrl} alt={project.name} className="project-image" />
                    ) : (
                      <div className="button-container">
                        <a href={project.fileUrl} download={project.fileName}>
                          <button className="project-btn">Descargar Archivo ({project.fileName})</button>
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <button
                  className="project-btn view-details"
                  onClick={() => navigate(`/projectdetails/${project._id}`)}
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
