import React, { useMemo } from "react";
import { getConfig } from "../../../utils/functions";
import Icon from "../Icon";
import Typography from "../Typography";

const Registration = () => {
  const { colorLogo } = useMemo(getConfig, []);
  return (
    <div className="ati-registration">
      <div className="flex-between-center">
        <Icon
          src={require(`assets/${colorLogo}`)}
          dataAid="left"
          height="20px"
        />
        <Icon
          src={require(`assets/sebi-logo.svg`)}
          dataAid="right"
          size="20px"
        />
      </div>
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        className="atir-text"
        dataAid="title"
        component="div"
      >
        NSE member code - 90228 | BSE member code - 6696 | NSE/BSE - SEBI
        registration no. - INZ000209036 | CDSL - SEBI registeration no. -
        IN-DP-572-2021 , INA200005323 | AMFI registration no. ARN 103168
      </Typography>
    </div>
  );
};

export default Registration;
