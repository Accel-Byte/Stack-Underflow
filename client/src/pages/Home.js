import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Transition,
  Button,
  Loader,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard/HomeCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    data: { getPosts: { posts } = {}, getPosts: { totalPages } = 0 } = {},
    refetch,
  } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      page: currentPage,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      toast.error(err.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });
  console.log(totalPages);
  useEffect(() => {
    refetch();
    return () => {};
  }, [currentPage]);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };
  return (
    <>
        <div class="h-14"></div>
        <div class="bg-primary-light p-10 min-h-screen">
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-1 justify-self-center h-96 overflow-y-scroll scroll-1">
            <div class="bg-card-dark py-8 px-10 text-center rounded-xl font-bold">
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-green-dark">
                Mongodb
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-red-dark">
                Rust
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-pink-dark">
                GraphQL
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-pink-dark">
                GraphQL
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-pink-dark">
                GraphQL
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-pink-dark">
                GraphQL
              </div>
              <hr class="border-gray-900" />
              <div class="hover:bg-gray-700 cursor-pointer py-4 px-8 rounded-xl text-card-pink-dark">
                GraphQL
              </div>
            </div>
          </div>
          <div class="col-span-2 justify-self-stretch">
            {posts &&
              posts.map((post) => (
                  <PostCard post={post} />
              ))}
          </div>
          <div class="col-span-1 justify-self-center">
            <div class="bg-card-dark p-6 rounded-xl mb-2 text-white">
              <div class="font-semibold">Featured Post</div>
              <button class="mt-4 py-1 px-20 border-white border-2 rounded-lg">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
