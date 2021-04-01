import React, { useState, useEffect } from "react";
import Container from "../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import Button from "@material-ui/core/Button";
import { getPathname } from "../constants";
import { initData } from "../services";
import { getFunds, getFundMf } from "../common/api";
import { navigate as navigateFunc, getAmountInInr } from "../common/functions";
import FundNotAvailable from "./mini_components/FundNotAvailable";
import AskInvestType from "./mini_components/AskInvestType";
import CircularProgress from "@material-ui/core/CircularProgress";

const Funds = (props) => {
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.itype) props.history.goBack();
  const itype = params.itype || "";
  const subtype = params.subtype || "";

  const navigate = navigateFunc.bind(props);
  const [openFundNotAvailable, setFundNotAvailable] = useState(false);
  const [openAskInvestType, setAskInvestType] = useState(false);
  const [funds, setFunds] = useState({});
  const [selectedFund, setSelectedFund] = useState({});
  const [investTypeData, setInvestTypeData] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);
  const [openIndex, setOpenindex] = useState(-1);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const onlySips = ["saveforgoal"];
  const onlyOt = [
    "investsurplus",
    "reliancesimplysave",
    "arbitrage",
    "monthlyincomeplan",
  ];
  const allowsBoth = [
    "buildwealth",
    "savetax",
    "sectoral",
    "midcap",
    "index",
    "balanced",
    "legacy",
    "diy",
    "shariah",
    "gold",
    "insta-redeem",
  ];

  const dontAddSuffixInType = (type) => {
    let notNeededSuffix = ["insta-redeem"];
    if (notNeededSuffix.indexOf(type) !== -1) {
      return type;
    } else {
      return type + "sip";
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    initData();
    const result = await getFunds({
      itype,
      subtype,
    });
    if (!result) {
      setShowSkelton(false);
      return;
    }
    setFunds(result.report);
    setShowSkelton(false);
  };

  const canShowBothOptions = (type) => {
    return allowsBoth.indexOf(type) > -1;
  };

  const canShowOnlyOt = (type) => {
    return onlyOt.indexOf(type) > -1;
  };

  const canShowOnlySip = (type) => {
    return onlySips.indexOf(type) > -1;
  };

  const getMfDetails = async (fund) => {
    setIsApiRunning(true);
    try {
      const result = await getFundMf({
        mfid: fund.mf.amfi,
      });
      if (!result) return;
      setSelectedFund(fund);
      let item = {
        type: itype,
        subtype: subtype,
        mfname: result.mfname,
        mfid: result.mfid,
        max: result.sip_flag ? result.sip.max : result.addl_purchase.max,
        min:
          result.sip_flag && itype !== "reliancesimplysave"
            ? result.sip.min
            : result.addl_purchase.min,
        mul: result.sip_flag ? result.sip.mul : result.addl_purchase.mul,
        default_date: result.default_date,
        sip_dates: result.sip_dates,
      };
      if (!result.purchase_flag) setFundNotAvailable(true);
      if (canShowBothOptions(itype)) {
        if (result.sip_flag && result.ot_flag) {
          item.type =
            itype === "buildwealth"
              ? "buildwealth"
              : dontAddSuffixInType(itype);
          setInvestTypeData({
            message: "How would you like to invest in this fund?",
            button2Title: "SIP",
            button1Title: "ONE-TIME",
            handleClick1: handleInvestType("ONE-TIME", item),
            handleClick2: handleInvestType("SIP", item),
          });
          setAskInvestType(true);
        } else if (result.sip_flag) {
          setInvestTypeData({
            message: result.mfname + " is only enabled for SIP",
            button2Title: "CONTINUE",
            button1Title: "CANCEL",
            handleClick1: handleInvestType("CANCEL"),
            handleClick2: handleInvestType("SIP", item),
          });
          setAskInvestType(true);
        } else if (result.ot_flag) {
          setInvestTypeData({
            message: result.mfname + " is only enabled for ONE-TIME",
            button2Title: "CONTINUE",
            button1Title: "CANCEL",
            handleClick1: handleInvestType("CANCEL"),
            handleClick2: handleInvestType("ONE-TIME", item),
          });
          setAskInvestType(true);
        }
      } else if (canShowOnlyOt(itype) && result.ot_flag) {
        navigate(`${getPathname.investMore}ONE-TIME`, {
          state: {
            recommendation: JSON.stringify(item),
          },
        });
      } else if (canShowOnlySip(itype) && result.sip_flag) {
        navigate(`${getPathname.investMore}SIP`, {
          state: {
            recommendation: JSON.stringify(item),
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleInvestType = (invest_type, recommendation) => () => {
    if (invest_type === "SIP") {
      navigate(`${getPathname.investMore}${invest_type}`, {
        state: {
          recommendation: JSON.stringify(recommendation),
        },
      });
    } else if (invest_type === "ONE-TIME") {
      navigate(`${getPathname.investMore}${invest_type}`, {
        state: {
          recommendation: JSON.stringify(recommendation),
        },
      });
    }
    setAskInvestType(false);
  };

  const handleTiles = (index) => {
    if (index === openIndex) setOpenindex(-1);
    else setOpenindex(index);
  };

  return (
    <Container hideInPageTitle={true} noFooter={true} skelton={showSkelton}>
      <div className="reports-funds">
        {!showSkelton &&
          !isEmpty(funds) &&
          funds.map((fund, index) => {
            return (
              <div className="fund" key={index}>
                <h5 onClick={() => handleTiles(index)}>
                  <div>{fund.mf.friendly_name}</div>
                  <div className="right-info">
                    {fund.current_earnings.percent &&
                      fund.current_earnings.percent !== 0 && (
                        <div
                          className={`earning-percent ${
                            fund.current_earnings.percent >= 0 ? "green" : "red"
                          }`}
                        >
                          {fund.current_earnings.percent > 0 && "+"}
                          {fund.current_earnings.percent.toFixed(2)}%
                        </div>
                      )}
                    <img
                      src={require(`assets/${
                        openIndex === index ? "show" : "hide"
                      }.png`)}
                      alt=""
                    />
                  </div>
                </h5>
                {openIndex === index && (
                  <>
                    <div onClick={() => handleTiles(index)}>
                      <div className="head">
                        Folio No: {fund.folio_details[0].folio_number}
                      </div>
                      <div className="summary">
                        <div className="content">
                          <div className="amount">
                            {formatAmountInr(fund.current)}
                          </div>
                          <div className="text">
                            Current <br /> Value
                          </div>
                        </div>
                        <div className="content">
                          <div className="amount">
                            {formatAmountInr(fund.current_invested)}
                          </div>
                          <div className="text">
                            Amount <br />
                            Invested
                          </div>
                        </div>
                        <div className="content">
                          <div
                            className={`amount ${
                              fund.current_earnings.amount < 0 ? "red" : "green"
                            }`}
                          >
                            {getAmountInInr(fund.current_earnings.amount)}
                            {fund.current_earnings.percent &&
                              fund.current_earnings.percent !== 0 && (
                                <div
                                  className={`earning-percent ${
                                    fund.current_earnings.percent >= 0
                                      ? "green"
                                      : "red"
                                  }`}
                                >
                                  ( {fund.current_earnings.percent > 0 && "+"}{" "}
                                  {fund.current_earnings.percent.toFixed(2)}% )
                                </div>
                              )}
                          </div>
                          <div className="text">
                            Total <br />
                            Earnings
                          </div>
                        </div>
                      </div>
                      <hr className="hr-break" />
                      <div className="summary">
                        <div className="content">
                          <div className="amount">
                            {formatAmountInr(fund.mf.curr_nav)}
                          </div>
                          <div className="text">
                            Current <br />
                            NAV Value
                          </div>
                        </div>
                        <div className="content">
                          <div className="amount">
                            {formatAmountInr(fund.units)}
                          </div>
                          <div className="text">
                            Number of <br />
                            units
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => getMfDetails(fund)}
                      disabled={isApiRunning}
                      className={`${isApiRunning && "disabled"}`}
                    >
                      INVEST MORE
                      {isApiRunning && (
                        <div className="loader">
                          <CircularProgress size={20} thickness={5} />
                        </div>
                      )}
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        {openFundNotAvailable && (
          <FundNotAvailable
            data={selectedFund}
            isOpen={openFundNotAvailable}
            close={() => setFundNotAvailable(false)}
          />
        )}
        {openAskInvestType && (
          <AskInvestType isOpen={openAskInvestType} data={investTypeData} />
        )}
      </div>
    </Container>
  );
};

export default Funds;
