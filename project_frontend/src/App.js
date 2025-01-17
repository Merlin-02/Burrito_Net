import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/SignUp';
import Dashboard from './components/Dashboard';
import CreateProject from './components/Project/CreateProject';
import ProjectList from './components/Project/ProjectList';
import ProjectDetail from './components/Project/ProjectDetail';
import UserProfile from './components/User/UserProfile';
import ProjectCommits from './components/Project/commits';
import HistorialCommits from './components/User/HistorialCommits';
import EditProfile from './components/User/EditProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/projectlist" element={<ProjectList />} />
        <Route path="/projectdetails/:id" element={<ProjectDetail />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/commits" element={<ProjectCommits />} />
        <Route path="/historialcommits" element={<HistorialCommits />} />
        <Route path="/editprofile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
