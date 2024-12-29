import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Importación correcta
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null); // Información del usuario
  const token = localStorage.getItem('token'); // Obtiene el token almacenado

  // Decodificar el token para obtener el ID del usuario
  const userId = token ? jwtDecode(token).id : null;

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('No se encontró el ID del usuario');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/projectlist">Lista de Proyectos</Link></li>
          <li><Link to="/createproject">Crear Proyecto</Link></li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        {user ? (
          <div className="user-profile">
            <h1>Perfil de Usuario</h1>

            {/* Información del usuario */}
            <h2>{user.username}</h2>
            <p>{user.email}</p>

            {/* Seguidores y seguidos */}
            <div className="follow-info">
              <p>Seguidores: {user.followers.length}</p>
              <p>Seguidos: {user.following.length}</p>
            </div>
          </div>
        ) : (
          <p>Cargando datos del usuario...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
