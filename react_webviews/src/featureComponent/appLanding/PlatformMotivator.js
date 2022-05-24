import React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Typography from "../../designSystem/atoms/Typography";
import Icon from "../../designSystem/atoms/Icon";

import "./PlatformMotivator.scss";

const PlatformMotivator = ({ imgSrc, title, subtitle, dataAid }) => {
  return (
    <Box
      sx={infoCardWrapperSxStyle}
      className="platform-motivator-wrapper"
      data-aid={`carousel_${dataAid}`}
    >
      {imgSrc && (
        <Icon size="64px" src={imgSrc} className="pm-left-img" dataAid="left" />
      )}
      <div className="pm-text-wrapper">
        <Typography variant="heading4" component="div" dataAid="title">
          {title}
        </Typography>
        <Typography
          className="pm-description"
          variant="body5"
          component="div"
          dataAid="description"
        >
          {subtitle}
        </Typography>
      </div>
    </Box>
  );
};

export default PlatformMotivator;

const infoCardWrapperSxStyle = {
  backgroundColor: "foundationColors.supporting.grey",
};

PlatformMotivator.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  imgProps: PropTypes.object,
};
