import React from 'react';
import { getConfig } from '../../utils/functions';
import Container from '../common/Container';

const { productName } = getConfig();

const SelfieSteps = (props) => {
  return (
    <Container
      title="How to take a selfie?"
      buttonTitle="Okay"
      handleClick={() => props.history.goBack()}
    >
      <div className="selfie-step">
        <div className="selfie-step-desc">
          While taking the selfie look straight to the phone.
        </div>
        <div className="selfie-step-imgs">
          <img
            src={require(`assets/${productName}/right_selfie.svg`)}
            alt="correct selfie alignment"
          />
          <img
            src={require(`assets/${productName}/wrong_selfie.svg`)}
            alt="incorrect selfie alignment"
          />
        </div>
      </div>
      <div className="selfie-step">
        <div className="selfie-step-desc">
          Take your selfie in a well lighted environment
        </div>
        <div className="selfie-step-imgs">
          <img
            src={require(`assets/${productName}/right_selfie.svg`)}
            alt="correct selfie alignment"
          />
          <img
            src={require(`assets/${productName}/dark_selfie.svg`)}
            alt="incorrect selfie alignment"
          />
        </div>
      </div>
    </Container>
  );
}

export default SelfieSteps;