import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Form } from 'semantic-ui-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';


function Editor({ id }) {
  const [problemStatement, setProblemStatement] = useState('');

  const [submitAnswer, { loading }] = useMutation(SUBMIT_ANSWER_MUTATION, {
    variables: { postId: id, body: problemStatement },
    update(){
      setProblemStatement('');
    }
  });

  const modules = {syntax: true};
  modules.toolbar = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'], // blocks
    [{ list: 'ordered' }, { list: 'bullet' }], // lists
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults
    [{ font: [] }], // font family
    [{ align: [] }], // text align
    ['clean'], // remove formatting
    
  ];

  const formats = [
    'header',
    'font',
    'background',
    'color',
    'code',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'script',
    'align',
    'direction',
    'link',
    'image',
    'code-block',
    'formula',
    'video',
  ];
  const handleChange = (value) => {
    setProblemStatement(value);
  };
  const onSubmit = () => {
    submitAnswer();
  };
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <ReactQuill
          modules={modules}
          formats={formats}
          theme="snow"
          value={problemStatement}
          onChange={handleChange}
        />
        <Button
          content="Submit"
          icon="telegram plane"
          loading={loading}
          floated="right"
          labelPosition="right"
          style={{ margin: '0.8rem 0 0 0' }}
          secondary
        ></Button>
      </Form>
    </div>
  );
}

const SUBMIT_ANSWER_MUTATION = gql`
  mutation createAnswer($postId: ID!, $body: String!) {
    createAnswer(postId: $postId, body: $body) {
      id
      createdAt
      answers {
        id
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

export default Editor;
