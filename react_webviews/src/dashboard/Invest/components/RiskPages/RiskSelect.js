import './commonStyles.scss';
import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import { getConfig } from '../../../../utils/functions';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import useFunnelDataHook from '../../common/funnelDataHook';
import { navigate as navigateFunc } from '../../common/commonFunctions';
import { riskProfiles } from '../../constants';
import FSelect from './FSelect';
import { nativeCallback } from '../../../../utils/native_callback';
import { storageService } from '../../../../utils/validators'

const { productName } = getConfig();

const RiskSelect = ({
  canSkip,
  ...otherProps
}) => {
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
    const { amount, investType: type, term } = funnelData;
    var params = {
      amount,
      term,
      type,
      rp_enabled: true,
    };

    if (type === 'saveforgoal') {
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
    }
  }

  const goNext = async (skipRiskUpdate) => {
    sendEvents('next')
    storageService().remove('risk-info-clicked');
    await updateRiskAndFetchRecommendations(skipRiskUpdate);

    let state = 'recommendations';
    if (funnelData.investType === 'saveforgoal') {
      state = `savegoal/${funnelData.subtype}/amount`;
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
        amount: funnelData.amount,
        type: funnelData.investType,
        subType: funnelData.subtype, // only applicable for 'saveforgoal'
        year: funnelData.year, // only applicable for 'saveforgoal'
        term: funnelData.term
      }
    }, true);
  };

  const showInfo = () => {
    storageService().set("risk-info-clicked", true);
    navigate('risk-info');
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "select risk profile",
        "flow": funnelData.flow || (funnelData.investType === "saveforgoal" ? "invest for goal" : funnelData.investType) || "",
        "profile": userRiskProfile,
        "info_clicked": storageService().get('risk-info-clicked') ? 'yes' : 'no',
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
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle="SHOW MY FUNDS"
      helpContact
      showLoader={loader}
      hidePageTitle
      handleClick={goNext}
      classOverRideContainer='pr-container'
    > 
      <div className="risk-select-header">
        <span>Please select your risk profile</span>
        <div className="risk-sh-info" onClick={showInfo}>
          Info
        </div>
      </div>
      {canSkip &&
        <div className="risk-select-skip" onClick={() => goNext(true)}>Skip for now</div>
      }
      <div style={{ marginTop: '30px' }}>
        <FSelect
          preselectFirst
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
    <div className="risk-opt-title">
      {data.name}
    </div>,
    <div className="risk-opt-desc">
      {data.desc}
    </div>
  ];
}