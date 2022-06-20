import React from "react";
import Typography from "../../designSystem/atoms/Typography";
import CardHorizontal from "../../designSystem/molecules/CardHorizontal";
import { MF_LANDING } from "../../strings/webappLanding";
import PropTypes from "prop-types";

const { passiveIndexFunds } = MF_LANDING;

const PassiveIndexFunds = ({ productName, onClick }) => {
  return (
    <div className="mfl-kyc">
      <CardHorizontal
        rightImgSrc={require(`assets/${productName}/${passiveIndexFunds.icon}`)}
        title={passiveIndexFunds.title}
        subtitle={passiveIndexFunds.subtitle}
        actionLink={passiveIndexFunds.buttonTitle}
        variant="heroCard"
        dataAid={passiveIndexFunds.dataAid}
        footerText={passiveIndexFunds.footerText}
        onClick={onClick(passiveIndexFunds)}
      />
      <Typography
        variant="body6"
        dataAid="helperText"
        color="foundationColors.content.secondary"
      >
        *Based on TER averages of regular large cap and direct index funds
      </Typography>
    </div>
  );
};

export default PassiveIndexFunds;

PassiveIndexFunds.propTypes = {
  productName: PropTypes.string,
  onClick: PropTypes.func,
};
