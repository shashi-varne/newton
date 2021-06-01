import React, { memo, useState } from "react";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "../../../assets/expand_more.svg";
import ExpandLessIcon from "../../../assets/expand_less.svg";
import "./commonStyles.scss";
import { storageService } from "../../../utils/validators";

const PassiveFundAccordian = ({ title, children, name }) => {
  const [open, setOpen] = useState(false);
  const handleAccordian = () => {
    if (name) storageService().set(name, true);
    setOpen(!open);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "0 20px",
        }}
        onClick={handleAccordian}
      >
        <p
          style={{
            fontSize: "15px",
            fontWeight: "700",
            lineHeight: "24px",
            letterSpacing: "0px",
          }}
        >
          {title}
        </p>
        <img src={open ? ExpandLessIcon : ExpandMoreIcon} alt="" />
      </div>
      <div style={{ padding: "0 5px 0 5px" }}>
        <Collapse in={open}>{children}</Collapse>
      </div>
    </>
  );
};

export default memo(PassiveFundAccordian);
