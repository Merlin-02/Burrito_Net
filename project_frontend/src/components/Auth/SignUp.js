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
    <section 
      className="position-relative overflow-hidden" 
      style={{
        background: 'linear-gradient(135deg, #6B133B 0%, #FCFDF9 100%)',
        minHeight: '100vh', // Esto asegura que la sección ocupe toda la pantalla
        padding: 0 // Elimina el padding adicional
      }}
    >
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="row w-100">
          {/* Formulario de Sign Up a la izquierda */}
          <div className="col-lg-6 mb-12 mb-lg-0">
            <div className="mw-md mw-xl-lg ms-xl-auto">
              <h5 className="mb-5 text-black text-center">Crea tu cuenta</h5>
              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label className="fw-semibold fs-9 mb-1 text-black" htmlFor="username">Username</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    id="username" 
                    placeholder="Introduce tu nombre de usuario" 
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="fw-semibold fs-9 mb-1 text-black" htmlFor="email">Email</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    id="email" 
                    placeholder="ejemplo@gmail.com" 
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="fw-semibold fs-9 mb-1 text-black" htmlFor="password">Password</label>
                  <input 
                    className="form-control" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    id="password" 
                    placeholder="Introduce tu contraseña" 
                    required 
                  />
                </div>

                <button className="btn btn-primary mb-6 w-100 rounded-pill" type="submit">Sign Up</button>

              </form>
            </div>
          </div>

          {/* Imagen a la derecha */}
          <div className="col-lg-6 order-first order-lg-last">
            <div className="mw-md mw-xl-none position-relative">
              <div className="position-absolute bottom-0 start-0 w-100 p-6">
                <div className="py-10 px-6 px-sm-10 bg-dark bg-opacity-25 rounded">
                  <h6 className="text-white text-center">Nueva Cuenta</h6>
                  <p className="fs-5 text-white fw-semibold mb-14">
                    "Crea una cuenta para que puedas subir tus proyecto, conocer más personas, seguirlas y poder compartir mucho conocimiento"
                  </p>
                </div>
              </div>
              <img 
                className="img-fluid d-block w-100" 
                style={{ minHeight: 620, objectFit: 'cover' }} 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGY0NnZuN2FvZ3IyOXB4eHluOHR5MHhqeGRjZnE4aDc4OGczajI5cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/o0vwzuFwCGAFO/giphy.webp" 
                alt="Sign Up" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
