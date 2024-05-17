import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc , addDoc,deleteDoc,setDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loading from '../component/Loading';

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState("bank");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [userKYCDetails, setUserKycDetails] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  
  const [bankInfo, setBankInfo] = useState({
    account_number: '',
    bank: '',
    ifsc_code: '',
    name: ''
  });
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    // Fetch payment details, payment requests, and user details from Firestore
    const fetchPaymentDetails = async () => {
      try {
        const db = getFirestore();
        const paymentDetailsSnapshot = await getDocs(collection(db, "paymentDetails"));
        const paymentDetailsData = paymentDetailsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPaymentDetails(paymentDetailsData[0]); // Assuming there's only one payment detail object
        setBankInfo(paymentDetailsData[0]);
      } catch (error) {
        console.error("Error fetching payment details: ", error);
      }
    };

    const fetchPaymentRequests = async () => {
      try {
        const db = getFirestore();
        const paymentRequestsSnapshot = await getDocs(collection(db, "payment-history"));
        const paymentRequestsData = paymentRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const pendingRequests = paymentRequestsData.filter(request => request.status === 'pending');
        setPaymentRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching payment requests: ", error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const db = getFirestore();
        const usersSnapshot = await getDocs(collection(db, "kyc"));
        const userDetailsSnapShot = await getDocs(collection(db, "users"));
        const userDetails = userDetailsSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const pendingKYC = usersSnapshot.docs
      .filter(doc => doc.data().status === 'pending' || doc.data().status == 'modified')
      .map(doc => ({ id: doc.id, ...doc.data() }));
        setUserDetails(pendingKYC);
        const usersKycDetails= usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserKycDetails(usersKycDetails)
        setAllUsers(userDetails);
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchPaymentDetails();
    fetchPaymentRequests();
    fetchUserDetails();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const db = getFirestore();

      
      const requestRef = doc(db, "payment-history", requestId);
      const docSnapshot = await getDoc(requestRef);
      if (docSnapshot.exists()) {
        await updateDoc(requestRef, { status: newStatus });
        // Refresh payment requests after updating status
        const updatedRequests = paymentRequests.map(request => {
          if (request.id === requestId) {
            return { ...request, status: newStatus };
          }
          return request;
        });
        setPaymentRequests(updatedRequests);
        alert(`Payment request ${requestId} has been ${newStatus}`);
      } else {
        console.error("Document does not exist:", requestId);
      }
    } catch (error) {
      console.error("Error updating payment request status: ", error);
    }
  };
  const handleKYCStatusUpdate = async (userId, newStatus) => {
    try {
        const userToUpdate = allusers.find(user => user.id === userId);

        if (userToUpdate) {
          setLoading(true);
            const db = getFirestore();
            const usersCollectionRef = collection(db, 'users');
            const kycCollectionRef = collection(db, 'kyc');
            
            const usersSnapshot = await getDocs(usersCollectionRef);
            const kycSnapshot = await getDocs(kycCollectionRef);
            
            // Find the specific user and KYC documents from the snapshots
            const userDoc = usersSnapshot.docs.find(doc => {
              console.log(doc.id);
              const userData = doc.data();
              return userData.id === userToUpdate.id;
          });
          
          const kycDoc = kycSnapshot.docs.find(doc => {
              const kycData = doc.data();
              return kycData.id === userToUpdate.id;
          });
          
          // Create new objects with id field added
          const userDocWithId = userDoc ? { ...userDoc.data(), id: userDoc.id } : null;
          const kycDocWithId = kycDoc ? { ...kycDoc.data(), id: kycDoc.id } : null;
          
          
            if (userDoc) {
                // Document exists, update the KYC status
                const userRef = doc(usersCollectionRef, userDocWithId.id);
                const kycRef = doc(kycCollectionRef, kycDocWithId.id);
                
                await updateDoc(userRef, { kyc: newStatus });
                
                if (kycDoc) {
                    await updateDoc(kycRef, { status: newStatus });
                } else {
                    // Create new KYC document if it doesn't exist
                    await setDoc(kycRef, { status: newStatus });
                }
                setLoading(false);
                alert(`KYC request for user ${userToUpdate.id} has been ${newStatus}`);
            } else {
                alert(`User document with ID ${userToUpdate.id} does not exist.`);
                setLoading(false);
            }
        } else {
            alert(`User with ID ${userId} not found in the local data.`);
            setLoading(false);
        }
    } catch (error) {
        console.error("Error updating KYC status:", error);
        alert("Failed to update KYC status. Please try again later.");
    }
};


  const toggleExpansion = (id, type) => {
    if (type === "request") {
      setExpandedRequestId(expandedRequestId === id ? null : id);
    } else if (type === "user") {
      setExpandedUserId(expandedUserId === id ? null : id);
    }
  };

  const toggleBankDetails = () => {
    setShowBankDetails(!showBankDetails);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `scanner_images/${file.name}`);
    
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setBankInfo(prevState => ({
        ...prevState,
        scanner: downloadURL
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSaveBankInfo = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const paymentDetailsRef = doc(db, "paymentDetails", paymentDetails.id);
      await updateDoc(paymentDetailsRef, bankInfo);
      setPaymentDetails(bankInfo);
      setEditMode(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating bank details: ", error);
      setLoading(false);
    }
  };
  const handleTraderReportUpload = async (userId) => {
    try {
        // Get the selected trade type (default to 'daily' if not specified)
        setLoading(true);
        const tradeType = document.querySelector(`input[name="trade-type-${userId}"]:checked`).value || 'daily';

        // Get the file input element
        const fileInput = document.getElementById(`file-upload-${userId}`);
        const file = fileInput.files[0];

        // Check if a file is selected
        if (!file) {
            alert("Please select a file to upload.");
            setLoading(false)
            return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, `trader_reports/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Store the trader report in Firestore under the tradeReports collection
        const db = getFirestore();

        // Add a new document to the tradeReports collection with the download URL, file name, user ID, and trade type
        const tradeReportsRef = collection(db, "traderReports");
        await addDoc(tradeReportsRef, { 
            url: downloadURL, 
            fileName: file.name,
            userId: userId,
            type: tradeType // Add the selected trade type to the document
        });
        setLoading(false)
        alert("Trader report uploaded successfully.");
    } catch (error) {
        console.error("Error uploading trader report:", error);
        alert("Error uploading trader report. Please try again later.");
    } 
};



const handleRemoveUser = async (userId) => {
  try {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) {
          return; // If user cancels, exit the function
      }

      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      // After deletion, update the state to remove the user from the UI
      setAllUsers(allusers.filter(user => user.id !== userId));
      alert(`User ${userId} has been removed successfully.`);
  } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user. Please try again later.");
  }
};

  
  
  const [kycFilter, setKycFilter] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [filteredUsers, setFilteredUsers] = useState([]);

useEffect(() => {
  let filtered = allusers;

  // Apply KYC filter
  if (kycFilter) {
    filtered = filtered.filter(user => user.kyc === kycFilter);
  }

  // Apply search query filter
 

  setFilteredUsers(filtered);
}, [allusers, kycFilter, searchQuery]);


  return (
    <div className="flex mt-24">
        {loading && <Loading />}
      {/* Left side: Menu options */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Menu Options</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setSelectedOption("bank")} className="text-blue-500 hover:text-blue-700 focus:outline-none">Bank Details</button>
          </li>
          <li>
  <button onClick={() => setSelectedOption("payment")} className="text-blue-500 hover:text-blue-700 focus:outline-none">Payment Requests</button>
  {paymentRequests.length > 0 && <span className="text-gray-500 ml-2">({paymentRequests.length} requests)</span>}
</li>

<li>
  <button onClick={() => setSelectedOption("kyc")} className="text-blue-500 hover:text-blue-700 focus:outline-none">KYC Requests</button>
  {userDetails.length > 0 && <span className="text-gray-500 ml-2">({userDetails.length} requests)</span>}
</li>

          <li>
  <button onClick={() => setSelectedOption("allusers")} className="text-blue-500 hover:text-blue-700 focus:outline-none">Upload Trade Report</button>
  {allusers.length > 0 && <span className="text-gray-500 ml-2">({allusers.length} users)</span>}
</li>
<li>
  <button onClick={() => setSelectedOption("userdetails")} className="text-blue-500 hover:text-blue-700 focus:outline-none">User Details</button>
</li>


          {/* Add more menu options here */}
        </ul>
      </div>

      {/* Right side: Details based on selected option */}
      <div className="w-3/4 p-4">
        {selectedOption === "bank" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>
            <div className="mb-4">
              <p className="font-semibold">Account Number:</p>
              <p>{paymentDetails.account_number}</p>
            </div>
            {showBankDetails && (
              <div className="mb-4">
                <p className="font-semibold">Bank:</p>
                <p>{paymentDetails.bank}</p>
                <p className="font-semibold">IFSC Code:</p>
                <p>{paymentDetails.ifsc_code}</p>
                <p className="font-semibold">Name:</p>
                <p>{paymentDetails.name}</p>
                <p className="font-semibold">UPI:</p>
                <p>{paymentDetails.upi}</p>
                <p className="font-semibold">Scanner:</p>
                <img src={paymentDetails.scanner} alt="Scanner" />
              </div>
            )}

            <button onClick={toggleBankDetails} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              {showBankDetails ? "Hide Details" : "Show Details"}
            </button>
            <button onClick={toggleEditMode} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ml-2">
              {editMode ? "Save" : "Edit"}
            </button>
            {editMode && (
              <div className="mt-4">
                <input type="text" name="account_number" value={bankInfo.account_number} onChange={handleInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="Account Number" />
                <input type="text" name="bank" value={bankInfo.bank} onChange={handleInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="Bank" />
                <input type="text" name="ifsc_code" value={bankInfo.ifsc_code} onChange={handleInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="IFSC Code" />
                <input type="text" name="name" value={bankInfo.name} onChange={handleInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="Name" />
                <input type="text" name="upi" value={bankInfo.upi} onChange={handleInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="UPI" />
                <input type="file" accept="image/*" name="scanner" onChange={handleFileInputChange} className="border border-gray-300 rounded-md px-3 py-2 mb-2" />
                <button onClick={handleSaveBankInfo} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
                  Save
                </button>
              </div>
            )}
          </div>
        )}

{selectedOption === "payment" && (
  <div>
    <h2 className="text-lg font-semibold mb-4">Payment Requests</h2>
    <div className="grid grid-cols-1 gap-4">
      {paymentRequests.map(request => (
        <div key={request.transactionId} className="bg-gray-100 p-4 rounded-md">
          <p><span className="font-semibold">Action:</span> {request.action}</p> {/* Display action */}
          <p><span className="font-semibold">Amount:</span> {request.amount}</p>
          {/* Render UPI ID or bank details based on payment mode */}
          {request.paymentMode === "UPI" ? (
            <p><span className="font-semibold">UPI ID:</span> {request.upiDetails}</p>
          ) : (
            <div>
              <p><span className="font-semibold">Account Number:</span> {request.accountNumber}</p>
              <p><span className="font-semibold">Holder Name:</span> {request.holderName}</p>
              <p><span className="font-semibold">Bank Name:</span> {request.bankName}</p>
              <p><span className="font-semibold">IFSC Code:</span> {request.ifscCode}</p>
            </div>
          )}
          {/* Additional request details... */}
          <button onClick={() => toggleExpansion(request.transactionId, "request")} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            {expandedRequestId === request.transactionId ? "Collapse" : "Expand"}
          </button>
          {expandedRequestId === request.transactionId && (
            <div className="mt-2">
              {/* Detailed request information */}
              <p><span className="font-semibold">Full Name:</span> {request.fullName}</p>
              <p><span className="font-semibold">Payment Mode:</span> {request.paymentMode}</p>
              <p><span className="font-semibold">Status:</span> {request.status}</p>
              <button onClick={() => handleStatusUpdate(request.id, 'completed')} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600 focus:outline-none focus:bg-green-600">
                Mark as Completed
              </button>
              <button onClick={() => handleStatusUpdate(request.id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-red-600 focus:outline-none focus:bg-red-600">
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
      {paymentRequests.length === 0 && (
        <p>No pending payment requests.</p>
      )}
    </div>
  </div>
)}



        {selectedOption === "kyc" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">KYC Requests</h2>
            <div className="grid grid-cols-1 gap-4">
            {userDetails.map(user => (
  <div key={user.id} className="bg-gray-100 p-4 rounded-md">
    <p><span className="font-semibold">Email:</span> {user.personalDetails?.name}</p>
    <p><span className="font-semibold">KYC Status:</span> {user.status}</p>
    <button onClick={() => toggleExpansion(user.id, "user")} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
      {expandedUserId === user.id ? "Collapse" : "Expand"}
    </button>
    {expandedUserId === user.id && (
      <div className="mt-2">
        {/* Detailed user information */}
        <p><span className="font-semibold">Name:</span> {user.personalDetails?.email}</p>
        <p><span className="font-semibold">Phone:</span> {user.personalDetails?.phone}</p>
       
        {/* Check if bank details exist */}
        {user.bankDetails && (
          <div>
            <h3 className="font-semibold mt-2">Bank Details:</h3>
            <p><span className="font-semibold">Bank Name:</span> {user.bankDetails.bankName}</p>
            <p><span className="font-semibold">Account Number:</span> {user.bankDetails.accountNumber}</p>
            <p><span className="font-semibold">IFSC Code:</span> {user.bankDetails.ifscCode}</p>
            <p><span className="font-semibold">UPI:</span> {user.bankDetails.upi}</p>
          </div>
        )}
        {/* Check if image URLs exist */}
        {user.imageUrls && (
  <div>
    <h3 className="font-semibold mt-2">Image URLs:</h3>
    {Object.entries(user.imageUrls).map(([key, value]) => (
      <p key={key}>
        <span className="font-semibold">{key}:</span>{" "}
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
          View
        </a>{" "}
        |{" "}
        <a href={value} download className="text-blue-500 underline hover:text-blue-700">
          Download
        </a>
      </p>
    ))}
  </div>
)}


        {/* <p><span className="font-semibold">Time:</span> {user.time.toDate().toString()}</p> */}
        <button onClick={() => handleKYCStatusUpdate(user.id, 'completed')} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600 focus:outline-none focus:bg-green-600">
          Complete KYC
        </button>
        <button onClick={() => handleKYCStatusUpdate(user.id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-red-600 focus:outline-none focus:bg-red-600">
          Reject KYC
        </button>
      </div>
    )}
  </div>
))}

              {userDetails.length === 0 && (
                <p>No pending KYC requests.</p>
              )}
            </div>
          </div>
        )}

{selectedOption === "allusers" && (
  <div>
    <h2 className="text-lg font-semibold mb-4">All Users</h2>
    <div className="flex justify-between mb-4">
      <div>
        <label htmlFor="kycFilter" className="font-semibold mr-2">Filter by KYC Status:</label>
        <select id="kycFilter" onChange={(e) => setKycFilter(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
    
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {filteredUsers.map(user => (
    <div key={user.id} className="bg-gray-100 p-4 rounded-md">
    <p><span className="font-semibold">Name:</span> {user.name}</p>
    <p><span className="font-semibold">Email:</span> {user.email}</p>
    <p><span className="font-semibold">KYC Status:</span> {user.kyc}</p>
    {/* Additional user details... */}

    {/* Trade Upload Section */}
    <div className="mt-4">
        <label className="font-semibold">Trade Upload:</label>
        <div className="flex items-center mt-2">
            <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                id={`file-upload-${user.id}`}
                className="border border-gray-300 rounded-md px-2 py-1 mr-2"
            />
            <div className="flex items-center">
                <input
                    type="radio"
                    id={`daily-trade-${user.id}`}
                    name={`trade-type-${user.id}`}
                    value="daily"
                    defaultChecked
                    className="mr-1"
                />
                <label htmlFor={`daily-trade-${user.id}`} className="mr-4">Daily Trade</label>
                <input
                    type="radio"
                    id={`financial-trade-${user.id}`}
                    name={`trade-type-${user.id}`}
                    value="financial"
                    className="mr-1"
                />
                <label htmlFor={`financial-trade-${user.id}`}>Financial Trade</label>
            </div>
            <button
                onClick={() => handleTraderReportUpload(user.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
                Upload
            </button>
        </div>
    </div>

    {/* Remove User Button */}
    <button
        onClick={() => handleRemoveUser(user.id)}
        className="mt-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
    >
        Remove
    </button>
</div>

      ))}
      {filteredUsers.length === 0 && (
        <p>No users found.</p>
      )}
    </div>
  </div>
)}

{selectedOption === "userdetails" && (
  <div>
  <h2 className="text-lg font-semibold mb-4">User Details</h2>
  <div className="grid grid-cols-1 gap-4">
    {userKYCDetails.map(user => (
      <div key={user.id} className="bg-gray-100 p-4 rounded-md">
        {/* Personal Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
          <p><span className="font-semibold">Name:</span> {user.personalDetails.name}</p>
          <p><span className="font-semibold">Surname:</span> {user.personalDetails.surname}</p>
          <p><span className="font-semibold">Email:</span> {user.personalDetails.email}</p>
          <p><span className="font-semibold">Phone:</span> {user.personalDetails.phone}</p>
          <p><span className="font-semibold">PAN:</span> {user.personalDetails.pan}</p>
          <p><span className="font-semibold">Aadhar:</span> {user.personalDetails.aadhar}</p>
        </div>
        
        {/* Bank Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
          <p><span className="font-semibold">Account Holder Name:</span> {user.bankDetails.accountHolderName}</p>
          <p><span className="font-semibold">Account Number:</span> {user.bankDetails.accountNumber}</p>
          <p><span className="font-semibold">Bank Name:</span> {user.bankDetails.bankName}</p>
          <p><span className="font-semibold">IFSC Code:</span> {user.bankDetails.ifscCode}</p>
          <p><span className="font-semibold">UPI:</span> {user.bankDetails.upi}</p>
        </div>
        
        {/* KYC Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">KYC Status</h3>
          <p><span className="font-semibold">Status:</span> {user.status}</p>
        </div>
        
        {/* Image URLs */}
        {user.imageUrls && Object.entries(user.imageUrls).map(([key, value]) => (
  <div key={key} className="mt-4">
    <h3 className="text-lg font-semibold mb-2">{key}</h3>
    <div className="flex items-center">
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 mr-4">
        View
      </a>
      <a href={value} download className="text-blue-500 underline hover:text-blue-700">
        Download
      </a>
    </div>
  </div>
))}

      </div>
    ))}
    {userKYCDetails.length === 0 && (
      <p>No user details found.</p>
    )}
  </div>
</div>



)}

      </div>
    </div>
  );
};

export default Admin;
