import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
    return (
        <section className='main text-white text-center'>
            <div className="container-fluid d-flex">
                <div className="row vh-100 align-items-center">
                    <div className="col-lg-8">
                        <h1 className='fw-bold mb-5 ' style={{ color: '#0F4C75'}}>VIRTUAL EXAMINER</h1>
                        <h5 className='mb-5 ms-5 me-5 text-dark'>Tailored Quizzes Just for You. Where curiosity meets fun!  Challenge your mind, Enjoy the ride!</h5>
                        <Link to="/signup" className="text-light">
                            <button className="button btn px-5 py-2 mx-4 text-light fw-bold">Sign Up</button>
                        </Link>
                        <Link to="/login" className="text-light">
                            <button className="button btn px-5 py-2 text-light fw-bold">Login</button>
                        </Link>
                    </div>
                    <div className='col-lg-4'>
                        <img src="/login_img.png" className="loginImg img-fluid vh-100 " alt="laptop"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Start;

