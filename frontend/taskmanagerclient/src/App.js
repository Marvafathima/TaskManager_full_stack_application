

import AuthForm from './components/AuthForm';
import TaskManager from './components/TaskManager';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
      <ToastContainer />
    <div>
    <Routes>
    <Route path="" element={<AuthForm/>} />
   
    <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<TaskManager />} />
          </Route>
          <Route path="*" element={<Navigate to="" />} />
    </Routes>
    </div>
    </Router>
  );
}

export default App;
