import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const fetchQuestionsForQuiz = async (apiUrl, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(apiUrl);
    console.log('Fetched questions:', response.data.results);
    return response.data.results.map(question => ({
      question: question.question,
      options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
      answer: question.correct_answer,
    }));
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.warn('Rate limit exceeded. Retrying...');
      await new Promise(res => setTimeout(res, delay));
      return fetchQuestionsForQuiz(apiUrl, retries - 1, delay * 2);
    } else {
      console.error('Error fetching trivia questions:', error);
      throw error;
    }
  }
};

const getQuizData = async (quizId) => {
  try {
    const response = await fetch('/quiz.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const quizzes = await response.json();
    console.log('Fetched quizzes:', quizzes);

    const quiz = quizzes.find(q => q.id === quizId);
    console.log('Selected quiz:', quiz);

    if (quiz) {
      return {
        title: quiz.title,
        questions: await fetchQuestionsForQuiz(quiz.api_url),
      };
    }
    return { title: '', questions: [] };
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return { title: '', questions: [] };
  }
};

const getUserNameFromLocalStorage = () => {
  return localStorage.getItem('userName') || 'User';
};

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(300);
  // const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    console.log('Quiz ID:', quizId);
    const fetchQuestions = async () => {
      try {
        const { title, questions: quizQuestions } = await getQuizData(quizId);
        console.log('Questions fetched:', quizQuestions);
        setQuizTitle(title);
        setQuestions(quizQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    console.log('Questions length:', questions.length); 
  }, [questions]);

  useEffect(() => {
    if (totalTimeLeft === 0) {
      setShowScore(true);
    }
    const timer = totalTimeLeft > 0 && setInterval(() => setTotalTimeLeft(prevTime => prevTime - 1), 1000);
    return () => clearInterval(timer);
  }, [totalTimeLeft]);

  

  const fetchQuizData = async (quizId) => {
    try {
      const response = await fetch('/quiz.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const quizzes = await response.json();

      const quiz = quizzes.find(q => q.id === quizId);
      return quiz ? { id: quiz.id, title: quiz.title } : null; 
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      return null;
    }
  };

  
  const submitScore = async (score) => {
    try {
        const userName = getUserNameFromLocalStorage();
        if (!userName) {
            throw new Error('User name not found');
        }

        const quizData = await fetchQuizData(quizId);

        if (!quizData) {
            throw new Error('Quiz data not found');
        }

        console.log("Submitting score:");
        console.log(`userName: ${userName}`);
        console.log(`quiz: ${JSON.stringify(quizData)}`);
        console.log(`score: ${score}`);

        await axios.post('http://localhost:8000/api/scores/', {
            userName: userName,
            quiz: { title: quizData.title || "Unknown Quiz" },
            score: score,
        });

        console.log('Score submitted successfully');
    } catch (error) {
        console.error('Error submitting score:', error);
        console.log(error.response?.data);
    }
};

  

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex]?.answer) {
      setScore(score + 1 );
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect: The correct answer is ${questions[currentQuestionIndex]?.answer}`);
    }

    setTimeout(() => {
      setSelectedOption('');
      setFeedback(null);
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        submitScore(score ); 
        setShowScore(true);
      }
    }, 2000);
  };

  const downloadQuestions = () => {
    const textLines = [];

    // // Add the header row
    // textLines.push('Question\tOption 1\tOption 2\tOption 3\tOption 4\tCorrect Answer');

    questions.forEach(question => {
        const options = [...question.options];
        while (options.length < 4) options.push('');

        const formattedOptions = options.map(option =>
            option === question.answer
                ? `**${option}**`  // Highlight correct answer with asterisks
                : option
        );

       
        textLines.push([
            question.question,
            formattedOptions[0],
            formattedOptions[1],
            formattedOptions[2],
            formattedOptions[3],
            // formattedOptions.find(opt => opt.startsWith('**')) // Correct answer highlighted
        ].join('\t\t'));
    });


    const textString = textLines.join('\n\n\n\n');

    const blob = new Blob([textString], { type: 'text/plain' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${quizTitle}-questions.txt`;

    // Click the link to trigger the download
    link.click();
};

  

  const Navbar = () => (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand mx-3" href="/">VIRTUAL EXAMINER</a>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/browse">QUIZZES</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/result">HISTORY</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search course or topic" aria-label="Search" />
            <button className="btn btn-outline-light me-3" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );

  if (showScore) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card quiz text-center">
                <div className="card-body score">
                  <h1 className="card-title">Your Score</h1>
                  <h5 className={`card-text ${score > (questions.length / 2) ? 'text-success' : 'text-danger'}`}>
                    You scored {score} out of {questions.length}
                  </h5>
                  <a href="/browse" style={{ backgroundColor: '#0F4C75', color: '#fff' }} className="btn mt-3">Back to Quizzes</a>
                  <button onClick={downloadQuestions} className="btn mt-3" style={{ marginLeft: '5%', backgroundColor: '#0F4C75', color: '#fff' }}>Download Questions</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        {questions.length > 0 ? (
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="card quiz">
                <div className="card-body">
                  <div className="d-flex mt-5">
                    <h3 style={{ marginRight: '5%', color: '#0F4C75', marginLeft: '5%' }}>{quizTitle}</h3>
                    <h4 style={{ marginLeft: 'auto', marginRight: '5%' }}>Question {currentQuestionIndex + 1} of {questions.length}</h4>
                    <h4 style={{ marginLeft: 'auto', marginRight: '5%' }}>Time left: {Math.floor(totalTimeLeft / 60)}:{totalTimeLeft % 60 < 10 ? `0${totalTimeLeft % 60}` : totalTimeLeft % 60} minutes</h4>
                    
                  </div>
                  <h4 style={{ marginLeft: '5%' }} className="card-title mt-5 mb-4">
                    {questions[currentQuestionIndex]?.question}
                  </h4>
                  <form style={{ marginLeft: '5%' }}>
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                      <div key={index} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="option"
                          value={option}
                          checked={selectedOption === option}
                          onChange={handleOptionChange}
                        />
                        <label className="form-check-label">
                          {option}
                        </label>
                      </div>
                    ))}
                  </form>
                  {feedback && (
                    <div className={`mt-3 text-${feedback === 'Correct!' ? 'success' : 'danger'}`}>
                      <h3 style={{ marginLeft: '5%' }}>{feedback}</h3>
                    </div>
                  )}
                  <button className="btn quizbutton px-5" style={{ backgroundColor: '#0F4C75', color: '#fff',marginLeft: '5%' }} onClick={handleNextQuestion}>Next</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )}
      </div>
    </div>
  );
};

export default Question;


