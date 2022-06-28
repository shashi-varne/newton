import React from "react";
import CustomItem from "./CustomItem";
import RowContainer from "./RowContainer";

const SecondaryBottomSection = ({ bottomRowData }) => {
  const {
    leftTitle,
    leftSubtitle,
    leftImgSrc,
    middleTitle,
    middleImgSrc,
    middleSubtitle,
    rightTitle,
    rightImgSrc,
    rightSubtitle,
  } = bottomRowData;

  return (
    <RowContainer className="bottom-section-two">
      <CustomItem
        title={leftTitle}
        subtitle={leftSubtitle}
        id={1}
        imgSrc={leftImgSrc}
        align="left"
      />
      <CustomItem
        title={middleTitle}
        subtitle={middleSubtitle}
        id={2}
        imgSrc={middleImgSrc}
        align="center"
      />
      <CustomItem
        title={rightTitle}
        subtitle={rightSubtitle}
        id={3}
        imgSrc={rightImgSrc}
        align="right"
      />
    </RowContainer>
  );
};

export default SecondaryBottomSection;
