import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoginStatus } from '../../Store/Slices/AuthSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDo-GMUlH9BQyAiH-8WzkaPymtrR5opfKw', {
          email: email,
          password: password,
          returnSecureToken: true,
        });
        const data = response.data;
        if (response.status === 200) {
          localStorage.setItem('loginId', data.idToken);
          dispatch(setLoginStatus(true));
          const userName = email.replace(/[^a-zA-Z0-9 ]/g, '');
          localStorage.setItem('userName', userName);
          navigate('/')
          toast.success('Sign In Successful');
        } else {
          console.log('SignIn failed');
        }
      } catch (error) {
        toast.error('Enter Correct Password');
      }
    } else {
      toast.error('Fill All Fields');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDo-GMUlH9BQyAiH-8WzkaPymtrR5opfKw', {
        requestType: 'PASSWORD_RESET',
        email: email,
      });
      toast.success('Password Reset Mail Sent');
    } catch (error) {
      toast.error('Password Reset Mail Not Sent')
    }
    setShowForgotPassword(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2>Sign In</h2>
      <Form onSubmit={handleSignIn} className="w-25 d-flex flex-column gap-2">
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          Sign In
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <p>
          <Link to="#" onClick={() => setShowForgotPassword(true)}>
            Forgot Password?
          </Link>
        </p>
        <p>
          Don't have an account? <Link to="/sign-up">Create Account</Link>
        </p>
      </div>

      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleForgotPasswordSubmit}>
            <Form.Group controlId="forgotPasswordEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

 
    </div>
  );
};

export default SignIn;
