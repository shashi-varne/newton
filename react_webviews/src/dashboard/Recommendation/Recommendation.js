// ----------- Asset Imports -------------------
import single_star from 'assets/single_star.png';
import morning_text from 'assets/morning_text.png';
// ---------------------------------------------

import './Recommendation.scss';
import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import FundCard from '../Invest/mini-components/FundCard';
import TermsAndCond from "../mini-components/TermsAndCond"
import { getBasePath, getConfig } from 'utils/functions';
import { storageService, formatAmountInr } from 'utils/validators';
import { navigate as navigateFunc } from 'utils/functions';
import { isInvestRefferalRequired, proceedInvestment } from '../proceedInvestmentFunctions';
import PennyVerificationPending from '../Invest/mini-components/PennyVerificationPending';
import InvestError from '../Invest/mini-components/InvestError';
import InvestReferralDialog from '../Invest/mini-components/InvestReferralDialog';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import PeriodWiseReturns from '../mini-components/PeriodWiseReturns';
import { get, isArray } from 'lodash';
import { get_recommended_funds } from '../Invest/common/api';
import RecommendationTopCard from './RecommendationTopCard';
import useFunnelDataHook from '../Invest/common/funnelDataHook';
import { nativeCallback } from '../../utils/native_callback';
import toast from 'common/ui/Toast'
import { flowName } from '../Invest/constants';
import WVSecurityDisclaimer from '../../common/ui/SecurityDisclaimer/WVSecurityDisclaimer';

const sipTypesKeys = [
  "buildwealth",
  "savetaxsip",
  "saveforgoal",
  "indexsip",
  "shariahsip",
  "sectoralsip",
  "midcapsip",
  "balancedsip",
  "goldsip",
  "diysip",
];

