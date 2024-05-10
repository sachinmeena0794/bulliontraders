import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Loading from '../component/Loading';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function TradeReport() {
    const [tradeReports, setTradeReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage, setReportsPerPage] = useState(5);
    const [filterType, setFilterType] = useState('');
    const [sortBy, setSortBy] = useState('fileName');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchTradeReports = async () => {
            try {
                const db = getFirestore();
                const tradeReportsCollection = collection(db, 'traderReports');
                const querySnapshot = await getDocs(tradeReportsCollection);

                const tradeReportsData = [];
                querySnapshot.forEach(doc => {
                    const reportData = doc.data();
                    tradeReportsData.push(reportData);
                });

                setTradeReports(tradeReportsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trade reports:', error);
            }
        };

        fetchTradeReports();
    }, []);

    // Filter trade reports based on selected type
    const filteredReports = filterType ? tradeReports.filter(report => report.type === filterType) : tradeReports;

    // Sort trade reports based on selected column and order
    const sortedReports = filteredReports.sort((a, b) => {
        const compareValue = a[sortBy].localeCompare(b[sortBy]);
        return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Get current reports for pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = sortedReports.slice(indexOfFirstReport, indexOfLastReport);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle change in records per page
    const handleRecordsPerPageChange = (e) => {
        setReportsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing records per page
    };

    return (
        <div className='container mx-auto mt-8'>
            {loading ? <Loading /> : (
                <div className="text-center">
                    {/* Display trade view for the logged-in user */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => {setSortBy('fileName'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}}>File Name {sortBy === 'fileName' && (sortOrder === 'asc' ? '🔼' : '🔽')}</th>
                                    <th className="border border-gray-300 px-4 py-2">Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReports.map((report, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="border border-gray-300 px-4 py-2">{report.fileName}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline" title="Click to download">
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination and records per page */}
                    <div className="flex justify-center items-center mt-4">
                        <div className="mr-4">
                            <label htmlFor="recordsPerPage" className="block text-sm font-medium text-gray-700 mb-1">Records per page:</label>
                            <select id="recordsPerPage" value={reportsPerPage} onChange={handleRecordsPerPageChange} className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <div className="flex">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="mr-2" title="Previous"><FiChevronLeft /></button>
                            <div>Page {currentPage}</div>
                            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastReport >= sortedReports.length} className="ml-2" title="Next"><FiChevronRight /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TradeReport;
