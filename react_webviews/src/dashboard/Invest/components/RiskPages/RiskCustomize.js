import './commonStyles.scss';
import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc } from '../../common/commonFunctions';
import EquityDebtSlider from '../../mini-components/EquityDebtSlider';
import toast from 'common/ui/Toast'
import InfoBox from '../../../../common/ui/F-InfoBox';
import { getConfig } from '../../../../utils/functions';
import BottomSheet from '../../../../common/ui/BottomSheet';
import useFunnelDataHook from '../../common/funnelDataHook';

const { productName } = getConfig();

const RiskCustomize = (props) => {
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
    try {
      await fetchRecommendations();
      navigate('recommendations');
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

  return (
    <Container
      classOverRide='pr-error-container'
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
          <div className="risk-info-title">Info</div>
          <div className="risk-info-desc">
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