const Recommendations = (props) => {
  const config = getConfig();
  const riskEnabledFunnel = config.riskEnabledFunnels;
  const partner_code = config.code;
  const routeState = get(props, 'location.state', {});
  const navigate = navigateFunc.bind(props);
  const {
    funnelData,
    updateFunnelData,
    userRiskProfile,
    setUserRiskProfile
  } = useFunnelDataHook();
  const [recommendations, setRecommendations] = useState([]);
  const [renderTopCard, setRenderTopCard] = useState(false);

  useEffect(() => {
    if (isArray(funnelData.recommendation)) {
      setRecommendations(funnelData.recommendation);
    }
    if (
      ['savetax', 'savetaxsip', 'investsurplus'].includes(funnelData.investType) ||
      userRiskProfile
    ) {
      setRenderTopCard(true);
    }
  }, [funnelData]);

  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPending: false,
    openInvestError: false,
    errorMessage: '',
  });
  const [isins, setIsins] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [showSkelton, setShowSkelton] = useState(false)
  const {kyc: userKyc, user: currentUser, isLoading} = useUserKycHook();
  let sipOrOneTime = "";
  if ((funnelData.type !== "riskprofile") & (funnelData.type !== "insta-redeem")) {
    sipOrOneTime = "onetime";
    if (sipTypesKeys.indexOf(funnelData.investType) !== -1) sipOrOneTime = "sip";
  } else {
    sipOrOneTime = funnelData.order_type;
  }

  let investCtaText = "INVEST";
  if (sipOrOneTime === "sip") {
    investCtaText = "SELECT SIP DATE";
    if (recommendations.length !== 1) {
      investCtaText += "S";
    }
  }

  const getRecommendations = async () => {
    const { userEnteredAmt, amount, investType: type, term } = funnelData
    var params = {
      amount: userEnteredAmt || amount,
      term,
      type,
      rp_enabled: true,
    };

    try {
      setShowSkelton(true);
      const res = await get_recommended_funds(params);

      if (res.rp_indicator) {
        setUserRiskProfile(res.rp_indicator);
      }
      updateFunnelData(res);

    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setShowSkelton(false)
    }
  };

  useEffect(() => {
    if (routeState.fromRiskProfiler) {
      getRecommendations();
    }
  }, []);

  const goNext = (investReferralData, isReferralGiven, handleGraph) => {
    sendEvents('next')
    let investmentObject = {};
    if (funnelData.type !== "riskprofile") {
      var allocations = [];
      for (let data of recommendations) {
        let allocation = {};
        allocation = data.mf;
        allocation.amount = data.amount;
        allocations.push(allocation);
      }

      if (funnelData.type === "insta-redeem") {
        investmentObject.order_type = funnelData.order_type;
      }
      investmentObject.name = funnelData.name;
      investmentObject.bondstock = routeState.bond + ":" + routeState.stock;
      investmentObject.amount = funnelData.amount;
      investmentObject.term = funnelData.term;
      investmentObject.type = funnelData.investType;
      investmentObject.subtype = funnelData.subtype;
      investmentObject.allocations = allocations;
      investmentObject.flow = funnelData.flow;
      if (funnelData.showRecommendationTopCards && riskEnabledFunnel) {
        investmentObject.risk_profile_indicator = userRiskProfile;
        investmentObject.equity_ratio = funnelData.equity;
      }
    } else {
      investmentObject = funnelData;
    }

    let 
    paymentRedirectUrl = encodeURIComponent(
      `${getBasePath()}/page/callback/${sipOrOneTime}/${investmentObject.amount}${getConfig().searchParams}`
    );

    window.localStorage.setItem("investment", JSON.stringify(investmentObject));

    let investmentEventData = {};

    if (funnelData.type === "riskprofile") {
      investmentEventData = {
        amount: funnelData.amount,
        investment_type: funnelData.type,
        journey_name: "mf",
        investment_subtype: funnelData.subtype,
      };
    } else {
      investmentEventData = {
        amount: funnelData.amount,
        investment_type: funnelData.investType,
        journey_name: "mf",
        investment_subtype: funnelData.subtype,
      };
    }

    storageService().setObject("mf_invest_data", investmentEventData);

    if(handleGraph) {
      return
    }

    if (!currentUser.active_investment && partner_code !== "bfdlmobile") {
      navigate(
        "/invest-journey",
        { state: { investment: JSON.stringify(investmentObject) } },
      );
      return;
    } else if (sipOrOneTime === "onetime") {
      storageService().set("came_from_risk_webview", "");
      if (funnelData.type === "riskprofile") {
        if (!storageService().get("firsttime_from_risk_webview_invest")) {
          storageService().set("firsttime_from_risk_webview_invest", true);
        } else {
          storageService().set("firsttime_from_risk_webview_invest", "");
          window.location.href = storageService().get(
            "risk_webview_redirect_url"
          );
          return;
        }
      }
    }

      if (
        isInvestRefferalRequired(partner_code) &&
        !isReferralGiven
      ) {
        handleDialogStates("openInvestReferral", true);
        return;
      }
  
      let body = {
        investment: investmentObject,
      };
  
      if (isReferralGiven && investReferralData.code) {
        body.referral_code = investReferralData.code;
      }

      proceedInvestment({
        userKyc: userKyc,
        sipOrOnetime: sipOrOneTime,
        body: body,
        investmentEventData: investmentEventData,
        paymentRedirectUrl: paymentRedirectUrl,
        isSipDatesScreen: false,
        handleApiRunning: handleApiRunning,
        handleDialogStates: handleDialogStates,
        navigate: navigate,
      });
  };

  const handleApiRunning = (result) => {
    setIsApiRunning(result)
  }

  const handleDialogStates = (key, value, errorMessage) => {
    let dialog_states = {...dialogStates};
    dialog_states[key] = value;
    if(errorMessage)
    dialog_states['errorMessage'] = errorMessage;
    setDialogStates({...dialog_states});
  }

  useEffect(() => {
    const isinsVal = recommendations?.map((el) => {
      return el.mf.isin;
    });
    setIsins(isinsVal?.join(","));
  }, [recommendations]);

  const editFund = () => {
    sendEvents("fund edit")
    navigate("/invest/recommendations/edit-funds");
  };

  const checkHow = () => {
    storageService().setBoolean('check_how_clicked',true)
    navigate("/invest/recommendations/how-we-recommend");
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "recommended funds",
        "flow": funnelData.flow || flowName[funnelData.investType] || "",
        "check_how_clicked": storageService().getBoolean("check_how_clicked") ? "yes" : "no",
        "period_changed": storageService().getBoolean("period_changed") ? "yes" : "no",
        "info_clicked": storageService().getBoolean("info_clicked") ? "yes" : "no",
        }
    };
    if (funnelData.investType === "saveforgoal") {
      eventObj.properties['goal_purpose'] = funnelData.subtype || "";
    }
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      removeEventData();
      nativeCallback({ events: eventObj });
    }
  }

  const removeEventData = () => {
    storageService().remove("check_how_clicked") 
    storageService().remove("period_changed")
    storageService().remove("info_clicked")
  }

  const goBack = () => {
    sendEvents('back')
    const goBackPath = props.location?.state?.goBack || "";
    if(goBackPath) {
      props.history.push({
        pathname: goBackPath,
        search: getConfig().searchParams,
      });
      return;
    }
    props.history.goBack();
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='recommended-funds-screen'
      buttonTitle={
        currentUser &&
        !currentUser.active_investment &&
        partner_code !== "bfdlmobile"
          ? "HOW IT WORKS?"
          : investCtaText
      }
      skelton={isLoading || showSkelton}
      title='Recommended Funds'
      handleClick={goNext}
      showLoader={isApiRunning}
      hidePageTitle
      loaderData={{
        loadingText:"Your payment is being processed. Please do not close this window or click the back button on your browser."
      }}
      headerData={{goBack}}
    > 
      <div className="recommendation-page" data-aid='recommendation-page'>
        {riskEnabledFunnel && funnelData.showRecommendationTopCards &&
          <>
            {renderTopCard &&
              <RecommendationTopCard
                data={{
                  userRiskProfile,
                  funnelData
                }}
                parentProps={props}
                sendEvents={sendEvents}
              />
            }
            <PeriodWiseReturns
              initialTerm={funnelData.term}
              equity={funnelData.equity}
              stockReturns={funnelData.stockReturns}
              bondReturns={funnelData.bondReturns}
              principalAmount={funnelData.amount}
              isRecurring={funnelData.isRecurring}
              showInfo
            />
          </>
        }
        <section className='recommendations-section' data-aid='recommendations-section'>
          <div className='recommendations-header' data-aid='recommendations-header'>
            <div className="recommendation-title">Our Recommendation</div>
            <div className="recommendation-how-button" onClick={checkHow}>
              <span>How?</span>
            </div>
            {funnelData.investType !== 'insta-redeem' && (
              <div onClick={editFund} className='edit-recommendation-funds'>
                Edit
              </div>
            )}
          </div>
          <div className='recommendations-funds-lists' data-aid='recommendations-funds-lists'>
            {recommendations &&
              recommendations?.map((el, idx) => (
                <FundCard 
                  isins={isins} 
                  graph 
                  key={idx} 
                  fund={el} 
                  setInvestmentData={goNext} 
                  parentProps={props} />
              ))}
          </div>
          <div className='recommendations-total-investment' data-aid='recommendations-total-investment'>
            <div>Total investment</div>
            <div style={{ textAlign: 'right' }}>
              <div>{recommendations?.length ? formatAmountInr(funnelData.amount) : '₹0'}</div>
              {funnelData.investTypeDisplay === 'sip' && <div className='amount-per-month'>per month</div>}
            </div>
          </div>
          <div className="recommendations-disclaimers" data-aid='recommendations-disclaimers'>
            <div className="recommendations-disclaimer-morning" data-aid='recommendations-disclaimer-morning'>
              <img alt="single_star" src={single_star} />
              {partner_code !== "hbl" ? (
                <img alt="morning_star" width="100" src={morning_text} />
              ) : (
                <div>BL Portfolio Star Track MF Ratings</div>
              )}
            </div>
            <TermsAndCond />
            <WVSecurityDisclaimer />
          </div>
          <PennyVerificationPending
            isOpen={dialogStates.openPennyVerificationPending}
            handleClick={() => navigate("/kyc/add-bank")}
          />
          <InvestError
            isOpen={dialogStates.openInvestError}
            errorMessage={dialogStates.errorMessage}
            handleClick={() => navigate("/invest")}
            close={() => handleDialogStates("openInvestError", false)}
          />
          <InvestReferralDialog
            isOpen={dialogStates.openInvestReferral}
            goNext={goNext}
            close={() => handleDialogStates("openInvestReferral", false)}
          />
        </section>
      </div>
    </Container>
  );
};
export default Recommendations;