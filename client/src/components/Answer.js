import React from 'react';
import { Card, Grid } from 'semantic-ui-react';
import moment from 'moment';

import VoteButton from '../components/Button/voteButton';

const Answer = ({ answer, user, id }) => {
  return (
    <div className="flex gap-x-4 mt-4">
      <div className="">
        <VoteButton
          user={user}
          id={id}
          answerId={answer._id}
          voteCount={answer.voteCount}
          upvotes={answer.upvotes}
          downvotes={answer.downvotes}
        />
      </div>
      <div className="w-full">
        <div className="bg-primary-light font-poppins">
          <div className="bg-card-dark py-2 px-8 text-white rounded-lg">
            <div
              className="pt-4 text-gray-300"
              style={{
                fontSize: '16px',
                overflowWrap: 'break-word',
              }}
              dangerouslySetInnerHTML={{ __html: answer.body }}
            ></div>
            <div className="flex justify-end pt-2">
              <div>
              <p className="text-xs text-gray-400 text-right">
                {moment(answer.createdAt).fromNow()}
              </p>
              <p className="text-sm text-gray-400 text-right">By {answer.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
