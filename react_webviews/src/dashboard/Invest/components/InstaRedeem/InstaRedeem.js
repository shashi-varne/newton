import "./InstaRedeem.scss";
import "../../commonStyles.scss";
import React, { useEffect, useState } from "react";
import Container from "../../../common/Container";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import Faqs from "common/ui/Faqs";
import SecureInvest from "../../mini-components/SecureInvest";
import { investRedeemData } from "../../constants";
import Button from "common/ui/Button";
import Dialog, { DialogActions, DialogContent } from "material-ui/Dialog";
import HowToSteps from "common/ui/HowToSteps";
import { SkeltonRect } from "../../../../common/ui/Skelton";
import { storageService } from "../../../../utils/validators";
import toast from "../../../../common/ui/Toast";
import { isEmpty, cloneDeep, get } from "lodash";
import { getInstaRecommendation } from "../../common/api";
import useFunnelDataHook from "../../common/funnelDataHook";
import { nativeCallback } from "../../../../utils/native_callback";

const { partner_code, productName } = getConfig();

const InstaRedeem = (props) => {
  const navigate = navigateFunc.bind(props);
  const { benefits, faqData } = investRedeemData;

  const [showLoader, setShowLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [knowMoreClicked, setKnowMoreClicked] = useState(false);
  const {
    funnelData,
    setFunnelData,
    setFunnelGoalData,
  } = useFunnelDataHook();
  const [recommendation, setRecommendation] = useState({});

  useEffect(() => {
    if (
      funnelData.investType !== 'insta-redeem' ||
      isEmpty(funnelData.recommendation)
    ) {
      initializeInstaRedeem();
    }
  }, []);

  useEffect(() => {
    setRecommendation(get(funnelData, 'recommendation[0].mf', []));
  }, [funnelData])

  const handleClick = () => {
    sendEvents('next')
    navigate("/invest/instaredeem/type");
  };

  const showFundInfo = (data) => {
    sendEvents('fund details card')
    const recommendation = { mf: data };
    let dataCopy = cloneDeep(recommendation);
    dataCopy.diy_type = "recommendation";
    dataCopy.invest_type_from = "instaredeem";
    storageService().setObject("diystore_fundInfo", dataCopy);
    navigate(
      "/fund-details",
      {
        searchParams: `${getConfig().searchParams}&isins=${data.isin}`,
      }
    );
  }

  const initializeInstaRedeem = async () => {
    setShowLoader(true);
    try {
      const result = await getInstaRecommendation();
      setFunnelData({
        type: "insta-redeem",
        term: 15,
        name: "Insta Redeem",
        bondstock: "",
        recommendation: [{ mf: result.mfs[0] }],
        investType: 'insta-redeem'
      });
      setFunnelGoalData(result.itag);
      setShowLoader(false);
    } catch (error) {
      console.log(error);
      setShowLoader(false);
      toast("Something went wrong!");
      props.history.goBack();
    }
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="responsive-dialog-title"
        className="invest-common-dialog"
        data-aid='invest-common-dialog'
      >
        <DialogContent className="dialog-content" data-aid='dialog-content'>
          <div className="head-bar insta-redeem-head-bar" data-aid='insta-redeem-head-bar'>
            <div className="text-left">Instant withdrawal</div>
            <img
              src={require(`assets/${productName}/ic_instant_withdrawal.svg`)}
              alt=""
            />
          </div>
          <div className="subtitle" data-aid='insta-redeem-subtitle'>
            Get your money whenever you need in two easy steps
          </div>
          <HowToSteps
            baseData={investRedeemData.withdrawSteps}
            style={{ margin: "0", padding: "5px 0 0 0" }}
          />
          <div className="sub-text" data-aid='sub-text-one'>
            Max limit is 50 k or 90% of folio value with redemption time of 30
            mins. Additional amount can be withdrawn from systematic/manual
            withdraw where amount is credited in 3-4 working days.
          </div>
          <div className="sub-text" data-aid='sub-text-two'>
            Exit load on withdrawal amount is 0.0070% to 0.0045% before seven
            days and 0% seven days onwards
          </div>
        </DialogContent>
        <DialogActions className="action">
          <Button
            onClick={() => {
              sendEvents("next", "insta popup");
              setOpenDialog(false);
            }}
            dataAid='okay-btn'
            classes={{ button: "invest-dialog-button" }}
            buttonTitle="OKAY"
          />
        </DialogActions>
      </Dialog>
    );
  };

  const sendEvents = (userAction, screenName) => {
    let eventObj = {
      "event_name": 'insta_redemption_Investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": screenName || "introduction",
        }
    };
    if(screenName !== "insta popup")
    {
      eventObj.properties["know_more_clicked"] = knowMoreClicked ? "yes" : "no";
    }
    if(screenName === "insta popup")
      eventObj.properties["intent"] = "withdrawal information"
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='start-investing-screen'
      buttonTitle="START INVESTING"
      handleClick={handleClick}
      title={
        partner_code === "bfdlmobile" ? "Money +" : "Insta redemption fund"
      }
      disable={showLoader}
    >
      <div className="insta-redeem" data-aid='insta-redeem'>
        <div className="generic-page-subtitle" data-aid='generic-page-subtitle'>
          Instant withdrawal facility with superior return compared to savings
          bank account
          </div>
        <div className="title" data-aid='benifites-text'>Benefits</div>
        {benefits.map((data, index) => {
          return (
            <div key={index} className="benefit" data-aid={`${data.key}-benefits`}>
              <img
                src={require(`assets/${productName}/${data.icon}`)}
                alt=""
              />
              <div className="text">
                {data.disc}
                {data.key === "withdrawal" && (
                  <div className="insta-redeem-know-more" data-aid={`insta-redeem-know-more-${data.key}`} onClick={() => {setKnowMoreClicked(true); setOpenDialog(true)}}>
                    KNOW MORE
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="title" data-aid='deposited-text'>Money will be deposited in</div>
        {!isEmpty(recommendation) && !showLoader && (
          <div
            data-aid='recommendation-fund-card'
            className="card fund-card"
            onClick={() => showFundInfo(recommendation)}
          >
            <div className="text">
              <h1 data-aid='recommendation-name'>{recommendation.mfname}</h1>
              <div className="flex">
                <div className="common-badge bond" data-aid='bond'>
                  {recommendation.mftype_name}
                </div>
                {partner_code !== "hbl" && recommendation.rating > 0 && (
                  <div className="common-badge rating" data-aid='rating'>
                    <div className="img">
                      <img src={require(`assets/ic_star.svg`)} alt="" />
                    </div>
                    <div className="value">{recommendation.rating}</div>
                  </div>
                )}
                {partner_code === "hbl" &&
                  recommendation.the_hindu_rating > 0 && (
                    <div className="common-badge rating" data-aid='the-hindu-rating'>
                      <div className="img">
                        <img src={require(`assets/ic_star.svg`)} alt="" />
                      </div>
                      <div className="value">
                      {recommendation.the_hindu_rating}
                      </div>
                    </div>
                  )}
                <div className="returns" data-aid='returns'>
                  {recommendation.returns &&
                    recommendation.returns.five_year && (
                      <span className="highlight-return">
                        {recommendation.returns.five_year.toFixed(2)}%
                      </span>
                    )}
                    in 5yrs
                  </div>
              </div>
            </div>
            <img
              className="icon"
              src={recommendation.amc_logo_small}
              alt="logo"
            />
          </div>
        )}
        {showLoader && <SkeltonRect className="skelton-loader" />}
        <div className="title" data-aid='f-a-q'>Frequently asked questions</div>
        <div className="generic-render-faqs" data-aid='generic-render-faqs'>
          <Faqs options={faqData} />
        </div>
        <SecureInvest />
        {renderDialog()}
      </div>
    </Container>
  );
}

export default InstaRedeem;
