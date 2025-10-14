import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button'; // We still use our main animated button for Logout

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    // 1. NEW BACKGROUND: A dark slate color that complements the buttons, with a subtle border.
    <nav className="bg-slate-900 text-neutral-200 p-4 flex justify-between items-center border-b border-neutral-800">
      <h1 className="text-xl font-bold">
        <Link to="/">GameNightHub 🎮</Link>
      </h1>
      <ul className="flex items-center space-x-6"> {/* Increased spacing for a cleaner look */}
        <li>
          {/* 2. NICER LINK STYLE: Added a hover effect with a bright accent color. */}
          <Link to="/lobbies" className="transition-colors hover:text-sky-400">
            Lobbies
          </Link>
        </li>
        {user ? (
          <>
            {/* 3. HIGHLIGHTED USERNAME: Makes the welcome message pop. */}
            <li>
              Welcome, <span className="font-semibold text-sky-400">{user.username}</span>!
            </li>
            <li>
              <Button onClick={logout}>Logout</Button>
            </li>
          </>
        ) : (
          <>
            {/* 4. NEW BUTTON-LIKE LINKS: These are styled to look like clickable buttons. */}
            <li>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md text-sm font-medium border border-neutral-600 transition-colors hover:bg-neutral-800 hover:border-neutral-700"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-800 border border-neutral-700 transition-colors hover:bg-neutral-700"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;