import React, { useContext, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Card,
  Grid,
  Image,
  Divider,
  Form,
  Dimmer,
  Loader,
  Segment,
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import VoteButton from '../components/Button/voteButton';
import Editor from '../components/Editor';
import Answer from '../components/Answer';
import Question from '../components/Question';
import NothingHere from '../components/NothingHere/NothingHere';

const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const [postDoesNotExist, setPostDoesNotExist] = useState(false);
  const [answer, setAnswer] = useState('');

  const {
    subscribeToMore,
    data: { getPost } = {},
    loading: postLoading,
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onCompleted: (data) => {
      if (!data.getPost) {
        setPostDoesNotExist(true);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors[0].extensions.code === 'POST_NOT_FOUND') {
        setPostDoesNotExist(true);
      }
    },
  });
  const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    skip: !getPost,
    variables: {
      userId: getPost && getPost.user,
    },
  });
  const { data: { getImage: image } = {}, loading: imageLoading } = useQuery(
    FETCH_IMAGE_QUERY,
    {
      skip: !getUser,
      variables: {
        fileId: getUser && getUser.fileId,
      },
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: NEW_COMMENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.newComment;

        let updatedPosts = Object.assign(
          {},
          {
            getPost: {
              ...prev.getPost,
              question: {
                ...prev.getPost.question,
                comments: [...prev.getPost.question.comments, newComment],
              },
            },
          }
        );
        return updatedPosts;
      },
    });

    subscribeToMore({
      document: NEW_ANSWER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;
        const newAnswer = subscriptionData.data.newAnswer;

        let updatedPosts = Object.assign(
          {},
          {
            getPost: {
              ...prev.getPost,
              answers: [...prev.getPost.answers, newAnswer],
            },
          }
        );
        return updatedPosts;
      },
    });

    return () => {};
  }, [subscribeToMore]);

  const [submitAnswer, { loading: submitAnswerLoading }] = useMutation(
    SUBMIT_ANSWER_MUTATION,
    {
      variables: { postId: getPost?.id, body: answer },
      update() {
        setAnswer('');
      },
    }
  );

  const onSubmit = () => {
    submitAnswer();
  };
  const answerChange = (value) => {
    setAnswer(value);
  };

  function deletePostCallback() {
    props.history.push('/');
  }
  let answers = [];
  if (getPost) {
    answers = getPost.answers;
    answers = answers
      .slice()
      .sort((a, b) => (b.voteCount > a.voteCount ? 1 : -1));
  }

  const postMarkup = postDoesNotExist ? (
    <NothingHere />
  ) : (
    <Grid>
      <Dimmer active={postLoading}>
        <Loader size="medium" />
      </Dimmer>
      <Grid.Column width={3}>
        <Segment>
          <Loader size="large" active={imageLoading} />
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
        </Segment>
      </Grid.Column>
      <Grid.Column width={13}>
        <Grid.Row>
          <Grid>
            <Grid.Column width={1} style={{ paddingTop: '1rem' }}>
              {getPost && (
                <VoteButton
                  user={user}
                  id={getPost.id}
                  voteCount={getPost.question.voteCount}
                  upvotes={getPost.question.upvotes}
                  downvotes={getPost.question.downvotes}
                />
              )}
            </Grid.Column>
            <Grid.Column width={15}>
              {getPost && (
                <Question
                  post={getPost}
                  user={user}
                  deletePostCallback={deletePostCallback}
                />
              )}
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
              {getPost &&
                answers.map((answer) => (
                  <Grid.Row key={answer._id}>
                    <Answer answer={answer} user={user} id={getPost.id} />
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
                      <Form onSubmit={onSubmit}>
                        <Editor
                          loading={submitAnswerLoading}
                          editorText={answer}
                          setEditorText={setAnswer}
                          handleChange={answerChange}
                        />
                      </Form>
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

  return postMarkup;
};

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
        tags {
          id
          name
        }
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
        comments {
          _id
          username
          body
          createdAt
        }
      }
      answers {
        _id
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
  query($fileId: ID!) {
    getImage(fileId: $fileId)
  }
`;

const FETCH_USER_QUERY = gql`
  query($userId: ID!) {
    getUser(userId: $userId) {
      fileId
      username
    }
  }
`;

const SUBMIT_ANSWER_MUTATION = gql`
  mutation createAnswer($postId: ID!, $body: String!) {
    createAnswer(postId: $postId, body: $body) {
      id
      createdAt
      answers {
        _id
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
      }
    }
  }
`;

const NEW_COMMENT_SUBSCRIPTION = gql`
  subscription newComment {
    newComment {
      _id
      body
      createdAt
      username
    }
  }
`;

const NEW_ANSWER_SUBSCRIPTION = gql`
  subscription newAnswer {
    newAnswer {
      _id
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
  }
`;

export default SinglePost;
