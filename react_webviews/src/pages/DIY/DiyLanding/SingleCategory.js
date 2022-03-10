import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import Icon from '../../../designSystem/atoms/Icon';
import Typography from '../../../designSystem/atoms/Typography';
import WrapperBox from '../../../designSystem/atoms/WrapperBox';
import CardHorizontal from '../../../designSystem/molecules/CardHorizontal';
import SectionHeader from './SectionHeader';
import isEmpty from 'lodash/isEmpty';

const SingleCategory = ({ handleCardClick, isPageLoading, data = {} }) => {
  if (!isPageLoading && isEmpty(data)) {
    return null;
  }
  return (
    <Stack direction='column' spacing={2} className='diy-c-tax-saving-wrapper'>
      <SectionHeader isPageLoading={isPageLoading} title={data?.name} dataAid={data?.design_id} />
      {isPageLoading ? (
        <SingleCategorySkeleton />
      ) : (
        <div className="diy-c-card-horz-wrapper">
          {data?.options?.map((el, idx) => {
            return (
              <WrapperBox
                elevation={1}
                sx={{ height: "100%" }}
                onClick={handleCardClick(data.key, el.key, el.name)}
                key={idx}
              >
                <CardHorizontal
                  key={idx}
                  title={el?.name}
                  subtitle={el?.trivia}
                  dataAid={el?.design_id}
                  className="pointer"
                  leftImgSrc={el.image_url}
                  rightImgSrc={el.right_image_url}
                />
              </WrapperBox>
            );
          })}
        </div>
      )}
    </Stack>
  );
};

export default SingleCategory;

const SingleCategorySkeleton = () => {
  return (
    <WrapperBox elevation={1}>
      <Stack sx={{ p: 2 }} justifyContent='space-between' alignItems='center' direction='row'>
        <Stack direction='column' spacing={1}>
          <Typography variant='heading3'>
            <Skeleton width='40px' />
          </Typography>
          <Typography variant='body1'>
            <Skeleton width='140px' />
          </Typography>
        </Stack>
        <Icon size='110px' />
      </Stack>
    </WrapperBox>
  );
};
