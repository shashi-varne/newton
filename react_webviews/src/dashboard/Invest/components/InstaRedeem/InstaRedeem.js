import "./InstaRedeem.scss";
import "../../commonStyles.scss";
import React, { useEffect, useState } from "react";
import Container from "../../../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../../common/commonFunctions";
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

const { partner_code, productName } = getConfig();

const InstaRedeem = (props) => {
  const navigate = navigateFunc.bind(props);
  const { benefits, faqData } = investRedeemData;

  const [showLoader, setShowLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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
    navigate("instaredeem/type");
  };

  const showFundInfo = (data) => {
    const recommendation = { mf: data };
    let dataCopy = cloneDeep(recommendation);
    dataCopy.diy_type = "recommendation";
    dataCopy.invest_type_from = "instaredeem";
    storageService().setObject("diystore_fundInfo", dataCopy);
    navigate("/fund-details", {
      searchParams: `${getConfig().searchParams}&isins=${data.isin}`,
    });
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
      >
        <DialogContent className="dialog-content">
          <div className="head-bar insta-redeem-head-bar">
            <div className="text-left">Instant withdrawal</div>
            <img
              src={require(`assets/${productName}/ic_instant_withdrawal.svg`)}
              alt=""
            />
          </div>
          <div className="subtitle">
            Get your money whenever you need in two easy steps
          </div>
          <HowToSteps
            baseData={investRedeemData.withdrawSteps}
            style={{ margin: "0", padding: "5px 0 0 0" }}
          />
          <div className="sub-text">
            Max limit is 50 k or 90% of folio value with redemption time of 30
            mins. Additional amount can be withdrawn from systematic/manual
            withdraw where amount is credited in 3-4 working days.
          </div>
          <div className="sub-text">
            Exit load on withdrawal amount is 0.0070% to 0.0045% before seven
            days and 0% seven days onwards
          </div>
        </DialogContent>
        <DialogActions className="action">
          <Button
            onClick={() => setOpenDialog(false)}
            classes={{ button: "invest-dialog-button" }}
            buttonTitle="OKAY"
          />
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container
      buttonTitle="START INVESTING"
      handleClick={handleClick}
      title={
        partner_code === "bfdlmobile" ? "Money +" : "Insta redemption fund"
      }
    >
      <div className="insta-redeem">
        <div className="generic-page-subtitle">
          Instant withdrawal facility with superior return compared to savings
          bank account
          </div>
        <div className="title">Benefits</div>
        {benefits.map((data, index) => {
          return (
            <div key={index} className="benefit">
              <img
                src={require(`assets/${productName}/${data.icon}`)}
                alt=""
              />
              <div className="text">
                {data.disc}
                {data.key === "withdrawal" && (
                  <div className="insta-redeem-know-more" onClick={() => setOpenDialog(true)}>
                    KNOW MORE
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="title">Money will be deposited in</div>
        {!isEmpty(recommendation) && !showLoader && (
          <div
            className="card fund-card"
            onClick={() => showFundInfo(recommendation)}
          >
            <div className="text">
              <h1>{recommendation.mfname}</h1>
              <div className="flex">
                <div className="common-badge bond">
                  {recommendation.mftype_name}
                </div>
                {partner_code !== "hbl" && recommendation.rating > 0 && (
                  <div className="common-badge rating">
                    <div className="img">
                      <img src={require(`assets/ic_star.svg`)} alt="" />
                    </div>
                    <div className="value">{recommendation.rating}</div>
                  </div>
                )}
                {partner_code === "hbl" &&
                  recommendation.the_hindu_rating > 0 && (
                    <div className="common-badge rating">
                      <div className="img">
                        <img src={require(`assets/ic_star.svg`)} alt="" />
                      </div>
                      <div className="value">
                      {recommendation.the_hindu_rating}
                      </div>
                    </div>
                  )}
                <div className="returns">
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
        <div className="title">Frequently asked questions</div>
        <div className="generic-render-faqs">
          <Faqs options={faqData} />
        </div>
        <SecureInvest />
        {renderDialog()}
      </div>
    </Container>
  );
}

export default InstaRedeem;
