import React from 'react';
import {
    Card,
} from 'semantic-ui-react';
import DeleteButton from '../DeleteButton';
import moment from 'moment';

function ShowComment({user,id, comment}) {
  return (
    <Card fluid key={comment.id}>
      <Card.Content style={{ padding: '4px 10px 4px 10px' }}>
        {user && user.username === comment.username && (
          <DeleteButton postId={id} commentId={comment.id} />
        )}
        <Card.Header
          style={{
            display: 'inline',
            marginRight: '5px',
            fontSize: '12px',
          }}
        >
          {comment.username}
        </Card.Header>
        <Card.Meta style={{ display: 'inline', fontSize: '12px' }}>
          {moment(comment.createdAt).fromNow()}
        </Card.Meta>
        <Card.Description style={{ fontSize: '14px' }}>
          {comment.body}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default ShowComment;
