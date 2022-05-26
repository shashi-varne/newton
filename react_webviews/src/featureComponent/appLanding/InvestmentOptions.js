import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import MenuItem from "../../designSystem/molecules/MenuItem";
import { isEmpty } from "lodash-es";

const InvestmentOptions = ({ productList = [], title, titleDataAid }) => {
  return (
    <div className="al-investment-options">
      {!isEmpty(title) && (
        <Typography
          dataAid={titleDataAid}
          variant="heading3"
          className="al-io-title"
        >
          {title}
        </Typography>
      )}
      {productList.map((data, idx) => (
        <MenuItem
          {...data}
          leftImgSrc={require(`assets/${data.icon}`)}
          key={idx}
          showSeparator={productList.length !== idx + 1}
        />
      ))}
    </div>
  );
};

export default InvestmentOptions;
