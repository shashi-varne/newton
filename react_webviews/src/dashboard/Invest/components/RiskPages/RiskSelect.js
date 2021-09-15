import './commonStyles.scss';
import React, { useState } from 'react';
import { getConfig, navigate as navigateFunc } from '../../../../utils/functions';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import useFunnelDataHook from '../../common/funnelDataHook';
import { flowName, riskProfiles } from '../../constants';
import FSelect from './FSelect';
import { nativeCallback } from '../../../../utils/native_callback';
import { storageService } from '../../../../utils/validators'
import toast from 'common/ui/Toast'


const RiskSelect = ({
  canSkip,
  ...otherProps
}) => {
  const { productName } = getConfig();
  const {
    funnelData,
    userRiskProfile,
    updateFunnelData,
    setUserRiskProfile
  } = useFunnelDataHook();
  const [loader, setLoader] = useState(false);
  // const [title, setTitle] = useState('');
  const [selectedRisk, selectRisk] = useState(userRiskProfile);
  const navigate = navigateFunc.bind(otherProps);

  // useEffect(() => {
  //   const investTitle = selectTitle(funnelData.investType);
  //   setTitle(investTitle);
  // }, []);

  const updateRiskAndFetchRecommendations = async (skipRiskUpdate) => {
    const { userEnteredAmt, amount, investType: type, term } = funnelData;
    var params = {
      amount: userEnteredAmt || amount,
      term,
      type,
      rp_enabled: true,
    };

    if (type === 'saveforgoal') {
      /* Since in saveforgoal flow, the next screen is the monthly amount screen unlike
      in other flows where next screen is recommendations screen, we remove amount
      to prevent server from responding with recommendations list for this flow.
      
      Also, technically the property 'amount'/'userEnteredAmt' does not even exist 
      in funnelData yet for 'saveforgoal' flow since the monthly amount is entered
      only in the next screen*/
      delete params.amount;
    }

    if (skipRiskUpdate) {
      Object.assign(params, { skip_rp: true })
    } else {
      Object.assign(params, { rp_indicator: selectedRisk })
    }

    try {
      setLoader("button");
      const res = await get_recommended_funds(params);

      if (res.updated) {
        setUserRiskProfile(selectedRisk);
      }
      updateFunnelData({
        ...res,
        showRecommendationTopCards: true
      });
      
      setLoader(false);
    } catch (err) {
      console.log(err);
      toast(err);
    }
  }

  const goNext = async (skipRiskUpdate) => {
    sendEvents('next')
    storageService().remove('risk_info_clicked');
    if(!skipRiskUpdate && !selectedRisk) {
      toast("Please select your risk profile");
      return;
    }
    await updateRiskAndFetchRecommendations(skipRiskUpdate);

    let state = '/invest/recommendations';
    if (funnelData.investType === 'saveforgoal') {
      state = `/invest/savegoal/${funnelData.subtype}/amount`;
    }
    navigate(state);
  };

  const gotToRiskProfiler = () => {
    sendEvents('risk profiler')
    navigate('/risk/result-new', {
      state: {
        hideRPReset: true,
        hideClose: true,
        fromExternalSrc: true,
        internalRedirect: true,
        flow: funnelData.flow,
        amount: funnelData.userEnteredAmt || funnelData.amount,
        type: funnelData.investType,
        subType: funnelData.subtype, // only applicable for 'saveforgoal'
        year: funnelData.year, // only applicable for 'saveforgoal'
        term: funnelData.term
      }
    });
  };

  const showInfo = () => {
    storageService().setBoolean("risk_info_clicked", true);
    navigate('/invest/risk-info');
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "select risk profile",
        "flow": funnelData.flow || flowName[funnelData.investType] || "",
        "profile": selectedRisk,
        "info_clicked": storageService().getBoolean('risk_info_clicked') ? 'yes' : 'no',
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  return (
    <Container
      events={sendEvents("just_set_events")}
      data-aid='please-select-your-risk-profile-screen'
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle="SHOW MY FUNDS"
      helpContact
      showLoader={loader}
      hidePageTitle
      handleClick={goNext}
      classOverRideContainer='pr-container'
    > 
      <div className="risk-select-header" data-aid='pick-risk-profile'>
        <span>Please select your risk profile</span>
        <div className="risk-sh-info" onClick={showInfo}>
          Info
        </div>
      </div>
      {canSkip &&
        <div className="risk-select-skip" data-aid='risk-select-skip' onClick={() => goNext(true)}>Skip for now</div>
      }
      <div style={{ marginTop: '30px' }}>
        <FSelect
          options={riskProfiles}
          indexBy='name'
          renderItem={riskOpt =>
            riskOpt.name === 'Custom' ? '' : <RiskOption data={riskOpt} />
          }
          onChange={risk => selectRisk(risk.name)}
        />
        <img
          src={require(`assets/${productName}/rp_entry_banner.svg`)}
          alt="rp_entry"
          width="100%"
          onClick={gotToRiskProfiler}
        />
      </div>
    </Container>
  );
}

export default RiskSelect;

const RiskOption = ({ data }) => {
  return [
    <div className="risk-opt-title" data-aid='risk-opt-title'>
      {data.name}
    </div>,
    <div className="risk-opt-desc" data-aid='risk-opt-descy'>
      {data.desc}
    </div>
  ];
}