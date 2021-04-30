import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
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
    const emailreg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
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
    const passwordreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/;
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

  

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
          required
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
          required
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
          required
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
          required
        />
        <Form.Input
          name="file"
          type="file"
          required
          onChange={onChange}
          data-max-size="500000"
          accept="image/*"
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
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
