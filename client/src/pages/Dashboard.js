import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostCard from '../components/PostCard/HomeCard';
import Pagination from '../components/Pagination/Pagination';
import Loader from '../components/Loader/Loader';
import UpdateImage from '../components/UpdateImage';
import NotFound from '../components/404';

const Dashboard = (props) => {
  const userId = props.match.params.userId;
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
    onError: (errors) => {
      if (errors.graphQLErrors[0].extensions.code === 'USER_NOT_FOUND') {
        setUserNotFound(true);
      } else {
        toast.error(errors.graphQLErrors[0].message, {
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
  }, [currentPage, refetch]);

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

  return userNotFound ? (
    <NotFound />
  ) : (
    <>
      <ToastContainer />
      <div className="dark:bg-primary-light bg-gray-100 p-10 pt-24 min-h-screen transition duration-500">
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-2 justify-self-center h-37rem overflow-y-scroll scroll-1 font-poppins">
            <div className="bg-card-dark relative shadow-profile-card-shadow rounded-md pt-8 pb-4 px-10 w-80 text-center mx-auto max-w-full text-gray-300">
              <span className="absolute bg-profile-tag-background-dark text-gray-900 top-6 left-6 rounded-sm px-4 py-0 text-base font-semibold">
                PRO
              </span>
              {image ? (
                <img
                  className="border border-solid border-blue-400 rounded-full p-2 inline w-36 h-36"
                  src={'data:image/jpeg;base64,' + image}
                  alt="user"
                />
              ) : (
                <div className="mx-20 my-14">
                  <div className="spinner animate-spinner"></div>
                </div>
              )}

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
                <UpdateImage userId={userId} fileId={user?.fileId} />
              </div>
            </div>
          </div>
          <div className="col-span-4 justify-self-stretch">
            {networkStatus === NetworkStatus.refetch ? (
              <Loader mainLoader={false} />
            ) : (
              <>
                {' '}
                <div className="flex justify-between font-poppins">
                  <div className="relative p-4 px-12 rounded-md mb-6 bg-blue-600 text-white overflow-hidden">
                    <i className="absolute h-16 w-16 -top-5 -left-3 text-xl p-6 pt-7 bg-opacity-10 bg-white rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                        <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                    </i>
                    <h3 className="text-center text-xl">{totalPosts}</h3>
                    <hr className="w-5/6 mx-auto my-2 opacity-40" />
                    <p className="lead text-center text-xl">Total Posts</p>
                  </div>
                  <div className="relative p-4 px-12 rounded-md mb-6 bg-red-500 text-white overflow-hidden">
                    <i className="absolute h-16 w-16 -top-5 -left-3 text-xl p-6 pt-7 bg-opacity-10 bg-white rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </i>
                    <h3 className="text-center text-xl">3</h3>
                    <hr className="w-5/6 mx-auto my-2 opacity-40" />
                    <p className="lead text-center text-xl">Total Answers</p>
                  </div>
                  <div className="relative p-4 px-12 rounded-md mb-6 bg-green-500 text-white overflow-hidden">
                    <i className="absolute h-16 w-16  -top-5 -left-3 text-xl p-6 pt-7 bg-opacity-10 bg-white rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </i>
                    <h3 className="text-center text-xl">{votes}</h3>
                    <hr className="w-5/6 mx-auto my-2 opacity-40" />
                    <p className="lead text-center text-xl">Total Votes</p>
                  </div>
                </div>
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
