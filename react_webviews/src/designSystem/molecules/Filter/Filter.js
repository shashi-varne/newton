/*
  prop description:
  leftSectionProps, middleSectionProps, rightSectionProps:
    - The structure for the above props is:
      {
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        imgProps: PropTypes.object,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        titleColor: PropTypes.string,
        onClick: PropTypes.func,
    };
  Note: strongly recommended to pass only foundation color for the color related props.
  Example: badgeColor: 'foundationColors.secondary.profitGreen.300'
*/

import React from "react";
import Typography from "../../atoms/Typography";
import Badge from "../../atoms/Badge";
import PropTypes from "prop-types";
import noop from "lodash/noop";
import Icon from '../../atoms/Icon';
import Stack from "@mui/material/Stack";

import "./Filter.scss";

const Filter = ({
  imgSrc,
  imgProps = {},
  badgeProps = {},
  title,
  titleColor,
  dataAid,
  filterCount,
  className,
  onClick = noop,
  sx,
}) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='center'
      spacing={1}
      className={`filter-wrapper ${className}`}
      onClick={onClick}
      data-aid={`filter_${dataAid}`}
      sx={sx}
    >
      {imgSrc && (
        <Icon
          src={imgSrc}
          size='16px'
          dataAid="left"
          {...imgProps}
        />
      )}
      <Typography
        variant="body2"
        color={titleColor}
        component="div"
        dataAid="title"
      >
        {title}
      </Typography>
      {filterCount || filterCount === 0 ? (
        <Badge
          badgeContent={filterCount}
          dataAid="singleNumber"
          className="filter-nav-badge"
          {...badgeProps}
        />
      ) : null}
    </Stack>
  );
};

export default Filter;

Filter.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string,
  onClick: PropTypes.func,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
