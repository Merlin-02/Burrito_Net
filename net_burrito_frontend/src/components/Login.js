import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password
            });
            //console.log('Inicio de sesión exitoso:', response.data);
            
            // Almacenar el token y el userId en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Almacenar userId
    
            // Obtener userId desde localStorage para usar en la navegación
            const userId = response.data.userId; // Obtener userId directamente del response
    
            // Redirigir a la página de subida de archivos
            navigate(`/users/${userId}/upload`); 
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
        }
    };
    
    

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
