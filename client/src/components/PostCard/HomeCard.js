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
    <div class="bg-card-dark p-6 pr-0 rounded-xl mb-2">
      <div class="flex">
        <div class="justify-self-center self-center">
          <img
            src="https://source.unsplash.com/800x800/?nature"
            class="w-24 h-24 rounded-full"
            alt="img"
          />
        </div>
        <div class="px-6 pr-0 max-w-lg text-white">
          <div>
            <p>
              <Link to={`/posts/${id}`}>
              {question.title}
              </Link>
            </p>
          </div>
          <div class="text-xs text-gray-400 py-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline-block m-0 mr-1 p-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              25 answers
            </span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline-block ml-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              25 votes
            </span>
          </div>
          <div class="text-sm font-semibold">
            <span class="mr-1 text-card-red-dark">#mongodb</span>
            <span class="mr-1 text-card-green-dark">#mongodb</span>
            <span class="mr-1 text-card-orange-dark">#mongodb</span>
            <span class="mr-1 text-card-blue-dark">#mongodb</span>
            <span class="mr-1 text-card-purple-dark">#mongodb</span>
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
