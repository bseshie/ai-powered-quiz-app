import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      password,
    };
    console.log(payload)
    try {
      const response = await axios.post('http://localhost:8000/api/signups/', payload);
      if (response.status === 201 || response.status === 200) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
    
  };

  return (
    <div className="container-fluid">
      <div className='row'>
        <div className='LoGin col-lg-6 mx-auto align-items-center justify-content-center'>
          <h2 className='text-center'>VIRTUAL EXAMINER</h2>
          <form onSubmit={handleSignup}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group mb-4">
              <input
                type="text"
                className="form-control rounded-pill"
                value={username}
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control rounded-pill mt-5 mb-5"
                value={email}
                placeholder='EMAIL'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control rounded-pill mt-5 mb-5"
                value={password}
                placeholder='PASSWORD'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="submitBtn btn mb-4 w-100 rounded-pill">Sign Up</button>
            <h6 className='text-center'>Already have an account? <a href="/login">Log In</a> here</h6>
          </form>
        </div>
        <div className='col-lg-4'>
          <img src='/login_img.png' className="loginImg img-fluid vh-100" alt='pic'/>
        </div>
      </div>
    </div>
  );
};

export default Signup;

