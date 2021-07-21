import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import Button from "common/ui/Button";
import {
  getProjectedValue,
  getAmountInInr,
} from "../../common/functions";
import { getPathname, storageConstants } from "../../constants";
import { getSummaryV2 } from "../../common/api";
import useUserKycHook from "../../../kyc/common/hooks/userKycHook";
import "./commonStyles.scss";
import CheckInvestment from "../mini-components/CheckInvestment";

const config = getConfig();
const productName = config.productName;
const Summary = (props) => {
  const navigate = navigateFunc.bind(props);
  const [report, setReportData] = useState({});
  const [current, setCurrent] = useState(true);
  const [investData, setInvestData] = useState({
    amount: 500,
    time: 1,
    investType: "sip",
    projectedValue: getProjectedValue(500, 1, "sip"),
  });
  const [data, setData] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [investCards, setInvestCards] = useState({});
  const [isAmountSliderUsed, setIsAmountSliderUsed] = useState(false);
  const [isYearSliderUsed, setIsYearSliderUsed] = useState(false);
  const { user: currentUser, isLoading } = useUserKycHook();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const investSections = config.investSections;
    const investSubSectionMap = config.investSubSectionMap;
    const keysToCheck = ["nps", "insurance", "gold"];
    const cardsToShow = {};
    for (let section of investSections) {
      if (!isEmpty(investSubSectionMap[section])) {
        for (let subSections of investSubSectionMap[section]) {
          if (keysToCheck.includes(subSections)) {
            cardsToShow[subSections] = true;
          }
        }
      }
    }
    setInvestCards(cardsToShow);
    const result = await getSummaryV2();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setReportData(result.report);
    const reportData = result.report;
    let Data = { ...data };
    Data.insurance_active =
      reportData.insurance_details.insurance_active || false;
    Data.gold_active_investment =
      reportData.gold_details.gold_active_investment || false;
    Data.gold_details = reportData.gold_details;
    storageService().setObject(
      storageConstants.PENDING_PURCHASE,
      reportData?.pending?.invested_transactions
    );
    storageService().setObject(
      storageConstants.PENDING_REDEMPTION,
      reportData?.pending?.redeemed_transactions
    );
    storageService().setObject(
      storageConstants.SIPS,
      reportData?.sips?.active_sips
    );
    storageService().setObject(
      storageConstants.PENDING_SWITCH,
      reportData?.pending?.switch_transactions
    );
    Data.showTrackGoals = reportData.current.invested > 0 ? true : false;
    Data.showPendingPurchase = reportData.pending.invested > 0 ? true : false;
    Data.showPendingRedemption = reportData.pending.redeemed > 0 ? true : false;
    Data.showPendingSwitched = reportData.pending.switched > 0 ? true : false;
    Data.showSipScheduleAmount =
      reportData.sips.total_payment > 0 ? true : false;
    Data.showSipSchedule =
      reportData.sips.active_sips.length > 0 ? true : false;
    Data.showTransactions = reportData.current.current > 0 ? true : false;
    setData({ ...Data });
    setShowSkelton(false);
  };

  const handleChange = (name) => (event) => {
    if (name === "time") setIsYearSliderUsed(true);
    if (name === "amount") setIsAmountSliderUsed(true);
    let value = event.target ? event.target.value : event;
    handleInvestData(name, value);
  };

  const handleInvestData = (name, value) => {
    let investValues = { ...investData };
    investValues[name] = value;
    if (name === "investType") {
      setIsAmountSliderUsed(false);
      investValues.amount = investValues.investType === "sip" ? 500 : 5000;
    }
    investValues[`${name}_error`] = "";
    const projectedValue = getProjectedValue(
      investValues.amount,
      investValues.time,
      investValues.investType
    );
    investValues.projectedValue = projectedValue;
    setInvestData(investValues);
  };

  const flowOptions = (name) => {
    switch (name) {
      case "reportsSip":
        sendEvents("next", "Existing SIPs");
        break;
      case "reportsTransactions":
        sendEvents("next", "Transactions");
        break;
      case "reportsFundswiseSummary":
        sendEvents("next", "Track Fund Performance");
        break;
      case "reportsSwitched":
        sendEvents("next", "Pending Switch");
        break;
      case "reportsRedeemed":
        sendEvents("next", "Pending Withdrawals");
        break;
      case "reportsPurchased":
        sendEvents("next", "Pending Purchase");
        break;
      case "npsInvestments":
        sendEvents("next", "NPS Investments");
        break;
      default:
        sendEvents("next");
        break;
    }
    navigate(getPathname[name], { state: { fromPath: "reports" } });
  };

  const redirectWithdraw = () => {
    sendEvents("next", "Withdraw");
    if (currentUser.kyc_registration_v2 === "complete") {
      navigate(`${getPathname.withdrawReason}`);
      return;
    } else {
      navigate(getPathname.withdraw);
      return;
    }
  };

  const toggleheader = () => {
    setCurrent(!current);
  };

  const showGoals = () => {
    sendEvents("next", "Track my goals");
    if (report.invested === 0) return;
    navigate(getPathname.reportGoals);
  };

  const sendEvents = (userAction, flow) => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "my money",
        flow: flow || "",
        mode: (investData?.investType === "sip" ? "sip" : "ot") || "",
        invested_amount_slider: isAmountSliderUsed ? "yes" : "no",
        years_slider: isYearSliderUsed ? "yes" : "no",
        // "investment_graph": $scope.isGraphUsed ? "yes" : "no", // To be checked
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  const investMore = () => {
    const config = getConfig();
    var _event = {
      'event_name': 'journey_details',
      'properties': {
        'journey': {
          'name': 'reports',
          'trigger': 'cta',
          'journey_status': 'complete',
          'next_journey': 'mf'
        }
      }
    };
    sendEvents("next", "Explore Mutual Funds");
    // send event
    if (!config.Web) {
      window.callbackWeb.eventCallback(_event);
    } else if (config.isIframe) {
      window.callbackWeb.sendEvent(_event);
    }

    if(!config.isIframe || config.code === "moneycontrol") {
      navigate(getPathname.invest)
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      title="My Money"
      noFooter={true}
      skelton={showSkelton || isLoading}
      data-aid='reports-summary-screen'
    >
      <div className="reports" data-aid='reports'>
        {!isEmpty(report) && (
          <>
            <header className="reports-header" data-aid='reports-header'>
              {current && (
                <>
                  <div className="title">Current Value</div>
                  <div className="amount">
                    {formatAmountInr(report.current?.current || 0)}
                  </div>
                  {report.current.invested > 0 && (
                    <>
                      <div className="title " data-aid='reports-current-invested'>
                        1 Day Change:{" "}
                        {report.current.one_day_earnings.amount >= 0 ? (
                          <span className="summary-green-text">
                            {formatAmountInr(
                              report.current.one_day_earnings.amount
                            )}{" "}
                            (
                            {report.current.one_day_earnings.percent.toFixed(1)}
                            %)
                          </span>
                        ) : (
                          <span className="summary-red-text">
                            -{" "}
                            {formatAmountInr(
                              -1 * report.current.one_day_earnings.amount
                            )}{" "}
                            (
                            {report.current.one_day_earnings.percent.toFixed(1)}
                            %)
                          </span>
                        )}
                      </div>
                      <div className="row" data-aid='reports-row'>
                        <div className="content">
                          <div>Amount Invested</div>
                          <div>{formatAmountInr(report.current.invested)}</div>
                        </div>
                        <div className="content">
                          <div>Earnings</div>
                          <div
                            className={
                              report.current.earnings >= 0 &&
                              "summary-green-text"
                            }
                          >
                            {formatAmountInr(report.current.earnings)}
                          </div>
                        </div>
                      </div>
                      {report.past.redeemed > 0 && (
                        <div className="pointer" data-aid='reports-pointer' onClick={() => toggleheader()}>
                          View redeemed investments
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {!current && (
                <>
                  <div className="title" data-aid='reports-redeemed-value'>Redeemed Value</div>
                  <div className="amount" data-aid='reports-amount-value'>
                    {formatAmountInr(report.past.redeemed)}
                  </div>
                  <div className="row" data-aid='reports-row'>
                    <div className="content">
                      <div>Purchase Cost</div>
                      <div>
                        {formatAmountInr(report.past.invested_cost_price)}
                      </div>
                    </div>
                    <div className="content">
                      <div>Earnings</div>
                      <div
                        className={
                          report.past.earnings > 0 && "summary-green-text"
                        }
                      >
                        {getAmountInInr(report.past.earnings)}
                      </div>
                    </div>
                  </div>
                  <div className="pointer" data-aid='reports-pointer' onClick={() => toggleheader()}>
                    View current investments
                  </div>
                </>
              )}
            </header>
            <main data-aid='reports-summary-main'>
              {!currentUser.active_investment && report.pending.invested === 0 && (
                <div className="invest-more" data-aid='reports-invest-more'>
                  <div className="invest-more-content">
                    <p>
                      You have not invested in Mutual Funds!
                      <br />
                      <b>Invest today & grow your wealth</b>
                    </p>
                    <Button
                      dataAid='reports-explore-mf-btn'
                      onClick= {investMore}
                      buttonTitle="Explore Mutual Funds"
                      classes={{
                        button: "reports-invest-button",
                      }}
                    />
                  </div>
                  <img src={require(`assets/plant.svg`)} alt="" />
                </div>
              )}
              {currentUser.nps_investment ||
              data.showTrackGoals ||
              data.showPendingPurchase ||
              data.showPendingRedemption ||
              data.showSipSchedule ||
              data.showTransactions ? (
                <>
                  {currentUser.nps_investment && investCards.nps && (
                    <SummaryCard
                      dataAid='nps-investments'
                      goNext={() => flowOptions("npsInvestments")}
                      icon={`nps_report_icon.svg`}
                      title="NPS Investments"
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showTrackGoals && (
                    <SummaryCard
                      dataAid="track-my-goals"
                      goNext={showGoals}
                      icon={`goalwise.svg`}
                      title="Track my goals"
                      subtitle="View Goal Wise Investments"
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showPendingPurchase && (
                    <SummaryCard
                      dataAid='pending-purchase'
                      goNext={() => flowOptions("reportsPurchased")}
                      icon={`pending_purchase.svg`}
                      title="Pending Purchase"
                      subtitle={formatAmountInr(report.pending.invested)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showPendingRedemption && (
                    <SummaryCard
                      dataAid='pending-withdrawals'
                      goNext={() => flowOptions("reportsRedeemed")}
                      icon={`pending_redemption.svg`}
                      title="Pending Withdrawals"
                      subtitle={formatAmountInr(report.pending.redeemed)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showPendingSwitched && (
                    <SummaryCard
                      dataAid='pending-switch'
                      goNext={() => flowOptions("reportsSwitched")}
                      icon={`pending_purchase.svg`}
                      title="Pending Switch"
                      subtitle={formatAmountInr(report.pending.switched)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showSipSchedule && (
                    <SummaryCard
                      dataAid='existing-sip'
                      goNext={() => flowOptions("reportsSip")}
                      icon={`sip.svg`}
                      title="Existing SIPs"
                      subtitle={formatAmountInr(report.sips.total_payment)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showTransactions && (
                    <>
                      <SummaryCard
                        dataAid='transactions'
                        goNext={() => flowOptions("reportsTransactions")}
                        icon={`transactions.svg`}
                        title="Transactions"
                        iconClassName={
                          productName === "finity" && "reports-finity-icon"
                        }
                      />
                      <SummaryCard
                        dataAid='track-fund-performance'
                        goNext={() => flowOptions("reportsFundswiseSummary")}
                        icon={`fundwise.svg`}
                        title="Track Fund Performance"
                        subtitle="View fund wise summary"
                        iconClassName={
                          productName === "finity" && "reports-finity-icon"
                        }
                      />
                    </>
                  )}
                </>
              ) : (
                <CheckInvestment
                  investData={investData}
                  handleChange={handleChange}
                  handleInvestData={handleInvestData}
                />
              )}
              <SummaryCard
                dataAid='withdraw'
                goNext={() => redirectWithdraw()}
                icon="ic_pf_withdraw.svg"
                title="Withdraw"
                subtitle="Withdraw your funds"
              />
              {data.insurance_active && investCards.insurance && (
                <SummaryCard
                  dataAid='insurance'
                  goNext={() => {
                    sendEvents("next", "Insurance");
                    navigate("/group-insurance/common/report");
                  }}
                  icon="ic_pf_insurance.svg"
                  title="Insurance"
                />
              )}
              {data.gold_active_investment && investCards.gold && (
                <SummaryCard
                  dataAid='gold'
                  goNext={() => {
                    sendEvents("next", "Gold");
                    navigate("/gold/my-gold");
                  }}
                  icon="ic_pf_gold.svg"
                  title="Gold"
                  subtitle={`${data?.gold_details?.total_balance || 0} gm`}
                />
              )}
            </main>
          </>
        )}
      </div>
    </Container>
  );
};

export default Summary;

export const SummaryCard = ({
  icon,
  goNext,
  title,
  subtitle,
  iconClassName,
  dataAid,
}) => {
  return (
    <div className="content" data-aid={dataAid} onClick={goNext}>
      <img
        alt=""
        src={require(`assets/${productName}/${icon}`)}
        className={iconClassName}
      />
      <div className="text">
        <div className="title">{title}</div>
        <div>{subtitle}</div>
      </div>
    </div>
  );
};
