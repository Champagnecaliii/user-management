import React from 'react';
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const LogoutButton = () => {
  const history = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      history.push('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };
  return (
    <div>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;


