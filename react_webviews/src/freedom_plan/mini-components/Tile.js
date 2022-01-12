import React from "react";

const Tile = ({
  showBottomDivider,
  title,
  amount,
  titleClassName = "",
  amountClassName = "",
  className = "",
  dataAid,
}) => {
  return (
    <>
      <div
        data-aid={`grp_${dataAid}`}
        className={`flex-between-center  fpps-tile ${className}`}
      >
        <div className={titleClassName} data-aid="tv_title">
          {title}
        </div>
        <div className={amountClassName} data-aid="tv_description">
          {amount}
        </div>
      </div>
      {showBottomDivider && <div className="generic-hr" />}
    </>
  );
};

export default Tile;
