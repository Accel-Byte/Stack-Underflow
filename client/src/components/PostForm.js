import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import Editor from './Editor';
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
        console.log(tags[0]);
        console.log(err);
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
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Question</h2>
        <Form.Field>
          <label style={{ fontSize: '1.125rem' }}>Title</label>
          <input
            placeholder="Hi World!"
            name="title"
            onChange={onChange}
            value={values.title}
            error={errors.post === null ? true : false}
          />
        </Form.Field>
        <Form.Field>
          <label style={{ fontSize: '1.125rem' }}>Tags</label>
          <QuestionTag tags={tags} setTags={setTags} />
        </Form.Field>
        <Form.Field>
          <label style={{ fontSize: '1.125rem' }}>Question</label>
          <Editor
            loading={createPostLoading}
            editorText={question}
            handleChange={answerChange}
          />
        </Form.Field>
        <br />
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </>
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
