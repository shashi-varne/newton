import Button from "@material-ui/core/Button";
import React from "react";

const FilterButton = (props) => {
  return (
    <Button
      {...props}
      style={{ width: "138px", border: "1px solid rgba(255,255,255,0.5)" }}
    >
      <div className="icon">
        <img src={require("../../../assets/filter_icon.svg")} alt="" />
      </div>
      <div
        className="title"
        style={{ color: "#35CB5D", paddingLeft: "10px", fontSize: "12px" }}
      >
        Filter
      </div>
    </Button>
  );
};

export default FilterButton;
