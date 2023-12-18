import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagement from './UserManagement';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import RegistrationForm from './RegistrationForm';
import firebaseConfig from './firebaseConfig';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<div>Home Page</div>} /> */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



