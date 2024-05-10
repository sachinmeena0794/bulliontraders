import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { RiAddCircleLine, RiContactsLine, RiAdminFill, RiHistoryLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Sidebar = ({ userInfo2 }) => {
  const [userKycStatus, setUserKycStatus] = useState('');
  const [loading, setLoading] = useState(true);

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

  // Show loading indicator while fetching user details
  if (loading) {
    return <div>Loading...</div>;
  }

  const userEmail = JSON.parse(localStorage.getItem('user'))? JSON.parse(localStorage.getItem('user')).email : '';

  return (
    <div className={`bg-gray-800 w-64 flex flex-col justify-start sidebar mt-28`}>
      {/* User profile picture */}
      <div className="flex items-center justify-center py-4">
        <img src="/user-profile-picture.jpg" alt="User Profile" className="h-16 w-16 rounded-full" />
      </div>
      
      {/* Sidebar options */}
      <div className="flex flex-col items-start">
        {/* Conditionally render "Create Account" button */}
        {userKycStatus === 'pending' && (
          <Link to="/create-account" className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
            <RiAddCircleLine className="h-8 w-8 mr-3" />
            <span className="text-white">Create Account</span>
          </Link>
        )}

        {/* Render rest of the sidebar options only if KYC is not pending */}
        {userKycStatus !== 'pending' && (
          <>
            <Link to="/add-funds" className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
              <RiAddCircleLine className="h-8 w-8 mr-3" />
              <span className="text-white">Add Fund</span>
            </Link>
    
            <Link to="/transfer-history" className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
              <RiHistoryLine className="h-8 w-8 mr-3" />
              <span className="text-white">Transfer History</span>
            </Link>
            <Link to="/trade-report" className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
              <RiHistoryLine className="h-8 w-8 mr-3" />
              <span className="text-white">Trade Report</span>
            </Link>
    
            {/* Show Admin link only if the user's email matches */}
            {userEmail === 'sachinmeena745@gmail.com' && (
              <Link to='/admin' className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
                <RiAdminFill className="h-8 w-8 mr-3" />
                <span className="text-white">Admin</span>
              </Link>
            )}
          </>
        )}

        {/* Sidebar option */}
        <Link to='/contact-us' className="flex items-center py-3 px-4 mb-2 hover:bg-gray-700 cursor-pointer transition-transform duration-300 transform hover:scale-125">
          <RiContactsLine className="h-8 w-8 mr-3" />
          <span className="text-white">Contact Us</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
