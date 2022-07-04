import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import WithdrawPlaced from "../../pages/ReferAndEarn/WithdrawPlaced";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../constants/referAndEarn";

const withdrawPlacedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const amount = props?.location?.state?.amount || "";

  const goToSuccess=()=>{
    navigate(REFER_AND_EARN_PATHNAME_MAPPER.successDetails, {
      state: {
        amount: amount,
      },
      action:'replace'
    });
  }

  return (
    <WrappedComponent
      amount={amount}
      productName={productName}
      navigate={navigate}
      goToSuccess={goToSuccess}
    />
  );
};

export default withdrawPlacedContainer(WithdrawPlaced);
