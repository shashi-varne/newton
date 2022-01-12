/*
  Below are the props description.
  Note: by default it will return large rating variant(large MorningStar logo)
  smallRating(bool): a variant which will give smaller Tag(small MorningStar logo).
  label(string): a variant to show label.
  labelBackgroundColor, labelColor: It is strongly recommended to use Foundation colors to change the color of this props.
  Example: labelColor: foundationColors.secondary.mango.200;
  rating(number): A number which displays the rating.

  Usage as per Variants:
  1. large Variant => <Tags rating={4.7}/>
  2. small Variant => <Tags smallRating rating={4.7}/>
  3. label Variant => <Tags label='Label'/>
*/

import { Box } from '@mui/material';
import Typography from '../../atoms/Typography';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import './Tags.scss';

const Tags = (props) => {
  const {
    smallRating,
    label,
    labelBackgroundColor,
    labelColor,
    rating,
    dataAid,
    className,
  } = props;
  const smallVariantProps = getSmallRatingProps(smallRating);
  const morningStarLogo = smallRating ? 'small_morning_star' : 'large_morning_star';

  if (!isEmpty(label)) {
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
    <div className={`tags-wrapper ${smallVariantProps?.wrapperClass} ${className}`} data-aid={`tags_${dataAid}`}>
      <Imgc
        style={{ width: '14px', height: '14px' }}
        src={require(`assets/tags_star.svg`)}
        dataAid='left'
        className={`tags-left-image ${smallVariantProps?.leftImageClass}`}
      />
      <Typography variant='body5' data-aid='tv_title'>{rating}</Typography>
      <Imgc
        src={require(`assets/${morningStarLogo}.svg`)}
        alt=''
        dataAid='logo'
        className={`tags-right-image ${smallVariantProps?.rightImageClass}`}
      />
    </div>
  );
};

export default Tags;

const LabelTag = ({ label, labelBackgroundColor, labelColor, dataAid, className }) => {
  return (
    <Box
      className={`label-tag-wrapper ${className}`}
      sx={{
        backgroundColor: labelBackgroundColor,
      }}
      data-aid={`tags_${dataAid}`}
    >
      <Typography variant='body5' color={labelColor} data-aid='tv_title'>
        {label}
      </Typography>
    </Box>
  );
};

const getSmallRatingProps = (isSmallRating = false) => {
  if(isSmallRating) {
    return {
      wrapperClass: 'tags-small-wrapper',
      leftImageClass: 'tags-left-image-small',
      rightImageClass: 'tags-right-image-small'
    };
  }
}

Tags.defaultProps = {
  labelBackgroundColor: 'foundationColors.secondary.blue.200'
}

Tags.propTypes = {
  label: PropTypes.string,
  labelColor: PropTypes.string,
  labelBackgroundColor: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  smallRating: PropTypes.bool,
  dataAid: PropTypes.string,
};