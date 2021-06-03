import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';

import { AuthContext } from '../../context/auth';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../utils/MyPopup';

function PostCard({ post: { createdAt, id, question, user: userId } }) {
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
    <div className="bg-card-dark p-6 pr-0 rounded-xl mb-2">
      <div className="flex">
        <div className="justify-self-center self-center">
          <img
            src="https://source.unsplash.com/800x800/?nature"
            className="w-24 h-24 rounded-full"
            alt="img"
          />
        </div>
        <div className="px-6 pr-0 max-w-lg text-white">
          <div>
            <p>
              <Link to={`/posts/${id}`}>
              {question.title}
              </Link>
            </p>
          </div>
          <div className="text-xs text-gray-400 py-2">
            <span>
              
              25 answers
            </span>
            <span>
              
              25 votes
            </span>
          </div>
          <div className="text-sm font-semibold">
            <span className="mr-1 text-card-red-dark">#mongodb</span>
            <span className="mr-1 text-card-green-dark">#mongodb</span>
            <span className="mr-1 text-card-orange-dark">#mongodb</span>
            <span className="mr-1 text-card-blue-dark">#mongodb</span>
            <span className="mr-1 text-card-purple-dark">#mongodb</span>
          </div>
        </div>
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
