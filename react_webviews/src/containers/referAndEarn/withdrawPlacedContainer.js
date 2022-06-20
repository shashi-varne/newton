import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import WithdrawPlaced from "../../pages/ReferAndEarn/WithdrawPlaced";

const withdrawPlacedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const amount = props?.location?.state?.amount || "";

  return (
    <WrappedComponent
      amount={amount}
      productName={productName}
      navigate={navigate}
    />
  );
};

export default withdrawPlacedContainer(WithdrawPlaced);
