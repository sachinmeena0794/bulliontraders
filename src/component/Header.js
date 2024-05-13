import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../fireBaseConfig';
import { getFirestore, getDocs, collection, query, where } from "firebase/firestore";

const Header = ({ userInfo, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loggedUser, setLoggedUser] = useState(null); // Changed from array to object
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.clear("user");
      window.location.href = './login';
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const db = getFirestore();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const paymentHistoryRef = await getDocs(collection(db, "payment-history"));
        const paymentDetailsData = paymentHistoryRef.docs.map(doc => doc.data());

        const filteredData = paymentDetailsData.filter(item => {
          const userInfo1 = JSON.parse(item.userInfo);
          return userInfo1.email === userInfo.email && item.status === 'completed';
        });

        let totalDeposits = 0;
        let totalWithdrawals = 0;

        filteredData.forEach(item => {
          if (item.action === 'deposit' || item.action == undefined) {
            totalDeposits += parseInt(item.amount);
          } else if (item.action === 'withdraw') {
            totalWithdrawals += parseInt(item.amount);
          }
        });

        const totalAmount = totalDeposits - totalWithdrawals;

        setTotalAmount(totalAmount);
      } catch (error) {
        console.error('Error fetching payment history:', error.message);
      }
    };

    if (userInfo) {
      fetchPaymentHistory();
    }
  }, [userInfo]);

  useEffect(() => {
    const loggedInUser = async () => {
      try {
        const userRef = await getDocs(collection(db, "users"));
        const userData = userRef.docs.map(doc => doc.data());

        const filteredUser = userData.find(item => item.email === userInfo.email);
        setLoggedUser(filteredUser);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    if (userInfo) {
      loggedInUser();
    }
  }, [userInfo]);

  return (
    <header className="bg-gray-800 text-white fixed top-0 w-full z-10 uppercase">
      <div className="container mx-auto flex justify-between items-center ml-2 mr-4">
        <div className="flex items-center">
          {/* Mobile menu icon */}
          <div className="lg:hidden mr-4">
            <button onClick={toggleSidebar} className="bg-transparent text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/2.png" alt="bullionstocktrade" className="h-8 logo-image" />
            <span className="text-xl font-bold">Bullion Traders</span>
          </Link>
        </div>
        <div className="flex items-center ml-auto">
          {!userInfo && (
            <div>
              <Link to='/signup' className="text-lg font-bold mr-8">Sign Up</Link>
            </div>
          )}
          {userInfo && loggedUser && loggedUser.kyc === 'completed' && (
            <div className="hidden lg:block ml-4">
              <span className="text-sm font-semibold">Wallet Balance:</span>
              <span className="text-lg font-bold ml-2">₹{totalAmount}</span>
            </div>
          )}
          {userInfo && (
            <div className="relative ml-4 mr-16">
              <button onClick={toggleMenu} className="bg-transparent text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <ul className={`dropdown-menu absolute ${isMenuOpen ? '' : 'hidden'} text-gray-700 pt-1 right-0 bg-white border rounded-lg shadow-lg p-2`}>
                {userInfo && loggedUser && loggedUser.kyc === 'completed' && (
                  <li className="mb-2 lg:hidden text-black flex items-center">
                    <span className="text-gray-600 mr-2">Wallet Balance:</span>
                    <span className="font-semibold">₹{totalAmount}</span>
                  </li>
                )}
                <li className="mb-2">
                  <Link to="/user-profile" className="inline-block w-full rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap text-black text-sm">Profile</Link>
                </li>
                <li>
                  <button onClick={logout} className="inline-block w-full rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap text-black text-sm">Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
