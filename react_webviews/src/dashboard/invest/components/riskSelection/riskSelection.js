import { CircularProgress } from 'material-ui';
import React, { useEffect, useState } from 'react';
import { storageService } from '../../../../utils/validators';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc, selectTitle } from '../../common/commonFunction';
import { riskProfiles } from '../../constants';
import FSelect from './FSelect';
import './riskSelection.scss';

const RiskSelection = ({
  canSkip,
  modifyRisk,
  ...otherProps
}) => {

  const sessionStoredRisk = storageService().get('userSelectedRisk') || '';
  const graphData = storageService().getObject('graphData');
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedRisk, selectRisk] = useState(sessionStoredRisk);
  const navigate = navigateFunc.bind(otherProps);

  useEffect(() => {
    const investTitle = selectTitle(graphData.investType);
    setTitle(investTitle);
  }, []);

  const updateRiskAndFetchRecommendations = async (skipRiskUpdate) => {
    const { amount, investType: type, term } = graphData;
    var params = {
      amount,
      term,
      type,
      rp_enabled: true,
    };

    if (type === 'saveforgoal' && modifyRisk) {
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

  const redirectToNextScreen = () => {
    let state = 'recommendations';

    if (graphData.investType === 'saveforgoal' && !modifyRisk) {
      state = `savegoal/${graphData.subtype}/target`;
    }

    navigate(state);
  };

  const goNext = async (skipRiskUpdate) => {
    if (selectedRisk !== 'Custom' && selectedRisk !== sessionStoredRisk) {
      await updateRiskAndFetchRecommendations(skipRiskUpdate);
    }
    redirectToNextScreen();
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
      helpContact
      disable={loader}
      title={title}
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <FSelect
        options={riskProfiles}
        indexBy='name'
        renderItem={riskOpt => <RiskOption data={riskOpt} />}
        onChange={risk => selectRisk(risk.name)}
      />
    </Container>
  );
}

export default RiskSelection;

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