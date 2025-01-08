import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
  const [user, setUser] = useState(null); // Usuario actual
  const [searchQuery, setSearchQuery] = useState(''); // Término de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Resultados de búsqueda
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;

  // Función para obtener los datos del usuario actual
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error.message);
    }
  }, [userId, token]);

  // Ejecuta fetchUserData cuando se monta el componente o cuando cambian sus dependencias
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Función para buscar usuarios
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error al buscar usuarios:', error.message);
    }
  };

  // Función para seguir a un usuario
  const handleFollow = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${id}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Seguido exitosamente.');
      fetchUserData(); // Actualiza la lista de seguidores
    } catch (error) {
      console.error('Error al seguir al usuario:', error.message);
    }
  };

  // Función para dejar de seguir a un usuario
  const handleUnfollow = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${id}/unfollow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Dejado de seguir exitosamente.');
      fetchUserData(); // Actualiza la lista de seguidores
    } catch (error) {
      console.error('Error al dejar de seguir al usuario:', error.message);
    }
  };

  // Función para eliminar la cuenta
  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        alert('Cuenta eliminada.');
        window.location.href = '/login';
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error.message);
      }
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/projectlist">Lista de Proyectos</Link></li>
          <li><Link to="/createproject">Crear Proyecto</Link></li>
          <li><button onClick={handleDeleteAccount}>Eliminar Cuenta</button></li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        {user ? (
          <div className="user-profile">
            <h1 className="main-title">Perfil de Usuario</h1>
            <h2 className="user-name">{user.username}</h2>
            <p className="user-email">{user.email}</p>
            <div className="follow-info">
              <p><strong>Seguidores:</strong> {user.followers.length}</p>
              <p><strong>Seguidos:</strong> {user.following.length}</p>
            </div>

            {/* Botón Editar Perfil */}
            <div className="edit-profile">
              <Link to="/editprofile">
              <button className="project-btn view-details">Editar Perfil</button>
              </Link>
            </div>

            {/* Buscador de usuarios */}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">Buscar</button>
            </form>
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={result._id} className="search-item">
                  <p className="search-text">{result.username} - {result.email}</p>
                  <button onClick={() => handleFollow(result._id)} className="follow-btn">Seguir</button>
                  <button onClick={() => handleUnfollow(result._id)} className="unfollow-btn">Dejar de seguir</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="loading-text">Cargando datos del usuario...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
