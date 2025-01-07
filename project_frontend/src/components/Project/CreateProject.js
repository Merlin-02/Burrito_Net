import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const handleTagChange = (e) => setTags(e.target.value);
  const handleAddTag = () => {
    if (tags.trim() && !selectedTags.includes(tags.trim())) {
      setSelectedTags([...selectedTags, tags.trim()]);
      setTags("");
    }
  };
  const handleTagDelete = (tagToDelete) =>
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !projectDescription.trim()) {
      alert("El nombre y la descripción son obligatorios.");
      return;
    }

    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files[0]) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", projectName.trim());
    formData.append("description", projectDescription.trim());
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("file", fileInput.files[0]);

    console.log("Datos enviados al backend:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        "http://localhost:5000/projects/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Proyecto creado:", response.data);
      navigate(`/projectdetails/${response.data._id}`);
    } catch (error) {
      console.error("Error creando el proyecto:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error al crear el proyecto.");
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/projectlist">Lista de Proyectos</Link></li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <form onSubmit={handleSubmit}>
          <h2>Crear Proyecto</h2>
          <div className="form-group">
            <label htmlFor="projectName">Nombre del Proyecto</label>
            <input
              type="text"
              id="projectName"
              placeholder="Ingresa el nombre del proyecto"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectDescription">Descripción</label>
            <textarea
              id="projectDescription"
              placeholder="Ingresa la descripción"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Agregar Tags</label>
            <div className="tag-input">
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
                <span key={index}>
                  {tag}
                  <button type="button" onClick={() => handleTagDelete(tag)}>X</button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fileInput">Subir Archivo</label>
            <input type="file" id="fileInput" accept=".jpeg,.jpg,.png,.gif,.webp,.txt,.py,.zip,.tar,.gz,.c" />
          </div>
          <button type="submit">Crear Proyecto</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
