import WVButton from "../Button/WVButton"
import React from "react";
import "./commonStyles.scss";

const WVFilterButton = (props) => {
  return (
    <div className="filter-btn" data-aid={`filter-btn-${props.dataAidSuffix}`}>
      <WVButton
        data-aid={`filter-button-${props.dataAidSuffix}`}
        {...props}
        style={{ width: "138px", border: "1px solid rgba(255,255,255,0.5)" }}
      >
        <div className="icon">
          <img src={require("../../../assets/filter_icon.svg")} alt="" />
        </div>
        <div className="wv-filter-btn-title">
          Filters
        </div>
      </WVButton>
    </div>
  );
};


export default WVFilterButton;