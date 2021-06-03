import React, { memo, useState } from "react";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "../../assets/expand_more.svg";
import ExpandLessIcon from "../../assets/expand_less.svg";

const Accordian = ({ title, children, handleClick }) => {
  const [open, setOpen] = useState(false);

  const handleAccordian = () => {
    if (handleClick) handleClick();
    setOpen(!open);
  };
  return (
    <>
      <div className="generic-accordian" onClick={handleAccordian}>
        <p>{title}</p>
        <img src={open ? ExpandLessIcon : ExpandMoreIcon} alt="" />
      </div>
      <div style={{ padding: "0 5px 0 5px" }}>
        <Collapse in={open}>{children}</Collapse>
      </div>
    </>
  );
};

export default memo(Accordian);
