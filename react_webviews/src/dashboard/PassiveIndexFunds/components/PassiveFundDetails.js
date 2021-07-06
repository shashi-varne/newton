import React, { useState, useEffect } from "react";
import { getUrlParams, storageService } from "../../../utils/validators";
import "./PassiveFundDetails.scss";
import WVAccordian from "../../../common/ui/Accordian/WVAccordian";
import { List } from "@material-ui/core";
import MorningStar from "../../../assets/logo_morningstar.svg";
import moment from "moment";
import {
  fetch_fund_details,
  fetch_fund_graph,
} from "../../../fund_details/common/ApiCalls";
import Returns from "../../../fund_details/components/Returns";
import FundInfo from "../../../fund_details/components/FundInfo";
import FundPortfolio from "../../../fund_details/components/FundPortfolio";
import RiskDetails from "../../../fund_details/components/RiskDetails";
import FundChart from "../mini-components/PassiveFundChart";
import Container from "../../common/Container";
import Toast from "../../../common/ui/Toast";
import { SkeltonRect } from "../../../common/ui/Skelton";
import StarRating from "../../../common/ui/StarRating";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig } from "../../../utils/functions";
import { Imgc } from "../../../common/ui/Imgc";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import WVYearFilter from "../../../common/ui/YearFilter/WVYearFilter";
import { YEARS_FILTERS, BUTTON_MAPPER } from "../constants";

const productName = getConfig().productName;

