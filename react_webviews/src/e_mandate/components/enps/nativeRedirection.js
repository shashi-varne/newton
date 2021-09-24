import React, { Component } from "react";

import { nativeCallback } from "utils/native_callback";
import { getConfig, getBasePath } from "utils/functions";
import Container from "../../common/Container";
import UiSkelton from "common/ui/Skelton";

class NativeEsignRedirection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pc_urlsafe: getConfig().pc_urlsafe,
    };
  }

  cmponentWillMount() {
    let basepath = getBasePath();
    let current_url =
      basepath + "/e-mandate/enps/native-redirection" + getConfig().searchParams;
    var pgLink =
      getConfig().base_url + "/page/nps/user/esign/" + this.state.pc_urlsafe;
    if (getConfig().isNative) {
      if (getConfig().app === "ios") {
        nativeCallback({
          action: "show_top_bar",
          message: {
            title: "Activate NPS",
          },
        });
      }
      nativeCallback({
        action: "take_control",
        message: {
          back_url: current_url,
          back_text: "You are almost there, do you really want to go back?",
        },
      });
    }

    window.location.href = pgLink;
  }

  render() {
    return (
      <Container noFooter={true}>
        <UiSkelton type="g" />
      </Container>
    );
  }
}

export default NativeEsignRedirection;
