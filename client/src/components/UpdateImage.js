import React, { useState } from 'react';
import { Modal, Card, Button, Form } from 'semantic-ui-react';
import ImageUploader from 'react-images-upload';
import { useMutation, gql } from '@apollo/client';

const UpdateImage = ({ open, setOpen, userId, fileId }) => {
  const [file, setFile] = useState(null);
  
  const onDrop = (pictureFile, pictureDataURL) => {
    console.log("picturefile", pictureFile);
    console.log("picturedataURL", pictureDataURL);
    setFile(pictureFile[0]);
    pictureDataURL = pictureDataURL;
  };
  
  const [ updateImage, { loading }] = useMutation(UPDATE_IMAGE, {
    update() {
      setFile(null);
      setOpen(false);
      window.location.reload();
    },
    variables: {
      userId,
      file,
      fileId
    },
    onError(err) {
      console.log(err);
    },
  });
  return (
    <Modal
      closeIcon
      open={open}
      trigger={<Button secondary>Update Image</Button>}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Content>
        <Card fluid>
          <Card.Content>
            <Form className={loading ? 'loading' : ''}>
              <ImageUploader
                withIcon={false}
                withPreview={true}
                buttonText="Choose images"
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
              />
              <button
                type="submit"
                className="ui button teal"
                disabled={file === null}
                onClick={() => {
                  updateImage();
                }}
              >
                Submit
              </button>
            </Form>
          </Card.Content>
        </Card>
      </Modal.Content>
    </Modal>
  );
};
const UPDATE_IMAGE = gql`
  mutation updateImage($file: Upload!, $fileId: ID!, $userId: ID!) {
    updateImage(
      userId: $userId
      fileId: $fileId
      file: $file
    ) {
      fileId
    }
  }
`;
export default UpdateImage;
