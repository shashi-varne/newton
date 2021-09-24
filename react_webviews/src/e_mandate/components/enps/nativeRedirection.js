import React, { useEffect, useState } from "react";

import { nativeCallback } from "utils/native_callback";
import { getConfig, getBasePath } from "utils/functions";
import Container from "../../common/Container";
import UiSkelton from "common/ui/Skelton";

const NativeEsignRedirection = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    let basepath = getBasePath();
    let current_url =
      basepath +
      "/e-mandate/enps/native-redirection" +
      getConfig().searchParams;
    var pgLink =
      getConfig().base_url + "/page/nps/user/esign/" + getConfig().pc_urlsafe;
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
    } else {
      let redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "Are you sure you want to exit?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: current_url,
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "webview",
        },
      };
      if (getConfig().app === "ios") {
        redirectData.show_toolbar = true;
      }
      nativeCallback({
        action: "third_party_redirect",
        message: redirectData,
      });
    }

    console.log(pgLink);
    window.location.href = pgLink;
  }, []);

  return <Container noFooter={true}>{<UiSkelton type="g" />}</Container>;
};

export default NativeEsignRedirection;
