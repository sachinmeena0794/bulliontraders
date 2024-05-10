import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import Loading from '../component/Loading';

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // State variable to track editing mode
  const [formData, setFormData] = useState({
    aadhar: '',
    email: '',
    name: '',
    pan: '',
    phone: '',
    surname: '',
    status: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    upi: ''
  });

  // Retrieve user details from local storage
  const userInfo = localStorage.getItem('user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  useEffect(() => {
    // Fetch user details from Firestore
    const fetchUserData = async () => {
      try {
        const db = getFirestore();

        // Fetch KYC details
        const kycCollection = collection(db, 'kyc');
        const kycQuery = query(kycCollection, where('id', '==', user.id));
        const kycQuerySnapshot = await getDocs(kycQuery);

        if (!kycQuerySnapshot.empty) {
          kycQuerySnapshot.forEach((doc) => {
            const kycData = doc.data();
            if (kycData.id === user.id) {
              setKycDetails(kycData);
              setFormData({
                aadhar: kycData.personalDetails.aadhar,
                email: kycData.personalDetails.email,
                name: kycData.personalDetails.name,
                pan: kycData.personalDetails.pan,
                phone: kycData.personalDetails.phone,
                surname: kycData.personalDetails.surname,
                status: kycData.status,
                accountHolderName: kycData.bankDetails.accountHolderName,
                accountNumber: kycData.bankDetails.accountNumber,
                bankName: kycData.bankDetails.bankName,
                ifscCode: kycData.bankDetails.ifscCode,
                upi: kycData.bankDetails.upi
              });
            }
          });
        } else {
          console.log("No KYC documents found for the user.");
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to toggle editing mode
  const toggleEditing = () => {
    setEditing(!editing);
  };

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Implement logic to upload file to storage and save URL in 'users' collection
    // Example: const storageRef = ref(storage, 'userImages/' + user.id);
  };

  return (
    <div>
      {/* Check if user is logged in */}
      {loading ? (
        <Loading />
      ) : user ? (
        <div className='flex justify-center mt-24'>
          <div className="max-w-xl bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8 h-96 overflow-y-auto"> {/* Added height and scroll */}
              {/* Display circular image section */}
              <div className="flex justify-center mb-4">
                <img src={userDetails && userDetails.photoURL} alt="User" className="w-24 h-24 rounded-full" />
              </div>
              {/* Display KYC details */}
              {kycDetails && (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-center">KYC Information</h2>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Aadhar:</span> {editing ? <input type="text" name="aadhar" value={formData.aadhar} onChange={handleInputChange} /> : kycDetails.personalDetails.aadhar}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'disabled' : ''}`}><span className="font-semibold">Email:</span> {editing ? <input type="text" name="email" value={formData.email} onChange={handleInputChange} disabled/> : kycDetails.personalDetails.email}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Name:</span> {editing ? <input type="text" name="name" value={formData.name} onChange={handleInputChange} /> : kycDetails.personalDetails.name}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">PAN:</span> {editing ? <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} /> : kycDetails.personalDetails.pan}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Phone:</span> {editing ? <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} /> : kycDetails.personalDetails.phone}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Surname:</span> {editing ? <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} /> : kycDetails.personalDetails.surname}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Status:</span> {kycDetails.status}</p>
                </>
              )}
              {/* Display bank details */}
              {kycDetails && (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-center">Bank Details</h2>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Account Holder Name:</span> {editing ? <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} /> : kycDetails.bankDetails.accountHolderName}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Account Number:</span> {editing ? <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} /> : kycDetails.bankDetails.accountNumber}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">Bank Name:</span> {editing ? <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} /> : kycDetails.bankDetails.bankName}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">IFSC Code:</span> {editing ? <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} /> : kycDetails.bankDetails.ifscCode}</p>
                  <p className={`text-gray-500 mb-2 ${editing ? 'border-b-2 border-indigo-600' : ''}`}><span className="font-semibold">UPI:</span> {editing ? <input type="text" name="upi" value={formData.upi} onChange={handleInputChange} /> : kycDetails.bankDetails.upi}</p>
                </>
              )}
            </div>
            <div className="px-6 pb-8"> {/* Added margin bottom for space */}
              <div className="flex justify-end">
                {editing ? (
                  <>
                    <button onClick={toggleEditing} className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
                    <button onClick={toggleEditing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
                  </>
                ) : (
                  <button onClick={toggleEditing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Edit</button>
                )}
              </div>
              <div className="mt-4">
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload ID Image</label>
                <input type="file" id="fileUpload" onChange={handleFileUpload} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Please log in to view your profile.</p>
          {/* You can add a link to the login page here */}
        </div>
      )}
    </div>
  );
  
}

export default Profile;
