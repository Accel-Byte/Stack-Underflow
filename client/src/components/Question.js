import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import moment from 'moment';

import DeleteButton from '../components/DeleteButton';
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
  const [submitComment, { loading: commentLoading }] = useMutation(
    SUBMIT_COMMENT_MUTATION,
    {
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
    }
  );
  const commentChange = (e) => {
    setComment(e.target.value);
  };

  const color = [
    'text-red-400',
    'text-yellow-300',
    'text-green-400',
    'text-card-orange-dark',
    'text-card-blue-dark',
    'text-purple-500',
  ];

  return (
    <div className="bg-primary-light font-poppins">
      <div className="bg-card-dark py-2 px-8 text-white">
        <div className="py-2">
          <h1 className="text-2xl">{post.question.title}</h1>
          <p className="text-xs pt-1 text-gray-400">
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
        <hr className="border-gray-500" />
        <div
          className="pt-4 text-gray-300"
          style={{
            fontSize: '16px',
            overflowWrap: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: post.question.body }}
        ></div>
        <div className="py-4 font-semibold text-sm">
          {post.question &&
            post.question.tags.slice(0, 6).map((tag, index) => {
              return (
                <span className={`${color[index]}`} key={tag.id}>
                  #{tag.name} &nbsp;
                </span>
              );
            })}
        </div>
        <hr className="border-gray-500" />
        <div className="flex pt-4 pb-2 justify-between">
          {user && (
            <CreateComment
              submitComment={submitComment}
              comment={comment}
              commentChange={commentChange}
              commentInputRef={commentInputRef}
              commentLoading={commentLoading}
            />
          )}
          <div className="text-sm text-gray-400">
            <p></p>
          </div>
        </div>
        <hr className="border-gray-500" />
        <div className="mt-4 mb-2">
          {post.question.comments.map((comment, i) => (
            <ShowComment
              key={comment._id}
              comment={comment}
              id={post.id}
              user={user}
            />
          ))}
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