function PassiveFundDetails({ history }) {
  const [isLoading, setLoading] = useState(true);
  const [fundDetails, setFundDetails] = useState(null);
  const [graph, setGraph] = useState(null);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const [fundInfoClicked, setFundInfoClicked] = useState(false);
  const [portfolioDetailsClicked, setPortfolioDetailsClicked] = useState(false);
  const [moreRisksClicked, setMoreRisksClicked] = useState(false);
  const fund = storageService().getObject("diystore_fundInfo") || {};
  const [periodWiseData, setPeriodWiseData] = useState({});
  const [currentReturnsKey, setCurrentReturns] = useState("3M");
  const [xaxisFormat, setXaxisFormat] = useState("yyyy");
  const [returnsData, setReturnsData] = useState({});
  const [yearFilterOptions, setYearFilterOptions] = useState([]);
  const [morningStarDetails, setMorningStarDetails]= useState(false);
  const { isins } = getUrlParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch_fund_details(isins);
        const allButtons = ["1M", "3M", "6M", "1Y", "3Y", "5Y"];
        setCurrentReturns(
          allButtons[response?.text_report[0].performance.returns.length - 1]
        );
        setYearFilterOptions(
          YEARS_FILTERS.map((item, index) => {
            if (index > response?.text_report[0].performance.returns.length - 1)
              return {
                ...item,
                disabled: true,
              };
            return item;
          })
        );
        setFundDetails(response?.text_report[0]);
        setReturnsData(response?.text_report[0].performance.returns);
        setLoading(false);
        if (response?.text_report?.length === 1) {
          await fetch_graph_data(response?.text_report[0]?.isin);
        }
      } catch (err) {
        Toast("wrong", "error");
        setLoading(false);
      }
    })();
  }, []);
  const getTimeInMs = (time) => time * 60 * 60 * 24 * 1000;
  const fetch_graph_data = async (isin) => {
    setGraph(null);
    const graph_data = await fetch_fund_graph(isin);
    const amfi_data = graph_data.graph_report[0].graph_data_for_amfi;
    const maxi = amfi_data[amfi_data.length - 1][0];
    const one_month_minimum = maxi - getTimeInMs(30);
    const three_month_minimum = maxi - getTimeInMs(90);
    const six_month_minimum = maxi - getTimeInMs(180);
    const one_year_minimum = maxi - getTimeInMs(365);
    const three_year_minimum = maxi - getTimeInMs(1095);
    const five_year_minimum = maxi - getTimeInMs(1825);
    let choppedData = {
      "1M": [],
      "3M": [],
      "6M": [],
      "1Y": [],
      "3Y": [],
      "5Y": [],
    };
    for (var i = 0; i < amfi_data.length; i++) {
      let presentValue = amfi_data[i][0];
      if (presentValue <= maxi) {
        if (presentValue >= one_month_minimum) {
          choppedData["1M"].push(amfi_data[i]);
        }
        if (presentValue >= three_month_minimum) {
          choppedData["3M"].push(amfi_data[i]);
        }
        if (presentValue >= six_month_minimum) {
          choppedData["6M"].push(amfi_data[i]);
        }
        if (presentValue >= one_year_minimum) {
          choppedData["1Y"].push(amfi_data[i]);
        }
        if (presentValue >= three_year_minimum) {
          choppedData["3Y"].push(amfi_data[i]);
        }
        if (presentValue >= five_year_minimum) {
          choppedData["5Y"].push(amfi_data[i]);
        }
      }
    }
    setPeriodWiseData(choppedData);
    setGraph(graph_data.graph_report[0].graph_data_for_amfi);
  };

  const handleClose = () => {
    setOpenMoreInfoDialog(false);
  };
  const openDialog = () => {
    setOpenMoreInfoDialog(true);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "passive_funds",
      properties: {
        user_action: userAction || "",
        screen_name: "fund_info",
        fund_selected: fundDetails?.performance?.legal_name || "",
        fund_info_clicked: fundInfoClicked ? "yes" : "no",
        portfolio_details_clicked: portfolioDetailsClicked ? "yes" : "no",
        more_risks_clicked: moreRisksClicked ? "yes" : "no",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const navigate = (pathname) => {
    history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  const handleClick = () => {
    sendEvents("next");
    storageService().setObject("diystore_cart", [fund]);
    navigate("/diy/invest");
  };

  const storeEventsData = (name) => {
    if (name === "fund_info_clicked") {
      setFundInfoClicked(true);
    } else if (name === "portfolio_details_clicked") {
      setPortfolioDetailsClicked(true);
    } else if (name === "more_risks_clicked") {
      setMoreRisksClicked(true);
    }
  };

  const yearFilter = (time) => {
    if (BUTTON_MAPPER[time].index + 1 > returnsData.length) return;
    setCurrentReturns(time);
    setGraph(periodWiseData[time]);
    setXaxisFormat(BUTTON_MAPPER[time].format);
    yearSendEvents(time);
  };

  const yearSendEvents = (monthValue) => {
    let eventObj = {
      event_name: "fund_detail",
      properties: {
        investment_horizon: monthValue,
        channel: productName,
      },
    };

    nativeCallback({ events: eventObj });
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      buttonTitle="INVEST NOW"
      title={fundDetails?.performance?.friendly_name}
      hidePageTitle
      handleClick={handleClick}
      noPadding
      skelton={isLoading}
    >
      <div className="passive-funds-details">
        <section className="pfd-padding">
          <div className="pf-flex">
            <p className="pfd-title">
              {fundDetails?.performance?.friendly_name}
            </p>
            <Imgc
              style={{
                marginLeft: "40px",
                width: "50px",
                height: "50px",
                border: "1px solid var(--highlight)",
              }}
              src={fundDetails?.performance?.amc_logo_small}
              alt=""
            />
          </div>
          <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
            <StarRating value={fundDetails?.performance?.ms_rating} />
          </div>
          <p className="pfd-info">{`${fundDetails?.performance.ms_risk} risk | ${fundDetails?.performance?.tracking_index}`}</p>
          <div className="pf-flex">
            <div>
              <p className="pfd-points" style={{ color: "var(--dark)" }}>
                NAV
                <span style={{ fontSize: "8px", fontWeight: "400" }}>
                  (AS ON{" "}
                  {moment(
                    fundDetails?.performance?.nav_update_date,
                    "DD/MM/YY"
                  ).format("DD MMMM, YYYY")}
                  )
                </span>
              </p>
              <p className="pfd-nav-returns" style={{ color: "var(--dark)" }}>
                ₹{fundDetails?.performance?.current_nav}
              </p>
            </div>
            <div>
              <p className="pfd-points" style={{ color: "var(--dark)" }}>
                RETURNS{currentReturnsKey && `(${currentReturnsKey})`}
              </p>
              <p
                className="pfd-nav-returns"
                style={{
                  fontWeight: "700",
                  color:
                    returnsData === [] ||
                    returnsData[BUTTON_MAPPER[currentReturnsKey]?.index] ===
                      undefined
                      ? "var(--steelgray)"
                      : returnsData[BUTTON_MAPPER[currentReturnsKey].index]
                          ?.value >= 0
                      ? "#7ED321"
                      : "#D0021B",
                  textAlign: "right",
                }}
              >
                {returnsData === [] ||
                returnsData[BUTTON_MAPPER[currentReturnsKey]?.index] ===
                  undefined
                  ? "NA"
                  : returnsData[BUTTON_MAPPER[currentReturnsKey].index]
                      ?.value >= 0
                  ? `+${
                      returnsData[BUTTON_MAPPER[currentReturnsKey].index]?.value
                    }%`
                  : `${
                      returnsData[BUTTON_MAPPER[currentReturnsKey].index]?.value
                    }%`}
              </p>
            </div>
          </div>
        </section>
        <section
          style={{
            height: "250px",
            minHeight: "200px",
            minWidth: "100%",
            marginTop: "20px",
          }}
        >
          {graph ? (
            <FundChart xaxisFormat={xaxisFormat} graphData={graph} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <SkeltonRect
                style={{
                  width: "calc(100% - 30px)",
                  height: "100%",
                  borderRadius: "6px 6px 0 0",
                }}
              />
            </div>
          )}
        </section>
        {graph ? (
          <div style={{ padding: "0 20px" }}>
            <WVYearFilter
              filterArray={yearFilterOptions}
              selected={currentReturnsKey}
              onClick={yearFilter}
              dataAidSuffix={"passive-year-filter"}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <SkeltonRect
              style={{
                width: "calc(100% - 30px)",
                height: "100%",
                borderRadius: "0 0 6px 6px",
              }}
            />
          </div>
        )}
        <div
          className="pfd-line"
          style={{ marginTop: "30px", marginBottom: "18px" }}
        ></div>
        <div className="pf-flex pfd-padding" style={{ paddingBottom: "18px" }}>
          <div>
            <p className="pfd-points">EXPENSE RATIO</p>
            <p className="pfd-values">
              {fundDetails?.portfolio?.expense_ratio === null
                ? "NA"
                : `${fundDetails?.portfolio?.expense_ratio}%`}
            </p>
          </div>
          <div>
            <p className="pfd-points">TRACKING ERROR</p>
            <p className="pfd-values">
              {fundDetails?.performance?.tracking_error !== null
                ? `${fundDetails?.performance?.tracking_error}% (1Y)`
                : "NA"}
            </p>
          </div>
          <div>
            <p className="pfd-points">FUND SIZE</p>
            <p className="pfd-values">₹{fundDetails?.performance?.aum}</p>
          </div>
        </div>
        <p className="pfd-info pfd-padding">
          What is expense ratio & tracking error?{" "}
          <span className="pfd-check-btn" onClick={openDialog}>
            CHECK
          </span>
        </p>
        {fundDetails ? (
          <section className="fund-more-info">
            <List component="nav">
              <div className="pfd-line" style={{ marginTop: "13px" }}></div>
              <WVAccordian title="Returns*" dataAidSuffix="Returns">
                <Returns
                  returnsData={fundDetails?.performance?.returns}
                  iframe={false}
                />
              </WVAccordian>
              <div className="pfd-line"></div>
              <WVAccordian
                title="Fund's Info"
                dataAidSuffix="fundInfoClicked"
                handleClick={() => storeEventsData("fund_info_clicked")}
              >
                <FundInfo
                  title="Launch date"
                  content={fundDetails?.additional_info?.launch_date}
                />
                <FundInfo
                  title="Minimum investment"
                  content={fundDetails?.additional_info?.minimum_investment}
                />
                <FundInfo
                  title="Exit Load"
                  content={fundDetails?.additional_info?.exit_load}
                />
                <FundInfo
                  title="ISIN"
                  content={fundDetails?.additional_info?.isin}
                />
                <FundInfo
                  title="Previously Known as"
                  content={fundDetails?.additional_info?.previous_known_name}
                />
                <FundInfo
                  title="Fund Managers"
                  content={fundDetails?.additional_info?.fund_managers}
                />
              </WVAccordian>
              <div className="pfd-line"></div>
              <WVAccordian
                title="Risk Details"
                dataAidSuffix="moreRisksClicked"
                handleClick={() => storeEventsData("more_risks_clicked")}
              >
                <RiskDetails riskDetailsData={fundDetails?.risk} />
              </WVAccordian>
              <div className="pfd-line"></div>
              <WVAccordian
                title="Portfolio Details"
                dataAidSuffix="portfolioDetailsClicked"
                handleClick={() => storeEventsData("portfolio_details_clicked")}
              >
                <FundPortfolio
                  portfolio={fundDetails?.portfolio}
                  navDate={fundDetails?.performance?.nav_update_date}
                />
              </WVAccordian>
              <div className="pfd-line" style={{ marginBottom: "20px" }}></div>
            </List>
          </section>
        ) : null}
        <section className="pfd-padding" onClick={() => setMorningStarDetails(true)}>
          <Imgc
            src={MorningStar}
            style={{ paddingBottom: "10px", width: "113px", height: "22px" }}
            alt=""
          />
          {morningStarDetails &&
            <>
              <div style={{ paddingBottom: "10px" }}>
                <StarRating value={fundDetails?.performance?.ms_rating} />
              </div>
              <p
                className="pfd-values"
                style={{ color: "var(--steelgrey)", paddingBottom: "20px" }}
              >
                Funds are rated by Morningstar based on their past performance as
                compared to other funds in the same category. Ratings are from 1 – 5
                stars with 5 being the highest for the best performing funds and 1
                being the lowest for poor-performing funds.
          </p> </>}
        </section>
      </div>
      <WVBottomSheet
        isOpen={openMoreInfoDialog || false}
        button1Props={{
          type: "primary",
          title: "OKAY",
          onClick: handleClose,
        }}
        onClose={handleClose}
        image={fundDetails?.performance?.amc_logo_small}
        title={fundDetails?.performance?.friendly_name}
        classes={{
          image: "pfd-image",
        }}
      >
        <div className="passive-funds-details">
          <p
            className="pfd-nav-returns"
            style={{
              paddingTop: "20px",
              paddingBottom: "10px",
              fontWeight: "700",
            }}
          >
            Tracking error:{" "}
            <span style={{ fontWeight: "400" }}>
              {fundDetails?.performance?.tracking_error !== null
                ? `${fundDetails?.performance?.tracking_error}%`
                : "NA"}
            </span>
          </p>
          <p className="pfd-values" style={{ color: "var(--steelgrey)" }}>
            The difference between the fund’s returns & the index it tries to
            mimic. The lower the tracking error the better it is.
          </p>
          <p
            className="pfd-nav-returns"
            style={{
              paddingTop: "30px",
              paddingBottom: "10px",
              fontWeight: "700",
            }}
          >
            Expense ratio:{" "}
            <span style={{ fontWeight: "400" }}>
              {fundDetails?.portfolio?.expense_ratio === null
                ? "NA"
                : `${fundDetails?.portfolio?.expense_ratio}%`}
            </span>
          </p>
          <p className="pfd-values" style={{ color: "var(--steelgrey)" }}>
            The annual maintenance charge that includes operating costs,
            management fees, allocation charges, advertising costs, etc. A lower
            expense ratio leads to more gains.
          </p>
        </div>
      </WVBottomSheet>
    </Container>
  );
}

export default PassiveFundDetails;
