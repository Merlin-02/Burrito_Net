//forgot password
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/forgot-password', { email });
      setMessage(response.data.message || 'Revisa tu correo para restablecer tu contraseña.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al solicitar restablecimiento.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Restablecer Contraseña</h3>
      <form onSubmit={handleForgotPassword} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Enviar</button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
