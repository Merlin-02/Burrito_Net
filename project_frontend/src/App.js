import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/SignUp';
import Dashboard from './components/Dashboard';
import CreateProject from './components/Project/CreateProject';
import ProjectList from './components/Project/ProjectList';
import ProjectDetail from './components/Project/ProjectDetail';
import UserProfile from './components/User/UserProfile';
import ProjectCommits from './components/Project/commits';
import HistorialCommits from './components/User/HistorialCommits';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirige la ruta raíz a Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Otras rutas */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/projectlist" element={<ProjectList />} />
        <Route path="/projectdetails/:id" element={<ProjectDetail />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/commits" element={<ProjectCommits />} />
        <Route path="/Historialcommits" element={<HistorialCommits />} />
      </Routes>
    </Router>
  );
};

export default App;
