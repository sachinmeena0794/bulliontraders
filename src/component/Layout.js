import React, { useState, lazy, Suspense, startTransition, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getFirestore, getDocs, collection, query, where } from "firebase/firestore";


// Lazy load Header and Sidebar components
const Header = lazy(() => import('./Header'));
const Sidebar = lazy(() => import('./Sidebar'));
const Loading = lazy(() => import('./Loading'));
const Footer = lazy(() => import('./Footer'));

const Layout = ({ userInfo, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to determine if sidebar should be displayed
  const shouldDisplaySidebar = () => {
    // Exclude login and signup pages
    return !['/login', '/signup'].includes(location.pathname);
  };

  return (
    <div className="layout">
      {/* Use Suspense to handle lazy loading */}
      <Suspense fallback={<Loading />}>
        {/* Lazy-loaded Header component */}
        <Header userInfo={userInfo} toggleSidebar={toggleSidebar} />
        {/* Main content and sidebar container */}
        <div className="main-container">
          {/* Conditionally render Sidebar */}
          {shouldDisplaySidebar() && userInfo && <Sidebar userInfo={userInfo} />}
          {/* Main content */}
          <main className='mt-8'>
            {children}
          </main>
        </div>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Layout;
