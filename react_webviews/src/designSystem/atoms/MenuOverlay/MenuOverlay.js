import React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "../Typography";
import PropTypes from "prop-types";
import { noop, isObject } from "lodash";
import "./MenuOverlay.scss";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
  },
}));

const MenuOverlay = (props) => {
  const {
    anchorEl,
    onClose = noop,
    onClickLabel = noop,
    options = [],
    displayKey = "name",
    dataAid,
    anchorOriginVertical = "top",
    anchorOriginHorizontal = "right",
    transformOriginVertical = "top",
    transformOriginHorizontal = "right",
    labelColor = "foundationColors.content.primary",
  } = props;

  const handleLabelClick = (index) => () => {
    onClickLabel(index);
  };
  const classes = useStyles();

  return (
    <div>
      <Popover
        id={"menu-overlay"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: anchorOriginVertical,
          horizontal: anchorOriginHorizontal,
        }}
        transformOrigin={{
          vertical: transformOriginVertical,
          horizontal: transformOriginHorizontal,
        }}
        data-aid={`menuOverlay_${dataAid}`}
        className={"molecule-menu-overlay" + " " + classes.root}
      >
        {options.map((data, index) => (
          <MenuListItem
            key={index}
            index={index + 1}
            onClick={handleLabelClick(index)}
            data={data}
            displayKey={displayKey}
            labelColor={labelColor}
          />
        ))}
      </Popover>
    </div>
  );
};

const MenuListItem = ({ index, onClick, data, displayKey, labelColor }) => {
  const labelName = isObject(data) ? data[displayKey] : data;

  return (
    <Box className="mo-item-wrapper" onClick={onClick}>
      <Typography
        dataAid={`label${index}`}
        variant={"body8"}
        color={labelColor}
      >
        {labelName}
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
  displayKey: PropTypes.string,
};
