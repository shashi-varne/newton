import React, { useEffect } from "react";
import { getBasePath, getConfig } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";

const StatusCallback = (props) => {
  const urlParams = getUrlParams() || "";

  useEffect(() => {
    const { dl_url, esign_url, state } = urlParams;
    let url = "";
    if (dl_url) {
      url = dl_url;
    } else if (esign_url) {
      url = esign_url + '&state=' + state;
    }
    redirect(url);
  }, [urlParams]);

  const redirect = (url) => {
    let basepath = getBasePath();
    let current_url =
      basepath + "/status/callback/native" + getConfig().searchParams;

    if (getConfig().isNative) {
      nativeCallback({
        action: "take_control",
        message: {
          back_url: current_url,
          back_text: "You are almost there, do you really want to go back?",
        },
      });
    }

    if (url) {
      window.location.href = url;
    }
  };

  return <div></div>;
};

export default StatusCallback;
