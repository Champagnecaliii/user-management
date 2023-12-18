import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(null);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);

      if (user && user.status === 'blocked') {
        await signOut(auth);
        console.log('Blocked user tried to login. Redirecting to login page.');
        navigate.push('/login');
      } else {
        navigate.push('/register');
      }

    } catch (error) {
      setError(error.message);
      console.error('Login error:', error.message);
    }
  };

  return (
    <div>
      <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default LoginForm;


