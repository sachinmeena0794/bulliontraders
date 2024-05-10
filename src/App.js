import './App.css';
import Layout from './component/Layout';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate


// Lazy load the MarketIndex component
const MarketIndex = lazy(() => import('./component/TradingViewWidget'));
const Signup = lazy(() => import('./page/Signup'));
const Login = lazy(() => import('./page/Login'));
const Funds = lazy(() => import('./page/FundTransfer'));
const Admin = lazy(() => import('./page/Admin'));
const TradeReport = lazy (()=> import('./page/TradeReport'))
const TransferHistory = lazy (()=> import ('./page/TransferHistory'))
const Profile = lazy (()=> import('./page/profile'))
const Contact = lazy (()=> import('./page/Contact'))
const AddAccount = lazy (()=> import ('./component/KYC'))
// Higher-order component for protected routes
const ProtectedRoute = ({ element, ...rest }) => {
  // Check if the user is authenticated as an admin
  // const isAdmin = JSON.parse(localStorage.getItem('user'))?.isAdmin;
  const isAdmin = true;
  return isAdmin ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Layout userInfo={JSON.parse(localStorage.getItem('user'))}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MarketIndex />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-funds" element={<Funds />} />
            <Route path="/transfer-history" element={<TransferHistory />} />
            <Route path="/trade-report" element={<TradeReport />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/create-account" element={<AddAccount />} />
            {/* Use ProtectedRoute for the Admin route */}
            <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
