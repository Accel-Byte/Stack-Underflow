import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
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
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: [result.data.createPost, ...data.getPosts],
          },
        });
        props.history.push('/');
      },
      onError(err) {
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

  return (
    <div class="bg-primary-light relative min-h-screen antialiased font-poppins pt-24">
      <div class="max-w-5xl px-6 mx-auto">
        <div class="relative flex flex-wrap">
          <div class="w-full relative">
            <div class="mt-6">
              <div class="font-semibold text-gray-200 text-4xl">
                Create Post
              </div>
              <form class="mt-8" onSubmit={onSubmit} noValidate>
                <div class="mx-auto w-full">
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Title of Question{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="text"
                      name="username"
                      class="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.username}
                      required
                    />
                  </div>
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Tags{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <QuestionTag tags={tags} setTags={setTags} />
                  </div>
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Question{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <Editor
                      loading={createPostLoading}
                      editorText={question}
                      handleChange={answerChange}
                    />
                  </div>
                  {Object.keys(errors).length > 0 && (
                    <div class="flex justify-start mt-3 p-1">
                      <ul>
                        {Object.values(errors).map((value) => (
                          <li class="flex items-center py-1" key={value}>
                            <div class="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
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
                            <span class="font-medium text-sm ml-3 text-red-400">
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
      question {
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
      }
      answers {
        username
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
    }
  }
`;

export default PostForm;
