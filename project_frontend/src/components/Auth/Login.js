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
    <section 
      className="position-relative overflow-hidden" 
      style={{
        background: 'linear-gradient(135deg, #0798A3 0%, #FCFDF9 100%)',
        minHeight: '100vh', // Esto asegura que la sección ocupe toda la pantalla
        padding: 0 // Elimina el padding adicional
      }}
    >
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="row w-100">
          {/* Imagen y texto en el lado izquierdo */}
          <div className="col-lg-6 order-last order-lg-first">
            <div className="mw-md mw-xl-none position-relative">
              <div className="position-absolute bottom-0 start-0 w-100 p-6">
                <div className="py-10 px-6 px-sm-10 bg-dark bg-opacity-25 rounded">
                  <h6 className="text-white text-center">IA para analizar dibujos</h6>
                  <p className="fs-5 text-white fw-semibold mb-14">
                    "Sistemas de inteligencia artificial diseñados para interpretar y comprender imágenes... utilizan técnicas de visión por computadora y aprendizaje automático para extraer..."
                  </p>
                </div>
              </div>
              <img 
                className="img-fluid d-block w-100" 
                style={{ minHeight: 620, objectFit: 'cover' }} 
                src="https://content.cuerpomente.com/medio/2022/09/08/dibujo-nino_6db16aa5_1200x1200.jpg" 
                alt="Sign Up" 
              />
            </div>
          </div>

          {/* Formulario de Login a la derecha */}
          <div className="col-lg-6 mb-12 mb-lg-0">
            <div className="mw-md mw-xl-lg ms-xl-auto">
              <h5 className="mb-5 text-black text-center">Entra a tu cuenta</h5>
              <form onSubmit={handleLogin}>
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

                <button className="btn btn-primary mb-6 w-100 rounded-pill" type="submit">Login</button>

                <p className="fs-10 fw-semibold text-center text-black">
                  <span>¿No tienes una cuenta?</span>
                  <a className="btn btn-link fw-semibold fs-10 p-0" href="/signup">Sign up</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
