import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  Switch,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/authRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/createPost';
import SinglePost from './pages/SinglePost';
import NotFound from './components/404';

function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <NavBar />
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  timeout={100}
                  classNames="fade"
                >
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <AuthRoute exact path="/register" component={Register} />
                    <AuthRoute exact path="/login" component={Login} />
                    <Route exact path="/createPost" component={CreatePost} />
                    <Route exact path="/posts/:postId" component={SinglePost} />
                    <Route exact path="/dashboard/:userId" component={Dashboard} />
                    <Route path="*" component={NotFound} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          />
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;
