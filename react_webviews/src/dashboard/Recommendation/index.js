import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import FundCard from '../invest/components/mini_components/FundCard';
import TermsAndCond from "../mini-components/TermsAndCond"

import trust_icons from 'assets/trust_icons.svg';
import single_star from 'assets/single_star.png';
import morning_text from 'assets/morning_text.png';

import { getConfig } from 'utils/functions';
import { storageService, formatAmountInr } from 'utils/validators';
import { navigate as navigateFunc } from '../invest/common/commonFunction';

import './style.scss';
import { isInvestRefferalRequired, proceedInvestmentChild } from '../invest/functions';
import PennyVerificationPending from '../invest/components/mini_components/PennyVerificationPending';
import InvestError from '../invest/components/mini_components/InvestError';
import InvestReferralDialog from '../invest/components/mini_components/InvestReferralDialog';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import PeriodWiseReturns from '../mini-components/PeriodWiseReturns';
import { isEmpty } from '../../utils/validators';

const Recommendations = (props) => {
  let graphData = storageService().getObject("graphData") || {};
  const {
    recommendation,
    amount,
    investType,
    order_type,
    type,
    term,
    name,
    subtype,
  } = graphData;
  const state = props.location.state || {};
  const partnerCode = getConfig().partnerCode;
  const partner = getConfig().partner;
  
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPendind: false,
    openInvestError: false,
    errorMessage: '',
  });
  const [isins, setIsins] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
  const {kyc: userKyc, user: currentUser, isLoading} = useUserKycHook();
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
  let sipOrOneTime = "";
  if ((type !== "riskprofile") & (type !== "insta-redeem")) {
    sipOrOneTime = "onetime";
    if (sipTypesKeys.indexOf(investType) !== -1) sipOrOneTime = "sip";
  } else {
    sipOrOneTime = order_type;
  }

  let investCtaText = "INVEST";
  if (sipOrOneTime === "sip") {
    investCtaText = "SELECT SIP DATE";
    if (recommendation.length !== 1) {
      investCtaText += "S";
    }
  }

  const proceedInvestment = (investReferralData, isReferralGiven) => {
    let investmentObject = {};
    if (type !== "riskprofile") {
      var allocations = [];
      for (let data of recommendation) {
        let allocation = {};
        allocation = data.mf;
        allocation.amount = data.amount;
        allocations.push(allocation);
      }

      if (type === "insta-redeem") {
        investmentObject.order_type = order_type;
      }
      investmentObject.name = name;
      investmentObject.bondstock = state.bond + ":" + state.stock;
      investmentObject.amount = amount;
      investmentObject.term = term;
      investmentObject.type = investType;
      investmentObject.subtype = subtype;
      investmentObject.allocations = allocations;

    } else {
      investmentObject = graphData;
    }

    let 
    paymentRedirectUrl = encodeURIComponent(
      `${window.location.origin}/page/callback/${sipOrOneTime}/${investmentObject.amount}`
    );

    window.localStorage.setItem("investment", JSON.stringify(investmentObject));

    let investmentEventData = {};

    if (type === "riskprofile") {
      investmentEventData = {
        amount: amount,
        investment_type: type,
        journey_name: "mf",
        investment_subtype: graphData.subtype,
      };
    } else {
      investmentEventData = {
        amount: amount,
        investment_type: investType,
        journey_name: "mf",
        investment_subtype: graphData.subtype,
      };
    }

    storageService().setObject("mf_invest_data", investmentEventData);

    if (!currentUser.active_investment && partner.code !== "bfdlmobile") {
      navigate(
        "/invest-journey",
        { state: { investment: JSON.stringify(investmentObject) } },
        true
      );
      return;
    } else if (sipOrOneTime === "onetime") {
      storageService().set("came_from_risk_webview", "");
      if (type === "riskprofile") {
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

      proceedInvestmentChild({
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
    handleApiRunning(false);
  }

  useEffect(() => {
    const isinsVal = recommendation?.map((el) => {
      return el.mf.isin;
    });
    setIsins(isinsVal?.join(","));
  }, []);


  const navigate = navigateFunc.bind(props);
  const editFund = () => {
    navigate("recommendations/edit-funds");
  };

  const goNext = () => {
    proceedInvestment();
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
      hidePageTitle
      skelton={isLoading}
      title='Recommended Funds'
      handleClick={goNext}
      showLoader={isApiRunning}
    > 
      <div style={{ margin: '0 -20px'}}>
        <RecommendationTopCard
          showRiskCard={userRiskProfile}
          showTaxCard={investType === 'savetax'}
        />
        <PeriodWiseReturns
          initialTerm={term}
          stockSplit={graphData.stockSplit}
          stockReturns={graphData.stockReturns}
          bondReturns={graphData.bondReturns}
          principalAmount={graphData.amount}
          // isRecurring={isRecurring}
        />
        <section className='recommendations-common-container'>
          <div className='recommendations-header'>
            <div>Our Recommendation</div>
            {investType !== 'insta-redeem' && (
              <div onClick={editFund} className='edit-recommendation-funds'>
                Edit
              </div>
            )}
          </div>
          <div className='recommendations-funds-lists'>
            {recommendation &&
              recommendation?.map((el, idx) => (
                <FundCard isins={isins} graph key={idx} fund={el} parentProps={props} />
              ))}
          </div>
          <div className='recommendations-total-investment'>
            <div>Total Investment</div>

            <div>{recommendation?.length > 0 ? formatAmountInr(amount) : '₹0'}</div>
          </div>
          <div>
            <div className="recommendations-disclaimer-morning">
              <img alt="single_star" src={single_star} />
              {partnerCode !== "hbl" ? (
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
            proceedInvestment={proceedInvestment}
            close={() => handleDialogStates("openInvestReferral", false)}
          />
        </section>
      </div>
    </Container>
  );
};
export default Recommendations;

const RecommendationTopCard = ({
  showRiskCard,
  showTaxCard,
  cardDetails,
}) => {
  const renderContent = () => {
    if (showRiskCard) {
      const { userRiskProfile, stockSplit, bondSplit } = riskDetails;
      
      return (
        <div class="risk-profile-card">
          <img alt="" class="left-img" />
          <div class="risk-details">
            {userRiskProfile ?
              <>
                <div class="header" onClick="showRiskInfo()">
                  Risk profile
                  <img src="assets/img/info_icon.svg" class="info-icn" />
                </div>
                <div class="risk-type">{{ userRiskProfile }}</div>
                <div class="risk-distribution">{{ stockSplit }}% Equity | {{ bondSplit }}% Debt</div>
              </> :
              <>
                <div class="risk-type" ng-if="showStartRiskProfile">Select risk profile</div>
                <div class="desc" ng-if="showStartRiskProfile">Get better fund recommendations</div>
              </>
            }
          </div>
          <div class="button" ng-click="modifyRiskProfile()">
            {isEmpty(cardDetails) ? "Select": "Change"}
          </div>
        </div>
      );
    } else if (showTaxCard) {
      return (
        <div class="tax-card" ng-show="investType === 'savetax' || investType === 'savetaxsip'">
          <img src="assets/img/sale.svg" alt="" />
          <div class="text">Tax savings for {{ taxPeriodText }}</div>
          <div class="amount">{formatAmountInr(cardDetails.corpus)}</div>
        </div>
      );
    }
  }
  return (
    <div class="recommendation-top-section">
      {renderContent()}
    </div>
  );
}