import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Grid,
  Transition,
  Divider,
  Image,
  Card,
  Loader,
} from 'semantic-ui-react';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardCard from '../components/PostCard/DashboardCard';
import UpdateImage from '../components/UpdateImage';
import NothingHere from '../components/NothingHere/NothingHere';

const Dashboard = (props) => {
  const userId = props.match.params.userId;
  const [open, setOpen] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const {
    loading,
    data: { getUser: user, getUserPost: posts } = {},
  } = useQuery(FETCH_DASHBOARD_DATA, {
    variables: {
      userId,
    },
    onError: (err) => {
      console.log(err.message);
      if (err.message.includes('UserNotFound')) {
        setUserNotFound(true);
      } else {
        toast.error(err.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  const { data: { getImage: image } = {}, loading: imageLoading } = useQuery(
    FETCH_IMAGE_QUERY,
    {
      skip: !user,
      variables: {
        fileId: user && user.fileId,
      },
    }
  );

  let votes = 0;
  if (!loading && posts) {
    posts.forEach((post) => {
      votes += post.question.voteCount;
    });
  }

  return userNotFound ? (
    <NothingHere />
  ) : (
    <>
      <ToastContainer />
      <Grid>
        <Grid.Column width={3}>
          <Grid.Row>
            <Card>
              <Loader
                active={imageLoading}
                size="medium"
                inline="centered"
                indeterminate
              >
                Fetching Data
              </Loader>
              <Image
                src={image && 'data:image/jpeg;base64,' + image}
                label={{
                  content: 'Community',
                  icon: 'users',
                  color: 'purple',
                  ribbon: true,
                }}
                wrapped
                ui={false}
              />
              <Card.Content>
                <Card.Header>{user ? user.username : ''}</Card.Header>
                <Card.Meta>
                  Joined in {moment(user ? user.createdAt : '').year()}
                </Card.Meta>
                <Card.Description>
                  Daniel is a comedian living in Nashville.
                </Card.Description>
              </Card.Content>
              <Card.Content extra style={{ margin: '0 auto' }}>
                <UpdateImage
                  open={open}
                  setOpen={setOpen}
                  userId={userId}
                  fileId={user?.fileId}
                />
              </Card.Content>
            </Card>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={13}>
          <Grid.Row>
            <Grid padded columns="equal" divided>
              <Grid.Column>
                <Grid.Row>
                  <h2>Questions</h2>
                </Grid.Row>
                <Grid.Row>
                  <h2>{posts ? posts.length : ''}</h2>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <Grid.Row>
                  <h2>Votes</h2>
                </Grid.Row>
                <Grid.Row>
                  <h2>{votes}</h2>
                </Grid.Row>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <Grid.Row>
            <Divider />
          </Grid.Row>
          <Grid.Row className="page-title">
            <h1>All Posts</h1>
          </Grid.Row>
          <Grid.Row>
            <Loader active={loading} size="medium" inline="centered" />
            <Transition.Group>
              {posts &&
                posts.map((post) => (
                  <Grid.Row
                    key={post.id}
                    style={{ marginBottom: 20, padding: '0px 10rem' }}
                  >
                    <DashboardCard post={post} />
                  </Grid.Row>
                ))}
            </Transition.Group>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Dashboard;

const FETCH_DASHBOARD_DATA = gql`
  query DashboardData($userId: ID!) {
    getUser(userId: $userId) {
      username
      email
      createdAt
      fileId
    }
    getUserPost(userId: $userId) {
      id
      createdAt
      question {
        commentCount
        username
        body
        title
        voteCount
      }
    }
  }
`;

const FETCH_IMAGE_QUERY = gql`
  query($fileId: ID!) {
    getImage(fileId: $fileId)
  }
`;
