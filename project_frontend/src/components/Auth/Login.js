// src/components/Auth/Login.js
import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../../styles.css'; // Asegúrate de importar el archivo CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      // Guardamos el token en el localStorage
      localStorage.setItem('token', token);
      console.log('Login exitoso, token:', token);

      // Redirigir al Dashboard después de un login exitoso
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Error al iniciar sesión, por favor revisa tus credenciales');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
