import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const payload = {
      username,
      password,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/api/logins/', payload);
      if (response.data) {
        localStorage.setItem('userName', username);
        navigate('/browse');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="container-fluid">
      <div className='row'>
        <div className='LoGin col-lg-6 mx-auto align-items-center justify-content-center '>
      <h2 className='text-center'>VIRTUAL EXAMINER</h2>
      <form onSubmit={handleLogin}>
      {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
        <input
                type="text"
                className="form-control rounded-pill mt-5"
                value={username}
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                required
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
        <button type="submit" className="loginBtn btn mb-4 w-100 rounded-pill ">Login</button>
        <h6 className='text-center'>Don’t have an account? <a href="/signup">Sign Up</a> here</h6>
      </form>
      </div>
      <div className='col-lg-4'>
        
        <img src='/login_img.png' className="loginImg img-fluid vh-100" alt='pic'/>
      </div>
      </div>
    </div>
  );
};

export default Login;



