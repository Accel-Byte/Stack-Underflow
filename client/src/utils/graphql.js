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

export const NEW_POST_SUBSCRIPTION = gql`
  subscription newPost {
    newPost {
      user
      question {
        title
        body
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
      }
      createdAt
      answers {
        body
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
        createdAt
        username
      }
    }
  }
`;
