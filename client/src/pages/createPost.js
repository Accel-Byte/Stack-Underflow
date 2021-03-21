import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

const CreatePost = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <Grid columns={3}>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm {...props}/>
          </Grid.Column>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default CreatePost;
