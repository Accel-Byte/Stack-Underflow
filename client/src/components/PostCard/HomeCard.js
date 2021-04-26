import React, { useContext } from 'react';
import { Button, Icon, Label, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { gql,useQuery } from '@apollo/client';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../utils/MyPopup';

function PostCard({
  post: { createdAt, id, question, user: userId },
}) {
  const { user } = useContext(AuthContext);
  
  const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    variables: {
       userId: userId,
    },  
  });
  const { data: { getImage: image } = {} } = useQuery(FETCH_IMAGE_QUERY, {
    skip: !getUser,
    variables: {
      fileId: getUser && getUser.fileId,
    },
  });

  return (
    <Item.Group divided style={{ border: '1px solid #ddd', padding: '25px' }}>
      <Item>
        <Item.Image
          key={new Date()}
          size="tiny" 
          src={image && 'data:image/jpeg;base64,' + image}
        />

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

const FETCH_IMAGE_QUERY = gql`
  query($fileId: ID!){
    getImage(fileId: $fileId)
  }
`;
const FETCH_USER_QUERY = gql`
  query($userId: ID!){
    getUser(userId: $userId){
      fileId,
      username
    }
  }
`;

export default PostCard;
