import React, { useEffect } from "react";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import Container from "../../common/Container";
import UiSkelton from "common/ui/Skelton";

const NativeEsignCalllback = () => {
  useEffect(() => {
    getNpsStatus();
  });

  const getNpsStatus = async () => {
    try {
      const res = await Api.get(
        "/api/nps/esign/status/" + getConfig().pc_urlsafe
      );

      if (res.pfwresponse.result && !res.pfwresponse.result.error) {
        let result = res.pfwresponse.result;
        if (result.esign === true) {
          nativeCallback({ action: "on_success" });
        } else {
          nativeCallback({ action: "on_failure" });
        }
      } else {
        nativeCallback({ action: "on_failure" });
      }
    } catch (err) {
      nativeCallback({ action: "on_failure" });
    }
  };

  return (
    <Container noFooter={true}>
      <UiSkelton type="g" />
    </Container>
  );
};

export default NativeEsignCalllback;
