import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import SingleItem from './SingleItem';
import MultipleItemCard from './MultipleItemCard';

import './CheckoutCard.scss';

const CheckoutCard = ({
  sx,
  variant,
  title,
  titleColor,
  leftImgSrc,
  leftImgProps,
  rightImgSrc,
  rightImgProps,
  topSectionData,
  bottomSectionData,
  footerSectionData,
  toggleTopSection,
  toggleBottomSection,
  handleIconClick,
  showSeparator,
}) => {
  const isSingleVariant = variant === 'single';
  const isMultipleVariant = variant === 'multiple';
  const topSectionDataLength = topSectionData?.length;
  const bottomSectionDataLength = bottomSectionData?.length;
  footerSectionData.dataIndex = isSingleVariant
    ? topSectionDataLength + 1
    : topSectionDataLength + bottomSectionDataLength + 1;
  return (
    <Box
      sx={{ backgroundColor: 'foundationColors.supporting.white', ...sx }}
      className='checkout-card-wrapper'
    >
      {isSingleVariant && (
        <SingleItem
          leftImgSrc={leftImgSrc}
          leftImgProps={leftImgProps}
          title={title}
          titleColor={titleColor}
          bottomSectionData={bottomSectionData}
          footerSectionData={footerSectionData}
          showSeparator={showSeparator}
        />
      )}
      {isMultipleVariant && (
        <MultipleItemCard
          rightImgSrc={rightImgSrc}
          rightImgProps={rightImgProps}
          title={title}
          titleColor={titleColor}
          topSectionData={topSectionData}
          bottomSectionData={bottomSectionData}
          footerSectionData={footerSectionData}
          toggleTopSection={toggleTopSection}
          toggleBottomSection={toggleBottomSection}
          handleIconClick={handleIconClick}
          showSeparator={showSeparator}
        />
      )}
    </Box>
  );
};

CheckoutCard.defaultProps = {
  sx: {},
  variant: 'single',
  leftImgProps: {},
  rightImgProps: {},
  topSectionData: [],
  bottomSectionData: [],
  footerSectionData: {},
  toggleTopSection: false,
  toggleBottomSection: false,
  showSeparator: true,
};

CheckoutCard.propTypes = {
  sx: PropTypes.object,
  variant: PropTypes.oneOf(['single', 'multiple']),
  title: PropTypes.node,
  titleColor: PropTypes.string,
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  topSectionData: PropTypes.arrayOf(
    PropTypes.exact({
      leftTitle: PropTypes.node,
      leftTitleColor: PropTypes.string,
      rightTitle: PropTypes.node,
      rightTitleColor: PropTypes.string,
    })
  ),
  bottomSectionData: PropTypes.arrayOf(
    PropTypes.exact({
      leftTitle: PropTypes.node,
      leftTitleColor: PropTypes.string,
      rightTitle: PropTypes.node,
      rightTitleColor: PropTypes.string,
    })
  ),
  footerSectionData: PropTypes.exact({
    leftTitle: PropTypes.node,
    leftTitleColor: PropTypes.string,
    rightTitle: PropTypes.node,
    rightTitleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    dataIndex: PropTypes.number,
  }),
  toggleTopSection: PropTypes.bool,
  toggleBottomSection: PropTypes.bool,
  handleIconClick: PropTypes.func,
};

export default CheckoutCard;
