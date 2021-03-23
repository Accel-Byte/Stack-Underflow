import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor() {
  const [problemStatement, setProblemStatement] = useState('');

  const modules = {};
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
  return (
    <div>
      <ReactQuill
        name="question"
        modules={modules}
        formats={formats}
        theme="snow"
        value={problemStatement}
        onChange={handleChange}
      />
    </div>
  );
}

export default Editor;
