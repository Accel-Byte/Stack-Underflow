import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: null,
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0]);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const validateEmail = () => {
    const emailreg =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!values.email.match(emailreg)) {
      setErrors((prev) => {
        return {
          ...prev,
          email: 'Please enter a valid email address!',
        };
      });
      return false;
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          email: '',
        };
      });
    }
    return true;
  };
  const validatePassword = () => {
    const passwordreg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
    if (!values.password.match(passwordreg)) {
      setErrors((prev) => {
        return {
          ...prev,
          password:
            'Use 8 or more characters with a mix of letters, numbers & symbols :)',
        };
      });
      return false;
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          password: '',
        };
      });
    }
    return true;
  };

  function registerUser() {
    setErrors({});
    if (validateEmail() && validatePassword()) {
      setErrors({});
      addUser();
    }
  }

  let circleCommonClasses = 'h-3 w-3 bg-card-dark rounded-full';

  return (
    <div class="bg-primary-light relative min-h-screen antialiased font-poppins pt-24">
      <div class="max-w-md mx-auto px-6">
        <div class="relative flex flex-wrap">
          <div class="w-full relative">
            <div class="mt-6">
              <div class="text-center font-semibold text-gray-200 text-4xl">
                Register
              </div>
              <form class="mt-8" onSubmit={onSubmit} noValidate>
                <div class="mx-auto max-w-lg">
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Username{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="text"
                      name="username"
                      class="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.username}
                      required
                    />
                  </div>
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Email{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="email"
                      name="email"
                      class="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200 focus:bg-card-dark"
                      onChange={onChange}
                      value={values.email}
                      required
                    />
                  </div>
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Password{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="password"
                      name="password"
                      class="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.password}
                      required
                    />
                  </div>
                  <div class="py-1">
                    <span class="px-1 text-sm text-gray-300">
                      Confirm Password{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </span>
                    <input
                      placeholder=""
                      type="password"
                      name="confirmPassword"
                      class="text-md block px-3 py-2 rounded-lg w-full bg-card-dark border-2 border-gray-900 focus:outline-none text-gray-200"
                      onChange={onChange}
                      value={values.confirmPassword}
                      required
                    />
                  </div>
                  <div class="py-1">
                    <label
                      class="px-1 mb-1 block text-sm font-medium text-gray-300"
                      for="view_model_avatar"
                    >
                      {' '}
                      Avatar{' '}
                      <span class="text-red-400 font-extrabold text-lg">*</span>
                    </label>
                    <div class="relative">
                      <input
                        class="border-gray-900 focus:ring-blue-600 block w-full overflow-hidden cursor-pointer border text-gray-300 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                        aria-describedby="view_model_avatar_help"
                        id="view_model_avatar"
                        name="view_model[avatar]"
                        type="file"
                        name="file"
                        required
                        onChange={onChange}
                        data-max-size="500000"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <button class="mt-3 text-lg font-semibold bg-login-button-dark w-full text-card-dark rounded-lg px-6 py-3 block shadow-xl hover:bg-login-button-dark-hover hover:text-login-button-dark">
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
                      'Register'
                    )}
                  </button>
                  {Object.keys(errors).length > 0 && (
                    <div class="flex justify-start mt-3 p-1">
                      <ul>
                        {Object.values(errors).map((value) => (
                          <li class="flex items-center py-1" key={value}>
                            <div class="bg-red-200 text-red-700 rounded-full p-1 fill-current">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
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
                            <span class="font-medium text-sm ml-3 text-red-400">
                              {value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
              <div class="text-sm font-semibold sm:hidden py-6 flex justify-center">
                <a
                  href="#"
                  class="text-black font-normal border-b-2 border-gray-200 hover:border-blue-500"
                >
                  You're already member?
                  <span class="text-black font-semibold"> Login </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $file: Upload!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        file: $file
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
