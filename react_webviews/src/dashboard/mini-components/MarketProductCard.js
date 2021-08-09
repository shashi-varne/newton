import React from "react";
import { Imgc } from "../../common/ui/Imgc";
import WVTag from "../../common/ui/Tag/WVTag";
import "./mini-components.scss";

const MarketProductCard = ({ icon, onClick, key, ...data }) => {
  return (
    <div key={key} className="product-category-block" onClick={onClick}>
      <div className="image-wrapper">
        <Imgc src={icon} alt={data.name} className="catergory-icon" />
      </div>
      <div className="content-wrapper">
        <div className="category-name flex-between">
          <div>{data.name}</div>
          {data.subText && (
            <WVTag
              content={data.subText}
              classes={{ container: "align-self-start m-left-1x" }}
            />
          )}
        </div>
        <div className="category-fullform">{data.info}</div>
        <div className="category-divider" />
      </div>
    </div>
  );
};

export default MarketProductCard;
