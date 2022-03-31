import React, { useMemo, useState } from "react";
import Container from "../../common/Container";
import { Imgc } from "../../../common/ui/Imgc";

import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import useUserKycHook from "../../common/hooks/userKycHook";
// import { nativeCallback } from "../../../utils/native_callback";
import { getMfVsTradingData } from "../common/constants";
import { PATHNAME_MAPPER } from "../../constants";
import { triggerAocPaymentDecision } from "../../common/api";
import { getAocData, isEquityAocApplicable } from "../common/functions";

import "./MfAndTradingDifference.scss";

const MFAndTradingDifferences = (props) => {
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const { isMobileDevice, searchParams } = useMemo(getConfig, []);
  const [showLoader, setShowLoader] = useState(false);
  const [errorData, setErrorData] = useState({});

  const mfVsTradingData = useMemo(
    getMfVsTradingData(getAocData(kyc).amount, !isEquityAocApplicable(kyc)),
    [kyc]
  );

  // const sendEvents = (userAction) => {
  //   let eventObj = {
  //     event_name: "trading_onboarding",
  //     properties: {
  //       user_action: userAction || "",
  //       screen_name: "mf_vs_trading",
  //     },
  //   };
  //   if (userAction === "just_set_events") {
  //     return eventObj;
  //   } else {
  //     nativeCallback({ events: eventObj });
  //   }
  // };

  const handleClick = async () => {
    // sendEvents("next");
    setErrorData({});
    try {
      setShowLoader("button");
      const result = await triggerAocPaymentDecision({ status: "skip" });
      if (result.kyc) {
        updateKyc(result.kyc);
      }
      if (kyc.kyc_status === "compliant" || kyc.sign_status === "signed") {
        navigate(PATHNAME_MAPPER.kycEsignNsdl, {
          searchParams: `${searchParams}&status=success`,
        });
      } else {
        navigate(PATHNAME_MAPPER.kycEsign);
      }
    } catch (err) {
      setErrorData({
        showError: true,
        title2: err.message,
        handleClick1: handleClick,
      });
    } finally {
      setShowLoader(false);
    }
  };

  const handleChangeAccountType = () => {
    // sendEvents("next");
    if (showLoader) return;
    navigate(PATHNAME_MAPPER.aocSelectAccount);
  };

  return (
    <Container
      skelton={isLoading}
      title="Account type - Mutual fund only"
      // events={sendEvents("just_set_events")}
      handleClick={handleClick}
      data-aid="mfAndTradingDifference"
      errorData={errorData}
      showError={errorData.showError}
      twoButtonVertical={true}
      button1Props={{
        variant: "outlined",
        title: "Continue with mutual fund only",
        onClick: handleClick,
        showLoader,
      }}
      button2Props={{
        variant: "contained",
        title: "Change account type",
        onClick: handleChangeAccountType,
      }}
    >
      <div
        className={`aoc-mf-vs-trading ${
          isMobileDevice && "aoc-mf-vs-trading-mobile-view"
        }`}
      >
        <div className="aoc-mfvt-subtitle">
          Products & features you’ll miss out on
        </div>
        <MfVsTrading data={mfVsTradingData} />
      </div>
    </Container>
  );
};

export default MFAndTradingDifferences;

const getTableData = (data) => {
  const tableHeaderData = data[0];
  const tableBodyData = data.slice(1);
  return {
    tableHeaderData,
    tableBodyData,
  };
};

const TableRow = ({ data = {}, index }) => (
  <tr className={data.className}>
    <td className="mftd-tc-type" data-aid={`tv_title${index}`}>
      {data.type}
      {data.subText && <span className="mftd-tc-subtext">{data.subText}</span>}
    </td>

    <td className="mftd-tc-mf" data-aid={`tv_mfDescription${index}`}>
      {data.mf}
      {data.mfIcon && <Imgc src={require(`assets/${data.mfIcon}.svg`)} />}
    </td>
    <td className="mftd-tc-trading" data-aid={`tv_tradingDescription${index}`}>
      {data.amount && (
        <div
          className={`mftd-amount ${data.strikeOut && "mftd-strike-amount"}`}
        >
          {data.amount}
        </div>
      )}
      {data.trading}
      {data.tradingIcon && (
        <Imgc src={require(`assets/${data.tradingIcon}.svg`)} />
      )}
    </td>
  </tr>
);

const MfVsTrading = ({ data = [] }) => {
  const { tableBodyData = [], tableHeaderData = {} } = getTableData(data);
  return (
    <table className="mftd-table-content" cellSpacing="0">
      <thead>
        <TableRow data={tableHeaderData} index={0} />
      </thead>
      <tbody>
        {tableBodyData.map((data, index) => {
          return <TableRow key={index} data={data} index={index + 1} />;
        })}
      </tbody>
    </table>
  );
};
