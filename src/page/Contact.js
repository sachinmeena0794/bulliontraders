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
  
{/* Review */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 ">

  <div className="bg-yellow-200 border border-yellow-400 rounded-lg p-6 transition duration-300 hover:bg-yellow-300 hover:border-yellow-500 transform hover:-translate-y-1">
    <h2 className="text-2xl font-semibold mb-4">Our Users Review </h2>
    <img className="w-16 h-16 rounded-full mb-4" src="https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg" alt="User" />
    <p className="mb-2">"I am doing trading in equity all segment and also in commodity. I am taking services from bullion Traders firm. there is a person who assigned me really he provide me proper follow-up during the market."</p>
    <p className="mb-2 font-semibold">- Amit Dubey</p>
  </div>
  <div className="bg-purple-200 border border-purple-400 rounded-lg p-6 transition duration-300 hover:bg-purple-300 hover:border-purple-500 transform hover:-translate-y-1">
    <h2 className="text-2xl font-semibold mb-4">Our Users Review</h2>
    <img className="w-16 h-16 rounded-full mb-4" src="https://www.shutterstock.com/image-photo/headshot-portrait-smiling-young-indian-260nw-2029044050.jpg/" alt="User" />
    <p className="mb-2">"Excellent company when it comes to research and follow-up, commitments they made at the time of subscription have fulfilled by their side. Thanks for being my financial advisory."</p>
    <p className="mb-2 font-semibold">- Priya jain</p>
  </div>

  <div className="bg-yellow-200 border border-yellow-400 rounded-lg p-6 transition duration-300 hover:bg-yellow-300 hover:border-yellow-500 transform hover:-translate-y-1">
    <h2 className="text-2xl font-semibold mb-4">Our Users Review </h2>
    <img className="w-16 h-16 rounded-full mb-4" src="https://www.shutterstock.com/image-photo/handsome-indian-man-looking-camera-260nw-1775164592.jpg"alt="User" />
    <p className="mb-2">"I have been using stock future service from last two year with shield research. i would say that i gained my capital in this two years. overall I am happy. thank you Alpha Traders Equites. you have good analyst team."</p>
    <p className="mb-2 font-semibold">- Deepak Patel</p>
  </div>
  <div className="bg-purple-200 border border-purple-400 rounded-lg p-6 transition duration-300 hover:bg-purple-300 hover:border-purple-500 transform hover:-translate-y-1">
    <h2 className="text-2xl font-semibold mb-4">Our Users Review</h2>
    <img className="w-16 h-16 rounded-full mb-4" src="data:image/jpeg;base64,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" alt="User" />
    <p className="mb-2">"Excellent company when it comes to research and follow-up,Thanks for being my financial advisory."</p>
    <p className="mb-2 font-semibold">- Arun singh</p>
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
