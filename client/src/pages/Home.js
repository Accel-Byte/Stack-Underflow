import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Button } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard/HomeCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      {user && (
        <Grid.Row style={{ paddingLeft: '10rem', paddingRight: '10rem' }}>
          <Button secondary as={Link} to={'/createPost'}>
            Create Post
          </Button>
        </Grid.Row>
      )}
      {loading ? (
        <h1>Loading posts..</h1>
      ) : (
        <Transition.Group>
          {posts &&
            posts.map((post) => (
              <Grid.Row
                key={post.id}
                style={{ marginBottom: 20, padding: '0px 10rem' }}
              >
                <PostCard post={post} />
              </Grid.Row>
            ))}
        </Transition.Group>
      )}
    </Grid>
  );
}

export default Home;
