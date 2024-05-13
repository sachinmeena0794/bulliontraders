import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs ,query,where} from 'firebase/firestore';
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

                const filteredData = tradeReportsData.filter(item => {
                    const userInfo1 = JSON.parse(localStorage.getItem('user'));
                    return userInfo1.id === item.userId;
                  });

                setTradeReports(filteredData);
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
                    {currentReports && currentReports.length === 0 ? (
                        <div className="flex justify-center items-center h-[100vh]">
                            <p className="text-center">No records available.</p>
                        </div>
                    ) : (
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
                    )}
                </div>
            )}
        </div>
    );
    
    
    
}

export default TradeReport;
