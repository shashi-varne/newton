import React, { useEffect, useState } from "react";
import WVInfoBubble from "../../common/ui/InfoBubble/WVInfoBubble";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";

const StatusCallback = (props) => {
  const status = getUrlParams().status || "";
  const params = props.match?.params || {};
  const [error, setError] = useState("");

  useEffect(() => {
    if (status) {
      if (status === "success") {
        nativeCallback({ action: "on_success" });
      } else if (status === "failed") {
        nativeCallback({ action: "on_failure" });
      }
    } else {
      setError("Something went wrong. No status received");
    }
  }, [status])

  useEffect(() => {
    if (params) {
      if (params === "success") {
        nativeCallback({ action: "on_success" });
      } else if (params === "failed") {
        nativeCallback({ action: "on_failure" });
      }
    } else {
      setError("Something went wrong. No status received");
    }
  }, [params])

  return (
    <div>
      {error ? 
        <WVInfoBubble
        type="error"
        hasTitle
        customTitle="Error"
      >
        {error}
      </WVInfoBubble>
      :
      null
      }
    </div>
  );
};

export default StatusCallback;
