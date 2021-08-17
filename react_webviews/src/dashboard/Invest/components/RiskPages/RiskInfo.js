import React from 'react';
import RiskIntroContent from '../../../../risk_profiler/components/intro/RiskIntroContent';
import Container from '../../../common/Container';

const RiskInfo = (props) => {
  return (
    <Container
      hidePageTitle
      buttonTitle="Okay"
      handleClick={() => props.history.goBack()}
    >
      <RiskIntroContent />
    </Container>
  );
}

export default RiskInfo;