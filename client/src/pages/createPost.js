import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

const CreatePost = (props) => {
  const { user } = useContext(AuthContext);

  return <div>{user && <PostForm {...props} />}</div>;
};

export default CreatePost;
