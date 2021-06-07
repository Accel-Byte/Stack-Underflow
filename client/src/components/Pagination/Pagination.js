import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Pagination = ({
  itemsCount,
  currentPage,
  pageSize,
  onPageChange,
  totalPosts,
  totalPages,
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages =
    currentPage <= 3
      ? _.range(1, Math.min(6, pagesCount + 1))
      : _.range(currentPage - 2, Math.min(currentPage + 3, totalPages + 1));

  return (
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4">
      <div>
        <p className="text-sm text-gray-400">
          Showing
          <span className="font-medium text-gray-300"> 1 </span>
          to
          <span className="font-medium text-gray-300"> {totalPages} </span>
          of
          <span className="font-medium text-gray-300"> {totalPosts} </span>
          results
        </p>
      </div>
      <div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
          >
            <span className="sr-only">First</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-l-md bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage === 1 ? 1 : currentPage - 1);
            }}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {pages.map((page) => (
            <button
              key={page}
              aria-current="page"
              className={`z-10  ${
                page === currentPage
                  ? 'text-pink-300 bg-gray-700'
                  : 'text-gray-300 bg-card-dark'
              }  relative inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer focus:outline-none hover:bg-gray-700`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {' '}
              {page}{' '}
            </button>
          ))}
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-r-md bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(
                currentPage === pagesCount ? pagesCount : currentPage + 1
              );
            }}
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-r-md bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pagesCount);
            }}
          >
            <span className="sr-only">Last</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
