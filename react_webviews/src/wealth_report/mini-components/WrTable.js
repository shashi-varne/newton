import React, { useEffect, useState } from "react";
/* Use 'headersMap' prop to send a list of column header - data property mapping 
  Structure is as follows:

  [{
    label: // Text to show as column header for table
    accessor: // Name of property to access within 'data' for this column
  }]

*/
const WrTable = (props) => {
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const { headersMap, data } = props;
    setColumnHeaders(headersMap || []);
    setTableData(data || []);
  }, [props]);

  return (
    <table className={`wr-table ${props.classes}`} style={props.style || {}}>
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
              {columnHeaders.map(({ accessor }) => (
                <td key={accessor}>{row[accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default WrTable;