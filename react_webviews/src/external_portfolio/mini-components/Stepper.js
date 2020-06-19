import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import InfoBox from './InfoBox';

function getSteps() {
  return ['Wait for CAS email', 'Forward the email', 'View portfolio instantly'];
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

  renderStep1 = () => {
    return (<Fragment>
      In a few minutes, you’ll receive a CAS email on your email ID
    </Fragment>);
  }

  renderStep2 = () => {
    return (<Fragment>
      Please forward the email (and not the statement) to
      <InfoBox
        classes={{ root: 'info-box-cut-out' }}
        isCopiable={true}
        textToCopy="cas@fisdom.com"
      >
        <span className="info-box-body-text">
          cas@fisdom.com
        </span>
      </InfoBox>
      <Button
        variant="outlined" color="secondary" fullWidth={true}
        classes={{
          root: 'gen-statement-btn',
          label: 'gen-statement-btn-label'
        }}
        onClick={this.props.generateBtnClick}
      >
        Generate Statement
      </Button>
    </Fragment>);
  }

  renderStep3 = () => {
    return (<Fragment>
      As soon as we receive the email, your portfolio view will get generated
    </Fragment>);
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return this.renderStep1();
      case 1:
        return this.renderStep2();
      case 2:
        return this.renderStep3();
      default:
        return 'Unknown step';
    }
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
                {this.getStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    );
  }
}
