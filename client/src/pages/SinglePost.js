import React,  { useContext, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../context/auth';
import VoteButton from '../components/Button/voteButton';
import Editor from '../components/Editor/Editor';
import Answer from '../components/Answer';
import Question from '../components/Question';
import NothingHere from '../components/NothingHere/NothingHere';


const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const [postDoesNotExist, setPostDoesNotExist] = useState(false);
  const [answer, setAnswer] = useState('');

  const {
    subscribeToMore,
    data: { getPost } = {},
    loading: postLoading,
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onCompleted: (data) => {
      if (!data.getPost) {
        setPostDoesNotExist(true);
      }
    },
    onError: (error) => {
      if (error.message === 'PostNotFound') {
        setPostDoesNotExist(true);
      }
    },
  });
  const { data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    skip: !getPost,
    variables: {
      userId: getPost && getPost.user,
    },
  });
  const { data: { getImage: image } = {}, loading: imageLoading } = useQuery(
    FETCH_IMAGE_QUERY,
    {
      skip: !getUser,
      variables: {
        fileId: getUser && getUser.fileId,
      },
    }
  );
  
  useEffect(() => {
    subscribeToMore({
      document: NEW_COMMENT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.newComment;

        let updatedPosts = Object.assign(
          {},
          {
            getPost: {
              ...prev.getPost,
              question: {
                ...prev.getPost.question,
                comments: [...prev.getPost.question.comments, newComment],
              },
            },
          }
        );
        return updatedPosts;
      },
    });

    subscribeToMore({
      document: NEW_ANSWER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;
        const newAnswer = subscriptionData.data.newAnswer;

        let updatedPosts = Object.assign(
          {},
          {
            getPost: {
              ...prev.getPost,
              answers: [...prev.getPost.answers, newAnswer],
            },
          }
        );
        return updatedPosts;
      },
    });

    return () => {};
  }, [subscribeToMore]);

  const [submitAnswer, { loading: submitAnswerLoading }] = useMutation(
    SUBMIT_ANSWER_MUTATION,
    {
      variables: { postId: getPost?.id, body: answer },
      update() {
        setAnswer('');
      },
    }
  );

  const onSubmit = () => {
    submitAnswer();
  };
  const answerChange = (value) => {
    setAnswer(value);
  };

  function deletePostCallback() {
    props.history.push('/');
  }
  let answers = [];
  if (getPost) {
    answers = getPost.answers;
    answers = answers
      .slice()
      .sort((a, b) => (b.voteCount > a.voteCount ? 1 : -1));
  }

  return (
    <>
      <div className="dark:bg-primary-light bg-gray-100 p-10 pt-24 min-h-screen transition duration-500">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 justify-self-center h-37rem overflow-y-scroll scroll-1 font-poppins">
            <div className="bg-card-dark relative shadow-profile-card-shadow rounded-md pt-8 pb-4 px-10 w-80 text-center mx-auto max-w-full text-gray-300">
              <span className="absolute bg-profile-tag-background-dark text-gray-900 top-6 left-6 rounded-sm px-4 py-0 text-base font-semibold">
                PRO
              </span>
              {image ? (
                <img
                  className="border border-solid border-blue-400 rounded-full p-2 inline w-36 h-36"
                  src={'data:image/jpeg;base64,' + image}
                  alt="user"
                />
              ) : (
                <div className="mx-20 my-14">
                  <div className="spinner"></div>
                </div>
              )}
              <h3 className="mt-2 mx-0 text-2xl">
                {user ? user.username : ''}
              </h3>
              <h6 className="text-sm mx-0 mt-1 text-gray-500">
                Joined in {moment(user ? user.createdAt : '').year()}
              </h6>
              <p className="leading-5 my-3 text-sm font-light text-gray-400">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Architecto cum aliquam
              </p>
            </div>
          </div>
          <div className="col-span-2 justify-self-stretch">
            
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePost;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      createdAt
      question {
        commentCount
        username
        body
        title
        tags {
          id
          name
        }
        upvotes {
          username
        }
        downvotes {
          username
        }
        voteCount
        comments {
          _id
          username
          body
          createdAt
        }
      }
      answers {
        _id
        body
        createdAt
        upvotes {
          username
          createdAt
        }
        downvotes {
          username
          createdAt
        }
        voteCount
        username
      }
      user
    }
  }
`;

const FETCH_IMAGE_QUERY = gql`
  query($fileId: ID!) {
    getImage(fileId: $fileId)
  }
`;

const FETCH_USER_QUERY = gql`
  query($userId: ID!) {
    getUser(userId: $userId) {
      fileId
      username
    }
  }
`;

const SUBMIT_ANSWER_MUTATION = gql`
  mutation createAnswer($postId: ID!, $body: String!) {
    createAnswer(postId: $postId, body: $body) {
      id
      createdAt
      answers {
        _id
        body
        createdAt
        upvotes {
          username
          createdAt
        }
        downvotes {
          username
          createdAt
        }
        voteCount
      }
    }
  }
`;

const NEW_COMMENT_SUBSCRIPTION = gql`
  subscription newComment {
    newComment {
      _id
      body
      createdAt
      username
    }
  }
`;

const NEW_ANSWER_SUBSCRIPTION = gql`
  subscription newAnswer {
    newAnswer {
      _id
      body
      createdAt
      upvotes {
        username
        createdAt
      }
      downvotes {
        username
        createdAt
      }
      voteCount
      username
    }
  }
`;
