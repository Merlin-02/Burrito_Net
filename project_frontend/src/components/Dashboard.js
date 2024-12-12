import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar si el usuario está autenticado
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Verificamos si el token existe en localStorage para saber si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Si hay token, el usuario está autenticado
    }

    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token al cerrar sesión
    setIsAuthenticated(false); // Cambiar el estado de autenticación a falso
    console.log('User logged out');
  };

  const handleUploadProject = () => {
    navigate('/createproject'); // Redirigir a la página de "CreateProject"
  };

  return (
    <div className="dashboard">
      <h1>NetBurrito</h1>

      {/* Botones para navegar solo si no están autenticados */}
      <div className="navigation-buttons">
        {!isAuthenticated && (
          <>
            <Link to="/signup"><button>Sign Up</button></Link>
            <Link to="/login"><button>Login</button></Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <button className="upload-project-btn" onClick={handleUploadProject}>
              Subir Proyecto
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      <h2>Proyectos Recientes</h2>
      {loading ? (
        <p>Cargando proyectos...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
