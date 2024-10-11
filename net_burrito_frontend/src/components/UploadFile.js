// src/components/UploadFile.js

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importar useParams

const UploadFile = () => {
    const { userId } = useParams(); // Obtener userId de la URL
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        try {
            await axios.post(`http://localhost:5000/api/users/${userId}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Archivo subido exitosamente');
            // Reset fields
            setFile(null);
            setDescription('');
        } catch (err) {
            alert(err.response.data.msg || 'Error al subir archivo');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Subir Archivo</h2>
            <input type="file" onChange={handleFileChange} required />
            <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <button type="submit">Subir</button>
        </form>
    );
};

export default UploadFile;
