import { Box, Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import isEmpty from 'lodash/isEmpty';
import './Tags.scss';

const Tags = (props) => {
  const {
    smallRating,
    label,
    labelBackgroundColor,
    labelColor,
    labelClassName,
    tagClassName,
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
        style={{ marginRight: '9px', width: '14px', height: '14px' }}
        src={require(`assets/tags_star.svg`)}
        alt=''
      />
      <Typography variant='body5'>4.77</Typography>
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
