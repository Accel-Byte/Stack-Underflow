import React from 'react';
import DeleteButton from '../DeleteButton';
import moment from 'moment';

function ShowComment({ user, id, comment }) {
  return (
    <div className="bg-comment-dark px-4 py-2 rounded-md my-2">
      <div className="flex text-gray-200 justify-between">
        <div className="text-sm">
          {comment.username}
          <p className="text-xs inline-block ml-2 text-gray-400">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>
        <div className="mr-3">
          <DeleteButton postId={id} commentId={comment._id} />
        </div>
      </div>
      <div className="text-gray-300 text-sm">{comment.body}</div>
    </div>
  );
}

export default ShowComment;
