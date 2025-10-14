import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Outlet /> {/* This will render the specific page component */}
      </main>
    </>
  );
};

export default Layout;