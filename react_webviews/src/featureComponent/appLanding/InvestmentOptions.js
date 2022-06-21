import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import MenuItem from "../../designSystem/molecules/MenuItem";
import PropTypes from 'prop-types';

const ICON_COLOR = [
  "#33CF90",
  "#FE794D",
  "#5AAAF6",
  "#FFBD00",
];

const InvestmentOptions = ({
  productList = [],
  title,
  titleDataAid,
  onClick,
  feature,
  isLoading,
}) => {
  return (
    <div className="al-investment-options">
      {!title && (
        <Typography
          dataAid={titleDataAid}
          variant="heading3"
          className="al-io-title"
        >
          {title}
        </Typography>
      )}
      {productList.map((data, idx) => {
        const showLoader = ["stocks", "ipo"].includes(data.id) && isLoading;
        const rightLottieSrc =
          feature === data.id
            ? require(`assets/fisdom/lottie/signfier.json`)
            : null;
        return (
          <MenuItem
            {...data}
            leftImgSrc={require(`assets/${data.icon}`)}
            leftSvgIconColor={ICON_COLOR[idx % 4]}
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

InvestmentOptions.propTypes = {
  productList: PropTypes.array,
  title: PropTypes.string,
  onClick: PropTypes.func,
  titleDataAid: PropTypes.string,
};
