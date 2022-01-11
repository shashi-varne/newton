import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import InfoBox from './InfoBox';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { isFunction, storageService } from '../../utils/validators';
import { getConfig } from '../../utils/functions';
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement';
import { Button } from '@material-ui/core';
const { emailDomain, productName } = getConfig();

const theme = createMuiTheme({
  overrides: {
    MuiStepper: {
      root: {
        padding: 0,
        background: 'transparent',
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
      root: {
        width: '20px',
        height: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
      active: {
        color: 'var(--primary) !important',
      },
      completed: {
        color: 'var(--primary) !important',
      },
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
  return ['Portfolio statement requested', 'View portfolio instantly'];
}

export default class EmailRequestSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      popupOpen: false,
    };
  }

  setActiveStep = (step) => {
    this.setState({ activeStep: step });
  }

  renderStep1 = () => {
    const {
      showRegenerateBtn,
      onRegenerateBtnClick,
      classes = {},
      emailLinkClick,
    } = this.props;

    return (<Fragment>
      <p>
        You will recieve an email with your consolidated portfolio statement
      </p>
      {showRegenerateBtn &&
        <Button
          color="secondary" fullWidth={true}
          classes={{
            root: 'gen-statement-btn-filled',
            label: 'gen-statement-btn-label-filled'
          }}
          style={{ marginBottom: '10px' }}
          onClick={onRegenerateBtnClick}
        >
          Regenerate Statement
        </Button>
      }
      <div>
        You'll get an email with your portfolio statement in around 1 hour. Forward the email as received to
      </div>
      <InfoBox
        classes={{ root: `info-box-cut-out ${classes.emailBox}` }}
        isCopiable={true}
        textToCopy={`cas@${emailDomain}`}
        boxStyle={{
          marginTop: '20px',
          border: 'none',
          backgroundColor: '#E6E5F4'
        }}
      >
        <span className="info-box-body-text">
          cas@{emailDomain}
        </span>
      </InfoBox>
      <WVClickableTextElement style={{ marginTop: '20px', display: 'inline-block' }} onClick={emailLinkClick}>
        The email looks like this
      </WVClickableTextElement>
    </Fragment>);
  }

  renderStep2 = () => {
    return (<Fragment>
      As soon as we receive the email, your portfolio statement will get generated.
    </Fragment>);
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return this.renderStep1();
      case 1:
        return this.renderStep2();
      default:
        return 'Unknown step';
    }
  }

  onPopupClose = () => {
    this.setState({ popupOpen: false });
  }

  notReceivedHandler = () => {
    const { notReceivedClick, parent } = this.props;

    if (isFunction(notReceivedClick)) {
      notReceivedClick();
    } else {
      parent.navigate('email_not_received');
    }
  }

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    // const { emailForwardedHandler } = this.props;
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
                disabled={[0, 1].includes(index)}
              >
                <StepLabel icon={customStepIcon(index)}>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {/* <RegenerateOptsPopup
            emailForwardedHandler={() => { this.onPopupClose(); emailForwardedHandler(); }}
            notReceivedClick={this.notReceivedHandler}
            onPopupClose={this.onPopupClose}
            open={this.state.popupOpen}
          /> */}
        </div>
      </MuiThemeProvider>
    );
  }
}

const customStepIcon = (idx) => {
  const iconMap = {
    0: '1',
    1: '2',
  };
  return (
    <div
      id="hni-custom-step-icon"
      style={{
        color: idx === 0 ? 'white' : '#767e86',
        background: idx === 0 ? 'var(--primary)' : 'white',
        lineHeight: '20px',
      }}>
      {iconMap[idx]}
    </div>
  );
};