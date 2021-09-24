import React, { Component } from "react";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import Api from "utils/api";
import Container from "../../common/Container";
import UiSkelton from "common/ui/Skelton";

class NativeEsignCalllback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pc_urlsafe: getConfig().pc_urlsafe,
    };
  }

  async componentDidMount() {
    try {
      const res = await Api.get(
        "/api/nps/esign/status/" + this.state.pc_urlsafe
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
  }

  render() {
    return (
      <Container noFooter={true}>
        <UiSkelton type="g" />
      </Container>
    );
  }
}

export default NativeEsignCalllback;
