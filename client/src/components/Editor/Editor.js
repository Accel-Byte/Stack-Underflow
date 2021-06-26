import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css'

const Editor = ({ loading, editorText, handleChange }) => {
  
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
  
  return (
    <div>
        <ReactQuill
          modules={modules}
          formats={formats}
          theme="snow"
          value={editorText}
          onChange={handleChange}
          style={{
            outline: "none",
            border: "none"
          }}
        />
    </div>
  );
}


export default Editor;
