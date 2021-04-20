import React from 'react';
import { Card, Grid } from 'semantic-ui-react';
import moment from 'moment';

import VoteButton from '../components/Button/voteButton';

const Answer = ({ answer, user, id }) => {
  return (
    <>
      <Grid.Column  width={1} style={{ paddingTop: '1rem' }}>
        <VoteButton
          user={user}
          id={id}
          answerId={answer._id}
          voteCount={answer.voteCount}
          upvotes={answer.upvotes}
          downvotes={answer.downvotes}
        />
      </Grid.Column>
      <Grid.Column width={15}>
        <Card fluid color="purple" style={{ padding: '10px' }}>
          <Card.Content>
            <Card.Description style={{ fontSize: '16px', color: '#000' }} dangerouslySetInnerHTML={{ __html: answer.body }}>    
            </Card.Description>
            <Card.Meta textAlign="right">
              {moment(answer.createdAt).fromNow()}
            </Card.Meta>
            <Card.Description
              textAlign="right"
              style={{
                marginBottom: '0',
                marginTop: '0px',
                color: '#999',
              }}
            >
              {'By ' + answer.username}
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid.Column>
    </>
  );
};

export default Answer;
