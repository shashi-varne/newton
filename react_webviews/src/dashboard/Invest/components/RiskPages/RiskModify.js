import './commonStyles.scss';
import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import InfoBox from '../../../../common/ui/F-InfoBox';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc } from '../../common/commonFunctions';
import FSelect from './FSelect';
import { getConfig } from '../../../../utils/functions';
import BottomSheet from '../../../../common/ui/BottomSheet';
import useFunnelDataHook from '../../common/funnelDataHook';
import { nativeCallback } from '../../../../utils/native_callback';

const { productName } = getConfig();

const RiskModify = ({
  canSkip,
  modifyRisk,
  ...otherProps
}) => {
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
    }
  }

  const goNext = async () => {
    sendEvents('next')
    if (selectedRisk !== 'Custom' && selectedRisk !== userRiskProfile) {
      await updateRiskAndFetchRecommendations();
    }
    navigate('recommendations');
  };

  const toggleConfirmDialog = () => setShowConfirmDialog(!showConfirmDialog);

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
        "screen_name": "changerisk profile",
        "flow": funnelData.flow || (funnelData.investType === "saveforgoal" ? "invest for goal" : funnelData.investType) || "",
        "profile": selectedRisk,
        "info_clicked": 'no'
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
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Proceed'}
      helpContact
      disable={loader}
      title='Change risk profile'
      handleClick={toggleConfirmDialog}
      classOverRideContainer='pr-container'
    >
      <div style={{ marginTop: '10px' }}>
        <InfoBox
          image={require(`assets/${productName}/info_icon.svg`)}
          classes={{
            root: 'risk-info'
          }}
        >
          <div className="risk-info-title">Note</div>
          <div className="risk-info-desc">
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
          className="risk-customize-cta"
          onClick={() => {sendEvents('custom profile'); navigate(`${funnelGoalData.id}/risk-customize`)}}>
          Customise EQUITY to DEBT DISTRIBUTION
        </div>
        <BottomSheet
          open={showConfirmDialog}
          data={{
            header_title: 'Save changes',
            content: 'Are you sure you want to change your risk profile?',
            src: require(`assets/${productName}/ic_save.svg`),
            button_text1: 'Confirm',
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
    <div className="risk-opt-title">
      {data.rp_indicator}
    </div>,
    <div className="risk-opt-desc">
      {data.subtitle}
    </div>,
    <div className="risk-opt-split">
      <span>Distribution: </span>
      {data.equity}% Equity
      &nbsp;&nbsp;|&nbsp;&nbsp;
      {data.debt}% Debt
    </div>
  ];
}