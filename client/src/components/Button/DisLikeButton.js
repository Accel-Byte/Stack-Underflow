import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../../utils/MyPopup';

function DisLikeButton({ user, post: { id, dislikeCount, dislikes } }) {
  const [disliked, setDisLiked] = useState(false);
console.log(dislikeCount);
  useEffect(() => {
    if (user && dislikes.find((dislike) => dislike.username === user.username)) {
      setDisLiked(true);
    } else setDisLiked(false);
  }, [user, dislikes]);

  const [dislikePost] = useMutation(DISLIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const dislikeButton = user ? (
    disliked ? (
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
      onClick={dislikePost}
    >
      <MyPopup content={disliked ? 'Remove Dislike' : 'DisLike'}>{dislikeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {dislikeCount}
      </Label>
    </Button>
  );
}

const DISLIKE_POST_MUTATION = gql`
  mutation dislikePost($postId: ID!) {
    dislikePost(postId: $postId) {
      id
      dislikes {
        id
        username
      }
      dislikeCount
    }
  }
`;

export default DisLikeButton;
