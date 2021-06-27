import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import useDarkMode from '../utils/useDarkMode';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [colorTheme, setTheme] = useDarkMode();

  const pathname = window.location.pathname;

  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e) => {
    setActiveItem(e.target.getAttribute('name'));
  };

  const navBar = (
    <>
      <nav className="fixed w-screen text-primary-light dark:text-white shadow-nav-shadow font-medium font-poppins bg-white dark:bg-primary-light z-50 transition duration-500">
        <div className="md:flex md:justify-between px-16">
          <div className="py-2 md:py-4 px-4 text-center">
            <Link to="/">
              <h1
                className="dark:text-dark-logo cursor-pointer text-2xl font-bold sm:leading-relaxed md:leading-normal"
                name={'StackUnderflow'}
              >
                Stack Underflow
              </h1>
            </Link>
          </div>
          <ul className="pb-4 md:py-4 flex text-center justify-evenly">
            {user ? (
              <>
                <li className="cursor-pointer hover:text-nav-link-hover-light dark:hover:text-nav-link-hover-dark sm:px-1 md:px-2">
                  <Link to={'/dashboard/' + user.id}>
                    <div
                      className="nav-item-border py-2"
                      onClick={handleItemClick}
                      name={'Dashboard'}
                    >
                      Dashboard
                    </div>
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-nav-link-hover-light dark:hover:text-nav-link-hover-dark sm:px-1 md:px-2">
                  <Link to="#">
                    <div className="nav-item-border py-2" onClick={logout}>
                      Logout
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="cursor-pointer hover:text-nav-link-hover-light dark:hover:text-nav-link-hover-dark sm:px-1 md:px-2">
                  <Link to="/login">
                    <div
                      className="nav-item-border py-2"
                      onClick={handleItemClick}
                      name="login"
                    >
                      Login
                    </div>
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-nav-link-hover-light dark:hover:text-nav-link-hover-dark sm:px-1 md:px-2">
                  <Link to="/register">
                    <div
                      className="nav-item-border py-2"
                      onClick={(e) => handleItemClick(e)}
                      name="register"
                    >
                      Register
                    </div>
                  </Link>
                </li>
              </>
            )}
            <li className="cursor-pointer hover:text-nav-link-hover-light dark:hover:text-nav-link-hover-dark sm:px-1 md:px-2">
              <button className="focus:outline-none">
                <div
                  className="py-2"
                  onClick={() => setTheme(colorTheme)}
                  name="mode"
                >
                  {colorTheme === 'dark' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  )}{' '}
                </div>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
  return navBar;
};

export default NavBar;
