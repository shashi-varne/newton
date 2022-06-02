import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import MenuItem from "../../designSystem/molecules/MenuItem";
import { isEmpty } from "lodash-es";

const InvestmentOptions = ({
  productList = [],
  title,
  titleDataAid,
  onClick,
  signfierKey,
  isLoading
}) => {
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
      {productList.map((data, idx) => {
        const showLoader = ["stocks", "ipo"].includes(data.id) && isLoading
        const rightLottieSrc =
          signfierKey === data.id
            ? require(`assets/fisdom/lottie/signfier.json`)
            : null;
        return (
          <MenuItem
            {...data}
            leftImgSrc={require(`assets/${data.icon}`)}
            key={idx}
            showSeparator={productList.length !== idx + 1}
            onClick={onClick(data)}
            showLoader={showLoader}
            rightLottieSrc={rightLottieSrc}
          />
        );
      })}
    </div>
  );
};

export default InvestmentOptions;
