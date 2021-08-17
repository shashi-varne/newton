import React, { memo } from 'react';
import AssetAllocation from './AssetAllocation';
import SectorAllocation from './SectorAllocation';
import TopHoldings from './TopHoldings';
import Report from '../common/Report';
import Divider from '@material-ui/core/Divider';
const FundPortfolio = ({ portfolio, navDate }) => {
  const { asset_allocation, sector_allocation, top_ten_holdings } = portfolio;
  return (
    <div>
      {asset_allocation?.length > 0 && (
        <>
          <Report title='Asset Allocation'>
            <AssetAllocation assetAllocationData={asset_allocation} />
          </Report>
          <Divider style={{marginLeft:'10px', marginRight: '10px'}}/>
        </>
      )}
      {sector_allocation?.length > 0 && (
        <>
          <Report title='Sector Allocation' subTitle={navDate}>
            <SectorAllocation sectorAllocationData={sector_allocation} navDate={navDate} />
          </Report>
          <Divider style={{marginLeft:'10px', marginRight: '10px'}}/>
        </>
      )}
      {top_ten_holdings?.length > 0 && (
        <Report title='Top Holdings' subTitle={navDate}>
          <TopHoldings topHoldingsData={top_ten_holdings} navDate={navDate} />
        </Report>
      )}
    </div>
  );
};

export default memo(FundPortfolio);
