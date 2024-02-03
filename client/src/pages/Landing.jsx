import React from 'react';
import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <h1>E-COMMERCE MERN BOILERPLATE</h1>
      <ul>
        <li>
          <NavLink to='/register'>Register</NavLink>
        </li>
        <li>
          <NavLink to='/login'>Login</NavLink>
        </li>
        <li>
          <NavLink to='/checkout'>Checkout</NavLink>
        </li>
      </ul>
    </>
  );
};

export default Landing;
