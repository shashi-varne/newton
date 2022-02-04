import React, { useEffect, useState } from "react";
import WVInfoBubble from "common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "utils/native_callback";

const PaymentNativeCallback = (props) => {
  const params = props.match?.params || {};
  const [error, setError] = useState("");

  useEffect(() => {
    if (params) {
      console.log(params)
      if (params.status === "success") {
        nativeCallback({ action: "on_success" });
      } else if (params.status === "failed") {
        nativeCallback({ action: "on_failure" });
      }
    } else {
      setError("Something went wrong. No status received");
    }
  }, [params]);

  return (
    <div>
      {error ? (
        <WVInfoBubble type="error" hasTitle customTitle="Error">
          {error}
        </WVInfoBubble>
      ) : null}
    </div>
  );
};

export default PaymentNativeCallback;
