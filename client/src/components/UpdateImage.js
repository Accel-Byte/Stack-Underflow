/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ImageUploader from 'react-images-upload';
import { useMutation, gql } from '@apollo/client';

const UpdateImage = ({ userId, fileId }) => {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);

  const onDrop = (pictureFile, pictureDataURL) => {
    console.log('picturefile', pictureFile);
    setFile(pictureFile[0]);
  };

  const [updateImage, { loading }] = useMutation(UPDATE_IMAGE, {
    update() {
      setFile(null);
      setOpen(false);
      window.location.reload();
    },
    variables: {
      userId,
      file,
      fileId,
    },
    onError(err) {
      console.log(err);
    },
  });

  const cancelButtonRef = useRef(null);

  return (
    <>
      <button
        className="bg-profile-button-dark text-gray-900 border border-solid border-profile-button-dark rounded-md py-2 px-6 font-semibold focus:outline-none"
        onClick={() => setOpen(true)}
      >
        Change Profile
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 font-poppins">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-95 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-card-dark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-yellow-400">
                <div className="bg-card-dark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl leading-6 font-medium text-gray-100 pb-2"
                      >
                        Upload Image
                      </Dialog.Title>
                      <div className="w-full">
                        <ImageUploader
                          withIcon={false}
                          withPreview={true}
                          onChange={onDrop}
                          imgExtension={['.jpg', '.gif', '.png', '.gif']}
                          maxFileSize={5242880}
                          singleImage={true}
                          className="w-27rem"
                          fileContainerStyle={{
                            background: '#374151',
                            color: 'white',
                          }}
                          label="Max file size : 5mb &nbsp;&nbsp;&nbsp;&nbsp; Accepted : jpg | webp | png"
                          labelStyles={{
                            fontSize: '16px',
                          }}
                          buttonStyles={{
                            background: '#818CF8',
                            color: 'black',
                            fontWeight: "500",
                          }}
                          buttonText="Choose image"
                          errorStyle={{
                            color:"#F87171",
                            fontSize: "14px",
                            fontWeight: "500",
                            marginTop: "8px"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      updateImage();
                    }}
                    disabled
                  >
                    Upload
                  </button>
                  <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const UPDATE_IMAGE = gql`
  mutation updateImage($file: Upload!, $fileId: ID!, $userId: ID!) {
    updateImage(userId: $userId, fileId: $fileId, file: $file) {
      fileId
    }
  }
`;
export default UpdateImage;
