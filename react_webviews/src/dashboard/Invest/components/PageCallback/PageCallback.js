import React from "react";
import { navigate as navigateFunc } from "utils/functions";

const PageCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props.match.params || {};
  let { investment_type, status, message } = params;
  if (!status) {
    navigate("/invest");
  } else {
    if (!message) message = "";
    if (investment_type === "sip") {
      navigate(`/sip/payment/callback/${status}/${message}`);
    } else if (investment_type === "onetime") {
      navigate(`/payment/callback/${status}/${message}`);
    } else {
      navigate("/invest");
    }
  }
  return <div></div>;
};

export default PageCallback;
