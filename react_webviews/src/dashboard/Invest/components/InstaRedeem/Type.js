import React, { useState } from "react";
import Container from "../../../common/Container";
import InvestType from "../../mini-components/InvestType";
import { investRedeemData } from "../../constants";
import { navigate as navigateFunc } from "../../common/commonFunctions";
import useFunnelDataHook from "../../common/funnelDataHook";
import { nativeCallback } from "../../../../utils/native_callback";

const Type = (props) => {
  const navigate = navigateFunc.bind(props);

  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const [investType, setInvestType] = useState(funnelData.investTypeDisplay || 'onetime');

  const handleClick = () => {
    sendEvents('next')
    updateFunnelData({
      amount: '',
      investTypeDisplay: investType,
      order_type: investType
    });
    navigate(`instaredeem/amount`);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": 'select order type',
        "flow": "insta-redeem",
        "order_type": investType
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
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
