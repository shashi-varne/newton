import { Skeleton, Stack } from "@mui/material";
import React from "react";
import "./Landing.scss";

const ReferralSkeletonLoader = ({ cardHeight = "140px" }) => {
  return (
    <Stack>
      <Skeleton
        variant="rectangular"
        className="rae-card-loader"
        height={cardHeight}
      />
      <Skeleton
        variant="rectangular"
        className="rae-card-loader"
        height={cardHeight}
      />
      <Skeleton
        variant="rectangular"
        className="rae-card-loader"
        height={cardHeight}
      />
    </Stack>
  );
};

export default ReferralSkeletonLoader;
