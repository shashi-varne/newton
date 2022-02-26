import { Box, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import BarMeter from '../../designSystem/atoms/BarMeter';
import Separator from '../../designSystem/atoms/Separator';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';
import { isEmpty } from '../../utils/validators';

const barData = [
  {
    name: 'Low',
    value: 1,
  },
  {
    name: 'Below Average',
    value: 2,
  },
  {
    name: 'Medium',
    value: 3,
  },
  {
    name: 'Above Average',
    value: 4,
  },
  {
    name: 'High',
    value: 5,
  },
];

const TOOLTIP_MEASURES = {
  Alpha: 'Excess return generated over the benchmark',
  Beta: 'Degree of sensitivity to benchmark',
  squared: 'The deviation of the performance from the average over a period',
};

const getBarIndex = (riskValue) => {
  if (!riskValue) return -1;
  const riskIndex = barData?.findIndex((el) => el.name.toLowerCase() === riskValue.toLowerCase());
  return riskIndex;
};

const RiskDetails = () => {
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState({
    Alpha: false,
    Beta: false,
    squared: false,
  });
  const fundData = useSelector(getFundData);
  const isRiskVsCatAvailable = isEmpty(fundData?.risk?.risk_vs_category);
  const isReturnVsCatAvailable = isEmpty(fundData?.risk?.return_vs_category);
  const isRiskMeasureAvailable = isEmpty(fundData?.risk?.risk_measures);
  const isRiskDetailsAvailable =
    isRiskVsCatAvailable && isReturnVsCatAvailable && isRiskMeasureAvailable;
  const { riskVsCategoryActiveIndex, returnVsCategoryActiveIndex } = useMemo(() => {
    return {
      riskVsCategoryActiveIndex: getBarIndex(fundData?.risk?.risk_vs_category),
      returnVsCategoryActiveIndex: getBarIndex(fundData?.risk?.return_vs_category),
    };
  }, [fundData?.risk?.risk_vs_category, fundData?.risk?.return_vs_category]);
  const handleRiskAction = () => {
    setIsRiskOpen(!isRiskOpen);
  };

  const handleTooltip = (riskMeasureName) => () => {
    setIsTooltipOpen({ ...isTooltipOpen, [riskMeasureName]: !isTooltipOpen[riskMeasureName] });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection
        disabled={isRiskDetailsAvailable}
        label={`Risk details ${isRiskDetailsAvailable && '(N/A)'}`}
        isOpen={isRiskOpen}
        onClick={handleRiskAction}
      >
        <Box>
          <Stack direction='column' spacing={3}>
            {!isEmpty(fundData?.risk?.risk_vs_category) && (
              <Stack direction='column' spacing={3}>
                <Typography variant='heading4'>Risk vs Category</Typography>
                <BarMeter barMeterData={barData} activeIndex={riskVsCategoryActiveIndex} />
              </Stack>
            )}
            {!isEmpty(fundData?.risk?.return_vs_category) && (
              <Stack direction='column' spacing={3}>
                <Typography variant='heading4'>Return vs Category</Typography>
                <BarMeter barMeterData={barData} activeIndex={returnVsCategoryActiveIndex} />
              </Stack>
            )}
          </Stack>

          <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
            <Typography variant='heading4'>Risk measures</Typography>
            {fundData?.risk?.risk_measures?.map((riskMeasure, idx) => {
              let tooltipInfo = '';
              let riskMeasureName = '';
              if (!riskMeasure?.name.match(/Alpha|Beta|squared/i)) return;
              if (riskMeasure?.name.match(/Alpha/)) {
                tooltipInfo = TOOLTIP_MEASURES['Alpha'];
                riskMeasureName = 'Alpha';
              } else if (riskMeasure?.name.match(/Beta/)) {
                tooltipInfo = TOOLTIP_MEASURES['Beta'];
                riskMeasureName = 'Beta';
              } else if (riskMeasure?.name.match(/squared/)) {
                tooltipInfo = TOOLTIP_MEASURES['squared'];
                riskMeasureName = 'squared';
              }

              return (
                <Stack key={idx} direction='column' spacing={2}>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {riskMeasure?.name}
                    </Typography>
                    <Stack
                      direction='row'
                      spacing='6px'
                      justifyContent='flex-start'
                      alignItems='center'
                    >
                      <Typography variant='heading4' color='foundationColors.content.secondary'>
                        + {riskMeasure?.value}%
                      </Typography>
                      <div>
                        <Tooltip open={isTooltipOpen[riskMeasureName]} title={tooltipInfo}>
                          <Stack width='16px' height='16px'>
                            <Icon
                              src={require('assets/info_icon_ds.svg')}
                              size='16px'
                              className='ec_info_icon'
                              alt='info_icon'
                              dataAid='right'
                              onClick={handleTooltip(riskMeasureName)}
                            />
                          </Stack>
                        </Tooltip>
                      </div>
                    </Stack>
                  </Stack>
                  {idx < 2 && <Separator />}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </CollapsibleSection>
    </Box>
  );
};

export default RiskDetails;
