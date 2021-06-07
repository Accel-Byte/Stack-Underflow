import React, {
  useContext,
  useState,
  useEffect,
  Fragment,
  useRef,
} from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard/HomeCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import Pagination from '../components/Pagination/Pagination';
import Loader from '../components/Loader/Loader';

function Home() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [currenttag, setCurrentTag] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const searchRef = useRef(null);

  const {
    loading,
    data: {
      getPosts: { posts } = {},
      getPosts: { totalPages } = 0,
      getPosts: { totalPosts } = 0,
    } = {},
    refetch,
  } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      page: currentPage,
      tag: currenttag,
      search: currentSearch,
      featured: featured,
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

  useEffect(() => {
    refetch();
    return () => {};
  }, [currentPage, currenttag, currentSearch, featured]);

  useEffect(() => {
    fetch('data/tags.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then((myJson) => {
        let tempTags = [];
        myJson.forEach((item, index) => {
          tempTags.push({
            data: item.name,
            color: item.color,
          });
        });
        setTags(tempTags);
      });
    return () => {};
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTagChange = (tag) => {
    setCurrentTag((prev) => {
      return prev === tag ? '' : tag;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const search = searchRef.current.value;
    setCurrentSearch(search);
  };

  return (
    <>
      <div className="dark:bg-primary-light bg-gray-100 p-10 pt-24 min-h-screen transition duration-500">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 justify-self-center h-37rem overflow-y-scroll scroll-1">
            <div className="bg-white dark:bg-card-dark py-8 px-9 text-center rounded-xl font-bold transition duration-500">
              {tags &&
                tags.map((tag, i) => {
                  return (
                    <Fragment key={i}>
                      <div
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer py-4 px-6 rounded-xl ${
                          tag.color
                        } ${currenttag === tag.data ? 'bg-gray-700' : null}`}
                        onClick={(e) => {
                          console.log(e.target.textContent);
                          handleTagChange(e.target.textContent);
                        }}
                      >
                        {tag.data}
                      </div>
                      <hr className="dark:border-gray-900 border-gray-200" />
                    </Fragment>
                  );
                })}
            </div>
          </div>
          <div className="col-span-2 justify-self-stretch">
            <form onSubmit={(e) => handleSearch(e)}>
              <div className="relative mb-4">
                <input
                  type="text"
                  className="bg-card-dark py-3 w-full pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none text-gray-300"
                  placeholder="Search Anything..."
                  ref={searchRef}
                />
                <div className="absolute top-4 right-3 pl-2">
                  <button type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 hover:text-gray-300 focus:text-gray-300 cursor-pointer "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            <div className="flex">
              <button
                className="bg-card-dark hover:bg-gray-700 border-gray-900 border-r-2 border-b-2 py-3 w-1/2 text-center text-white font-semibold focus:outline-none"
                onClick={() => setFeatured(false)}
              >
                Recent Posts
              </button>
              <button
                className="bg-card-dark hover:bg-gray-700 border-black py-3 w-1/2 border-b-2 text-center text-white font-semibold focus:outline-none"
                onClick={() => setFeatured(true)}
              >
                Featured Posts
              </button>
            </div>
            {loading ? (
              <Loader />
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
          <div className="col-span-1 justify-self-center">
            <div className="bg-card-dark p-6 rounded-xl mb-2 text-white">
              <div className="font-semibold">Featured Post</div>
              <button className="mt-4 py-1 px-20 border-white border-2 rounded-lg">
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
