/*

Example:

<WVAccordian
  title="Fund's Info"
  name="fund_info_clicked"
  handleClick={() => storeEventsData("fund_info_clicked")}
>
{...content}
</WVAccordian>

*/

import React, { memo, useState } from "react";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "../../../assets/expand_more.svg";
import ExpandLessIcon from "../../../assets/expand_less.svg";
import PropTypes from "prop-types";
import "./WVAccordian.scss";

const WVAccordian = ({
  title, // Title for the accordian
  children, // Content to be displayed on expand
  handleClick, // Parent function to be called on every click
  classes = {}, // Custom Styling
  dataAidSuffix,
  expandIcon, // Provide custom expand icon
  collapseIcon, //Provide custom collapse icon
}) => {
  const [open, setOpen] = useState(false);

  const handleAccordian = () => {
    if (handleClick) handleClick();
    setOpen(!open);
  };

  return (
    <>
      <div
        className="wv-generic-accordian"
        data-aid={`wv-generic-accordian-${dataAidSuffix}`}
        onClick={handleAccordian}
      >
        <p className={`${classes.title}`}>{title}</p>
        <img
          className={`${classes.icon}`}
          src={
            open
              ? collapseIcon
                ? collapseIcon
                : ExpandLessIcon
              : expandIcon
              ? expandIcon
              : ExpandMoreIcon
          }
          alt=""
        />
      </div>
      <div style={{ padding: "0 5px 0 5px" }}>
        <Collapse in={open}>{children}</Collapse>
      </div>
    </>
  );
};

WVAccordian.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  handleClick: PropTypes.func,
  expandIcon: PropTypes.node,
  collapseIcon: PropTypes.node,
};

WVAccordian.defaultProps = {
  handleClick: () => {},
  classes: {},
};
export default memo(WVAccordian);
