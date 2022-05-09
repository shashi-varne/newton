import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import CustomSwiper from '../../designSystem/molecules/CustomSwiper';
import { useSelector } from 'react-redux';
import { getFundData, getRollingReturnData } from 'businesslogic/dataStore/reducers/fundDetails';
import isEmpty from 'lodash/isEmpty';
import { isValidValue } from './helperFunctions';
import RollingReturn from './RollingReturn';

const secondaryColor = 'foundationColors.content.secondary';

const minRollingYear = 3; // number is in month

const Returns = ({fundDetailsRef, sendEvents, isDataLoading}) => {
  const [isReturn, setIsReturn] = useState(false);
  const [pillReturnValue, setPillReturnValue] = useState(0);
  const [swiper, setSwiper] = useState('');
  const fundData = useSelector(getFundData);
  const isReturnAvailable = isEmpty(fundData?.performance?.returns);
  const rollingReturnData = useSelector(getRollingReturnData);
  const avoidFirstRender = useRef(null);
  const RETURN_TYPES = useMemo(() => {
    let returnTypes = [{ label: 'Return', dataAid: "return" }];
    if (rollingReturnData[minRollingYear]) {
      returnTypes.push({ label: 'Rolling return', dataAid: "rollingReturn" });
    }
    return returnTypes;
  }, [rollingReturnData, isDataLoading]);

  useEffect(() => {
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      returns: pillReturnValue === 0 ? 'return' : 'rolling return'
    }
    if(avoidFirstRender.current){
      sendEvents('back');
    }
    avoidFirstRender.current = true;
  },[pillReturnValue]);

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
        disabled={isReturnAvailable || isDataLoading}
        isOpen={isReturn}
        onClick={handleReturnSection}
        label={`Returns ${isReturnAvailable ? '(NA)' : ''}`}
        dataAid="returns"
      >
        <Stack direction='column'>
          <Box>
            <Pills value={pillReturnValue} onChange={handleReturnValue}>
              {RETURN_TYPES?.map((el, idx) => {
                return <Pill key={idx} {...el} />;
              })}
            </Pills>
          </Box>
          <CustomSwiper
            slidesPerView={1}
            slidesPerColumn={1}
            onSlideChange={handleSlideChange}
            onSwiper={setSwiper}
            autoHeight
            hidePagination
            noSwiping
            noSwipingClass='swiper-slide'
          >
            <SwiperSlide>
              <ReturnView returns={fundData?.performance?.returns} />
            </SwiperSlide>
            <SwiperSlide>
              <RollingReturn fundDetailsRef={fundDetailsRef} sendEvents={sendEvents}/>
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
    <Box sx={{ mt: 3, mb: 3 }} data-aid="grp_timePeriod">
      <Stack direction='column' spacing={3}>
        {returns?.map((returnData, idx) => {
          return (
            <Stack key={idx} direction='row' justifyContent='space-between'>
              <Typography dataAid={getReturnsDataAid(returnData?.name, "Key")} variant='body8' color={secondaryColor}>
                Last {returnData?.name}
              </Typography>
              <Typography dataAid={getReturnsDataAid(returnData?.name, "Value")} variant='heading4' color={secondaryColor}>
                {isValidValue(returnData?.value, `${returnData?.value > 0 ? '+': ''}${returnData?.value}%`)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

const getReturnsDataAid = (name, key) => {
  name = name.split(" ").join("");
  name = name?.toLowerCase() || "";
  return `${name}${key}`;
}