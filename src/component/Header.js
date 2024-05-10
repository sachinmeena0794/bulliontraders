import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom
import { auth } from '../fireBaseConfig'; // Import firestore from fireBaseConfig
import { getFirestore ,getDocs,collection, query, where} from "firebase/firestore";
const Header = ({ toggleSidebar, userInfo }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // State to store the total amount
  const navigate = useNavigate(); // Use useNavigate hook to navigate programmatically

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    try {
      await auth.signOut(); // Call the signOut method to log the user out
      localStorage.clear("user");
      window.location.href='./login'// Redirect the user to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Fetch payment history and calculate total amount for the logged-in user
  const db= getFirestore()
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const paymentHistoryRef = await getDocs(collection(db, "payment-history"));
        const paymentDetailsData = paymentHistoryRef.docs.map(doc => doc.data());
      
        // Filter paymentDetailsData based on criteria
        const filteredData = paymentDetailsData.filter(item => {
          // Parse userInfo string back to object
          const userInfo1 = JSON.parse(item.userInfo);
          return userInfo1.email === userInfo.email && item.status === 'completed';
        });
  
        // Calculate total amount for deposits
        let totalDeposits = 0;
        filteredData.forEach(item => {
          if (item.action === 'deposit' || item.action == undefined) {
            totalDeposits += parseInt(item.amount);
          }
        });
  
        // Calculate total amount for withdrawals
        let totalWithdrawals = 0;
        filteredData.forEach(item => {
          if (item.action === 'withdraw') {
            totalWithdrawals += parseInt(item.amount);
          }
        });
  
        // Calculate total amount after subtracting withdrawals
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
  

  // Close the menu when the page changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

  return (
<header className="bg-gray-800 text-white fixed top-0 w-full z-10 uppercase">
  <div className="container mx-auto flex justify-between items-center ml-2 mr-4">
    {/* Logo wrapped with Link to navigate to home page */}
    <div className="flex items-center">
      {/* Logo wrapped with Link to navigate to home page */}
      <Link to="/" className="flex items-center">
        <img src="/2.png" alt="bullionstocktrade" className="h-8 logo-image" />
        <span className="text-xl font-bold">Bullion Traders</span>
      </Link>
    </div>

    {/* Right side - Signup and toggle menu */}
    <div className="flex items-center ml-auto">
      {/* Signup */}
      {!userInfo && (
        <div>
          <Link to='/signup' className="text-lg font-bold">Sign Up</Link>
        </div>
      )}

     {/* Wallet balance for non-mobile devices */}
     {userInfo && (
        <div className="hidden lg:block ml-4">
          <span className="text-sm font-semibold">Wallet Balance:</span>
          <span className="text-lg font-bold ml-2">₹{totalAmount}</span>
        </div>
      )}
      {/* Toggle menu */}
      <div className="relative ml-4 mr-16">
        <button onClick={toggleMenu} className="bg-transparent text-white focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <ul className={`dropdown-menu absolute ${isMenuOpen ? '' : 'hidden'} text-gray-700 pt-1 right-0 bg-white border rounded-lg shadow-lg p-2`}>
  {/* Wallet balance for mobile devices only */}
  <li className="mb-2 lg:hidden text-black flex items-center">
  <span className="text-gray-600 mr-2">Wallet Balance:</span> 
  <span className="font-semibold">₹{totalAmount}</span>

</li>
<li className="mb-2">
  <Link to="/user-profile" className="inline-block w-full rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap text-black text-sm">Profile</Link>
</li>
<li>
  <button onClick={logout} className="inline-block w-full rounded bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap text-black text-sm">Logout</button>
</li>

</ul>

      </div>

 
    </div>
  </div>
</header>


  );
};

export default Header;
