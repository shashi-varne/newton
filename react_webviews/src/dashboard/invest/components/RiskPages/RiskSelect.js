import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import { storageService } from '../../../../utils/validators';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc, selectTitle } from '../../common/commonFunction';
import { riskProfiles } from '../../constants';
import FSelect from './FSelect';
import './RiskPages.scss';

const RiskSelect = ({
  canSkip,
  ...otherProps
}) => {

  const sessionStoredRisk = storageService().get('userSelectedRisk') || '';
  const graphData = storageService().getObject('graphData');
  const [loader, setLoader] = useState(false);
  // const [title, setTitle] = useState('');
  const [selectedRisk, selectRisk] = useState(sessionStoredRisk);
  const navigate = navigateFunc.bind(otherProps);

  // useEffect(() => {
  //   const investTitle = selectTitle(graphData.investType);
  //   setTitle(investTitle);
  // }, []);

  const updateRiskAndFetchRecommendations = async (skipRiskUpdate) => {
    const { amount, investType: type, term } = graphData;
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
      setLoader(true);
      const res = await get_recommended_funds(params);

      if (res.updated) {
        storageService().set('userSelectedRisk', selectedRisk);
      }
      storageService().setObject('graphData', { ...graphData, ...res });
      
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  }

  const goNext = async (skipRiskUpdate) => {
    await updateRiskAndFetchRecommendations(skipRiskUpdate);

    let state = 'recommendations';
    if (graphData.investType === 'saveforgoal') {
      state = `savegoal/${graphData.subtype}/target`;
    }
    navigate(state);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
      helpContact
      disable={loader}
      title='Please select your Risk Profile'
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <div style={{ marginTop: '10px' }}>
        <FSelect
          preselectFirst
          options={riskProfiles}
          indexBy='name'
          renderItem={riskOpt => <RiskOption data={riskOpt} />}
          onChange={risk => selectRisk(risk.name)}
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