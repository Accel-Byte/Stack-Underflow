import React, { useContext, useState } from 'react';
import { Button, Card, Icon, Label, Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../utils/MyPopup';

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Item.Group divided style={{ border: '1px solid #ddd', padding: '25px' }}>
      <Item>
        <Item.Image
          key={new Date()}
          size="tiny"
          src={'https://picsum.photos/200' + '?' + new Date()}
        />

        <Item.Content>
          <Item.Header as={Link} to={`/posts/${id}`}>
            {body}
          </Item.Header>
          <Item.Meta>{moment(createdAt).fromNow(true) + ' ago'}</Item.Meta>
          <Item.Description>{username}</Item.Description>
          <Item.Extra>
            <LikeButton user={user} post={{ id, likes, likeCount }} />
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
                  {commentCount}
                </Label>
              </Button>
            </MyPopup>
            {user && user.username === username && <DeleteButton postId={id} />}
          </Item.Extra>
        </Item.Content>
      </Item>
    </Item.Group>
    // <Card fluid>
    //   <Card.Content>
    //     <Image
    //       floated="left"
    //       size="tiny"
    //       src="https://react.semantic-ui.com/images/avatar/large/molly.png"
    //     />
    //     <Card.Header>{username}</Card.Header>
    //     <Card.Meta as={Link} to={`/posts/${id}`}>
    //       {moment(createdAt).fromNow(true)}
    //     </Card.Meta>
    //     <Card.Group style={{marginTop:"10px"}}>{body}</Card.Group>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <LikeButton user={user} post={{ id, likes, likeCount }} />
    //     <MyPopup content="Comment on post">
    //       <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
    //         <Button color="blue" basic>
    //           <Icon name="comments" />
    //         </Button>
    //         <Label basic color="blue" pointing="left">
    //           {commentCount}
    //         </Label>
    //       </Button>
    //     </MyPopup>
    //     {user && user.username === username && <DeleteButton postId={id} />}
    //   </Card.Content>
    // </Card>
  );
}

export default PostCard;
