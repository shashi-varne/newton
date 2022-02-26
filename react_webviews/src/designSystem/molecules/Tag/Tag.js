/*
  Below are the props description.
  largeMorningRating(bool): a variant which will give smaller Tag(small MorningStar logo).
  smallMorningRating(bool): a variant which will give smaller Tag(large MorningStar logo).
  label(string): a variant to show label.
  labelBackgroundColor: only applicable for variant which has label without Icon.
  labelBackgroundColor, labelColor: It is strongly recommended to use Foundation colors to change the color.
  Example: labelColor: foundationColors.secondary.mango.200;

  Usage:
  <Tag label='Equity'/> => will return label with background color.
  <Tag morningStarVariant='small' label={4.6}/> => will return morning star variant.
  <Tag leftImgProps={{
          src: require('assets/amazon_pay.svg')
        }}
        label='Equity'
  /> => This will return label with icon.
*/

import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import React, { useMemo } from 'react';
import Icon from '../../atoms/Icon'
import PropTypes from 'prop-types';
import './Tag.scss';
import isEmpty from 'lodash/isEmpty';

const Tag = (props) => {
  const {
    morningStarVariant,
    leftImgProps = {},
    label,
    labelBackgroundColor, // will be only applied for label without icon.
    labelColor,
    dataAid,
    className,
  } = props;
  const morningStarData = useMemo(() => getMorningStarData(morningStarVariant),[morningStarVariant]);
  const leftImageData = leftImgProps?.src ? leftImgProps : morningStarData;

  if (label && !leftImgProps?.src && isEmpty(morningStarData)) {
    return (
      <LabelTag
        label={label}
        labelBackgroundColor={labelBackgroundColor}
        labelColor={labelColor}
        dataAid={dataAid}
        className={className}
      />
    );
  }

  return (
    <div
      className={`tag-wrapper ${morningStarData?.wrapperClass} ${className}`}
      data-aid={`tag_${dataAid}`}
    >
      {leftImageData?.src && (
        <Icon
          size='16px'
          dataAid='left'
          className={`tag-left-image ${leftImageData?.leftImageClass}`}
          src={leftImageData?.src}
          {...leftImgProps}
        />
      )}
      <Typography variant='body5' dataAid='title' color={labelColor}>
        {label}
      </Typography>
      {morningStarData?.morningLogo && !leftImgProps?.src  && (
        <Icon
          src={require(`assets/${morningStarData?.morningLogo}.svg`)}
          alt=''
          dataAid='logo'
          className={`tag-right-image ${morningStarData?.rightImageClass}`}
        />
      )}
    </div>
  );
};

export default Tag;

const LabelTag = ({ label, labelBackgroundColor, labelColor, dataAid, className }) => {
  return (
    <Box
      className={`label-tag-wrapper ${className}`}
      sx={{
        backgroundColor: labelBackgroundColor,
      }}
      data-aid={`tag_${dataAid}`}
    >
      <Typography variant='body5' color={labelColor} dataAid='title'>
        {label}
      </Typography>
    </Box>
  );
};

const getMorningStarData = (morningStarVariant) => {
  if (morningStarVariant === 'large') {
    return {
      morningLogo: 'large_morning_star',
      src: require(`assets/tag_star.svg`),
    };
  } else if (morningStarVariant === 'small') {
    return {
      morningLogo: 'small_morning_star',
      src: require(`assets/tag_star.svg`),
      wrapperClass: 'tag-small-wrapper',
      leftImageClass: 'tag-left-image-small',
      rightImageClass: 'tag-right-image-small',
    };
  } else {
    return {};
  }
};

Tag.defaultProps = {
  labelBackgroundColor: 'foundationColors.secondary.blue.200',
};

Tag.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  labelColor: PropTypes.string,
  labelBackgroundColor: PropTypes.string,
  morningStarVariant: PropTypes.oneOf(['small', 'large']),
  dataAid: PropTypes.string,
  leftImgProps: PropTypes.object,
};
