import React, { useState } from "react";
import Container from "../../../common/Container";
import InvestType from "../../mini-components/InvestType";
import { investRedeemData } from "../../constants";
import { navigate as navigateFunc } from "utils/functions";
import useFunnelDataHook from "../../common/funnelDataHook";

const Type = (props) => {
  const navigate = navigateFunc.bind(props);

  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const [investType, setInvestType] = useState(funnelData.investTypeDisplay || 'onetime');

  const handleClick = () => {
    updateFunnelData({
      amount: '',
      investTypeDisplay: investType,
      order_type: investType
    });
    navigate(`/invest/instaredeem/amount`);
  };

  return (
    <Container
      data-aid='how-would-you-like-to-invest-screen'
      showLoader={false}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      title="How would you like to invest?"
      count="1"
      total="2"
      current="1"
    >
      <InvestType
        baseData={investRedeemData.investTypeData}
        selected={investType}
        handleChange={(type) => setInvestType(type)}
      />
    </Container>
  );
}

export default Type;
