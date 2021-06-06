import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  query ($page: Int, $tag: String) {
    getPosts (page: $page, tag: $tag) {
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
          voteCount
        }
        answers {
          _id
        }
        user
      }
      totalPages
      totalPosts
    }
  }
`;
