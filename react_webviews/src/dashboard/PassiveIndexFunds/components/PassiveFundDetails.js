import React, { useState, useEffect } from "react";
import { getUrlParams, storageService } from "../../../utils/validators";
import "./PassiveFundDetails.scss";
import Accordian from "../mini-components/Accordian";
import { List, Slide } from "@material-ui/core";
import Dialog, { DialogContent } from "material-ui/Dialog";
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
import PassiveStarRating from "../mini-components/PassiveStarRating";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig } from "../../../utils/functions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PassiveFundDetails({ history }) {
  const [isLoading, setLoading] = useState(true);
  const [fundDetails, setFundDetails] = useState(null);
  const [graph, setGraph] = useState(null);
  const [openMoreInfoDialog, setOpenMoreInfoDialog] = useState(false);
  const { isins } = getUrlParams();
  const fund = storageService().getObject("diystore_fundInfo") || {};

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch_fund_details(isins);
        setFundDetails(response?.text_report[0]);
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
  console.log(fundDetails);
  const fetch_graph_data = async (isin) => {
    setGraph(null);
    const graph_data = await fetch_fund_graph(isin);
    setGraph(graph_data);
  };

  const moreInfoDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={openMoreInfoDialog || false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent>
          <div
            className="passive-funds-details"
            style={{ marginTop: "20px", width: "100%" }}
          >
            <div className="pf-flex">
              <p className="pfd-title">
                {fundDetails?.performance?.legal_name}
              </p>
              <img
                style={{ marginLeft: "40px", width: "50px", height: "50px" }}
                src={fundDetails?.performance?.amc_logo_small}
                alt=""
              />
            </div>
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
                {fundDetails?.performance?.tracking_error !== "NA"
                  ? `${fundDetails?.performance?.tracking_error}%`
                  : "NA"}
              </span>
            </p>
            <p className="pfd-values" style={{ color: "#767E86" }}>
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
                {fundDetails?.portfolio?.expense_ratio}%
              </span>
            </p>
            <p
              className="pfd-values"
              style={{ color: "#767E86", paddingBottom: "40px" }}
            >
              The annual maintenance charge that includes operating costs,
              management fees, allocation charges, advertising costs, etc. A
              lower expense ratio leads to more gains.
            </p>

            <button
              className="call-back-popup-button"
              style={{ cursor: "pointer", fontSize: "12px" }}
              onClick={handleClose}
            >
              OKAY
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
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
        fund_info_clicked: storageService().get("fund_info_clicked")
          ? "yes"
          : "no",
        portfolio_details_clicked: storageService().get(
          "portfolio_details_clicked"
        )
          ? "yes"
          : "no",
        more_risks_clicked: storageService().get("more_risks_clicked")
          ? "yes"
          : "no",
      },
    };
    storageService().remove("fund_info_clicked");
    storageService().remove("portfolio_details_clicked");
    storageService().remove("more_risks_clicked");
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
    storageService().setObject("diystore_cart", [fund]);
    navigate("/diy/invest");
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
            <img
              style={{ marginLeft: "40px", width: "50px", height: "50px" }}
              src={fundDetails?.performance?.amc_logo_small}
              alt=""
            />
          </div>
          <div style={{ paddingBottom: "10px" }}>
            <PassiveStarRating value={fundDetails?.performance?.ms_rating} />
          </div>
          <p className="pfd-info">{`${fundDetails?.performance.ms_risk} risk | ${fundDetails?.performance?.tracking_index}`}</p>
          <div className="pf-flex">
            <div style={{ color: "#161A2E" }}>
              <p className="pfd-points" style={{ color: "#161A2E" }}>
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
              <p className="pfd-nav-returns" style={{ color: "#161A2E" }}>
                ₹{fundDetails?.performance?.current_nav}
              </p>
            </div>
            <div>
              <p className="pfd-points" style={{ color: "#161A2E" }}>
                Returns
              </p>
              <p
                className="pfd-nav-returns"
                style={{ fontWeight: "700", color: "#7ED321" }}
              >
                {fundDetails?.performance?.primary_return}%
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
            <FundChart graphData={graph} />
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
                }}
              />
            </div>
          )}
        </section>
        <div
          className="pfd-line"
          style={{ marginTop: "18px", marginBottom: "18px" }}
        ></div>
        <div className="pf-flex pfd-padding" style={{ paddingBottom: "18px" }}>
          <div>
            <p className="pfd-points">EXPENSE RATIO</p>
            <p className="pfd-values">
              {fundDetails?.portfolio?.expense_ratio}%
            </p>
          </div>
          <div>
            <p className="pfd-points">TRACKING ERROR</p>
            <p className="pfd-values">
              {fundDetails?.performance?.tracking_error !== "NA"
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
              <Accordian title="Returns*">
                <Returns
                  returnsData={fundDetails?.performance?.returns}
                  iframe={false}
                />
              </Accordian>
              <div className="pfd-line"></div>
              <Accordian title="Fund's Info" name="fund_info_clicked">
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
              </Accordian>
              <div className="pfd-line"></div>
              <Accordian title="Risk Details" name="more_risks_clicked">
                <RiskDetails riskDetailsData={fundDetails?.risk} />
              </Accordian>
              <div className="pfd-line"></div>
              <Accordian
                title="Portfolio Details"
                name="portfolio_details_clicked"
              >
                <FundPortfolio
                  portfolio={fundDetails?.portfolio}
                  navDate={fundDetails?.performance?.nav_update_date}
                />
              </Accordian>
              <div className="pfd-line" style={{ marginBottom: "20px" }}></div>
            </List>
          </section>
        ) : null}
        <section className="pfd-padding">
          <img src={MorningStar} style={{ paddingBottom: "10px" }} alt="" />
          <PassiveStarRating value={fundDetails?.performance?.ms_rating} />
          <p
            className="pfd-values"
            style={{ color: "#767E86", paddingBottom: "20px" }}
          >
            Funds are rated by Morningstar based on their past performance as
            compared to other funds in the same category. Ratings are from 1 – 5
            stars with 5 being the highest for the best performing funds and 1
            being the lowest for poor-performing funds.
          </p>
        </section>
      </div>
      {moreInfoDialog()}
    </Container>
  );
}

export default PassiveFundDetails;
