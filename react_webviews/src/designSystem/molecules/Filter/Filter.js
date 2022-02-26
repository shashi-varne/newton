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
import { Imgc } from "../../../common/ui/Imgc";
import Badge from "../../atoms/Badge";
import PropTypes from "prop-types";
import noop from "lodash/noop";

import "./Filter.scss";

const Filter = ({
  imgSrc,
  imgProps = {},
  badgeProps = {},
  title,
  titleColor,
  dataAid,
  count,
  className,
  onClick = noop,
}) => {
  return (
    <div
      className={`filter-wrapper ${className}`}
      onClick={onClick}
      data-aid={`filter_${dataAid}`}
    >
      {imgSrc && (
        <Imgc
          src={imgSrc}
          style={{ width: "16px", height: "16px", marginRight: "8px" }}
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
      {(count || count === 0) && (
        <Badge
          badgeContent={count}
          dataAid="number"
          className="filter-nav-badge"
          {...badgeProps}
        />
      )}
    </div>
  );
};

export default Filter;

Filter.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string,
  onClick: PropTypes.func,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
