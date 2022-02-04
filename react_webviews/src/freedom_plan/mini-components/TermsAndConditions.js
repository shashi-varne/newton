import React, { useMemo } from "react";
import { getConfig } from "../../utils/functions";
import Button from "../../common/ui/Button";
import WVFullscreenDialog from "../../common/ui/FullscreenDialog/WVFullscreenDialog";
import { getFreedomPlanTermsAndConditions } from "../common/constants";
import noop from "lodash/noop";
import "./mini-components.scss";

const TermsAndConditions = ({ isOpen = false, close = noop }) => {
  const freedomPlanTermsAndConditions = useMemo(
    getFreedomPlanTermsAndConditions(getConfig().websiteLink),
    []
  );
  return (
    <WVFullscreenDialog
      onClose={close}
      open={isOpen}
      closeIconPosition="left"
      title="Freedom plan : Terms and conditions"
      classes={{
        wvTitle: "fp-tnc-title",
      }}
      dataAidSuffix="freedomPlanTermsAndCond"
    >
      <WVFullscreenDialog.Content>
        {freedomPlanTermsAndConditions.map((text, index) => (
          <div className="freedom-plan-terms-n-conditions flex" key={index} data-aid={`tv_description${index+1}`} >
            <div className="fp-tnc-left">{index + 1}.</div>
            <div>{text}</div>
          </div>
        ))}
      </WVFullscreenDialog.Content>
      <WVFullscreenDialog.Action>
        <Button buttonTitle="CLOSE" onClick={close} />
      </WVFullscreenDialog.Action>
    </WVFullscreenDialog>
  );
};

export default TermsAndConditions;
