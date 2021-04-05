import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getSummaryV2 } from "../../common/api";
import {
  navigate as navigateFunc,
  dateOrdinalSuffix,
} from "../../common/functions";
import { getConfig } from "utils/functions";

const Sip = (props) => {
  const productName = getConfig().productName;
  const navigate = navigateFunc.bind(props);
  const [report, setreports] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    storageService().remove(storageConstants.PAUSE_SIP);
    storageService().remove(storageConstants.SELECTED_SIP);
    storageService().remove(storageConstants.PAUSE_REQUEST_DATA);
    const result = await getSummaryV2();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setreports(result.report);
    setShowSkelton(false);
  };

  const showDetail = (item) => {
    storageService().set(storageConstants.SELECTED_SIP, item.id);
    storageService().setObject(storageConstants.PAUSE_SIP, item);
    navigate(getPathname.sipDetails);
  };

  const formatName = (name) => {
    if (name === "init") {
      name = "mandate pending";
    }
    return name.replace(/_/g, " ").toUpperCase();
  };

  return (
    <Container title="Existing SIPs" noFooter={true} skelton={showSkelton}>
      <div className="reports-sip">
        {!showSkelton &&
          !isEmpty(report) &&
          report.sips.active_sips.map((sip, index) => {
            return (
              <div key={index} className="sip" onClick={() => showDetail(sip)}>
                <div
                  className={`status ${
                    sip.friendly_status === "cancelled"
                      ? "red"
                      : sip.friendly_status === "active"
                      ? "green"
                      : sip.friendly_status === "paused"
                      ? "blue"
                      : "yellow"
                  }`}
                >
                  <div className="dot"></div>
                  <div className="name">{formatName(sip.friendly_status)}</div>
                </div>
                <div className="mf-name">{sip.mfname}</div>
                <div className="bottom">
                  <div className="content">
                    <img
                      alt=""
                      src={require(`assets/${productName}/sip_date_icon.svg`)}
                    />
                    <div>
                      {sip.next_trans.split(" ")[0]}
                      <sup>
                        {dateOrdinalSuffix(sip.next_trans.split(" ")[0])}
                      </sup>{" "}
                      of the month
                    </div>
                  </div>
                  <div className="content">
                    <img
                      alt=""
                      src={require(`assets/${productName}/amount_icon.svg`)}
                    />
                    <div>{formatAmountInr(sip.amount)}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Container>
  );
};

export default Sip;
