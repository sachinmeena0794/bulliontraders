import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <div className="container mx-auto">
        <p>&copy; {currentYear} Bullion Trader. All Rights Reserved. Designed By <a href='https://www.skillsuup.com/' className="text-blue-300">Skills Up</a></p>
      </div>
    </footer>
  );
};

export default Footer;
