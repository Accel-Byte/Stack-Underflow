import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, Label, Icon, Grid } from 'semantic-ui-react';

import MyPopup from '../../utils/MyPopup';

function VoteButton({ user, id, voteCount, upvotes, downvotes, answerId }) {
  const [state, setState] = useState({
    vote: 0,
  });
  useEffect(() => {
    if (user && upvotes.find((upvote) => upvote.username === user.username)) {
      setState({
        vote: 1,
      });
    } else if (
      user &&
      downvotes.find((downvote) => downvote.username === user.username)
    ) {
      setState({
        vote: -1,
      });
    }
    return () => {};
  }, []);

  // useEffect(() => {
  //   if (user && upvotes.find((upvote) => upvote.username === user.username)) {
  //     setVote('like');
  //   }
  //   else if (user && downvotes.find((downvote) => downvote.username === user.username)) {
  //      setVote('dislike');
  //   console.log(vote);
  //   }
  //    else setVote('');
  // }, [user, upvotes]);

  const [likeAnswer] = useMutation(UPVOTE_ANSWER_MUTATION, {
    variables: { postId: id, answerId: answerId },
  });

  const [dislikeAnswer] = useMutation(DOWNVOTE_ANSWER_MUTATION, {
    variables: { postId: id, answerId: answerId },
  });

  const [likePost] = useMutation(UPVOTE_POST_MUTATION, {
    variables: { postId: id },
  });

  const [dislikePost] = useMutation(DOWNVOTE_POST_MUTATION, {
    variables: { postId: id },
  });

  const vote = (type) => {
    setState((prev) => ({
      vote: prev.vote === type ? 0 : type,
    }));
    if (type === 1) {
      answerId ? likeAnswer() : likePost();
    } else if (type === -1) {
      answerId ? dislikeAnswer() : dislikePost();
    }
  };

  const likeButton = user ? (
    state.vote === 1 ? (
      <Button
        size="mini"
        color="blue"
        compact
        style={{ paddingLeft: '1.2rem' }}
        onClick={() => vote(1)}
      >
        <Icon name="thumbs up" />
      </Button>
    ) : (
      <Button
        size="mini"
        compact
        color="blue"
        style={{ paddingLeft: '1.2rem' }}
        basic
        onClick={() => vote(1)}
      >
        <Icon name="thumbs up" />
      </Button>
    )
  ) : (
    <Button
      size="mini"
      compact
      as={Link}
      to="/login"
      style={{ paddingLeft: '1.2rem' }}
      color="blue"
      basic
    >
      <Icon name="thumbs up" />
    </Button>
  );

  const dislikeButton = user ? (
    state.vote === -1 ? (
      <Button
        size="mini"
        color="red"
        style={{ paddingLeft: '1.2rem' }}
        compact
        onClick={() => vote(-1)}
      >
        <Icon name="thumbs down" />
      </Button>
    ) : (
      <Button
        size="mini"
        compact
        color="red"
        style={{ paddingLeft: '1.2rem' }}
        basic
        onClick={() => vote(-1)}
      >
        <Icon name="thumbs down" />
      </Button>
    )
  ) : (
    <Button
      size="mini"
      compact
      as={Link}
      to="/login"
      style={{ paddingLeft: '1.2rem' }}
      color="red"
      basic
    >
      <Icon name="thumbs down" />
    </Button>
  );

  return (
    <>
      <Grid.Row>
        <MyPopup content={state.vote === 1 ? 'Remove Like' : 'Like'}>
          {likeButton}
        </MyPopup>
      </Grid.Row>
      <Grid.Row>
        <Label
          basic
          size="large"
          horizontal
          color="teal"
          style={{ border: 'none' }}
        >
          {voteCount}
        </Label>
      </Grid.Row>
      <Grid.Row>
        <MyPopup content={state.vote === -1 ? 'Remove Dislike' : 'Dislike'}>
          {dislikeButton}
        </MyPopup>
      </Grid.Row>
    </>
  );
}

const UPVOTE_ANSWER_MUTATION = gql`
  mutation upvoteAnswer($postId: ID!, $answerId: ID!) {
    upvoteAnswer(postId: $postId, answerId: $answerId) {
      answers {
        id
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
const DOWNVOTE_ANSWER_MUTATION = gql`
  mutation downvoteAnswer($postId: ID!, $answerId: ID!) {
    downvoteAnswer(postId: $postId, answerId: $answerId) {
      answers {
        id
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

const UPVOTE_POST_MUTATION = gql`
  mutation upvotePost($postId: ID!) {
    upvotePost(postId: $postId) {
      id
      question {
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
      }
    }
  }
`;
const DOWNVOTE_POST_MUTATION = gql`
  mutation downvotePost($postId: ID!) {
    downvotePost(postId: $postId) {
      id
      question {
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
      }
    }
  }
`;

export default VoteButton;
