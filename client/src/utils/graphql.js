import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      createdAt
      question {
        username
        body
        title
        commentCount
      }
      user
    }
  }
`;
