import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const HistorialCommits = () => {
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();
  const location = useLocation(); // Acceder al estado de navegación
  const { projectId } = location.state || {}; // Obtener el ID del proyecto desde el estado

  const [commits, setCommits] = useState([]);

  useEffect(() => {
    if (!projectId) {
      console.error("ID del proyecto no proporcionado");
      return;
    }

    const fetchCommits = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/projects/${projectId}/commits`, // Usamos el ID del proyecto
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCommits(response.data);
      } catch (error) {
        console.error("Error al obtener los commits:", error.message);
      }
    };

    fetchCommits();
  }, [projectId, token]);

  if (!projectId) {
    return <p>Error: No se proporcionó el ID del proyecto.</p>;
  }

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>NetBurrito</h2>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <button
              onClick={() => navigate(-1)} // Navega a la página anterior
              className="search-button"
            >
              Regresar
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <h1>Historial de Commits</h1>
        {commits.length > 0 ? (
          <div className="commit-list">
            {commits.map((commit) => (
              <div key={commit._id} className="commit-card">
                <p>
                  <strong>Mensaje:</strong> {commit.message}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(commit.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay commits disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default HistorialCommits;
