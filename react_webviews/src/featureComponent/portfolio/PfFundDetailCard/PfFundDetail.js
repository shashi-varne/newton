import React from "react";
import { Box } from "@mui/material";
import Separator from "designSystem/atoms/Separator";
import { noop } from "lodash-es";
import PropTypes from "prop-types";
import "./PfFundDetail.scss";
import PrimaryBottomSection from "./subComponents/PrimaryBottomSection";
import SecondaryBottomSection from "./subComponents/SecondaryBottomSection";
import TopSection from "./subComponents/TopSection";

export const PF_DETAIL_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
};

function PfFundDetail({ variant, onClick, ...props }) {
  return (
    <Box
      onClick={onClick}
      className="pf-fund-detail-container"
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
    >
      <TopSection {...props} />
      <Separator dataAid={1} />
      {variant === PF_DETAIL_VARIANT.PRIMARY ? (
        <PrimaryBottomSection {...props} />
      ) : (
        <SecondaryBottomSection {...props} />
      )}
    </Box>
  );
}

PfFundDetail.defaultProps = {
  variant: PF_DETAIL_VARIANT.PRIMARY,
  onClick: noop,
  label: "",
  topTitle: "",
  middleImgSrc: "",
  mainTitle: "",
  middleLabel: "",
  bottomTitle: "",
  bottomLabel: "",
  bottomSubtitle: "",
  bottomRowData: {},
};

PfFundDetail.propTypes = {
  variant: PropTypes.string,
  onClick: noop,
  label: PropTypes.string,
  topTitle: PropTypes.string,
  middleImgSrc: PropTypes.string,
  mainTitle: PropTypes.string,
  middleLabel: PropTypes.string,
  bottomTitle: PropTypes.string,
  bottomLabel: PropTypes.string,
  bottomSubtitle: PropTypes.string,
  bottomRowData: PropTypes.shape({
    leftTitle: PropTypes.string,
    leftImgSrc: PropTypes.node,
    leftSubtitle: PropTypes.string,
    middleTitle: PropTypes.string,
    middleImgSrc: PropTypes.node,
    middleSubtitle: PropTypes.string,
    rightTitle: PropTypes.string,
    rightImgSrc: PropTypes.node,
    rightSubtitle: PropTypes.string,
  }),
};

export default PfFundDetail;
