import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import Editor from './Editor/Editor';
import QuestionTag from './QuestionTag/QuestionTag.js';

function PostForm(props) {
  const [errors, setErrors] = useState({});
  const [question, setQuestion] = useState('');
  const [tags, setTags] = useState([]);

  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    title: '',
  });
  const [createPost, { loading: createPostLoading }] = useMutation(
    CREATE_POST_MUTATION,
    {
      variables: {
        title: values.title,
        body: question,
        tags,
      },
      update(proxy, result) {
        props.history.push('/');
      },
      onError(err) {
        console.log(err);
        if (err.graphQLErrors[0].extensions.exception.errors)
          setErrors(err.graphQLErrors[0].extensions.exception.errors);
        else {
          setErrors({
            message: err.message,
          });
        }
      },
    }
  );

  function createPostCallback() {
    createPost();
  }

  const answerChange = (value) => {
    setQuestion(value);
  };

  let circleCommonClasses = 'h-3 w-3 bg-card-dark rounded-full';

  return (
    <div className="bg-primary-light relative min-h-screen antialiased font-poppins pt-24">
      <div className="max-w-5xl px-6 mx-auto">
        <div className="relative flex flex-wrap">
          <div className="w-full relative">
            <div className="mt-6">
              <div className="font-semibold text-gray-200 text-4xl">
                Create Post
              </div>
              <form className="mt-8" onSubmit={onSubmit} noValidate>
                <div className="mx-auto w-full">
                  <div className="py-1">  
                    <span className="px-1 text-sm text-gray-300">
                      Title of Question{' '}
                      <span className="text-red-400 font-extrabold text-lg">
                        *
                      </span>
                    </span>
                    <input
                      placeholder="Hi World!"
                      type="text"
                      className="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      name="title"
                      value={values.title}
                      required
                    />
                  </div>
                  <div className="py-1">
                    <span className="px-1 text-sm text-gray-300">
                      Tags{' '}
                      <span className="text-red-400 font-extrabold text-lg">
                        *
                      </span>
                    </span>
                    <QuestionTag tags={tags} setTags={setTags} />
                  </div>
                  <div className="py-1">
                    <span className="px-1 text-sm text-gray-300">
                      Question{' '}
                      <span className="text-red-400 font-extrabold text-lg">
                        *
                      </span>
                    </span>
                    <Editor
                      loading={createPostLoading}
                      editorText={question}
                      handleChange={answerChange}
                    />
                  </div>
                  <div className="py-1">
                    <button
                      className="mt-3 text-lg font-semibold bg-login-button-dark w-full text-card-dark rounded-lg px-6 py-3 block shadow-xl hover:bg-login-button-dark-hover hover:text-login-button-dark"
                      type="submit"
                    >
                      {createPostLoading ? (
                        <div className="flex justify-center items-center py-2">
                          <div
                            className={`${circleCommonClasses} mr-1 animate-bounce1`}
                          ></div>
                          <div
                            className={`${circleCommonClasses} mr-1 animate-bounce2`}
                          ></div>
                          <div
                            className={`${circleCommonClasses} animate-bounce3`}
                          ></div>
                        </div>
                      ) : (
                        'Create Post'
                      )}
                    </button>
                  </div>
                  {Object.keys(errors).length > 0 && (
                    <div className="flex justify-start mt-3 p-1">
                      <ul>
                        {Object.values(errors).map((value) => (
                          <li className="flex items-center py-1" key={value}>
                            <div className="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-sm ml-3 text-red-400">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $body: String!, $tags: [tagInput]!) {
    createPost(title: $title, body: $body, tags: $tags) {
      user
      id
      featured
      question{
        username
        body
        title
        tags{
          id
          name
        }
        upvotes{
          username
        }
        downvotes{
          username
        }
        voteCount
      }
      answers{
        _id
        username
        body
        upvotes{
          username
        }
        downvotes{
          username
        }
        voteCount
      }
      createdAt
    }
  }
`;

export default PostForm;
