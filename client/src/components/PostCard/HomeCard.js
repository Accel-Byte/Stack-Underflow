import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import Loader from '../Loader/Loader';
import DeleteButton from '../DeleteButton';

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
                  <span className={`mr-1 ${color[index]}`} key={tag.id}>
                    #{tag.name} &nbsp;
                  </span>
                );
              })}
          </div>
        </div>
        {user && user.username === question.username ? (
          <DeleteButton postId={id}/>
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
