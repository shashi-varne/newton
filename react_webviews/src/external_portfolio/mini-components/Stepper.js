import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import InfoBox from './InfoBox';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiStepper: {
      root: {
        padding: 0,
      },
    },
    MuiStepLabel: {
      label: {
        fontSize: '15px',
        fontWeight: 500,
      },
      completed: {
        color: '#767e86',
      },
      disabled: {
        color: '#767e86',
      },
      active: {
        color: 'inherit !important',
      },
      iconContainer: {
        
      }
    },
    MuiStepIcon: {
      active: {
        color: 'var(--primary) !important',
      },
      completed: {
        color: 'var(--primary) !important',
      },
      disabled: {
        color: 'var(--secondary) !important',
      }
    },
    MuiStepContent: {
      root: {
        color: '#767e86',
        fontSize: '13px',
        lineHeight: '19px',
        borderLeft: 'none',
      },
    },
  },
});

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

      <div
        className="email_example_link" onClick={this.props.emailLinkTrigger}>
        What does the CAS email look like?
      </div>
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
        Regenerate Statement
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
      <MuiThemeProvider theme={theme}>
        <div id="hni-stepper">
          <Stepper
            activeStep={activeStep}
            orientation="vertical">
            {steps.map((label, index) => (
              <Step
                key={label}
                active={true}
                completed={index === 0}
                disabled={[0, 2].includes(index)}
              >
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </MuiThemeProvider>
    );
  }
}
