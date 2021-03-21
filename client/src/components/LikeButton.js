import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../utils/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button size="mini" color="teal" compact>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button size="mini" compact color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button size="mini" compact as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button
      size="mini"
      compact
      as="div"
      labelPosition="right"
      onClick={likePost}
    >
      <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
