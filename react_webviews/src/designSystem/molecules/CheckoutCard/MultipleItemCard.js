import React, { useState } from 'react';
import isFunction from 'lodash/isFunction';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import { Collapse } from '@mui/material';
import { BottomSection, FooterSection, Row } from './CommonComponent';

const MultipleItemCard = ({
  title,
  titleColor,
  rightImgSrc,
  rightImgProps,
  topSectionData = [],
  bottomSectionData = [],
  footerSectionData = {},
  toggleTopSection = false,
  toggleBottomSection = false,
  handleIconClick,
  showSeparator = true,
}) => {
  const [showTopSection, setShowTopSection] = useState(true);
  const [showBottomSection, setShowBottomSection] = useState(true);
  const isIconClickable = toggleTopSection || toggleBottomSection || isFunction(handleIconClick);
  const onIconClick = (e) => {
    if (isFunction(handleIconClick)) {
      handleIconClick(e);
    } else if (toggleTopSection) {
      setShowTopSection(!showTopSection);
    } else if (toggleBottomSection) {
      setShowBottomSection(!showBottomSection);
    }
  };
  return (
    <div className='checkout-card-multi-item-wrapper'>
      {title && (
        <div className='cc-multi-header-wrapper'>
          <Typography variant='body1' color={titleColor} component='div' dataAid='title'>
            {title}
          </Typography>
          {rightImgSrc && (
            <Imgc
              src={rightImgSrc}
              className={`cc-multi-top-image ${isIconClickable && 'cc-clickable-img'}`}
              dataAid='right'
              onClick={onIconClick}
              {...rightImgProps}
            />
          )}
        </div>
      )}
      <Collapse in={showTopSection}>
        <div className='checkout-card-top-section-wrapper'>
          {topSectionData?.map((data, idx) => {
            const { leftTitle, leftTitleColor, rightTitle, rightTitleColor } = data;
            const dataIndex = topSectionData?.length > 0 ? idx + 1 : '';
            const defaultColor = 'foundationColors.content.secondary';
            data.dataIndex = dataIndex;
            return (
              <Row
                key={idx}
                leftTitle={leftTitle}
                leftTitleColor={leftTitleColor || defaultColor}
                leftTitleVariant='body2'
                rightTitle={rightTitle}
                rightTitleVariant='body2'
                rightTitleColor={rightTitleColor || defaultColor}
                dataAid={dataIndex}
              />
            );
          })}
        </div>
      </Collapse>
      <Collapse in={showBottomSection}>
        <BottomSection
          bottomSectionData={bottomSectionData}
          topSectionData={topSectionData}
          showSeparator={showSeparator}
        />
      </Collapse>
      <FooterSection footerSectionData={footerSectionData} />
    </div>
  );
};

export default MultipleItemCard;
