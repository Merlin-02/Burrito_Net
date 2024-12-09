import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [tags, setTags] = useState(''); // Almacenamos los tags como una cadena de texto
  const [selectedTags, setSelectedTags] = useState([]); // Almacenamos los tags seleccionados
  const navigate = useNavigate();  // Usamos useNavigate para redireccionar después de crear el proyecto

  const handleTagChange = (e) => {
    setTags(e.target.value);  // Actualizamos los tags mientras el usuario escribe
  };

  const handleAddTag = () => {
    if (tags.trim() && !selectedTags.includes(tags.trim())) {
      setSelectedTags([...selectedTags, tags.trim()]);
      setTags('');  // Limpiamos el campo de entrada de tags
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      name: projectName,
      description: projectDescription,
      tags: selectedTags,  // Los tags seleccionados serán enviados al backend
    };

    try {
      const response = await axios.post('http://localhost:5000/projects/', newProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Asegúrate de incluir el token de autenticación
        },
      });
      console.log('Proyecto creado:', response.data);
      // Redirigir al dashboard después de crear el proyecto
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando el proyecto:', error);
    }
  };

  return (
    <div className="create-project">
      <h1>Crear Proyecto</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Nombre del Proyecto</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ingresa el nombre del proyecto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectDescription">Descripción</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Ingresa la descripción"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Agregar Tags</label>
          <div>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={handleTagChange}
              placeholder="Escribe un tag y presiona Enter"
            />
            <button type="button" onClick={handleAddTag}>Agregar Tag</button>
          </div>
          <div className="tags-container">
            {selectedTags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => handleTagDelete(tag)}>X</button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit">Crear Proyecto</button>
      </form>
    </div>
  );
};

export default CreateProject;
