import React, { useState, useEffect } from 'react';
import PaymentModel from '../component/PaymentRequestModal';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import Loading from '../component/Loading';

function FundTransfer() {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bankDetailsVisible, setBankDetailsVisible] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawMoneyModal, setShowWithdrawMoneyModal] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const db = getFirestore();
        const paymentDetailsSnapshot = await getDocs(collection(db, "paymentDetails"));
        const paymentDetailsData = paymentDetailsSnapshot.docs.map(doc => doc.data());
        setPaymentDetails(paymentDetailsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment details: ", error);
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleAddMoneyClick = () => {
    setShowPaymentModal(false);
    setBankDetailsVisible(true);
  };

  const handleWithdrawMoneyClick = () => {
    setShowWithdrawMoneyModal(true);
    setBankDetailsVisible(false); // Hide payment details when withdrawing
  };

  const handleShowPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setShowWithdrawMoneyModal(false);
  };

  const handleCloseWithdrawMoneyModal = () => {
    setShowWithdrawMoneyModal(false);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md px-4 w-full">
        {loading ? (
          <Loading />
        ) : (
          <>
           <div className="flex justify-center mt-8">
  <div className="flex flex-col items-center sm:flex-row">
    <button onClick={handleAddMoneyClick} className="bg-blue-500 text-white px-3 py-2 rounded-md mb-4 sm:mb-0 sm:mr-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
      Add Money
    </button>
    <button onClick={handleWithdrawMoneyClick} className="bg-red-500 text-white px-3 py-2 rounded-md sm:px-4 sm:py-2 hover:bg-red-600 focus:outline-none focus:bg-red-600">
      Withdraw Money
    </button>
  </div>
</div>

  
            {bankDetailsVisible && (
              <div className="w-full mt-8">
                <h2 className="text-xl font-bold mb-4">Bank Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p><strong>Name:</strong> {paymentDetails[0]?.name}</p>
                    <p className="mb-2"><strong>Account Number:</strong> {paymentDetails[0]?.account_number}</p>
                    <p className="mb-2"><strong>Bank:</strong> {paymentDetails[0]?.bank}</p>
                    <p className="mb-2"><strong>IFSC Code:</strong> {paymentDetails[0]?.ifsc_code}</p>
                    <p className="mb-2"><strong>UPI:</strong> {paymentDetails[0]?.upi}</p>
                  </div>
                  <div className="text-center mt-8">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4  hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={handleShowPaymentModal}>
                    Create Request
                  </button>
                </div>
                  <div className=' mb-4'>
                 
                    <h2 className="text-xl font-bold mb-4">Admin Scanner</h2>
                    <img src={paymentDetails[0]?.scanner} alt="Admin Scanner" className="w-full" />
                  </div>
                </div>
               
              </div>
            )}
  
            {showPaymentModal && <PaymentModel action="deposit" onClose={handleClosePaymentModal} />}
            {showWithdrawMoneyModal && <PaymentModel action="withdraw" onClose={handleCloseWithdrawMoneyModal} />}
          </>
        )}
      </div>
    </div>
  );
  
}

export default FundTransfer;
