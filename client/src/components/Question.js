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
  const colors = [
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'violet',
    'purple',
    'pink',
    'brown',
  ];
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
    <div className="bg-primary-light font-poppins">
      <div className="bg-card-dark py-2 px-8 mx-8 text-white">
        <div className="py-2">
          <h1 className="text-2xl">React get data from MongoDB</h1>
          <p className="text-xs pt-1 text-gray-400">a month ago</p>
        </div>
        <hr />
        <div
          className="pt-4 text-gray-300"
          style={{
            fontSize: '16px',
            overflowWrap: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: post.question.body }}
        ></div>
        <div className="py-4 font-semibold">
          <span className="text-card-green-dark"> #mongodb</span>
          <span className="text-card-blue-dark"> #React</span>
          <span className="text-card-pink-dark"> #Graphql</span>
        </div>
        <hr />
        <div className="flex pt-4 justify-between">
          <button className="text-card-blue-dark font-semibold cursor-pointer">
            Add Comment
          </button>
          <div className="text-sm text-gray-400">
            <p>By Acce_l</p>
          </div>
        </div>
      </div>
    </div>
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
          body
          username
        }
      }
      answers {
        _id
        body
        createdAt
      }
    }
  }
`;

export default Question;
