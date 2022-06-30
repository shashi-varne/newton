import { Box } from "@mui/material";
import React from "react";
import Icon from "../../../../designSystem/atoms/Icon";
import Typography from "../../../../designSystem/atoms/Typography";
import RowContainer from "./RowContainer";

const CardItem = ({
  img,
  title,
  subtitle,
  align,
  hideTitle,
  id,
  titleColor,
  subtitleColor,
}) => {
  const subColor =
    subtitleColor ||
    (hideTitle
      ? "foundationColors.content.secondary"
      : "foundationColors.content.primary");

  return (
    <Box sx={{ textAlign: align }}>
      {!hideTitle && (
        <Typography
          variant="body5"
          color={titleColor || "foundationColors.content.secondary"}
          dataAid={`key${id}`}
        >
          {title}
        </Typography>
      )}

      <RowContainer>
        <Icon
          src={img}
          width="16px"
          height="16px"
          style={{ marginRight: 4 }}
          dataAid={`left${id}`}
        />
        <Typography
          variant={hideTitle ? "body5" : "body2"}
          dataAid={hideTitle ? "subtitle" : `value${id}`}
          color={subColor}
        >
          {subtitle}
        </Typography>
      </RowContainer>
    </Box>
  );
};

export default CardItem;
