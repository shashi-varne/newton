import React, { useMemo } from "react";
import Typography from "../../designSystem/atoms/Typography";
import MenuItem from "../../designSystem/molecules/MenuItem";
import getPartnerThemeData from "../../theme/utils";
import PropTypes from "prop-types";

const getIconColors = () => {
  const { colors } = getPartnerThemeData();
  const iconColors = [
    colors.secondary.profitGreen[400],
    colors.secondary.coralOrange[400],
    colors.secondary.blue[400],
    colors.secondary.mango[400],
  ];
  return iconColors;
};

const InvestmentOptions = ({
  productList = [],
  title,
  titleDataAid,
  onClick,
  feature,
  isLoading,
}) => {
  const iconColors = useMemo(getIconColors, []);

  return (
    <div className="al-investment-options">
      {title && (
        <Typography
          dataAid={titleDataAid}
          variant="heading3"
          className="al-io-title"
          component="div"
        >
          {title}
        </Typography>
      )}
      {productList.map((data, idx) => {
        const rightLottieSrc =
          feature === data.id
            ? require(`assets/fisdom/lottie/signfier.json`)
            : null;
        return (
          <MenuItem
            {...data}
            leftSvgSrc={require(`assets/${data.icon}`)}
            leftSvgIconColor={iconColors[idx % 4]}
            key={idx}
            showSeparator={productList.length !== idx + 1}
            onClick={onClick(data)}
            showLoader={isLoading}
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
