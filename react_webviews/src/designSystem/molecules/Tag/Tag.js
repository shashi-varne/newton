/*
  Below are the props description.
  Note: by default it will return large rating variant(large MorningStar logo)
  largeMorningRating(bool): a variant which will give smaller Tag(small MorningStar logo).
  smallMorningRating(bool): a variant which will give smaller Tag(large MorningStar logo).
  label(string): a variant to show label.
  labelBackgroundColor: only applicable for variant which has label without Icon.
  labelBackgroundColor, labelColor: It is strongly recommended to use Foundation colors to change the color.
  Example: labelColor: foundationColors.secondary.mango.200;
*/

import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import React, { useMemo } from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import './Tag.scss';

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

  if (!isEmpty(label) && !leftImgProps?.src) {
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
        <Imgc
        style={{ width: '16px', height: '16px' }}
        dataAid='left'
        className={`tag-left-image ${leftImageData?.leftImageClass}`}
        src={leftImageData?.src}
        {...leftImgProps}
        />
      )}
      <Typography variant='body5' data-aid='tv_title' color={labelColor}>
        {label}
      </Typography>
      {morningStarData?.morningLogo && !leftImgProps?.src  && (
        <Imgc
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
      <Typography variant='body5' color={labelColor} data-aid='tv_title'>
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
