import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setRegistrationError(null);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered:', user);
    } catch (error) {
      console.error('Registration error:', error.message);
      setRegistrationError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
    </div>
  );
};

export default RegistrationForm;



