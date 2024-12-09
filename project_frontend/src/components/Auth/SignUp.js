// src/components/Auth/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../../styles.css'; // Asegúrate de importar el archivo CSS

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para navegación

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        username,
        email,
        password,
      });
      console.log(`Bienvenido ${response.data.username}`); // Cambié `response.username` por `response.data.username`
      alert('User created successfully!');

      // Redirige al usuario a Dashboard
      navigate('/dashboard');
    } catch (error) {
      // Manejo mejorado de errores
      if (error.response && error.response.data) {
        console.error('Signup error:', error.response.data);
        alert(`Signup error: ${error.response.data.error || 'An error occurred'}`);
      } else {
        console.error('Signup error:', error);
        alert('Signup error: An unexpected error occurred');
      }
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
