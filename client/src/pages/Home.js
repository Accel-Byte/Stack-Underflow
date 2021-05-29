import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Transition,
  Button,
  Loader,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard/HomeCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    data: { getPosts: { posts } = {}, getPosts: { totalPages } = 0 } = {},
    refetch,
  } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      page: currentPage,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });
  console.log( totalPages);
  useEffect(() => {
    refetch();
    return () => {};
  }, [currentPage]);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };
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
      <Grid.Row style={{ paddingLeft: '10rem', paddingRight: '10rem' }}>
        <Pagination
          defaultActivePage={currentPage}
          ellipsisItem={totalPages < 5 ? null : {
            content: <Icon name="ellipsis horizontal" />,
            icon: true,
          }} 
          firstItem={{ content: <Icon name="angle double left" />, icon: true }}
          lastItem={{ content: <Icon name="angle double right" />, icon: true }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Grid.Row>
    </Grid>
  );
}

export default Home;
