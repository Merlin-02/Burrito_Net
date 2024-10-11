// src/components/Logout.js

import React from 'react';

const Logout = () => {
    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token
        alert('Has cerrado sesión');
        window.location.href = '/login'; // Redirigir al login
    };

    return (
        <button onClick={handleLogout}>Cerrar Sesión</button>
    );
};

export default Logout;
