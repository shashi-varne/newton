import React, { useMemo } from "react";
import { getConfig } from "utils/functions";
import { nativeCallback, openPdfCall } from "../../utils/native_callback";
import SebiRegistrationFooter from "../../common/ui/SebiRegistrationFooter/WVSebiRegistrationFooter";
import Checkbox from "../../common/ui/Checkbox";

const TermsAndConditions = ({
  checkTermsAndConditions,
  handleCheckBox,
  setShowSkelton,
}) => {
  const config = useMemo(getConfig, []);

  const openInBrowser = (url) => () => {
    nativeCallback({
      action: "open_browser",
      message: {
        url: url,
      },
    });
  };

  const openPdf = (url) => () => {
    if (config.iOS) {
      nativeCallback({
        action: "open_inapp_tab",
        message: {
          url: url || "",
          back_url: "",
        },
      });
    } else {
      setShowSkelton(true);
      const data = {
        url: url,
        header_title: "EQUITY ANNEXURE",
        icon: "close",
      };

      openPdfCall(data, config.isSdk);
    }
  };
  return (
    <div className="kyc-terms-and-conditions">
      <div className="kaim-terms" data-aid="kaim-terms">
        <Checkbox
          checked={checkTermsAndConditions}
          handleChange={handleCheckBox}
        />
        <div className="kaim-terms-info">
          I agree to have read and understood the{" "}
          {config.Web ? (
            <>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={config.termsLink}
                className="terms-text"
              >
                Terms & conditions
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={config.equityAnnexure}
                className="terms-text"
              >
                Equity Annexure
              </a>{" "}
            </>
          ) : (
            <>
              <span
                className="terms-text"
                onClick={openInBrowser(config.termsLink)}
              >
                Terms & conditions
              </span>{" "}
              and{" "}
              <span
                className="terms-text"
                onClick={openPdf(config.equityAnnexure)}
              >
                Equity Annexure
              </span>{" "}
            </>
          )}
        </div>
      </div>
      <div className="line-divider bottom-line-divider" />
      <SebiRegistrationFooter />
    </div>
  );
};

export default TermsAndConditions;
