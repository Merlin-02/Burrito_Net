import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la consulta de búsqueda
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Función para obtener proyectos desde el backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data); // Actualizar proyectos en el estado
    } catch (error) {
      console.error('Error al obtener proyectos:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login'); // Redirigir al login si no está autenticado
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener proyectos al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProjects(); // Llamar a la función de proyectos
    } else {
      navigate('/login'); // Redirigir si no hay token
    }
  }, [navigate]);

  // Manejar el evento de búsqueda local
  const handleSearch = (e) => {
    e.preventDefault();
    const filteredProjects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setProjects(filteredProjects); // Actualizar los proyectos filtrados
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="dashboard main-layout">
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
        <h2 className="main-title">Proyectos Recientes</h2>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar proyectos por nombre o tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>

        {loading ? (
          <p className="loading-text">Cargando proyectos...</p>
        ) : (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project._id} className="project-item">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description.substring(0, 100)}...</p>
                <p className="project-creator">
                  Creado por: {project.createdBy?.username || 'Usuario Desconocido'}
                </p>
                {project.fileUrl && (
                  <div className="project-file">
                    {project.fileType?.startsWith('image/') ? (
                      <img
                        src={project.fileUrl}
                        alt={project.name}
                        className="project-image"
                      />
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
