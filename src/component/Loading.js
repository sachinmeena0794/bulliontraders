import React from 'react';



const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      <div className="z-10 text-center text-white">
        <h2 className="text-xl font-bold">Bulliontradersfirm</h2>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
