import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

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
  console.log(state.vote);
  const likeButton = user ? (
    <button className="text-blue-400 focus:outline-none" onClick={() => vote(1)}>
      {state.vote === 1 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      )}
    </button>
  ) : (
    <Link to="/login">
      <button className="text-blue-400 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      </button>
    </Link>
  );

  const dislikeButton = user ? (
    <button className="text-red-400 focus:outline-none" onClick={() => vote(-1)}>
      {state.vote === -1 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
      )}
    </button>
  ) : (
    <Link to="/login">
      <button className="text-red-400 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
      </button>
    </Link>
  );

  return (
    <div className="flex flex-col gap-y-1">
      {likeButton}
      <div className="text-yellow-400 text-center font-semibold">{voteCount}</div>
      {dislikeButton}
    </div>
  );
}

const UPVOTE_ANSWER_MUTATION = gql`
  mutation upvoteAnswer($postId: ID!, $answerId: ID!) {
    upvoteAnswer(postId: $postId, answerId: $answerId) {
      answers {
        _id
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
        _id
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
