import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "../Typography";
import PropTypes from "prop-types";
import noop from "lodash/noop";
import "./MenuOverlay.scss";

const MenuOverlay = (props) => {
  const {
    onClose = noop,
    onClickLabel = noop,
    options = [],
    dataAid,
    anchorOriginVertical = "top",
    anchorOriginHorizontal = "right",
    transformOriginVertical = "top",
    transformOriginHorizontal = "right",
    labelColor = "foundationColors.content.primary",
    children = null,
  } = props;

  const [anchorEl, setAnchorEl] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  const handleLabelClick = (index) => () => {
    onClickLabel(index);
    handleClose();
  };

  return (
    <div>
      <div onClick={handleClick}>{children}</div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: anchorOriginVertical,
          horizontal: anchorOriginHorizontal,
        }}
        transformOrigin={{
          vertical: transformOriginVertical,
          horizontal: transformOriginHorizontal,
        }}
        data-aid={`menuOverlay_${dataAid}`}
        className="molecule-menu-overlay"
      >
        {options.map((label, index) => (
          <MenuListItem
            key={index}
            index={index + 1}
            onClick={handleLabelClick(index)}
            label={label}
            labelColor={labelColor}
          />
        ))}
      </Popover>
    </div>
  );
};

const MenuListItem = ({ index, onClick, label, labelColor }) => {
  return (
    <Box className="mo-item-wrapper" onClick={onClick}>
      <Typography
        dataAid={`label${index}`}
        variant={"body8"}
        color={labelColor}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default MenuOverlay;

MenuOverlay.propTypes = {
  onClose: PropTypes.func,
  labelColor: PropTypes.string,
  options: PropTypes.array.isRequired,
  anchorOriginVertical: PropTypes.string,
  anchorOriginHorizontal: PropTypes.string,
  transformOriginVertical: PropTypes.string,
  transformOriginHorizontal: PropTypes.string,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
