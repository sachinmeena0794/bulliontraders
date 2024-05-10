// TableDataContext.js
import React, { createContext, useState } from 'react';

const TableDataContext = createContext();
const initialTableData = [];

export const TableDataProvider = ({ children }) => {
  const [tableData, setTableData] = useState(initialTableData);

  return (
    <TableDataContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableDataContext.Provider>
  );
};

export default TableDataContext;
