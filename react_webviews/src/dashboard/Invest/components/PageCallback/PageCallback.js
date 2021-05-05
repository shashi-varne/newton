import React from "react";
import { navigate as navigateFunc } from "utils/functions";

const PageCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const params = props.match.params || {};
  let { investment_type, status, message } = params;
  if (!status) {
    navigate("/invest", null, true);
  } else {
    if (!message) message = "";
    if (investment_type === "sip") {
      navigate(`/sip/payment/callback/${status}/${message}`, null, true);
    } else if (investment_type === "onetime") {
      navigate(`/payment/callback/${status}/${message}`, null, true);
    } else {
      navigate("/invest", null, true);
    }
  }
  return <div></div>;
};

export default PageCallback;
