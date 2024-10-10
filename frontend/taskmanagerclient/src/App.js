
import './App.css';
import AuthForm from './components/AuthForm';
import TaskManager from './components/TaskManager';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
function App() {
  return (
    <Router>
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
