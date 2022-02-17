import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getFunds, getFundDetailsForSwitch } from "../../common/api";
import {
  getAmountInInr,
} from "../../common/functions";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FundSummaryMenu from "../mini-components/FundSummaryMenu";
import toast from "common/ui/Toast";
import "./commonStyles.scss";
import { storageService } from "../../../utils/validators";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";

const FundswiseSummary = (props) => {
  const navigate = navigateFunc.bind(props);
  const [menuPosition, setMenuPosition] = useState(null);
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const result = await getFunds();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setFunds(result.report);
    setShowSkelton(false);
  };

  const goToFundDetails = (fund) => () => {
    sendEvents('next', fund, "", "yes");
    navigate(
      `/fund-details`,
      {
        searchParams: `${getConfig().searchParams}&isins=${fund.mf.isin}`,
      },
    )
  };

  const handleMenuClick = (fund, index) => (event) => {
    fund.index = index;
    setSelectedFund(fund);
    setMenuPosition(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuPosition(null);
  };

  const handleSwitch = async () => {
    setMenuPosition(null);
    setShowSkelton(true);
    sendEvents('next', selectedFund, 'switch')
    const amfi = selectedFund.mf.amfi;
    try {
      const result = await getFundDetailsForSwitch({ amfi });
      if (!result) return;
      const fundDetails = result.report;
      if (fundDetails.switch_possible) {
        navigate(`${getPathname.reportsFundswiseSwitch}${amfi}`);
      } else {
        toast(fundDetails.switch_error_message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setShowSkelton(false);
    }
  };

  const handleTransactions = () => {
    const amfi = selectedFund.mf.amfi;
    sendEvents('next', selectedFund, "transactions")
    navigate(`${getPathname.reportsFundswiseTransactions}${amfi}`);
  };

  const handleTransactionSummary = () => {
    sendEvents('next', selectedFund, "transaction_summary")
    storageService().setObject(
      storageConstants.REPORTS_SELECTED_FUND,
      selectedFund
    );
    navigate(`${getPathname.reportsFundswiseDetails}${selectedFund.index}`);
  }

  const sendEvents = (userAction, data, flow, fundClicked = "no") => {
    let eventObj = {
      event_name: "my_portfolio",
      properties: {
        user_action: userAction || "",
        screen_name: "Track Fund Performance",
        fund: data?.current_invested || data?.invested_amount || "",
        over_flow_menu: flow || "",
        fund_clicked: fundClicked,
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container events={sendEvents("just_set_events")} title="Funds" noFooter={true} skelton={showSkelton} data-aid='reports-fundswise-summary-screen'>
      <div className="reports-fundswise-summary" data-aid='reports-fundswise-summary'>
        {!isEmpty(funds) &&
          funds.map((fund, index) => {
            return (
              <div className="summary-fund-content" key={index} data-aid='summary-fund-content'>
                <h5>
                  <div className="text" onClick={goToFundDetails(fund)}>
                    {fund.mf.friendly_name}
                  </div>
                  <div className="right-info">
                    <MoreVertIcon
                      className="icon"
                      onClick={handleMenuClick(fund, index)}
                    />
                  </div>
                </h5>
                <div onClick={goToFundDetails(fund)}>
                  <div className="head">
                    <span>Units: {fund.units.toFixed(4)}</span>
                    <span className="margin-left">
                      Nav: ₹ {fund.mf.curr_nav.toFixed(4)}
                    </span>
                  </div>
                  <div className="fundswise-summary-details" data-aid='reports-fundswise-summary-details'>
                    <div className="content">
                      <h5>
                        {formatAmountInr(fund.current)}
                      </h5>
                      <div>Current Value</div>
                    </div>
                    <div className="content">
                      <h5
                        className={`${
                          fund.redeemed_earnings.amount > 0 && "fundswise-green-text"
                        } ${fund.redeemed_earnings.amount < 0 && "fundswise-red-text"}`}
                      >
                        {fund.redeemed_earnings.amount === 0
                          ? "-"
                          : getAmountInInr(fund.redeemed_earnings.amount)}
                      </h5>
                      <div>Realised earnings</div>
                    </div>
                    <div className="content">
                      <h5>
                        {formatAmountInr(fund.current_invested)}
                      </h5>
                      <div>Invested Cost</div>
                    </div>
                    <div className="content">
                      <h5
                        className={`${
                          fund.current_earnings.amount > 0 && "fundswise-green-text"
                        } ${fund.current_earnings.amount < 0 && "fundswise-red-text"}`}
                      >
                        {fund.current_earnings.amount === 0
                          ? "-"
                          : getAmountInInr(fund.current_earnings.amount)}
                      </h5>
                      <div>Unrealised earnings</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <FundSummaryMenu
          handleMenuClose={handleMenuClose}
          menuPosition={menuPosition}
          handleSwitch={handleSwitch}
          handleTransactions={handleTransactions}
          handleTransactionSummary={handleTransactionSummary}
        />
      </div>
    </Container>
  );
};

export default FundswiseSummary;
