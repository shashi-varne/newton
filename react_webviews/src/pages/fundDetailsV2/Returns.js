import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import CustomSwiper from '../../designSystem/molecules/CustomSwiper';
import { inrFormatDecimal, nonRoundingToFixed } from '../../utils/validators';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import Separator from '../../designSystem/atoms/Separator';

const Returns = ({ fundData }) => {
  const [isReturn, setIsReturn] = useState(false);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [swiper, setSwiper] = useState('');

  const handleReturnSection = () => {
    setIsReturn(!isReturn);
  };

  const handleReturnValue = (e, value) => {
    setPillReturnValue(value);
    if (swiper) {
      swiper.slideTo(value);
    }
  };
  const handleSlideChange = (swiperRef) => {
    setPillReturnValue(swiperRef?.activeIndex);
  };

  return (
    <Box sx={{ mt: 4 }} component='section'>
      <CollapsibleSection isOpen={isReturn} onClick={handleReturnSection} label='Returns'>
        <Stack direction='column'>
          <Box>
            <Pills value={pillReturnValue} onChange={handleReturnValue}>
              <Pill label='Return' />
              <Pill label='Rolling return' />
            </Pills>
          </Box>
          <CustomSwiper
            slidesPerView={1}
            slidesPerColumn={1}
            onSlideChange={handleSlideChange}
            onSwiper={setSwiper}
            autoHeight
            hidePagination
          >
            <SwiperSlide>
              <ReturnView returns={fundData?.performance?.returns} />
            </SwiperSlide>
            <SwiperSlide>
              <RollingReturn returns={fundData?.performance?.returns} />
            </SwiperSlide>
          </CustomSwiper>
        </Stack>
      </CollapsibleSection>
    </Box>
  );
};

export default Returns;

const RollingReturn = ({ returns = [] }) => {
  const [investmentYear, setInvestmentYear] = useState(0);

  const minimun = minBy(returns, 'value')?.value;
  const maximum = maxBy(returns, 'value')?.value;
  const average = nonRoundingToFixed(meanBy(returns, 'value'),2);
  const NET_ASSET_VALUE = [
    {
      name: 'Minimum',
      value: minimun,
    },
    {
      name: 'Maximum',
      value: maximum,
    },
    {
      name: 'Average',
      value: average,
    },
  ];
  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack>
        <Typography>Investment period</Typography>
        <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
          <Timelines value={investmentYear} onChange={handleInvestmentYear}>
            <TimeLine label='1Y' />
            <TimeLine label='3Y' />
            <TimeLine label='5Y' />
            <TimeLine label='10Y' />
            <TimeLine label='15Y' />
            <TimeLine label='20Y' />
          </Timelines>
        </Box>
        <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
          <Typography variant='heading4' color='foundationColors.content.secondary'>
            Net asset value
          </Typography>
          {NET_ASSET_VALUE?.map((net_asset, idx) => {
            return (
              <Stack key={idx} direction='column' spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body8' color='foundationColors.content.secondary'>
                    {net_asset?.name}
                  </Typography>
                  <Typography variant='heading4' color='foundationColors.content.secondary'>
                    {net_asset?.value > 0 ? `+ ${net_asset?.value}` : `- ${net_asset?.value}`}%
                  </Typography>
                </Stack>
                <Separator />
              </Stack>
            );
          })}
        </Stack>
        <Box
          sx={{
            height: '300px',
            width: '100%',
            backgroundColor: 'foundationColors.secondary.profitGreen.200',
          }}
        />
      </Stack>
    </Box>
  );
};

const ReturnView = ({ returns = [] }) => {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack direction='column' spacing={3}>
        {returns?.map((returnData, idx) => {
          return (
            <Stack key={idx} direction='row' justifyContent='space-between'>
              <Typography variant='body8' color='foundationColors.content.secondary'>
                Last {returnData?.name}
              </Typography>
              <Typography variant='heading4' color='foundationColors.content.secondary'>
                {returnData?.value}%
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};
