import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../utils/MyPopup';

function PostCard({
  post: { createdAt, id, question, user: userId, answers },
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
  const color = [
    'text-red-400',
    'text-yellow-300',
    'text-green-400',
    'text-card-orange-dark',
    'text-card-blue-dark',
    'text-purple-500',
  ];

  return (
    <div className="bg-card-dark p-4 pr-0 rounded-xl mb-2">
      <div className="flex">
        <div className="justify-self-center self-center">
          {image ? (
            <img
              src={'data:image/jpeg;base64,' + image}
              className="w-20 h-20 rounded-full"
              alt="img"
            />
          ) : (
            <div className="spinner"></div>
          )}
        </div>
        <div className="pl-4 pr-4 w-5/6 text-white text-lg">
          <div className="" style={{ flexBasis: '90%' }}>
            <p style={{ lineHeight: '1.3rem' }}>{question.title}</p>
          </div>

          <div className="text-sm text-gray-400 py-2">
            <span>{answers.length} Answers</span>
            &nbsp;&nbsp;
            <span>{question.voteCount} Votes</span>
          </div>
          <div className="text-sm font-semibold">
            {question &&
              question.tags.slice(0, 6).map((tag, index) => {
                return (
                  <span className={`mr-1 ${color[index]}`}>
                    #{tag.name} &nbsp;
                  </span>
                );
              })}
          </div>
        </div>
        {user ? (
          <div className="w-0 cursor-pointe text-red-500 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const FETCH_IMAGE_QUERY = gql`
  query ($fileId: ID!) {
    getImage(fileId: $fileId)
  }
`;
const FETCH_USER_QUERY = gql`
  query ($userId: ID!) {
    getUser(userId: $userId) {
      fileId
      username
    }
  }
`;

export default PostCard;
