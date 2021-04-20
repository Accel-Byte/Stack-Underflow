import React, { useState, useContext } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;

  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const navBar = (
    <Segment inverted style={{ borderRadius: 0 }}>
      {user ? (
        <Menu borderless={true}  fixed="top"  inverted size="large" style={{padding:"0.5rem"}}>
          <Menu.Item name={'StackUnderflow'} onClick={handleItemClick} as={Link} to="/" />
          <Menu.Menu position="right">
            <Menu.Item
              color={'orange'}
              name={'Dashboard'}
              active={activeItem === 'Dashboard'}
              onClick={handleItemClick}
              as={Link}
              to={"/dashboard/" + user.id}
            />
            <Menu.Item color={'red'} name="logout" onClick={logout} />
          </Menu.Menu>
        </Menu>
      ) : (
        <Menu borderless={true}  fixed="top"  inverted size="large" style={{padding:"0.5rem"}} >
          <Menu.Item name={'StackUnderflow'} onClick={handleItemClick} as={Link} to="/" />
          <Menu.Menu position="right">
            <Menu.Item
              color={'green'}
              name="login"
              active={activeItem === 'login'}
              onClick={handleItemClick}
              as={Link}
              to="/login"
            />
            <Menu.Item
              color={'green'}
              name="register"
              active={activeItem === 'register'}
              onClick={handleItemClick}
              as={Link}
              to="/register"
            />
          </Menu.Menu>
        </Menu>
      )}
    </Segment>
  );
  return navBar;
};

export default NavBar;
