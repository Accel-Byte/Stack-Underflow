import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostCard from '../components/PostCard/HomeCard';
import Pagination from '../components/Pagination/Pagination';
import Loader from '../components/Loader/Loader';

const Dashboard = (props) => {
  const userId = props.match.params.userId;
  const [open, setOpen] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notInitialRender = useRef(false);

  const {
    loading,
    data: {
      getUser: user,
      getUserPost: { posts } = {},
      getUserPost: { totalPages } = 0,
      getUserPost: { totalPosts } = 0,
    } = {},
    refetch,
    networkStatus,
  } = useQuery(FETCH_DASHBOARD_DATA, {
    variables: {
      userId,
      page: currentPage,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.log(err.message);
      if (err.message.includes('UserNotFound')) {
        setUserNotFound(true);
      } else {
        toast.error(err.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  useEffect(() => {
    if (notInitialRender.current) {
      refetch();
    } else {
      notInitialRender.current = true;
    }
    return () => {};
  }, [currentPage]);

  const { data: { getImage: image } = {}, loading: imageLoading } = useQuery(
    FETCH_IMAGE_QUERY,
    {
      skip: !user,
      variables: {
        fileId: user && user.fileId,
      },
    }
  );

  let votes = 0;
  if (!loading && posts) {
    posts.forEach((post) => {
      votes += post.question.voteCount;
    });
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (networkStatus === NetworkStatus.loading) {
    return <Loader mainLoader={true} />;
  }

  return (
    <>
      <div className="dark:bg-primary-light bg-gray-100 p-10 pt-24 min-h-screen transition duration-500">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 justify-self-center h-37rem overflow-y-scroll scroll-1 font-poppins">
            <div className="bg-card-dark relative shadow-profile-card-shadow rounded-md pt-8 pb-4 px-10 w-80 text-center mx-auto max-w-full text-gray-300">
              <span className="absolute bg-profile-tag-background-dark text-gray-900 top-6 left-6 rounded-sm px-4 py-0 text-base font-semibold">
                PRO
              </span>
              <img
                className="border border-solid border-blue-400 rounded-full p-2 inline w-36 h-36"
                src={image && 'data:image/jpeg;base64,' + image}
                alt="user"
              />
              <h3 className="mt-2 mx-0 text-2xl">
                {user ? user.username : ''}
              </h3>
              <h6 className="text-sm mx-0 mt-1 text-gray-500">
                Joined in {moment(user ? user.createdAt : '').year()}
              </h6>
              <p className="leading-5 my-3 text-sm font-light text-gray-400">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Architecto cum aliquam
              </p>
              <div className="mt-5">
                <button className="bg-profile-button-dark text-gray-900 border border-solid border-profile-button-dark rounded-md py-2 px-6 font-semibold focus:outline-none">
                  Change Profile
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2 justify-self-stretch">
            {networkStatus === NetworkStatus.refetch ? (
              <Loader mainLoader={false} />
            ) : (
              <>
                {' '}
                <div>
                  {posts &&
                    posts.map((post) => <PostCard post={post} key={post.id} />)}
                </div>
                <Pagination
                  itemsCount={totalPages * 3}
                  pageSize={3}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  totalPosts={totalPosts}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

const FETCH_DASHBOARD_DATA = gql`
  query DashboardData($userId: ID!, $page: Int) {
    getUser(userId: $userId) {
      username
      email
      createdAt
      fileId
    }
    getUserPost(userId: $userId, page: $page) {
      posts {
        id
        createdAt
        question {
          username
          body
          tags {
            id
            name
          }
          title
          commentCount
          voteCount
        }
        answers {
          _id
        }
        user
      }
      totalPages
      totalPosts
    }
  }
`;

const FETCH_IMAGE_QUERY = gql`
  query ($fileId: ID!) {
    getImage(fileId: $fileId)
  }
`;
