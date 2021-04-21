import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import {
  formatAmountInr,
  isEmpty,
  storageService,
  numDifferentiation,
} from "utils/validators";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import Slider from "common/ui/Slider";
import {
  navigate as navigateFunc,
  getProjectedValue,
  redirectToReports,
  getAmountInInr,
} from "../../common/functions";
import { getPathname, storageConstants } from "../../constants";
import { getSummaryV2 } from "../../common/api";
import useUserKycHook from "../../../kyc/common/hooks/userKycHook";
import "./commonStyles.scss";

const Summary = (props) => {
  const config = getConfig();
  const productName = config.productName;
  const navigate = navigateFunc.bind(props);
  const [report, setReportData] = useState({});
  const [current, setCurrent] = useState(true);
  const [invest_data, setInvestData] = useState({
    amount: 500,
    time: 1,
    invest_type: "sip",
    projectedValue: getProjectedValue(500, 1, "sip"),
  });
  const [data, setData] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [investCards, setInvestCards] = useState({});
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
    let value = event.target ? event.target.value : event;
    handleInvestData(name, value);
  };

  const handleInvestData = (name, value) => {
    let investData = { ...invest_data };
    investData[name] = value;
    if (name === "invest_type") {
      investData.amount = investData.invest_type === "sip" ? 500 : 5000;
      investData.time = 1;
    }
    investData[`${name}_error`] = "";
    const projectedValue = getProjectedValue(
      investData.amount,
      investData.time,
      investData.invest_type
    );
    investData.projectedValue = projectedValue;
    setInvestData(investData);
  };

  const flowOptions = (name) => {
    navigate(getPathname[name]);
  };

  const redirectWithdraw = () => {
    if (currentUser.kyc_registration_v2 === "complete") {
      navigate(`${getPathname.withdrawReason}portfolio`);
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
    if (report.invested === 0) return;
    navigate(getPathname.reportGoals);
  };

  const imageMapper = {
    finity: "svg",
    fisdom: "png",
  };
  console.log(productName);
  return (
    <Container
      title="My Money"
      noFooter={true}
      skelton={showSkelton || isLoading}
    >
      <div className="reports">
        {!isEmpty(report) && (
          <>
            <header>
              {current && (
                <>
                  <div className="title">Current Value</div>
                  <div className="amount">
                    {formatAmountInr(report.current.current)}
                  </div>
                  {report.current.invested > 0 && (
                    <>
                      <div className="title ">
                        1 Day Change:{" "}
                        {report.current.one_day_earnings.amount >= 0 ? (
                          <span className="green">
                            {formatAmountInr(
                              report.current.one_day_earnings.amount
                            )}{" "}
                            (
                            {report.current.one_day_earnings.percent.toFixed(1)}
                            %)
                          </span>
                        ) : (
                          <span className="red">
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
                      <div className="row">
                        <div className="content">
                          <div>Amount Invested</div>
                          <div>{formatAmountInr(report.current.invested)}</div>
                        </div>
                        <div className="content">
                          <div>Earnings</div>
                          <div
                            className={report.current.earnings >= 0 && "green"}
                          >
                            {formatAmountInr(report.current.earnings)}
                          </div>
                        </div>
                      </div>
                      {report.past.redeemed > 0 && (
                        <div className="pointer" onClick={toggleheader()}>
                          View redeemed investments
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {!current && (
                <>
                  <div className="title">Redeemed Value</div>
                  <div className="amount">
                    {formatAmountInr(report.past.redeemed)}
                  </div>
                  <div className="row">
                    <div className="content">
                      <div>Purchase Cost</div>
                      <div>
                        {formatAmountInr(report.past.invested_cost_price)}
                      </div>
                    </div>
                    <div className="content">
                      <div>Earnings</div>
                      <div className={report.past.earnings > 0 && "green"}>
                        {getAmountInInr(report.past.earnings)}
                      </div>
                    </div>
                  </div>
                  <div className="pointer" onClick={toggleheader()}>
                    View current investments
                  </div>
                </>
              )}
            </header>
            <main>
              {!currentUser.active_investment && report.pending.invested === 0 && (
                <div className="invest-more">
                  <div className="invest-more-content">
                    <p>
                      You have not invested in Mutual Funds!
                      <br />
                      <b>Invest today & grow your wealth</b>
                    </p>
                    <Button onClick={() => navigate(getPathname.invest)}>
                      Explore Mutual Funds
                    </Button>
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
                    <div
                      className="content"
                      onClick={() => flowOptions("npsInvestments")}
                    >
                      <img
                        alt=""
                        className={
                          productName === "finity"
                            ? "reports-finity-icon"
                            : "icon"
                        }
                        src={require(`assets/${productName}/nps_report_icon.${imageMapper[productName]}`)}
                      />
                      <div className="text">
                        <div className="title">NPS Investments</div>
                      </div>
                    </div>
                  )}
                  <div className="content" onClick={() => showGoals()}>
                    <img
                      className={
                        productName === "finity" && "reports-finity-icon"
                      }
                      alt=""
                      src={require(`assets/${productName}/goalwise.${imageMapper[productName]}`)}
                    />
                    <div className="text">
                      <div className="title">Track my goals</div>
                      <div>View Goal Wise Investments</div>
                    </div>
                  </div>
                  {data.showPendingPurchase && (
                    <div
                      className="content"
                      onClick={() => flowOptions("reportsPurchased")}
                    >
                      <img
                        className={
                          productName === "finity" && "reports-finity-icon"
                        }
                        alt=""
                        src={require(`assets/${productName}/pending_purchase.${imageMapper[productName]}`)}
                      />
                      <div className="text">
                        <div className="title">Pending Purchase</div>
                        <div>{formatAmountInr(report.pending.invested)}</div>
                      </div>
                    </div>
                  )}
                  {data.showPendingRedemption && (
                    <div
                      className="content"
                      onClick={() => flowOptions("reportsRedeemed")}
                    >
                      <img
                        className={
                          productName === "finity" && "reports-finity-icon"
                        }
                        alt=""
                        src={require(`assets/${productName}/pending_redemption.${imageMapper[productName]}`)}
                      />
                      <div className="text">
                        <div className="title">Pending Withdrawals</div>
                        <div>{formatAmountInr(report.pending.redeemed)}</div>
                      </div>
                    </div>
                  )}
                  {data.showPendingSwitched && (
                    <div
                      className="content"
                      onClick={() => flowOptions("reportsSwitched")}
                    >
                      <img
                        className={
                          productName === "finity" && "reports-finity-icon"
                        }
                        alt=""
                        src={require(`assets/${productName}/pending_purchase.${imageMapper[productName]}`)}
                      />
                      <div className="text">
                        <div className="title">Pending Switch</div>
                        <div>{formatAmountInr(report.pending.switched)}</div>
                      </div>
                    </div>
                  )}
                  {data.showSipSchedule && (
                    <div
                      className="content"
                      onClick={() => flowOptions("reportsSip")}
                    >
                      <img
                        className={
                          productName === "finity" && "reports-finity-icon"
                        }
                        alt=""
                        src={require(`assets/${productName}/sip.${imageMapper[productName]}`)}
                      />
                      <div className="text">
                        <div className="title">Existing SIPs</div>
                        <div>{formatAmountInr(report.sips.total_payment)}</div>
                      </div>
                    </div>
                  )}
                  {data.showTransactions && (
                    <>
                      <div
                        className="content"
                        onClick={() => flowOptions("reportsTransactions")}
                      >
                        <img
                          className={
                            productName === "finity" && "reports-finity-icon"
                          }
                          alt=""
                          src={require(`assets/${productName}/transactions.${imageMapper[productName]}`)}
                        />
                        <div className="text">
                          <div className="title">Transactions</div>
                        </div>
                      </div>
                      <div
                        className="content"
                        onClick={() => flowOptions("reportsFundswiseSummary")}
                      >
                        <img
                          className={
                            productName === "finity" && "reports-finity-icon"
                          }
                          alt=""
                          src={require(`assets/${productName}/fundwise.${imageMapper[productName]}`)}
                        />
                        <div className="text">
                          <div className="title">Track Fund Performance</div>
                          <div>View fund wise summary</div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="check-investment">
                    <p>Check what would you have made with mutual funds?</p>
                    <label>Mode :</label>
                    <div className="invest-type">
                      <div className="invest-type-button">
                        <div className="text">Monthly(SIP)</div>
                        <span
                          className={`hollow-dot ${
                            invest_data.invest_type === "sip" && "selected"
                          }`}
                          onClick={() => {
                            if (invest_data.invest_type !== "sip")
                              handleInvestData("invest_type", "sip");
                          }}
                        >
                          <span className="dot"></span>
                        </span>
                      </div>
                      <div className="invest-type-button">
                        <div className="text">One-time</div>
                        <span
                          className={`hollow-dot ${
                            invest_data.invest_type === "one-time" && "selected"
                          }`}
                          onClick={() => {
                            if (invest_data.invest_type !== "one-time")
                              handleInvestData("invest_type", "one-time");
                          }}
                        >
                          <span className="dot"></span>
                        </span>
                      </div>
                    </div>
                    <div className="invested-slider-container">
                      <div className="invested-slider-head">
                        Invested Amount :{" "}
                        <span>
                          {formatAmountInr(invest_data.amount)}{" "}
                          {invest_data.invest_type === "sip" && "Monthly"}
                        </span>
                      </div>
                      <div className="invested-slider">
                        <Slider
                          value={invest_data.amount}
                          min={invest_data.invest_type === "sip" ? 500 : 5000}
                          max={
                            invest_data.invest_type === "sip" ? 50000 : 500000
                          }
                          onChange={handleChange("amount")}
                        />
                      </div>
                      <div className="invested-slider-range">
                        <div className="invested-slider-left">
                          {numDifferentiation(
                            invest_data.invest_type === "sip" ? 500 : 5000
                          )}
                        </div>
                        <div className="invested-slider-ratio-text">
                          <span>Slide to change amount</span>
                        </div>
                        <div className="invested-slider-right">
                          {numDifferentiation(
                            invest_data.invest_type === "sip" ? 50000 : 500000
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="invested-slider-container">
                      <div className="invested-slider-head">
                        For :{" "}
                        <span>
                          {invest_data.time} Year{invest_data.time > 1 && "s"}
                        </span>
                      </div>
                      <div className="invested-slider">
                        <Slider
                          value={invest_data.time}
                          min={1}
                          max={20}
                          onChange={handleChange("time")}
                        />
                      </div>
                      <div className="invested-slider-range">
                        <div className="invested-slider-left">1 Y</div>
                        <div className="invested-slider-ratio-text">
                          <span>Slide to change time</span>
                        </div>
                        <div className="invested-slider-right">20 Y</div>
                      </div>
                    </div>
                    <div className="report-result-tile">
                      You could have made :{" "}
                      {formatAmountInr(invest_data.projectedValue)}
                    </div>
                  </div>
                </>
              )}
              <div className="content" onClick={() => redirectWithdraw()}>
                <img
                  alt=""
                  src={require(`assets/${productName}/ic_pf_withdraw.svg`)}
                />
                <div className="text">
                  <div className="title">Withdraw</div>
                  <div>Withdraw your funds</div>
                </div>
              </div>
              {data.insurance_active && investCards.insurance && (
                <div
                  className="content"
                  onClick={() =>
                    // navigate("/group-insurance/common/report")
                    redirectToReports("insurance")
                  }
                >
                  <img
                    alt=""
                    src={require(`assets/${productName}/ic_pf_insurance.svg`)}
                  />
                  <div className="text">
                    <div className="title">Insurance</div>
                  </div>
                </div>
              )}
              {data.gold_active_investment && investCards.gold && (
                <div
                  className="content"
                  onClick={() =>
                    // navigate("/gold/my-gold")
                    redirectToReports("gold")
                  }
                >
                  <img
                    alt=""
                    src={require(`assets/${productName}/ic_pf_gold.svg`)}
                  />
                  <div className="text">
                    <div className="title">Gold</div>
                    <div>{data?.gold_details?.total_balance || 0} gm</div>
                  </div>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </Container>
  );
};

export default Summary;
