// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import UploadFile from './components/UploadFile';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/users/register" element={<Register />} />
                    <Route path="/users/:userId/upload" element={<UploadFile />} />
                    <Route path="/users/logout" element={<Logout />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
