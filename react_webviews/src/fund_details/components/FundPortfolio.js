import React, { memo } from "react";
import AssetAllocation from "./AssetAllocation";
import SectorAllocation from "./SectorAllocation";
import TopHoldings from "./TopHoldings";
import Report from "../common/Report";
import Divider from "@material-ui/core/Divider";
const FundPortfolio = ({ portfolio, navDate }) => {
  return (
    <div>
      <Report title="Asset Allocation">
        <AssetAllocation assetAllocationData={portfolio.asset_allocation} />
      </Report>
      <Divider />
      <Report title="Sector Allocation" subTitle={navDate}>
        <SectorAllocation
          sectorAllocationData={portfolio.sector_allocation}
          navDate={navDate}
        />
      </Report>
      <Divider />
      <Report title="Top Holdings" subTitle={navDate}>
        <TopHoldings
          topHoldingsData={portfolio.top_ten_holdings}
          navDate={navDate}
        />
      </Report>
    </div>
  );
};

export default memo(FundPortfolio);
