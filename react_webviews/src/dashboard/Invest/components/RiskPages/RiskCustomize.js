import './commonStyles.scss';
import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc } from 'utils/functions';
import EquityDebtSlider from '../../mini-components/EquityDebtSlider';
import toast from 'common/ui/Toast'
import InfoBox from '../../../../common/ui/F-InfoBox';
import { getConfig } from '../../../../utils/functions';
import BottomSheet from '../../../../common/ui/BottomSheet';
import useFunnelDataHook from '../../common/funnelDataHook';
import { nativeCallback } from '../../../../utils/native_callback';
import { flowName } from '../../constants';


const RiskCustomize = (props) => {
  const { productName } = getConfig();
  const {
    funnelData,
    updateFunnelData,
    setUserRiskProfile
  } = useFunnelDataHook();
  const [loader, setLoader] = useState(false);
  // const [title, setTitle] = useState('');
  const navigate = navigateFunc.bind(props);
  const [equity, setEquity] = useState(funnelData.equity || 0);
  const [debt, setDebt] = useState(100 - equity);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  // useEffect(() => {
  //   const investTitle = selectTitle(funnelData.investType);
  //   setTitle(investTitle);
  // }, []);

  const fetchRecommendations = async () => {
    const { amount, investType: type, term } = funnelData;
    var params = {
      amount,
      term,
      type,
      equity: equity,
      debt: debt,
      rp_enabled: true,
    };

    try {
      setLoader(true);

      const res = await get_recommended_funds(params);
      updateFunnelData(res);
      setUserRiskProfile('Custom');

      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
      throw(err);
    }
  }


  const goNext = async () => {
    sendEvents('next')
    try {
      await fetchRecommendations();
      navigate('/invest/recommendations');
    } catch (err) {
      console.log(err);
      toast(err)
    }
  };

  const handleChange = (value) => {
    setEquity(value);
    setDebt(100 - value);
  };

  const toggleConfirmDialog = () => {
    if (loader) return;
    setShowConfirmDialog(!showConfirmDialog);
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "custom profile",
        "flow": funnelData.flow || flowName[funnelData.investType] || "",
        "custom_stock%": equity,
        "custom_bond%": debt,
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  console.log(funnelData)
  return (
    <Container
      data-aid='customise-equity-debt-distribution-screen'
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      fullWidthButton
      buttonTitle='Save Changes'
      helpContact
      title='Customise Equity-Debt distribution'
      handleClick={toggleConfirmDialog}
      classOverRideContainer='pr-container'
    >
      <>
        <InfoBox
          image={require(`assets/${productName}/info_icon.svg`)}
          classes={{
            root: 'risk-info'
          }}
        >
          <div className="risk-info-title" data-aid='risk-info-title'>Info</div>
          <div className="risk-info-desc" data-aid='risk-info-desc'>
            We do not recommend setting custom equity & debt 
            distribution if you are unfamiliar with market dynamics.
          </div>
        </InfoBox>
        <EquityDebtSlider
          equity={equity}
          onChange={handleChange}
        />
        <BottomSheet
          open={showConfirmDialog}
          data={{
            header_title: 'Save changes',
            content: 'Are you sure you want to change your equity to debt distribution for your investment profile?',
            src: require(`assets/${productName}/ic_save.svg`),
            button_text1: loader ? <CircularProgress size={20} thickness={4} color="white" /> : 'Confirm',
            handleClick1: goNext,
            button_text2: 'Cancel',
            handleClick2: toggleConfirmDialog,
            handleClose: toggleConfirmDialog,
          }}
        />
      </>
    </Container>
  );
};

export default RiskCustomize;