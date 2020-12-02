import React from "react";
import TableData from "../common/TableData";
const TopHoldings = ({ topHoldingsData }) => {
  return (
    <div>
      <TableData data={topHoldingsData} isTopHolding={true} />
    </div>
  );
};

export default TopHoldings;
