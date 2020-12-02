import React from 'react';
import orderBy from 'lodash/orderBy';

import TableData from '../common/TableData';
import { colors } from '../constants';
const SectorAllocation = ({ sectorAllocationData }) => {
  if (sectorAllocationData.length > 0) {
    Object.keys(colors).forEach((key, idx) => {
      if (idx < sectorAllocationData.length) {
        sectorAllocationData[idx].color = colors[key];
      }
    });
  }
  sectorAllocationData = orderBy(sectorAllocationData, ['value']).reverse();

  return (
    <TableData data={sectorAllocationData} isSector={true} tableClassName='table-sector-padding' />
  );
};

export default SectorAllocation;
