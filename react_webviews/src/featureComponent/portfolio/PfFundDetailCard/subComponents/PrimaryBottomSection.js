import { Box } from "@mui/material";
import React from "react";
import Icon from "../../../../designSystem/atoms/Icon";
import Typography from "../../../../designSystem/atoms/Typography";
import Tag from "../../../../designSystem/molecules/Tag";
import RowContainer from "./RowContainer";

const PrimaryBottomSection = ({
  bottomTitle,
  bottomLabel,
  bottomSubtitle,
  bottomImgSrc,
}) => {
  return (
    <Box className="bottom-section">
      <RowContainer>
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid="info"
        >
          {bottomTitle}
        </Typography>
        <Tag label={bottomLabel} dataAid="label" />
        <RowContainer justifyContent="flex-start">
          <Icon
            src={bottomImgSrc}
            width="16px"
            height="16px"
            dataAid="left4"
            style={{ marginRight: 4 }}
          />
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid="subtitle2"
          >
            {bottomSubtitle}
          </Typography>
        </RowContainer>
      </RowContainer>
    </Box>
  );
};

export default PrimaryBottomSection;
