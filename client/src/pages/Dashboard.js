import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Grid,
  Transition,
  Divider,
  Image,
  Card,
  Icon,
} from 'semantic-ui-react';
import moment from 'moment';

import DashboardCard from '../components/PostCard/DashboardCard';

const Dashboard = (props) => {
  const userId = props.match.params.userId;
  const {
    loading,
    data: { getUser: user, getUserPost: posts } = {},
  } = useQuery(FETCH_DASHBOARD_DATA, {
    variables: {
      userId,
    },
  });

  return (
    <Grid>
      <Grid.Column width={3}>
        <Grid.Row>
          <Card>
            <Image
              src="https://picsum.photos/200"
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
              <Card.Meta>Joined in {moment(user ? user.createdAt : '').year()}</Card.Meta>
              <Card.Description>
                Daniel is a comedian living in Nashville.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a href="/    ">
                <Icon name="user" />
                10 Friends
              </a>
            </Card.Content>
          </Card>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={13}>
        <Divider />
        <Grid.Row>
          <Grid>
            <Grid.Row className="page-title">
              <h1>All Posts</h1>
            </Grid.Row>
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
                      <DashboardCard post={post} />
                    </Grid.Row>
                  ))}
              </Transition.Group>
            )}
          </Grid>
        </Grid.Row>
      </Grid.Column>
      {/* <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>All Posts</h1>
      </Grid.Row>
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
    </Grid> */}
    </Grid>
  );
};

export default Dashboard;

const FETCH_DASHBOARD_DATA = gql`
  query DashboardData($userId: ID!) {
    getUser(userId: $userId) {
      username
      email
      createdAt
    }
    getUserPost(userId: $userId) {
      id
      createdAt
      question {
        commentCount
        username
        body
        title
      }
    }
  }
`;
