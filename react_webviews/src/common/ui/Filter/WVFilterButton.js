import Button from "@material-ui/core/Button";
import React from "react";
import "./WVFilterCommonStyles.scss"

const WVFilterButton = (props) => {
  return (
    <div className="filter-btn" data-aid={`filter-btn-${props.dataAidSuffix}`}>
      <Button
        data-aid={`filter-button-${props.dataAidSuffix}`}
        {...props}
        style={{ width: "138px", border: "1px solid rgba(255,255,255,0.5)"}}
      >
        <div className="icon">
          <img src={require("../../../assets/filter_icon.svg")} alt="" />
        </div>
        <div
          className="title"
          style={{ color: "#35CB5D", paddingLeft: "10px", fontSize: "12px", fontWeight: "bold" }}
        >
          Filters
      </div>
      </Button>
    </div>
  );
};

export default WVFilterButton;
