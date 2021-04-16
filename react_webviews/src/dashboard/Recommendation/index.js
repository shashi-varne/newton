import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import FundCard from '../invest/mini-components/FundCard';
import TermsAndCond from "../mini-components/TermsAndCond"

import trust_icons from 'assets/trust_icons.svg';
import single_star from 'assets/single_star.png';
import morning_text from 'assets/morning_text.png';

import { getBasePath, getConfig } from 'utils/functions';
import { storageService, formatAmountInr } from 'utils/validators';
import { navigate as navigateFunc } from '../invest/common/commonFunction';

import './style.scss';
import { isInvestRefferalRequired, proceedInvestment } from '../proceedInvestmentFunctions';
import PennyVerificationPending from '../invest/mini-components/PennyVerificationPending';
import InvestError from '../invest/mini-components/InvestError';
import InvestReferralDialog from '../invest/mini-components/InvestReferralDialog';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import PeriodWiseReturns from '../mini-components/PeriodWiseReturns';
import { get, isArray } from 'lodash';
import { get_recommended_funds } from '../invest/common/api';
import RecommendationTopCard from './RecommendationTopCard';
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
  const routeState = get(props, 'location.state', {});
  const [funnelData, setGraphData] = useState(storageService().getObject('funnelData') || {});
  const [recommendations, setRecommendations] = useState([]);
  const [userRiskProfile, setUserRiskProfile] = useState(storageService().get('userSelectedRisk') || '');
  const [renderTopCard, setRenderTopCard] = useState(false);

  useEffect(() => {
    if (isArray(funnelData.recommendation)) {
      setRecommendations(funnelData.recommendation);
    }
    if (funnelData.investType === 'savetax' || userRiskProfile) {
      setRenderTopCard(true);
    }
  }, [funnelData]);

  const partner = getConfig().partner;
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPendind: false,
    openInvestError: false,
    errorMessage: '',
  });
  const [isins, setIsins] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
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
    const { amount, investType: type, term } = storageService().getObject('funnelData');
    var params = {
      amount,
      term,
      type,
      rp_enabled: true,
    };

    try {
      setIsApiRunning(true);
      const res = await get_recommended_funds(params);

      if (res.rp_indicator) {
        storageService().set('userSelectedRisk', res.rp_indicator);
        setUserRiskProfile(res.rp_indicator);
      }
      storageService().setObject('funnelData', {
        ...funnelData,
        ...res,
        recommendedTotalAmount: res.amount
      });
      setGraphData(storageService().getObject('funnelData'));

      setIsApiRunning(false);
    } catch (err) {
      console.log(err);
      
    }
  };

  useEffect(() => {
    if (routeState.fromRiskProfiler) {
      getRecommendations();
    }
  }, []);

  const goNext = (investReferralData, isReferralGiven, handleGraph) => {
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
      investmentObject.amount = funnelData.recommendedTotalAmount;
      investmentObject.term = funnelData.term;
      investmentObject.type = funnelData.investType;
      investmentObject.subtype = funnelData.subtype;
      investmentObject.allocations = allocations;

    } else {
      investmentObject = funnelData;
    }

    let 
    paymentRedirectUrl = encodeURIComponent(
      `${getBasePath()}/page/callback/${sipOrOneTime}/${investmentObject.amount}`
    );

    window.localStorage.setItem("investment", JSON.stringify(investmentObject));

    let investmentEventData = {};

    if (funnelData.type === "riskprofile") {
      investmentEventData = {
        amount: funnelData.recommendedTotalAmount,
        investment_type: funnelData.type,
        journey_name: "mf",
        investment_subtype: funnelData.subtype,
      };
    } else {
      investmentEventData = {
        amount: funnelData.recommendedTotalAmount,
        investment_type: funnelData.investType,
        journey_name: "mf",
        investment_subtype: funnelData.subtype,
      };
    }

    storageService().setObject("mf_invest_data", investmentEventData);

    if(handleGraph) {
      return
    }

    if (!currentUser.active_investment && partner.code !== "bfdlmobile") {
      navigate(
        "/invest-journey",
        { state: { investment: JSON.stringify(investmentObject) } },
        true
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
        isInvestRefferalRequired(getConfig().partner.code) &&
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
        history: props.history,
        handleApiRunning: handleApiRunning,
        handleDialogStates: handleDialogStates,
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
  }, []);


  const navigate = navigateFunc.bind(props);
  const editFund = () => {
    navigate("recommendations/edit-funds");
  };

  return (
    <Container
      buttonTitle={
        currentUser &&
        !currentUser.active_investment &&
        partner.code !== "bfdlmobile"
          ? "HOW IT WORKS?"
          : investCtaText
      }
      skelton={isLoading}
      title='Recommended Funds'
      handleClick={goNext}
      showLoader={isApiRunning}
      hidePageTitle
    > 
      <div style={{ margin: '0 -20px'}}>
        {renderTopCard &&
          <RecommendationTopCard
            data={{
              userRiskProfile,
              funnelData
            }}
            parentProps={props}
          />
        }
        <PeriodWiseReturns
          initialTerm={funnelData.term}
          equity={funnelData.equity}
          stockReturns={funnelData.stockReturns}
          bondReturns={funnelData.bondReturns}
          principalAmount={funnelData.amount}
          showInfo
          // isRecurring={isRecurring}
        />
        <section className='recommendations-common-container'>
          <div className='recommendations-header'>
            <div>Our Recommendation</div>
            {funnelData.investType !== 'insta-redeem' && (
              <div onClick={editFund} className='edit-recommendation-funds'>
                Edit
              </div>
            )}
          </div>
          <div className='recommendations-funds-lists'>
            {recommendations &&
              recommendations?.map((el, idx) => (
                <FundCard isins={isins} graph key={idx} fund={el} parentProps={props} />
              ))}
          </div>
          <div className='recommendations-total-investment'>
            <div>Total Investment</div>

            <div>{recommendations?.length ? formatAmountInr(funnelData.recommendedTotalAmount) : '₹0'}</div>
          </div>
          <div>
            <div className="recommendations-disclaimer-morning">
              <img alt="single_star" src={single_star} />
              {partner.code !== "hbl" ? (
                <img alt="morning_star" width="100" src={morning_text} />
              ) : (
                <div>BL Portfolio Star Track MF Ratings</div>
              )}
            </div>
            <TermsAndCond />
          </div>
          <div className='recommendations-trust-icons'>
            <div>Investments with fisdom are 100% secure</div>
            <img alt='trust_sebi_secure' src={trust_icons} />
          </div>
          <PennyVerificationPending
            isOpen={dialogStates.openPennyVerificationPendind}
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
