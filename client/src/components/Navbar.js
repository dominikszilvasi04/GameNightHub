import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">GameNightHub 🎮</Link>
      </h1>
      <ul className="flex items-center space-x-4">
        <li><Link to="/lobbies" className="hover:text-gray-300">Lobbies</Link></li>
        {user ? (
          // If user is logged in
          <>
            <li>Welcome, {user.username}!</li>
            <li>
              <Button onClick={logout}>Logout</Button>
            </li>
          </>
        ) : (
          // If user is logged out
          <>
            <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
            <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;