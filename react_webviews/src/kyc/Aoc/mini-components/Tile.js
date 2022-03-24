import React from "react";

export const Tile = ({
  title,
  amount,
  className = "",
  showDivider = false,
  index,
}) => (
  <>
    <div
      className={`flex-between-center aoc-ps-content ${className}`}
      data-aid={`grp_tile${index + 1}`}
    >
      <div className="aoc-ps-title" data-aid="tv_title">
        {title}
      </div>
      <div className="aoc-ps-subtitle" data-aid="tv_description">
        {amount}
      </div>
    </div>
    {showDivider && (
      <div className="generic-hr" data-aid={`separator_${index + 1}`} />
    )}
  </>
);
