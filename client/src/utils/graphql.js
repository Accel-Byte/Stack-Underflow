import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  query ($page: Int, $tag: String, $search: String, $featured: Boolean!) {
    getPosts (page: $page, tag: $tag, search: $search, featured: $featured) {
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
