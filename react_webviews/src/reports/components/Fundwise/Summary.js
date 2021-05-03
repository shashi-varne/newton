import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { getFunds, getFundDetailsForSwitch } from "../../common/api";
import {
  getAmountInInr,
} from "../../common/functions";
import { navigate as navigateFunc } from "utils/functions";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FundSummaryMenu from "../mini-components/FundSummaryMenu";
import toast from "common/ui/Toast";
import "./commonStyles.scss";
import { storageService } from "../../../utils/validators";

const FundswiseSummary = (props) => {
  const navigate = navigateFunc.bind(props);
  const [menuPosition, setMenuPosition] = useState(null);
  const [funds, setFunds] = useState({});
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

  const getFundDetails = (index) => {
    storageService().setObject(
      storageConstants.REPORTS_SELECTED_FUND,
      funds[index]
    );
    navigate(`${getPathname.reportsFundswiseDetails}${index}`);
  };

  const handleMenuClick = (event, fund) => {
    setSelectedFund(fund);
    setMenuPosition(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuPosition(null);
  };

  const handleSwitch = async () => {
    setMenuPosition(null);
    setShowSkelton(true);
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
    navigate(`${getPathname.reportsFundswiseTransactions}${amfi}`);
  };

  return (
    <Container title="Funds" noFooter={true} skelton={showSkelton}>
      <div className="reports-fundswise-summary">
        {!isEmpty(funds) &&
          funds.map((fund, index) => {
            return (
              <div className="summary-fund-content" key={index}>
                <h5>
                  <div className="text" onClick={() => getFundDetails(index)}>
                    {fund.mf.friendly_name}
                  </div>
                  <div className="right-info">
                    <MoreVertIcon
                      className="icon"
                      onClick={(e) => handleMenuClick(e, fund)}
                    />
                  </div>
                </h5>
                <div onClick={() => getFundDetails(index)}>
                  <div className="head">
                    <span>Units: {fund.units.toFixed(4)}</span>
                    <span className="margin-left">
                      Nav: ₹ {fund.mf.curr_nav.toFixed(4)}
                    </span>
                  </div>
                  <div className="fundswise-summary-details">
                    <div className="content">
                      <h5>
                        {formatAmountInr(fund.current)}
                        {fund.current === 0 && 0}
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
                        {fund.current_invested === 0 && 0}
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
          handleSwitch={() => handleSwitch()}
          handleTransactions={() => handleTransactions()}
        />
      </div>
    </Container>
  );
};

export default FundswiseSummary;
