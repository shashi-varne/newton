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

const Recommendations = (props) => {
  const graphData = storageService().getObject("graphData") || {};
  const [dialogStates, setDialogStates] = useState({
    openPennyVerificationPendind: false,
    openInvestError: false,
    errorMessage: '',
  })
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
  const [isins, setIsins] = useState("");
  const [isApiRunning, setIsApiRunning] = useState(false);
  const partner_code = getConfig().partner_code;
  const {kyc: userKyc, user: currentUser, isLoading} = useUserKycHook();
  const partner = getConfig().partner;
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
  const EditFund = () => {
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
      <section className='recommendations-common-container'>
        <div className='recommendations-header'>
          <div>Our Recommendation</div>
          {investType !== 'insta-redeem' && (
            <div onClick={EditFund} className='edit-recommendation-funds'>
              Edit
            </div>
          )}
        </div>
        <div className='recommendations-funds-lists'>
          {recommendation &&
            recommendation?.map((el, idx) => (
              <FundCard isins={isins} graph key={idx} fund={el} history={props.history} />
            ))}
        </div>
        <div className='recommendations-total-investment'>
          <div>Total Investment</div>

          <div>{recommendation?.length > 0 ? formatAmountInr(amount) : '₹0'}</div>
        </div>
        <div>
          <div className="recommendations-disclaimer-morning">
            <img alt="single_star" src={single_star} />
            {partner_code !== "hbl" ? (
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
    </Container>
  );
};
export default Recommendations;
