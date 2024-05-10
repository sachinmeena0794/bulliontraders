import React, { useState, useEffect } from 'react';
import Layout from '../component/Layout';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FiChevronLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi';

const TransferHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    // Get logged-in user ID from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser && loggedInUser.uid) {
      setLoggedInUserId(loggedInUser.uid);
    }
  }, []);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const db = getFirestore();
        const paymentHistoryCollection = collection(db, 'payment-history');
        const querySnapshot = await getDocs(paymentHistoryCollection);
        const historyData = querySnapshot.docs.map(doc => doc.data());
        setPaymentHistory(historyData);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    // Filter payment history based on logged-in user ID
    if (loggedInUserId) {
      const filtered = paymentHistory.filter(item => {
        const userInfo = JSON.parse(item.userInfo);
        return userInfo.uid === loggedInUserId;
      });
      setFilteredHistory(filtered);
    }
  }, [paymentHistory, loggedInUserId]);

  // Sorting logic
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] < b[sortBy] ? -1 : 1;
    } else {
      return a[sortBy] > b[sortBy] ? -1 : 1;
    }
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedHistory.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
  
      <div className='flex text-center justify-center'>
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4 text-center mt-16'>Transfer History</h2>
          <div className='overflow-x-auto'>
            <table className='w-full table-auto border-collapse border border-gray-300'>
              <thead>
                <tr className='bg-gray-200'>
                  <SortableHeader
                    field='fullName'
                    label='Full Name'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                  <SortableHeader
                    field='amount'
                    label='Amount'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                  <SortableHeader
                    field='paymentMode'
                    label='Payment Mode'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                  <SortableHeader
                    field='status'
                    label='Status'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                  <SortableHeader
                    field='transactionId'
                    label='Transaction ID'
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                  />
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className='border border-gray-300 px-4 py-2'>{item.fullName}</td>
                    <td className='border border-gray-300 px-4 py-2'>{item.amount}</td>
                    <td className='border border-gray-300 px-4 py-2'>{item.paymentMode}</td>
                    <td className='border border-gray-300 px-4 py-2'>{item.status}</td>
                    <td className='border border-gray-300 px-4 py-2'>{item.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className='flex justify-center mt-4'>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='mr-2'>
              <FiChevronLeft/>
            </button>
            <span>{`Page ${currentPage}`}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastRecord >= filteredHistory.length} className='ml-2'>
    <FiChevronRight/>
            </button>
          </div>
          {/* Records per page */}
          <div className='flex justify-center mt-2'>
            <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(parseInt(e.target.value))} className='mt-1 block w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2'>
              <option value={5}>5 records per page</option>
              <option value={10}>10 records per page</option>
              <option value={15}>15 records per page</option>
            </select>
          </div>
        </div>
      </div>

  );
};

const SortableHeader = ({ field, label, sortBy, sortOrder, setSortBy, setSortOrder }) => {
  const handleSortChange = () => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <th className='border border-gray-300 px-4 py-2 cursor-pointer' onClick={handleSortChange}>
      {label} 
      {sortBy === field && (
        <span>
          {sortOrder === 'asc' ? '⬆️' : '⬇️'}
        </span>
      )}
      {sortBy !== field && ( // Add this condition to display the sorting icon for the initial loading
        <span>
          {'⬆️'} {/* Display asc icon by default */}
        </span>
      )}
    </th>
  );
};


export default TransferHistory;
