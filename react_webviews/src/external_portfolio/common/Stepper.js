import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';

const step1 = (<Fragment>
  In a few minutes, you’ll receive a CAS email on your email ID
</Fragment>);
const step2 = (<Fragment>
  Please forward the email (and not the statement) to
  <div class="info-box info-box-extra">
    <div class="info-box-body">
      <span id="info-box-body-text">
        cas@fisdom.com
      </span>
    </div>
    <div class="info-box-ctrl">
      <span>COPY</span>
    </div>
  </div>
  <Button
    variant="outlined"  color="secondary" fullWidth={true}
    classes={{
      root: 'gen-statement-btn'
    }}
  >
    Generate Statement
  </Button>
</Fragment>);
const step3 = (<Fragment>
  As soon as we receive the email, your portfolio view will get generated
</Fragment>);

function getSteps() {
  return ['Wait for CAS email', 'Forward the email', 'View portfolio instantly'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return step1;
    case 1:
      return step2;
    case 2:
      return step3;
    default:
      return 'Unknown step';
  }
}

export default class EmailRegenerationStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
    };
  }

  setActiveStep = (step) => {
    this.setState({ activeStep: step });
  }

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <div>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          class={{ root: 'hni-stepper-root' }}>
          {steps.map((label, index) => (
            <Step
              key={label}
              active={true}
              completed={index === 0}
              disabled={index === 2}
            >
              <StepLabel
                classes={{
                  label: 'hni-stepper-label',
                  completed: 'hni-stepper-complete',
                  disabled: 'hni-stepper-disable',
                  active: 'hni-stepper-active',
                  iconContainer: 'hni-stepper-icon'
                }}
              >{label}</StepLabel>
              <StepContent
                classes={{ root: 'hni-step-content-root' }}
              >
                {getStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    );
  }
}
