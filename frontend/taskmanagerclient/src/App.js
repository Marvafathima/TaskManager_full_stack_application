import logo from './logo.svg';
import './App.css';
import AuthForm from './components/AuthForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
    <div>
    <Routes>
    <Route path="" element={<AuthForm/>} />
    </Routes>
    </div>
    </Router>
  );
}

export default App;
