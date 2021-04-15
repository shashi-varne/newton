import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import InfoBox from '../../../../common/ui/F-InfoBox';
import { storageService } from '../../../../utils/validators';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc, selectTitle } from '../../common/commonFunction';
import FSelect from './FSelect';
import './RiskPages.scss';
import { getConfig } from '../../../../utils/functions';
import BottomSheet from '../../../../common/ui/BottomSheet';

const { productName } = getConfig();

const RiskModify = ({
  canSkip,
  modifyRisk,
  ...otherProps
}) => {

  const sessionStoredRisk = storageService().get('userSelectedRisk') || '';
  const goalRecommendation = storageService().getObject('goalRecommendations');
  const funnelData = storageService().getObject('funnelData');
  let riskOptions = funnelData.rp_meta;
  const [loader, setLoader] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRisk, selectRisk] = useState(sessionStoredRisk);
  const navigate = navigateFunc.bind(otherProps);

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
        storageService().set('userSelectedRisk', selectedRisk);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'Something went wrong. Please try again'
      }
      storageService().setObject('funnelData', { ...funnelData, ...res });

      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  }

  const goNext = async () => {
    if (selectedRisk !== 'Custom' && selectedRisk !== sessionStoredRisk) {
      await updateRiskAndFetchRecommendations();
    }
    navigate('recommendations');
  };

  const toggleConfirmDialog = () => setShowConfirmDialog(!showConfirmDialog);

  if (sessionStoredRisk === 'Custom') {
    riskOptions.push({
      rp_indicator: 'Custom',
      subtitle: 'User created equity to debt distribution',
      equity: funnelData.equity,
      debt: funnelData.debt
    })
  }

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
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
          <div className="risk-info-title">Info</div>
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
          onClick={() => navigate(`${goalRecommendation.id}/risk-customize`)}>
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