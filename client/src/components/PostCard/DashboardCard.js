import React, { useContext } from 'react';
import { Button, Icon, Label, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../utils/MyPopup';

function PostCard({
  post: { createdAt, id, question },
}) {
  const { user } = useContext(AuthContext);
  return (
    <Item.Group divided style={{ border: '1px solid #ddd', padding: '2.5rem' }}>
      <Item>
        <Item.Content>
          <Item.Header as={Link} to={`/posts/${id}`}>
            {question.title}
          </Item.Header>
          <Item.Meta>{moment(createdAt).fromNow(true) + ' ago'}</Item.Meta>
          <Item.Description>{question.username}</Item.Description>
          <Item.Extra>
            <MyPopup content="Comment on post">
              <Button
                size="mini"
                compact
                labelPosition="right"
                as={Link}
                to={`/posts/${id}`}
              >
                <Button size="mini" compact color="blue" basic>
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {question.commentCount}
                </Label>
              </Button>
            </MyPopup>
            {user && user.username === question.username && <DeleteButton postId={id} />}
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
  );
}

export default PostCard;
