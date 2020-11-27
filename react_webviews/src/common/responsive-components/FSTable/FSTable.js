import React, { useEffect, useState } from 'react';
import { isFunction } from "lodash";
/* Use 'headersMap' prop to send a list of column header - data property mapping 
  Structure is as follows:

  [{
    label: // Text to show as column header for table
    accessor: // Name of property to access within 'data' for this column
  }]

*/
const FSTable = ({
  headersMap = [],
  data = [],
  errorMsg = '',
  className = '',
  style = {},
}) => {
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setColumnHeaders(headersMap || []);
    setTableData(data || []);
  }, [headersMap, data]);

  if (!tableData.length) {
    return (
      <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.5)' }}>
        {errorMsg || 'No data to display'}
      </div>
    );
  }

  return (
    <table className={`fisdom-table ${className}`} style={style || {}}>
      <thead>
        <tr>
          {columnHeaders.map(col => (
            <td key={col.label}>{col.label}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, idx) => (
          <tr key={idx}>
            {columnHeaders.map(({ accessor, formatter }) => (
              <td key={accessor}>
                {isFunction(formatter) ? formatter(row[accessor]) : row[accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FSTable;