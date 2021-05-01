import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Button, Loader } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard/HomeCard';
import { FETCH_POSTS_QUERY, NEW_POST_SUBSCRIPTION } from '../utils/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { subscribeToMore, loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY,
    {
      onError: (err) => {
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
    }
  );
  useEffect(() => {
    subscribeToMore({
      document: NEW_POST_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPost = subscriptionData.data.newPost;
        let updatedPosts = Object.assign(
          {},
          { getPosts: [...prev.getPosts, newPost] }
        );
        console.log(updatedPosts);
        return updatedPosts;
      },
    });

    return () => {};
  }, [subscribeToMore]);
  return (
    <Grid columns={3}>
      <ToastContainer />
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
      <Loader active={loading} size="medium" inline="centered" />
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
    </Grid>
  );
}

export default Home;
