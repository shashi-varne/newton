import './commonStyles.scss';
import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import InfoBox from '../../../../common/ui/F-InfoBox';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import FSelect from './FSelect';
import { getConfig, navigate as navigateFunc } from '../../../../utils/functions';
import BottomSheet from '../../../../common/ui/BottomSheet';
import useFunnelDataHook from '../../common/funnelDataHook';
import { nativeCallback } from '../../../../utils/native_callback';
import toast from 'common/ui/Toast';
import { flowName } from '../../constants';


const RiskModify = ({
  canSkip,
  modifyRisk,
  ...otherProps
}) => {
  const { productName } = getConfig();
  const {
    funnelData,
    funnelGoalData,
    userRiskProfile,
    updateFunnelData,
    setUserRiskProfile
  } = useFunnelDataHook();
  const [loader, setLoader] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRisk, selectRisk] = useState(userRiskProfile);
  const navigate = navigateFunc.bind(otherProps);
  
  let riskOptions = [...funnelData.rp_meta];

  // useEffect(() => {
  //   const investTitle = selectTitle(funnelData.investType);
  //   setTitle(investTitle);
  // }, []);

  const updateRiskAndFetchRecommendations = async () => {
    const { amount, investType: type, term } = funnelData;
    var params = {
      amount,
      term,
      type,
      rp_indicator: selectedRisk,
      rp_enabled: true,
    };

    try {
      setLoader(true);
      const res = await get_recommended_funds(params);

      if (res.updated) {
        setUserRiskProfile(selectedRisk);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'Something went wrong. Please try again'
      }
      updateFunnelData(res);

      setLoader(false);
    } catch (err) {
      console.log(err);
      toast(err);
    }
  }

  const goNext = async () => {
    sendEvents('next')
    if (selectedRisk !== 'Custom' && selectedRisk !== userRiskProfile) {
      await updateRiskAndFetchRecommendations();
    }
    navigate('/invest/recommendations');
  };

  const toggleConfirmDialog = () => {
    if (loader) return;
    setShowConfirmDialog(!showConfirmDialog);
  }

  if (userRiskProfile === 'Custom') {
    riskOptions.push({
      rp_indicator: 'Custom',
      subtitle: 'User created equity to debt distribution',
      equity: funnelData.equity,
      debt: funnelData.debt
    })
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "change risk profile",
        "flow": funnelData.flow || flowName[funnelData.investType] || "",
        "profile": selectedRisk,
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
      data-aid='change-risk-profile-screen'
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      fullWidthButton
      buttonTitle='Proceed'
      helpContact
      title='Change risk profile'
      handleClick={toggleConfirmDialog}
      classOverRideContainer='pr-container'
    >
      <div style={{ marginTop: '10px' }} data-aid='risk-modify'>
        <InfoBox
          image={require(`assets/${productName}/info_icon.svg`)}
          classes={{
            root: 'risk-info'
          }}
        >
          <div className="risk-info-title" data-aid='risk-info-title'>Note</div>
          <div className="risk-info-desc" data-aid='risk-info-desc'>
            If you change your risk profile, fund recommendations will change accordingly.
          </div>
        </InfoBox>
        {riskOptions &&
          <FSelect
            preselectFirst
            options={riskOptions}
            indexBy='rp_indicator'
            value={selectedRisk}
            renderItem={riskOpt => <RiskOption data={riskOpt} />}
            onChange={risk => selectRisk(risk.rp_indicator)}
          />
        }
        <div
          className="risk-customize-cta" data-aid='risk-customize-cta'
          onClick={() => {sendEvents('custom profile'); navigate(`/invest/${funnelGoalData.id}/risk-customize`)}}>
          Customise EQUITY to DEBT DISTRIBUTION
        </div>
        <BottomSheet
          open={showConfirmDialog}
          data={{
            header_title: 'Save changes',
            content: 'Are you sure you want to change your risk profile?',
            src: require(`assets/${productName}/ic_save.svg`),
            button_text1: loader ? <CircularProgress size={20} thickness={4} color="white" /> : 'Confirm',
            handleClick1: goNext,
            button_text2: 'Cancel',
            handleClick2: toggleConfirmDialog,
            handleClose: toggleConfirmDialog,
          }}
        />
      </div>
    </Container>
  );
}

export default RiskModify;

const RiskOption = ({ data }) => {
  return [
    <div className="risk-opt-title" data-aid='risk-opt-title'>
      {data.rp_indicator}
    </div>,
    <div className="risk-opt-desc" data-aid='risk-opt-desc'>
      {data.subtitle}
    </div>,
    <div className="risk-opt-split" data-aid='risk-opt-split'>
      <span>Distribution: </span>
      {data.equity}% Equity
      &nbsp;&nbsp;|&nbsp;&nbsp;
      {data.debt}% Debt
    </div>
  ];
}