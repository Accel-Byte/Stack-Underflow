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
      page: currentPage
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
