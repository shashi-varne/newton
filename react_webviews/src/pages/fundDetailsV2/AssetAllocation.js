import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getFundData } from 'businesslogic//dataStore/reducers/fundDetails';
import Button from '../../designSystem/atoms/Button';
import Separator from '../../designSystem/atoms/Separator';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import isEmpty from 'lodash/isEmpty';
import { isValidValue } from './helperFunctions';

const AssetColors = {
  Equity: 'foundationColors.secondary.profitGreen.400',
  Debt: 'foundationColors.secondary.mango.400',
  Others: 'foundationColors.secondary.coralOrange.400',
};

const AssetAllocation = ({fundDetailsRef, sendEvents}) => {
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [viewMoreHolding, setViewMoreHolding] = useState(3);
  const [viewMoreSector, setViewMoreSector] = useState(3);
  const fundData = useSelector(getFundData);
  const isTopHoldingsAvailable = isEmpty(fundData?.portfolio?.top_ten_holdings);
  const isSectorsAvailable = isEmpty(fundData?.portfolio?.sector_allocation);
  const handleAssetSection = () => {
    setIsAssetOpen(!isAssetOpen);
  };

  const handleMoreHolding = () => {
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      asset_allocation: 'view holdings'
    }
    sendEvents('back');
    setViewMoreHolding((prevProp) => prevProp + 10);
  };

  const handleMoreSector = () => {
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      asset_allocation: 'view sectors'
    }
    sendEvents('back');
    setViewMoreSector((prevProp) => prevProp + 10);
  };

  return (
    <Box sx={{ mt: 4 }} component='section' className='fund-details-asset-section'>
      <CollapsibleSection
        isOpen={isAssetOpen}
        onClick={handleAssetSection}
        label='Asset allocation'
        dataAid="assetAllocation"
      >
        <Stack>
          <Stack direction='row' spacing='40px'>
            {fundData?.portfolio?.asset_allocation?.map((assetData, idx) => {
              return (
                <Stack sx={{ ml: '-3px', mr: '-3px' }} key={idx} direction='column' spacing='4px'>
                  <Stack data-aid={`tv_${assetData?.name?.toLowerCase()}`} direction='column'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {assetData?.name}
                    </Typography>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {isValidValue(assetData?.value, `${assetData?.value}%`)}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: `${assetData?.value || 0}%`,
                      backgroundColor: AssetColors[assetData?.name],
                    }}
                    className='fund-asset-perc'
                    data-aid={`iv_${assetData?.name?.toLowerCase()}`}
                  />
                </Stack>
              );
            })}
          </Stack>
          {!isTopHoldingsAvailable && (
            <>
              <Separator marginTop='16px' dataAid="2" />
              <Stack sx={{ pt: 3 }} spacing={2}>
                <Typography dataAid="topHolding" variant='heading4'>Top holdings</Typography>
                {fundData?.portfolio?.top_ten_holdings
                  ?.slice(0, viewMoreHolding)
                  .map((holding, idx) => {
                    return (
                      <Stack key={idx} direction='row' justifyContent='space-between'>
                        <Typography dataAid={getAssestAllocationDataAid(holding?.name, "Key")} variant='body8' color='foundationColors.content.secondary'>
                          {holding?.name}
                        </Typography>
                        <Typography dataAid={getAssestAllocationDataAid(holding?.name, "Value")} variant='heading4' color='foundationColors.content.secondary'>
                          {holding?.weighting}%
                        </Typography>
                      </Stack>
                    );
                  })}
                {fundData?.portfolio?.top_ten_holdings?.length > viewMoreHolding && (
                  <Button dataAid="viewAllHoldings" title='View all holdings' variant='link' onClick={handleMoreHolding} />
                )}
              </Stack>
            </>
          )}
          {!isSectorsAvailable && (
            <>
              <Separator marginTop='16px' dataAid="3" />

              <Stack sx={{ pt: 3, pb: 2 }} spacing={2}>
                <Typography variant='heading4'>Top sectors</Typography>
                {fundData?.portfolio?.sector_allocation
                  ?.slice(0, viewMoreSector)
                  .map((sector, idx) => {
                    return (
                      <Stack key={idx} direction='row' justifyContent='space-between'>
                        <Typography dataAid={getAssestAllocationDataAid(sector?.name, "Key")} variant='body8' color='foundationColors.content.secondary'>
                          {sector?.name}
                        </Typography>
                        <Typography dataAid={getAssestAllocationDataAid(sector?.name, "Value")} variant='heading4' color='foundationColors.content.secondary'>
                          {sector?.value}%
                        </Typography>
                      </Stack>
                    );
                  })}
                {fundData?.portfolio?.sector_allocation.length > viewMoreSector && (
                  <Button dataAid="viewAllSectors" title='View all sectors' variant='link' onClick={handleMoreSector} />
                )}
              </Stack>
            </>
          )}
        </Stack>
      </CollapsibleSection>
    </Box>
  );
};

export default AssetAllocation;

const getAssestAllocationDataAid = (name, key) => {
  let [firstName] = name.split(" ");
  firstName = firstName?.toLowerCase() || "";
  return `${firstName}${key}`;
}