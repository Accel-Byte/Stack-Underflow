import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  query ($page: Int) {
    getPosts (page: $page) {
      posts{
        id
        createdAt
        question {
          username
          body
          tags {
            id
            name
          }
          title
          commentCount
        }
        user
      }
      totalPages
    }
  }
`;
