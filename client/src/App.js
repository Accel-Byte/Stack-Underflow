import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/authRoute';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/register" component={Register} />
        <AuthRoute exact path="/login" component={Login} />
      </Router>
    </AuthProvider>
  );
}

export default App;
