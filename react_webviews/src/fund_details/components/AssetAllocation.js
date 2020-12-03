import React from 'react';
import orderBy from 'lodash/orderBy';
const RenderData = ({ name, value }) => {
  let color = '';
  if (name === 'Equity') {
    color = '#FF7675';
  } else if (name === 'Debt') {
    color = '#74B9FF';
  } else {
    color = '#55EFC4';
  }
  return (
    <div className='fd-asset-item'>
      <div className='asset-box' style={{ backgroundColor: color }} />
      <span className='asset-name'>{name}:</span>
      <span className='asset-value' style={{ color, marginLeft: '6px' }}>
        {value}%
      </span>
    </div>
  );
};
const AssetAllocation = ({ assetAllocationData }) => {
  assetAllocationData = orderBy(assetAllocationData, ['value']).reverse();
  return (
    <div className='fd-asset-container'>
      {assetAllocationData.map((asset) => (
        <RenderData key={asset.name} name={asset.name} value={asset.value} />
      ))}
    </div>
  );
};

export default AssetAllocation;
