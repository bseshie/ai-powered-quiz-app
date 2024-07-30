import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Browse = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('quiz.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setQuizzes(data);
        setFilteredQuizzes(data);
      } catch (error) {
        setError('Failed to fetch quizzes.');
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'User';
    setUserName(storedUserName);
  }, []);

  useEffect(() => {
    const results = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(results);
  }, [searchTerm, quizzes]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Logging Out');
    
    if (confirmed) {
      try {
        await fetch('http://localhost:8000/api/logouts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        navigate('/login'); // Redirect to login page
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };
  
  
  return (
    <section className="browse-quizzes">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand mx-3" to="/">VIRTUAL EXAMINER</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/browse">QUIZZES</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/result">HISTORY</Link>
              </li>
            </ul>
            <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search course or topic"
                aria-label="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-light me-3" type="submit">Search</button>
            </form>
            <div className="d-flex align-items-center me-3">
              <button className="btn btn-outline-light me-3" type="button" onClick={handleLogout}>LOGOUT</button>
            </div>
          </div>
        </div>
      </nav>

      <h1 className="text-center mt-5">Welcome, {userName}!</h1>
      <h6 className="text-center mt-5">Tailored Quizzes Just for You. Where curiosity meets fun! Challenge your mind, Enjoy the ride!</h6>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="container mt-5">
        <div className="row">
          {filteredQuizzes.slice(0, 6).map((quiz, index) => (
            <div key={index} className="col-lg-4">
              <div className="card mb-5" style={{ width: '18rem' }}>
                <img src={quiz.image} className="card-img-top" alt={quiz.title} />
                <div className="card-body text-center">
                  <h5 className="card-title ">{quiz.title}</h5>
                  <p className="card-text">{quiz.description}</p>
                  <Link to={`/question/${quiz.id}`} className="btn btn-primary mx-5 px-4 rounded-pill">Start Quiz</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Browse;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// const Browse = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredQuizzes, setFilteredQuizzes] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await fetch('quiz.json');
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         setQuizzes(data);
//         setFilteredQuizzes(data);
//       } catch (error) {
//         setError('Failed to fetch quizzes.');
//         console.error('Error fetching quizzes:', error);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   useEffect(() => {
//     const storedUserName = localStorage.getItem('userName') || 'User';
//     setUserName(storedUserName);
//   }, []);

//   useEffect(() => {
//     const results = quizzes.filter(quiz =>
//       quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredQuizzes(results);
//   }, [searchTerm, quizzes]);

//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:8000/api/logout/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userName');
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };


//   const handleSignout = async () => {
//     try {
//       await fetch('http://localhost:8000/api/signout/', {  // Ensure this matches the Django URL
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('userName');
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };
  
//   return (
//     <section className="browse-quizzes">
//       <nav className="navbar navbar-expand-lg bg-body-tertiary">
//         <div className="container-fluid">
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <Link className="navbar-brand mx-3" to="/">VIRTUAL EXAMINER</Link>
//           <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className="nav-link active" aria-current="page" to="/browse">QUIZZES</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/result">HISTORY</Link>
//               </li>
//             </ul>
//             <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
//               <input
//                 className="form-control me-2"
//                 type="search"
//                 placeholder="Search course or topic"
//                 aria-label="Search"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//               />
//               <button className="btn btn-outline-light me-3" type="submit">Search</button>
//             </form>
//             <div className="d-flex align-items-center me-3">
//               <button className="btn btn-outline-light me-3" type="button" onClick={handleLogout}>LOGOUT</button>
//               <button className="btn" style={{ backgroundColor: '#dc3545', color: '#fff' }} type="button" onClick={handleSignout}>SIGN OUT</button>

//             </div>
//           </div>
//         </div>
//       </nav>

//       <h1 className="text-center mt-5">Welcome, {userName}!</h1>
//       <h6 className="text-center mt-5">Tailored Quizzes Just for You. Where curiosity meets fun! Challenge your mind, Enjoy the ride!</h6>
//       {error && <div className="alert alert-danger text-center">{error}</div>}
//       <div className="container mt-5">
//         <div className="row">
//           {filteredQuizzes.slice(0, 6).map((quiz, index) => (
//             <div key={index} className="col-lg-4">
//               <div className="card mb-5" style={{ width: '18rem' }}>
//                 <img src={quiz.image} className="card-img-top" alt={quiz.title} />
//                 <div className="card-body text-center">
//                   <h5 className="card-title ">{quiz.title}</h5>
//                   <p className="card-text">{quiz.description}</p>
//                   <Link to={`/question/${quiz.id}`} className="btn btn-primary mx-5 px-4 rounded-pill">Start Quiz</Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Browse;
