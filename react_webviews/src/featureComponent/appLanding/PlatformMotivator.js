import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Lottie from "lottie-react";
import Typography from "../../designSystem/atoms/Typography";
import { getConfig } from "../../utils/functions";

import "./PlatformMotivator.scss";

const PlatformMotivator = ({ icon, title, subtitle, dataAid }) => {
  const { productName } = useMemo(getConfig, []);
  return (
    <Box
      sx={cardWrapperSxStyle}
      className="platform-motivator-wrapper"
      data-aid={`carousel_${dataAid}`}
    >
      {icon && (
        <Lottie
          animationData={require(`assets/${productName}/lottie/${icon}`)}
          autoPlay
          loop
          data-aid="iv_left"
          className="pm-left-image"
        />
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

const cardWrapperSxStyle = {
  backgroundColor: "foundationColors.supporting.grey",
};

PlatformMotivator.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  dataAid: PropTypes.string,
};
