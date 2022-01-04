import React from "react";

const Tile = ({
  showBottomDivider,
  title,
  amount,
  titleClassName = "",
  amountClassName = "",
  className = "",
}) => {
  return (
    <>
      <div className={`flex-between-center  fpps-tile ${className}`}>
        <div className={titleClassName}>{title}</div>
        <div className={amountClassName}>{amount}</div>
      </div>
      {showBottomDivider && <div className="generic-hr" />}
    </>
  );
};

export default Tile;
