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
  const [userKycStatus, setUserKycStatus] = useState('');
  const [loading, setLoading] = useState(true);
  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const db = getFirestore();
        const usersSnapshot = await getDocs(collection(db, "users"));
        const loggedInUserId = JSON.parse(localStorage.getItem('user')).id;
        const currentUser = usersSnapshot.docs.find(doc => doc.data().id === loggedInUserId);
        if (currentUser) {
          setUserKycStatus(currentUser.data().kyc);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details: ", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

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
          <main className='mt-28'>
            {/* Conditionally render welcome message based on KYC status */}
            {userKycStatus === 'completed' && (
              <div>
                <h2 className='text-center uppercase font-bold text-xl'>Welcome, {userInfo.displayName}</h2>
                {/* Render children components */}
                {children}
              </div>
            )}
            {/* Render children components without welcome message if KYC status is not completed */}
            {userKycStatus !== 'completed' && children}
          </main>
        </div>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Layout;
