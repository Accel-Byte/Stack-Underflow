import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SinglePost from './pages/SinglePost';
import CreatePost from './pages/createPost';
import Register from './pages/Register';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/authRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Container style={{paddingTop: "2rem"}}>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
          <Route exact path="/createPost" component={CreatePost} />
          <Route exact path="/dashboard/:userId" component={Dashboard} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
