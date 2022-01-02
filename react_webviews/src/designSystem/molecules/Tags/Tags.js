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

import { Box, Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import PropTypes from "prop-types";
import './Tags.scss';

const Tags = (props) => {
  const {
    smallRating,
    label,
    labelBackgroundColor,
    labelColor,
    labelClassName,
    tagClassName,
    rating
  } = props;
  const morningStarLogo = smallRating
    ? 'small_morning_star'
    : 'large_morning_star';

  if (!isEmpty(label)) {
    return (
      <LabelTag
        label={label}
        labelBackgroundColor={labelBackgroundColor}
        labelColor={labelColor}
        labelClassName={labelClassName}
      />
    );
  }

  return (
    <div className={`${tagClassName} tags-wrapper`}>
      <Imgc
        style={{ marginRight: '8px', width: '14px', height: '14px' }}
        src={require(`assets/tags_star.svg`)}
        alt=''
      />
      <Typography variant='body5'>{rating}</Typography>
      <Imgc
        style={{ marginLeft: '8px' }}
        src={require(`assets/${morningStarLogo}.svg`)}
        alt=''
      />
    </div>
  );
};

export default Tags;

const LabelTag = ({
  label,
  labelBackgroundColor,
  labelColor,
  labelClassName,
}) => {
  return (
    <Box
      className={`${labelClassName} label-tag-wrapper`}
      sx={{
        backgroundColor: labelBackgroundColor
          ? labelBackgroundColor
          : 'foundationColors.secondary.blue.200',
      }}
    >
      <Typography variant='body5' color={labelColor}>
        {label}
      </Typography>
    </Box>
  );
};

Tags.propTypes = {
  label: PropTypes.string,
  rating: PropTypes.number,
  smallRating: PropTypes.bool
};