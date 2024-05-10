import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { generateOTP, verifyOTP } from '../fireBaseConfig'; // Assuming you have Firebase set up

const Login = () => {
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    aadhar: '',
    pan: '',
  });
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const sendOtp = async () => {
    try {
      // Validation
      if (!personalDetails.name || !personalDetails.surname || !personalDetails.phone || !personalDetails.email || !personalDetails.aadhar || !personalDetails.pan) {
        throw new Error('Please fill in all personal details.');
      }
  
      const confirmationResult = await generateOTP(personalDetails.phone);
      setVerificationId(confirmationResult.verificationId); // Access verification ID directly from confirmationResult
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Validation
      if (!bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        throw new Error('Please fill in all bank details.');
      }

    //   const credential = await verifyOTP(verificationId, otp);
      // OTP verification successful, now save user details to Firestore
      const userRef = collection(getFirestore(), 'users'); // Assuming getFirestore() returns the Firestore instance
      await addDoc(userRef, { personalDetails, bankDetails });
      // Optionally, sign in the user with the credential if needed
      // await auth.signInWithCredential(credential);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
    {/* Personal Details */}
    {!otpSent && (
      <div className="max-w-lg mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={personalDetails.name}
            onChange={handlePersonalDetailsChange}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Surname</label>
          <input
            type="text"
            name="surname"
            value={personalDetails.surname}
            onChange={handlePersonalDetailsChange}
            placeholder="Surname"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={personalDetails.phone}
            onChange={handlePersonalDetailsChange}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            name="email"
            value={personalDetails.email}
            onChange={handlePersonalDetailsChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Aadhar</label>
          <input
            type="text"
            name="aadhar"
            value={personalDetails.aadhar}
            onChange={handlePersonalDetailsChange}
            placeholder="Aadhar"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">PAN</label>
          <input
            type="text"
            name="pan"
            value={personalDetails.pan}
            onChange={handlePersonalDetailsChange}
            placeholder="PAN"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    )}
    {/* Bank Details */}
    {otpSent && (
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Bank Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Account Holder Name</label>
          <input
            type="text"
            name="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={handleBankDetailsChange}
            placeholder="Account Holder Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* Repeat similar blocks for other bank details fields */}
      </div>
    )}
    {/* Button to send OTP */}
    {!otpSent && (
      <div className="flex justify-center">
        <button onClick={sendOtp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Send OTP
        </button>
      </div>
    )}
    {/* OTP input and verification button */}
    {otpSent && (
      <div className="max-w-lg mx-auto">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mb-4"
        />
        <div className="flex justify-center">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Verify OTP
          </button>
        </div>
      </div>
    )}
    {error && <p className="text-red-500 mt-4">{error}</p>}
  </div>
  
  );
};


