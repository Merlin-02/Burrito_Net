import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EditProfile = () => {
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).id : null;
  const navigate = useNavigate(); // Hook para redirigir

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Perfil actualizado exitosamente');
      navigate('/userprofile'); // Redirige al perfil de usuario
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
      alert('Hubo un error al actualizar el perfil');
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/userprofile">Perfil de Usuario</Link></li>
          <li>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?')) {
                  localStorage.removeItem('token');
                  alert('Cuenta eliminada.');
                  window.location.href = '/login';
                }
              }}
            >
              Eliminar Cuenta
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h1 className="main-title">Editar Perfil</h1>
        <form onSubmit={handleSubmit}>
          <table className="edit-profile-table">
            <tbody>
              <tr>
                <td><label htmlFor="username">Nuevo Nombre de Usuario:</label></td>
                <td>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="email">Nuevo Correo Electrónico:</label></td>
                <td>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" className="confirm-btn">Confirmar</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
