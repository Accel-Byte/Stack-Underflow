import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        //gets posts from db and sets to var oldPosts
        const oldPosts = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        //sets newData to array of objects - the deleted post
        const newData = oldPosts.getPosts.filter((p) => p.id !== postId);
        //Sets getPosts to the newPosts
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: newData,
          },
        });
      }

      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
    onError(err) {
      return err;
    },
  });
  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
        size="mini"
        compact
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
