import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getConfig, navigate as navigateFunc } from "utils/functions";
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
const imageMapper = {
  finity: "svg",
  fisdom: "png",
};
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
    let investValues = { ...investData };
    investValues[name] = value;
    if (name === "investType") {
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
    navigate(getPathname[name], { state: { fromPath: "reports" } });
  };

  const redirectWithdraw = () => {
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
    if (report.invested === 0) return;
    navigate(getPathname.reportGoals);
  };

  return (
    <Container
      title="My Money"
      noFooter={true}
      skelton={showSkelton || isLoading}
    >
      <div className="reports">
        {!isEmpty(report) && (
          <>
            <header className="reports-header">
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
                      <div className="row">
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
                      <div
                        className={
                          report.past.earnings > 0 && "summary-green-text"
                        }
                      >
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
                    <Button
                      onClick={() => navigate(getPathname.invest)}
                      buttonTitle="Explore Mutual Funds"
                      style={{
                        width: "170px",
                        height: "40px",
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
                      goNext={() => flowOptions("npsInvestments")}
                      icon={`nps_report_icon.${imageMapper[productName]}`}
                      title="NPS Investments"
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  <SummaryCard
                    goNext={showGoals}
                    icon={`goalwise.${imageMapper[productName]}`}
                    title="Track my goals"
                    subtitle="View Goal Wise Investments"
                    iconClassName={
                      productName === "finity" && "reports-finity-icon"
                    }
                  />
                  {data.showPendingPurchase && (
                    <SummaryCard
                      goNext={() => flowOptions("reportsPurchased")}
                      icon={`pending_purchase.${imageMapper[productName]}`}
                      title="Pending Purchase"
                      subtitle={formatAmountInr(report.pending.invested)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showPendingRedemption && (
                    <SummaryCard
                      goNext={() => flowOptions("reportsRedeemed")}
                      icon={`pending_redemption.${imageMapper[productName]}`}
                      title="Pending Withdrawals"
                      subtitle={formatAmountInr(report.pending.redeemed)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showPendingSwitched && (
                    <SummaryCard
                      goNext={() => flowOptions("reportsSwitched")}
                      icon={`pending_purchase.${imageMapper[productName]}`}
                      title="Pending Switch"
                      subtitle={formatAmountInr(report.pending.switched)}
                      iconClassName={
                        productName === "finity" && "reports-finity-icon"
                      }
                    />
                  )}
                  {data.showSipSchedule && (
                    <SummaryCard
                      goNext={() => flowOptions("reportsSip")}
                      icon={`sip.${imageMapper[productName]}`}
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
                        goNext={() => flowOptions("reportsTransactions")}
                        icon={`transactions.${imageMapper[productName]}`}
                        title="Transactions"
                        iconClassName={
                          productName === "finity" && "reports-finity-icon"
                        }
                      />
                      <SummaryCard
                        goNext={() => flowOptions("reportsFundswiseSummary")}
                        icon={`fundwise.${imageMapper[productName]}`}
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
                goNext={() => redirectWithdraw()}
                icon="ic_pf_withdraw.svg"
                title="Withdraw"
                subtitle="Withdraw your funds"
              />
              {data.insurance_active && investCards.insurance && (
                <SummaryCard
                  goNext={() => navigate("/group-insurance/common/report")}
                  icon="ic_pf_insurance.svg"
                  title="Insurance"
                />
              )}
              {data.gold_active_investment && investCards.gold && (
                <SummaryCard
                  goNext={() => navigate("/gold/my-gold")}
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
}) => {
  return (
    <div className="content" onClick={goNext}>
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
