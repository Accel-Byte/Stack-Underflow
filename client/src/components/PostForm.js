import React, { useState } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import Editor from './Editor';

function PostForm(props) {
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
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
      values.body = '';
      props.history.push('/');
    },
    onError(err) {
      console.log(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Question</h2>
        <Form.Field>
          <label style={{fontSize:"1.125rem"}}>Title</label>
          <input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={errors.post === null ? true : false}
          />
        </Form.Field>
        <Form.Field>
          <label style={{fontSize:"1.125rem"}}>Question</label>
          <Editor />
        </Form.Field>
        <br />
        <Form.Field>
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
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
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
