import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './components/Main';
import Question from './components/Question';
import Statistics from './components/Result';
import Login from './components/Login';
import Signup from './components/Signup';
import Browse from './components/Browse';
import { DataProvider } from './context/dataContext';


function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/question/:quizId" element={<Question />} />
          <Route path="/result" element={<Statistics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;




