import React from "react";
import CustomItem from "./CustomItem";
import RowContainer from "./RowContainer";

const SecondaryBottomSection = ({ bottomRowData, colorProps }) => {
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

  console.log(colorProps);
  return (
    <RowContainer className="bottom-section-two">
      <CustomItem
        title={leftTitle}
        titleColor={colorProps?.leftTitle}
        subtitleColor={colorProps?.leftSubtitle}
        subtitle={leftSubtitle}
        id={1}
        imgSrc={leftImgSrc}
        align="left"
      />
      <CustomItem
        title={middleTitle}
        subtitle={middleSubtitle}
        titleColor={colorProps?.middleTitle}
        subtitleColor={colorProps?.middleSubtitle}
        id={2}
        imgSrc={middleImgSrc}
        align="center"
      />
      <CustomItem
        title={rightTitle}
        subtitle={rightSubtitle}
        titleColor={colorProps?.rightTitle}
        subtitleColor={colorProps?.rightSubtitle}
        id={3}
        imgSrc={rightImgSrc}
        align="right"
      />
    </RowContainer>
  );
};

export default SecondaryBottomSection;
