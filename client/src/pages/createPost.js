import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

const CreatePost = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      render={(props) =>
        user ? <PostForm {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default CreatePost;
