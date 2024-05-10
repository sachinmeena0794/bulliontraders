import React from 'react';

function Contact() {
  return (
    <div className="container mx-auto mt-10 px-4 mt-28">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-semibold text-blue-500 mt-24">Contact Us</h1>
      <div className="bg-blue-200 rounded-lg px-4 py-2 mt-4">
        <p className="text-lg text-blue-800">Get in touch with us for any queries or assistance.</p>
      </div>
    </div>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2"><span className="font-semibold">Address:</span> Shanthala Nagar, Sampangi Rama Nagar, Bangalore Urban, Bengaluru, Karnataka 560001</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> info@bulliontradersfirm.com</p>
        <p className="mb-2"><span className="font-semibold">Customer Support:</span> info@bulliontradersfirm.com</p>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Service Hours</h2>
        <p>Our customer support team is available 24 hours a day, 7 days a week to assist you with any inquiries or concerns.</p>
      </div>
    </div>
  
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-blue-200 border border-blue-400 rounded-lg p-6 transition duration-300 hover:bg-blue-300 hover:border-blue-500 transform hover:-translate-y-1">
        <h2 className="text-2xl font-semibold mb-4">Cautionary Message</h2>
        <p className="mb-2"><span className="font-semibold">Sharing of trading credentials:</span> Keep your password/PIN and OTPs private & confidential to avoid any misuse or unauthorized trades. Please ensure that you do not share it with anyone.</p>
        <p className="mb-2"><span className="font-semibold">Trading in leveraged products:</span> Like options without proper understanding could lead to losses.</p>
      </div>
      <div className="bg-green-200 border border-green-400 rounded-lg p-6 transition duration-300 hover:bg-green-300 hover:border-green-500 transform hover:-translate-y-1">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p className="mb-2"><span className="font-semibold">Investments in the securities market:</span> Are subject to market risks, read all the related documents carefully before investing.</p>
        <p className="mb-2"><span className="font-semibold">Brokerage:</span> Will not exceed the SEBI prescribed limit.</p>
      </div>
    </div>
  
    <div className="bg-green-200 border border-blue-400 mt-8 mb-4 rounded-lg p-6 transition duration-300 hover:bg-green-300 hover:border-green-500 transform hover:-translate-y-1">
      <h2 className="text-2xl font-semibold mb-4 text-center">Membership Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        <p className="text-gray-500 mb-2"><span className="font-semibold">NSE Membership Number:</span> 7539</p>
        <p className="text-gray-500 mb-2"><span className="font-semibold">BSE Membership Number:</span> 28605</p>
        <p className="text-gray-500 mb-2"><span className="font-semibold">MCX Membership Number:</span> 40291</p>
        <p className="text-gray-500 mb-2"><span className="font-semibold">MSEI Membership Number:</span> 82367</p>
        <p className="text-gray-500 mb-2"><span className="font-semibold">NCDEX Membership Number:</span> 5402</p>
        <p className="text-gray-500 mb-2"><span className="font-semibold">SEBI Reg No.:</span> INZ000047612</p>
      </div>
    </div>
  </div>
  
  );
}

export default Contact;
