import React, { useEffect } from "react";
import { getBasePath, getConfig } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import { getUrlParams } from "../../utils/validators";
import { updateQueryStringParameter } from "../common/functions";

let basepath = getBasePath();
let back_url = basepath + "/status/callback/native" + getConfig().searchParams;

const NativeRedirection = (props) => {
  const urlParams = getUrlParams() || {};

  useEffect(() => {
    const { dl_url, esign_url, state } = urlParams;
    let url = "";
    if (dl_url) {
      url = updateQueryStringParameter(dl_url, "redirect_url", back_url);
    } else if (esign_url) {
      url = `${esign_url}&state=${state}`
    }
    redirect(url);
  }, [urlParams]);

  const redirect = (url) => {
    if (getConfig().isNative) {
      nativeCallback({
        action: "take_control",
        message: {
          back_url: back_url,
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

export default NativeRedirection;
