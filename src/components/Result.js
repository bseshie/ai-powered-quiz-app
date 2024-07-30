// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Statistics = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:8000/api/logouts/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/scores/');
//         setQuizzes(response.data);
//       } catch (error) {
//         console.error('Error fetching quiz scores:', error);
//         setError('Failed to load quiz scores.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScores();
//   }, []);

//   if (loading) return <div className="text-center mt-5">Loading...</div>;

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg bg-body-tertiary">
//         <div className="container-fluid">
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <Link className="navbar-brand mx-3" to="/">VIRTUAL EXAMINER</Link>
//           <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className="nav-link" aria-current="page" to="/browse">QUIZZES</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link active" to="/result">HISTORY</Link>
//               </li>
//             </ul>
//             <div className="d-flex align-items-center me-3">
//               <button className="btn btn-outline-light me-3" type="button" onClick={handleLogout}>LOGOUT</button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <div className="container mt-5">
//         <h1 className="mb-4" style={{ color: '#0F4C75' }}>HISTORY</h1>
//         {error && <div className="alert alert-danger" role="alert">{error}</div>}
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th scope="col">Quiz Name</th>
//               <th scope="col">Date Taken</th>
//               <th scope="col">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//               {quizzes.length > 0 ? (
//                 quizzes.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.quiz.title}</td>
//                     <td>{new Date(item.date_taken).toLocaleDateString()}</td>
//                     <td>{item.score !== undefined ? item.score : 'N/A'}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center">No quiz scores available</td>
//                 </tr>
//               )}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default Statistics;




import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Statistics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const storedUserName = localStorage.getItem('userName');
        if (!storedUserName) {
          navigate('/login'); // Redirect to login if no username
          return;
        }
        
        setUserName(storedUserName);
        const response = await axios.get('http://localhost:8000/api/scores/', {
          params: { username: storedUserName, t: new Date().getTime() },
        });
        
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quiz scores:', error);
        setError('Failed to load quiz scores.');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand mx-3" to="/">VIRTUAL EXAMINER</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/browse">QUIZZES</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/result">HISTORY</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <h1 className="text-center mt-5">{userName}'s quiz history</h1>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th scope="col">Quiz Name</th>
              <th scope="col">Date Taken</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? (
              quizzes.map((item, index) => (
                <tr key={index}>
                  <td>{item.quiz.title}</td>
                  <td>{new Date(item.date_taken).toLocaleDateString()}</td>
                  <td>{item.score !== undefined ? item.score : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No quiz scores available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
