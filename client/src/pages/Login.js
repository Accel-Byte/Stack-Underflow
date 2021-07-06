import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },  
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }
  let circleCommonClasses = 'h-3 w-3 bg-card-dark rounded-full';

  return (
    <div className="bg-primary-light relative min-h-screen antialiased font-poppins pt-24">
      <div className="max-w-md mx-auto px-6">
        <div className="relative flex flex-wrap">
          <div className="w-full relative">
            <div className="mt-6">
              <div className="text-center font-semibold text-gray-200 text-4xl">
                Login
              </div>
              <form className="mt-8" onSubmit={onSubmit} noValidate>
                <div className="mx-auto max-w-lg">
                  <div className="py-1">
                    <span className="px-1 text-sm text-gray-300">
                      Username{' '}
                      <span className="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="text"
                      name="username"
                      className="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.username}
                      required
                    />
                  </div>
                  <div className="py-1">
                    <span className="px-1 text-sm text-gray-300">
                      Password{' '}
                      <span className="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="password"
                      name="password"
                      className="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.password}
                      required
                    />
                  </div>
                  <button className="mt-3 text-lg font-semibold bg-login-button-dark w-full text-card-dark rounded-lg px-6 py-3 block shadow-xl hover:bg-login-button-dark-hover hover:text-login-button-dark focus:outline-none">
                    {loading ? (
                      <div className="flex justify-center items-center py-2">
                        <div
                          className={`${circleCommonClasses} mr-1 animate-bounce1`}
                        ></div>
                        <div
                          className={`${circleCommonClasses} mr-1 animate-bounce2`}
                        ></div>
                        <div
                          className={`${circleCommonClasses} animate-bounce3`}
                        ></div>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </button>
                  {Object.keys(errors).length > 0 && (
                    <div className="flex justify-start mt-3 p-1">
                      <ul>
                        {Object.values(errors).map((value) => (
                          <li className="flex items-center py-1" key={value}>
                            <div className="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-sm ml-3 text-red-400">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
              <div className="text-sm sm:hidden font-semibold py-6 flex justify-center">
                <Link
                  to="#"
                  className="text-black font-normal border-b-2 border-gray-200 hover:border-blue-500"
                >
                  You're already member?
                  <span className="text-black font-semibold"> Login </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
