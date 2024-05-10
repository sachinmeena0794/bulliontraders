import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";

const PaymentModel = ({ onClose, action }) => {
  const [fullName, setFullName] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [upiDetails, setUpiDetails] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (!fullName || !amount || !paymentMode) {
      alert("Please fill in all fields.");
      return;
    }

    const db = getFirestore();
    const paymentHistoryRef = collection(db, 'payment-history');
    try {
      await addDoc(paymentHistoryRef, {
        fullName,
        amount,
        transactionId: action === 'withdraw' ? '' : transactionId, // Only include transaction ID if action is not withdraw
        paymentMode,
        upiDetails,
        accountNumber,
        holderName,
        bankName,
        ifscCode,
        action,
        userInfo: localStorage.getItem('user'),
        status: 'pending'
      });
      setFullName('');
      setAmount('');
      setTransactionId('');
      setPaymentMode('');
      setUpiDetails('');
      setAccountNumber('');
      setHolderName('');
      setBankName('');
      setIfscCode('');
      onClose(); // Close the modal
      alert("Request Created Successfully!");
    } catch (error) {
      console.error('Error adding payment request:', error);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-96 h-auto">
        <h2 className="text-xl font-bold mb-4">Create Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
          </div>
          {action !== 'withdraw' && ( // Render Transaction ID only if action is not withdraw
            <div className="mb-4">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
              <input type="text" id="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <select id="paymentMode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2">
              <option value="">Select Payment Mode</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          {paymentMode === "UPI" && (
            <div className="mb-4">
              <label htmlFor="upiDetails" className="block text-sm font-medium text-gray-700 mb-1">UPI Details</label>
              <input type="text" id="upiDetails" value={upiDetails} onChange={(e) => setUpiDetails(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
            </div>
          )}
          {paymentMode === "Bank Transfer" && (
            <div>
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 mb-1">Holder Name</label>
                <input type="text" id="holderName" value={holderName} onChange={(e) => setHolderName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input type="text" id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
              </div>
              <div className="mb-4">
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input type="text" id="ifscCode" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button type="button" onClick={handleCancel} className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Create Request</button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default PaymentModel;
