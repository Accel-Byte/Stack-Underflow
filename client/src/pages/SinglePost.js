import React, { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card, Grid, Image, Divider } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import VoteButton from '../components/Button/voteButton';
import Editor from '../components/Editor';
import Answer from '../components/Answer';
import Question from '../components/Question';

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });
  const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    skip: !getPost,
    variables: {
       userId: getPost && getPost.user,
    },
  });
  const { data: { getImage: image } = {} } = useQuery(FETCH_IMAGE_QUERY, {
    skip: !getUser,
    variables: {
      fileId: getUser && getUser.fileId,
    },
  });
  
  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const { id } = getPost;
    const question = getPost.question;
    let answers = getPost.answers;

    answers = answers
      .slice()
      .sort((a, b) => (b.voteCount > a.voteCount ? 1 : -1));

    function deletePostCallback() {
      props.history.push('/');
    }
    postMarkup = (
      <Grid>
        <Grid.Column width={3}>
          <Image
            src={image && 'data:image/jpeg;base64,' + image}
            label={{
              content: 'Community',
              icon: 'users',
              color: 'purple',
              ribbon: true,
            }}
            centered
          ></Image>
        </Grid.Column>
        <Grid.Column width={13}>
          <Grid.Row>
            <Grid>
              <Grid.Column width={1} style={{ paddingTop: '1rem' }}>
                <VoteButton
                  user={user}
                  id={id}
                  voteCount={question.voteCount}
                  upvotes={question.upvotes}
                  downvotes={question.downvotes}
                />
              </Grid.Column>
              <Grid.Column width={15}>
                <Question
                  post={getPost}
                  user={user}
                  deletePostCallback={deletePostCallback}
                />
              </Grid.Column>
            </Grid>
            <br />
            <Divider />
            <Grid.Row>
              <Grid>
                <Grid.Row>
                  <h2 style={{ paddingLeft: '1rem' }}>
                    {answers.length} Answers
                  </h2>
                </Grid.Row>
                {answers.map((answer) => (
                  <Grid.Row key={answer.id}>
                    <Answer answer={answer} user={user} id={id} />
                  </Grid.Row>
                ))}
              </Grid>
            </Grid.Row>
            <br />
            <Divider />
            <Grid.Row>
              <Grid>
                <Grid.Column width={1}></Grid.Column>
                <Grid.Column width={15}>
                  <Grid.Row>
                    <h2 style={{ paddingBottom: '1rem' }}>Your Answer : </h2>
                  </Grid.Row>
                  <Grid.Row>
                    <Card fluid color="yellow" style={{ padding: '10px' }}>
                      <Card.Content>
                        <Editor id={id} />
                      </Card.Content>
                    </Card>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </Grid.Row>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      createdAt
      question {
        commentCount
        username
        body
        title
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
        comments {
          id
          username
          body
          createdAt
        }
      }
      answers {
        id
        body
        createdAt
        upvotes {
          username
          createdAt
        }
        downvotes {
          username
          createdAt
        }
        voteCount
        username
      }
      user
    }
    
  }
`;
const FETCH_IMAGE_QUERY = gql`
  query($fileId: ID!){
    getImage(fileId: $fileId)
  }
`;
const FETCH_USER_QUERY = gql`
  query($userId: ID!){
    getUser(userId: $userId){
      fileId,
      username
    }
  }
`;

export default SinglePost;
