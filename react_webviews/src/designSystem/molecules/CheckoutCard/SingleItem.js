import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Icon from '../../atoms/Icon';
import Typography from '../../atoms/Typography';
import { BottomSection, FooterSection } from './CommonComponent';

const SingleItem = ({
  leftImgSrc,
  leftImgProps = {},
  title,
  titleColor,
  bottomSectionData = [],
  footerSectionData = {},
  showSeparator = true,
}) => {
  return (
    <div>
      {title && (
        <div className='checkout-card-single-top-wrapper'>
          {leftImgSrc && (
            <Icon
              size='32px'
              src={leftImgSrc}
              className='cc-single-top-image'
              dataAid='left'
              {...leftImgProps}
            />
          )}
          <Typography variant='body2' component='div' color={titleColor} dataAid='title'>
            {title}
          </Typography>
        </div>
      )}
      <BottomSection
        bottomSectionData={bottomSectionData}
        isSingleVariant
        showSeparator={showSeparator}
      />
      <FooterSection footerSectionData={footerSectionData} />
    </div>
  );
};

export default SingleItem;
