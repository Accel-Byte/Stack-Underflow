import React from 'react';
import { Modal, Card, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CreateComment = ({
  submitComment,
  comment,
  user,
  commentChange,
  commentInputRef,
  open,
  setOpen,
}) => {
  return (
    <Modal
      closeIcon
      open={open}
      trigger={
        user && (
          <Link style={{ color: 'blue', marginLeft: '5px' }}>
            Create Comment
          </Link>
        )
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Content>
        <Card fluid>
          <Card.Content>
            <p>Post a comment</p>
            <Form>
              <div className="ui action input fluid">
                <input
                  type="text"
                  placeholder="Comment.."
                  name="comment"
                  value={comment}
                  onChange={(event) => commentChange(event)}
                  ref={commentInputRef}
                />
                <button
                  type="submit"
                  className="ui button teal"
                  disabled={comment.trim() === ''}
                  onClick={() => {
                    submitComment();
                  }}
                >
                  Submit
                </button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      </Modal.Content>
    </Modal>
  );
};
export default CreateComment;
