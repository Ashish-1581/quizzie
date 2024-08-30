import { useState } from 'react'
import { BrowserRouter,Route,Routes} from 'react-router-dom';

import CreateQuiz from './pages/CreateQuiz';
import ShareQuiz from './pages/ShareQuiz';
import Quiz from './pages/Quiz';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EditPoll from './pages/EditPoll';
import EditQna from './pages/EditQna';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    
    <>
<BrowserRouter>
<Routes>
<Route path="/" element={<Auth/>} />
<Route path="/create_quiz/:userId" element={<CreateQuiz />} />
<Route path="/share_quiz/:userId/:quizId" element={<ShareQuiz />} />
<Route path="/quiz/:quizId" element={<Quiz />} />
<Route path="/dashboard/:userId" element={<Dashboard />} />
<Route path="/edit_poll/:userId/:quizId" element={<EditPoll />} />
<Route path="/edit_qna/:userId/:quizId" element={<EditQna />} />

</Routes>
</BrowserRouter>
<ToastContainer />
    </>

  )
}

export default App
