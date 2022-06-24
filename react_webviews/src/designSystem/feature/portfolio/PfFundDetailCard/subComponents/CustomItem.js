import { Box } from "@mui/material";
import React from "react";
import Icon from "../../../../atoms/Icon";
import Typography from "../../../../atoms/Typography";
import RowContainer from "./RowContainer";

const CustomItem = ({ title, subtitle, id, imgSrc, align }) => {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        dataAid={`key${id}`}
      >
        {title}
      </Typography>
      <RowContainer justifyContent="flex-start">
        <Icon
          src={imgSrc}
          width="16px"
          height="16px"
          dataAid={`left${id}`}
          style={{ marginRight: 4 }}
        />
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`value${id}`}
        >
          {subtitle}
        </Typography>
      </RowContainer>
    </Box>
  );
};

export default CustomItem;
