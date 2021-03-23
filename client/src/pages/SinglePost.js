import React, { useContext, useState, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import {
  Button,
  Card,
  Form,
  Grid,
  Image,
  Icon,
  Label,
  Divider,
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup';
import CreateComment from '../components/comment/createComment';
import Editor from '../components/Editor';

function SinglePost(props) {
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
      setOpen(false);
    },
    variables: {
      postId,
      body: comment,
    },
    onError(err) {
      console.log(err);
    },
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;
    const commentChange = (e) => {
      setComment(e.target.value);
    };
    postMarkup = (
      <Grid>
        <Grid.Column width={3}>
          <Image
            src="https://picsum.photos/200"
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
            <Card fluid color="blue" style={{ padding: '1rem' }}>
              <Card.Content>
                <Card.Header>{body}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description
                  style={{
                    marginBottom: '20px',
                    marginTop: '0px',
                    color: '#999',
                  }}
                >
                  {'By ' + username}
                </Card.Description>
                <Divider />
                <Card.Description style={{ fontSize: '16px', color: '#000' }}>
                  Velit occaecat dolor nulla ullamco velit duis dolore aliqua
                  nisi. Sunt excepteur ullamco duis aliquip nostrud laborum
                  minim est ut. Tempor nulla dolor elit proident.Consectetur
                  aliqua id pariatur pariatur aliquip minim aliquip laborum
                  labore do proident proident laborum nostrud. Cillum sit duis
                  magna pariatur duis. Qui id consectetur amet culpa sunt ea
                  nostrud ex sit quis velit sunt. Cillum fugiat nostrud qui elit
                  ex cillum culpa.
                </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    compact
                    size="mini"
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button compact size="mini" basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
                <CreateComment
                  submitComment={submitComment}
                  comment={comment}
                  user={user}
                  commentChange={commentChange}
                  commentInputRef={commentInputRef}
                  open={open}
                  setOpen={setOpen}
                />
              </Card.Content>
              <Card.Content>
                {comments.map((comment) => (
                  <Card fluid key={comment.id}>
                    <Card.Content style={{ padding: '4px 10px 4px 10px' }}>
                      {user && user.username === comment.username && (
                        <DeleteButton postId={id} commentId={comment.id} />
                      )}
                      <Card.Header
                        style={{
                          display: 'inline',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                      >
                        {comment.username}
                      </Card.Header>
                      <Card.Meta
                        style={{ display: 'inline', fontSize: '12px' }}
                      >
                        {moment(comment.createdAt).fromNow()}
                      </Card.Meta>
                      <Card.Description style={{ fontSize: '14px' }}>
                        {comment.body}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </Card>
          </Grid.Row>
          <br />
          <Grid.Row>
            <Grid.Column>
              <Card fluid color="yellow" style={{ padding: '10px' }}>
                <Card.Content>
                  <Editor />
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
