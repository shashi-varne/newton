import { Box, Stack } from "@mui/material";
import React from "react";
import ReactPlaceholder from "react-placeholder";
import { getConfig } from "../../utils/functions";
import "./PortfolioLandingLoader.scss";

let highlight_color = getConfig().styles.skeletonColor;
function PortfolioLandingLoader() {
  return (
    <Box className="portfoliolanding-loader">
      <ReactPlaceholder
        type="rect"
        showLoadingAnimation={true}
        className="single-full-image-skelton"
        ready={false}
        color={highlight_color}
        style={{ width: "60%", height: 24, marginBottom: 8, borderRadius: 100 }}
      />
      <ReactPlaceholder
        type="rect"
        showLoadingAnimation={true}
        className="single-full-image-skelton"
        ready={false}
        color={highlight_color}
        style={{
          width: "100%",
          height: 16,
          marginBottom: 32,
          borderRadius: 100,
        }}
      />
      <FlexLoaderRow />
      <FlexLoaderRow />
      <ReactPlaceholder
        type="rect"
        showLoadingAnimation={true}
        className="single-full-image-skelton"
        ready={false}
        color={highlight_color}
        style={{
          width: "100%",
          height: 270,
          marginBottom: 24,
          borderRadius: 12,
        }}
      />
      <ReactPlaceholder
        type="rect"
        showLoadingAnimation={true}
        className="single-full-image-skelton"
        ready={false}
        color={highlight_color}
        style={{
          width: "100%",
          height: 24,
          marginBottom: 32,
          borderRadius: 100,
        }}
      />
      <ReactPlaceholder
        type="rect"
        showLoadingAnimation={true}
        className="single-full-image-skelton"
        ready={false}
        color={highlight_color}
        style={{
          width: "50%",
          height: 16,
          marginBottom: 32,
          borderRadius: 100,
        }}
      />
      <FlexLoaderRow />
    </Box>
  );
}

const FlexLoaderRow = () => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box>
        <ReactPlaceholder
          type="rect"
          showLoadingAnimation={true}
          className="single-full-image-skelton"
          ready={false}
          color={highlight_color}
          style={{ width: 140, height: 16, marginBottom: 8, borderRadius: 100 }}
        />
        <ReactPlaceholder
          type="rect"
          showLoadingAnimation={true}
          className="single-full-image-skelton"
          ready={false}
          color={highlight_color}
          style={{
            width: 120,
            height: 24,
            marginBottom: 24,
            borderRadius: 100,
          }}
        />
      </Box>
      <Box>
        <ReactPlaceholder
          type="rect"
          showLoadingAnimation={true}
          className="single-full-image-skelton"
          ready={false}
          color={highlight_color}
          style={{ width: 140, height: 16, marginBottom: 8, borderRadius: 100 }}
        />
        <ReactPlaceholder
          type="rect"
          showLoadingAnimation={true}
          className="single-full-image-skelton"
          ready={false}
          color={highlight_color}
          style={{
            width: 120,
            height: 24,
            marginBottom: 24,
            marginLeft: "auto",
            borderRadius: 100,
          }}
        />
      </Box>
    </Stack>
  );
};

export default PortfolioLandingLoader;
