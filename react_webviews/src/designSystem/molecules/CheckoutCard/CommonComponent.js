import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Separator from '../../atoms/Separator';
import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';

export const BottomSection = ({
  bottomSectionData = [],
  topSectionData = [],
  isSingleVariant = false,
  showSeparator = true,
}) => {
  if (isEmpty(bottomSectionData)) return null;
  const topSectionDataLength = topSectionData?.length;

  return (
    <div className='checkout-card-bottom-wrapper'>
      {showSeparator && <Separator />}
      {bottomSectionData?.map((data, idx) => {
        const { leftTitle, leftTitleColor, rightTitle, rightTitleColor } = data;
        const dataIndex = topSectionDataLength + idx + 1;
        const defaultRightTitleColor = isSingleVariant ? '' : 'foundationColors.content.secondary';
        return (
          <Row
            key={idx}
            leftTitle={leftTitle}
            leftTitleColor={leftTitleColor}
            leftTitleVariant='body1'
            rightTitle={rightTitle}
            rightTitleVariant='body2'
            rightTitleColor={rightTitleColor || defaultRightTitleColor}
            dataAid={dataIndex}
          />
        );
      })}
    </div>
  );
};

export const FooterSection = ({ footerSectionData = {} }) => {
  if (isEmpty(footerSectionData)) return null;
  const { leftTitle, leftTitleColor, rightTitle, rightTitleColor, backgroundColor, dataIndex } =
    footerSectionData;
  return (
    <Row
      leftTitle={leftTitle}
      leftTitleColor={leftTitleColor}
      leftTitleVariant='body1'
      rightTitle={rightTitle}
      rightTitleVariant='body2'
      rightTitleColor={rightTitleColor}
      className='highlight'
      sx={{
        backgroundColor: backgroundColor || 'foundationColors.primary.100',
      }}
      dataAid={dataIndex}
    />
  );
};

export const Row = ({
  leftTitle,
  leftTitleVariant,
  leftTitleColor,
  rightTitle,
  rightTitleVariant,
  rightTitleColor,
  dataAid,
  className,
  sx,
}) => {
  if (leftTitle || rightTitle) {
    return (
      <Box className={`cc-key-value-wrapper ${className}`} sx={sx}>
        <Typography
          variant={leftTitleVariant}
          color={leftTitleColor}
          component='div'
          dataAid={`key${dataAid}`}
        >
          {leftTitle}
        </Typography>
        <Typography
          variant={rightTitleVariant}
          color={rightTitleColor}
          component='div'
          dataAid={`value${dataAid}`}
        >
          {rightTitle}
        </Typography>
      </Box>
    );
  }
  return null;
};
