import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes ,getDownloadURL} from 'firebase/storage';

import Loading from './Loading';

const KYC = () => {
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    aadhar: '',
    pan: '',
  });
  const [loading , setLoading] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
     // Added UPI field
  });
  const [images, setImages] = useState({
    aadharCard: null,
    panCard: null,
    bankPassbook: null,
    bankStatement: null,
    signature: null,
  });
  const [error, setError] = useState('');

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    setImages({ ...images, [name]: files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Validation
      if (!personalDetails.name || !personalDetails.surname || !personalDetails.phone || !personalDetails.email || !personalDetails.aadhar || !personalDetails.pan) {
        throw new Error('Please fill in all personal details.');
      }
      if (!bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode ) {
        throw new Error('Please fill in all bank details.');
      }
      if (!images.aadharCard || !images.panCard || !images.bankPassbook || !images.bankStatement || !images.signature) {
        throw new Error('Please upload all images.');
      }

      // Upload images to Firebase Storage
      const storage = getStorage();
      const imageUrls = {};
      for (const key in images) {
        const image = images[key];
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls[key] = downloadUrl;
      }

      // Save user details and image URLs to Firestore
      const userRef = collection(getFirestore(), 'kyc');
      await addDoc(userRef, { personalDetails, bankDetails, imageUrls, status: 'pending' ,id : JSON.parse(localStorage.getItem('user')).id ? JSON.parse(localStorage.getItem('user')).id : ''});

      // Display success alert
      setLoading(false)
      alert('Form submitted successfully');

      // Optionally, redirect to the next page after successful submission
      // navigate to the next page
    } catch (err) {
      // Display error alert
      alert('Form submission failed: ' + err.message);
      setLoading(false)
      setError(err.message);
    }
  };

  return (
  <div>
      {loading && <Loading/>}
    <div className="container mx-auto py-8 px-4  mt-16" style={{ maxHeight: '80vh', overflowY: 'auto', maxWidth: '80vh', position: 'relative' }}>
      {/* Personal Details */}
      <h2 className=' text-2xl font-bold text-center mb-4'> Create Account</h2>
      <div className="max-w-lg mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
        {/* Name and Surname */}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={personalDetails.name}
            onChange={handlePersonalDetailsChange}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium">Surname</label>
          <input
            type="text"
            name="surname"
            value={personalDetails.surname}
            onChange={handlePersonalDetailsChange}
            placeholder="Surname"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* Other Personal Details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={personalDetails.phone}
            onChange={handlePersonalDetailsChange}
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Email</label>
          <input
            type="text"
            name="email"
            value={personalDetails.email}
            onChange={handlePersonalDetailsChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Aadhar</label>
          <input
            type="text"
            name="aadhar"
            value={personalDetails.aadhar}
            onChange={handlePersonalDetailsChange}
            placeholder="Aadhar"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">PAN</label>
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

      {/* Bank Details */}
      <div className="max-w-lg mx-auto mb-16 relative">
        <h2 className="text-2xl font-bold mb-4">Bank Details</h2>
        {/* Input fields for bank details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Account Holder Name</label>
          <input
            type="text"
            name="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={handleBankDetailsChange}
            placeholder="Account Holder Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleBankDetailsChange}
            placeholder="Bank Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleBankDetailsChange}
            placeholder="Account Number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={bankDetails.ifscCode}
            onChange={handleBankDetailsChange}
            placeholder="IFSC Code"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
     
          {/* <input
            type="text"
            name="upi"
            value={bankDetails.upi}
            onChange={handleBankDetailsChange}
            placeholder="UPI"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          /> */}
        </div>
      </div>

      {/* Image Upload */}
      <div className="max-w-lg mx-auto mb-16 relative">
        <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Aadhar Card</label>
          <input
            type="file"
            name="aadharCard"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">PAN Card</label>
          <input
            type="file"
            name="panCard"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Bank Passbook</label>
          <input
            type="file"
            name="bankPassbook"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Bank Statement</label>
          <input
            type="file"
            name="bankStatement"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <label className="block text-sm font-medium">Signature</label>
          <input
            type="file"
            name="signature"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="container mx-auto max-w-lg fixed  left-0 right-0 bg-white py-4 px-4 border-t absolute">
        <div className="flex justify-center">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  </div>
  );
};

export default KYC;
