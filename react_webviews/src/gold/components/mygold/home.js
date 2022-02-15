import React from "react";
import { getConfig } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import Container from "../../common/Container";

const mmtcLink = "https://dgsweb.mmtcpamp.com/";
const safeGoldLink = "https://www.safegold.com/";

const GoldHomeClosure = (props) => {
  const openInBrowser = (url) => {
    nativeCallback({
      action: "open_in_browser",
      message: {
        url: url,
      },
    });
  };

  const redirectToHome = () => {
    const config = getConfig();
    if (config.isNative || config.isSdk) {
      nativeCallback({ action: "exit_web" });
    } else {
      props.history.push({
        pathname: "/invest",
      });
    }
  };

  const headerData = {
    icon: "close",
    goBack: redirectToHome,
  };

  return (
    <Container
      title="Discontinuation of Digital Gold product"
      buttonTitle="OKAY"
      handleClick={redirectToHome}
      headerData={headerData}
    >
      <div className="gold-home">
        <div className="subtext">
          In light of the new SEBI directive, we will be discontinuing Digital
          Gold starting 15 February 2022.
        </div>

        <div className="subtext">
          This will not impact your gold investments at all. You will be able to
          buy and sell digital gold just like before, but now on
          MMTC-PAMP's/Safegold's secure online platform starting 16 February
          2022.
        </div>

        <div className="subtext">
          Going forward, MMTC-PAMP/Safegold will continue to retain all the
          holdings of gold as usual and will offer redemption, sell-back & other
          digital gold-related services for all of our existing users.
        </div>

        <div className="subtext">
          As mentioned above – this will in no regard affect your existing gold
          investments. Digital gold purchased by you will remain 100% secure
          under the direct ownership of MMTC-PAMP's/Safegold's secured and fully
          insured, bank-grade vaults.
        </div>

        <div className="subtext">
          Click on the link below to login and access your digital gold account.
        </div>

        <div style={{marginBottom: '5px'}}>
          MMTC-PAMP :{" "}
          <span className="link" onClick={() => openInBrowser(mmtcLink)}>
            {mmtcLink}
          </span>
        </div>
        <div>
          Safegold :{" "}
          <span className="link" onClick={() => openInBrowser(safeGoldLink)}>
            {safeGoldLink}
          </span>
        </div>

        <div className="contact">
          For any further queries, write to us at{" "}
          <span className="email">{getConfig().email}</span> or to MMTC-PAMP at{" "}
          <span className="email">customercare@mmtcpamp.com</span> or to
          Safegold at <span className="email">care@safegold.in</span>
        </div>
      </div>
    </Container>
  );
};

export default GoldHomeClosure;
