import React, { useEffect, useState } from "react";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";

const StatusCallback = (props) => {
  const status = getUrlParams().status || props.location.state.status || "";
  const message = getUrlParams().message || props.location.state.message || "";
  const [error, setError] = useState("");

  useEffect(() => {
    if (status) {
      if (status === "success") {
        nativeCallback({
          action: "on_success",
          rnData: { status: "success", message: message },
        });

      } else if (status === "failed") {
        nativeCallback({
          action: "on_failure",
          rnData: { status: "failure", message: message },
        });
      } else if (status === "cancelled") {
        nativeCallback({ action: "on_cancelled" });
      }
    } else {
      setError("Something went wrong. No status received");
      nativeCallback({ action: "on_cancelled" });
    }
  }, [status]);

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

export default StatusCallback;
