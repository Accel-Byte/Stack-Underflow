import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, Card, Icon, Label, Divider } from 'semantic-ui-react';
import moment from 'moment';

import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup';
import CreateComment from '../components/comment/createComment';
import ShowComment from '../components/comment/showComment';

function Question({ post, user, deletePostCallback }) {
  const commentInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
      setOpen(false);
    },
    variables: {
      postId: post.id,
      body: comment,
    },
    onError(err) {
      console.log(err);
    },
  });
  const commentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <Card fluid color="blue" style={{ padding: '1rem' }}>
      <Card.Content>
        <Card.Header>{post.question.title}</Card.Header>
        <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
        <Card.Description
          style={{
            marginBottom: '20px',
            marginTop: '0px',
            color: '#999',
          }}
        >
          {'By ' + post.question.username}
        </Card.Description>
        <Divider />
        <Card.Description style={{ fontSize: '16px', color: '#000' }}>
          {post.question.body}
        </Card.Description>
      </Card.Content>
      <hr />
      <Card.Content extra>
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
              {post.question.commentCount}
            </Label>
          </Button>
        </MyPopup>
        {
          // TODO: SEE This Bastard Your DownVote button actually Upvote the post
        }
        {user && user.username === post.question.username && (
          <DeleteButton postId={post.id} callback={deletePostCallback} />
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
        {post.question.comments.map((comment, i) => (
          <ShowComment key={i} comment={comment} id={post.id} user={user} />
        ))}
      </Card.Content>
    </Card>
  );
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      createdAt
      question {
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
          body
          username
        }
      }
      answers {
        id
        body
        createdAt
      }
    }
  }
`;

export default Question;
