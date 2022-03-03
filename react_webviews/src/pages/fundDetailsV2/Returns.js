import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import CustomSwiper from '../../designSystem/molecules/CustomSwiper';
import { useSelector } from 'react-redux';
import { getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import isEmpty from 'lodash/isEmpty';
import { isValidValue } from './helperFunctions';
import RollingReturn from './RollingReturn';

const secondaryColor = 'foundationColors.content.secondary';

const Returns = () => {
  const [isReturn, setIsReturn] = useState(false);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [swiper, setSwiper] = useState('');
  const fundData = useSelector(getFundData);
  const isReturnAvailable = isEmpty(fundData?.performance?.returns);

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
      <CollapsibleSection
        disabled={isReturnAvailable}
        isOpen={isReturn}
        onClick={handleReturnSection}
        label={`Returns ${isReturnAvailable ? '(N/A)' : ''}`}
      >
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
              <RollingReturn />
            </SwiperSlide>
          </CustomSwiper>
        </Stack>
      </CollapsibleSection>
    </Box>
  );
};

export default Returns;

const ReturnView = ({ returns = [] }) => {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack direction='column' spacing={3}>
        {returns?.map((returnData, idx) => {
          return (
            <Stack key={idx} direction='row' justifyContent='space-between'>
              <Typography variant='body8' color={secondaryColor}>
                Last {returnData?.name}
              </Typography>
              <Typography variant='heading4' color={secondaryColor}>
                {isValidValue(returnData?.value, `${returnData?.value}%`)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};
