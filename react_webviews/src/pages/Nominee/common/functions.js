import { getConfig } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import { NOMINEE_PATHNAME_MAPPER } from "./constants";

export const handleNomineeExit = (navigate) => {
  const config = getConfig();
  if (config.isWebOrSdk) {
    navigate(NOMINEE_PATHNAME_MAPPER.myAccount);
  } else {
    nativeCallback({ action: "exit_web" });
  }
};
