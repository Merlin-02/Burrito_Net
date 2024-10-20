import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false); // Estado para mostrar/ocultar la lista de usuarios

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      setLoading(true); // Establecer loading en true antes de las solicitudes
      try {
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        setProjects(projectsResponse.data);
        
        // Aquí llamamos a la función fetchUsers
        await fetchUsers();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Establecer loading en false después de las solicitudes
      }
    };

    fetchProjectsAndUsers();
  }, []);

  // Función para obtener usuarios con autenticación
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Suponiendo que el token se almacena en localStorage
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    // Implementar la lógica para cerrar sesión (ej. limpiar el token del local storage)
    console.log('User logged out');
  };

  const toggleUsers = () => {
    setShowUsers((prev) => !prev); // Cambiar el estado para mostrar/ocultar usuarios
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Botones para navegar */}
      <div className="navigation-buttons">
        <Link to="/signup"><button>Sign Up</button></Link>
        <Link to="/login"><button>Login</button></Link>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Mostrar proyectos más recientes */}
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

      {/* Botón para mostrar/ocultar usuarios */}
      <button onClick={toggleUsers}>
        {showUsers ? 'Ocultar Usuarios' : 'Ver Usuarios'}
      </button>

      {/* Mostrar usuarios */}
      {showUsers && (
        <div>
          <h2>Usuarios</h2>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  <h3>{user.username}</h3>
                  <button onClick={() => followUser(user._id)}>Follow</button>
                  {/* Aquí puedes implementar lógica adicional para mostrar los proyectos del usuario */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const followUser = async (userId) => {
  try {
    await axios.post(`http://localhost:5000/users/${userId}/follow`);
    alert('You are now following this user!');
  } catch (error) {
    console.error('Error following user:', error);
  }
};

export default Dashboard;
