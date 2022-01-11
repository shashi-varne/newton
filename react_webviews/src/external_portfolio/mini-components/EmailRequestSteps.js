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
      // showRegenerateBtn,
      classes = {},
      emailLinkClick,
    } = this.props;

    return (<Fragment>
      <p>
        You will recieve an email with your consolidated portfolio statement
      </p>
      <p>STATEMENT PASSWORD - <span>{`${productName}123`}</span></p>
      {/* {showRegenerateBtn &&
        <Button
          variant="outlined" color="secondary" fullWidth={true}
          classes={{
            root: 'gen-statement-btn-transparent',
            label: 'gen-statement-btn-label'
          }}
          style={{ marginBottom: '10px' }}
          onClick={this.generateStatement}
        >
          Generate Statement
        </Button>
      } */}
      <div>Please forward the email to</div>
      <InfoBox
        classes={{ root: `info-box-cut-out ${classes.emailBox}` }}
        isCopiable={true}
        textToCopy={`cas@${emailDomain}`}
        boxStyle={{ marginTop: '10px', border: '2px dashed var(--steelgrey)'}}
      >
        <span className="info-box-body-text">
          cas@{emailDomain}
        </span>
      </InfoBox>
      <WVClickableTextElement style={{ marginTop: '20px', display: 'inline-block' }} onClick={emailLinkClick}>
        View email sample
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

  generateStatement = () => {
    const { parent, emailDetail } = this.props;
    if (parent) {
      parent.sendEvents('generate_stat');
    }

    /* Store email detail in LS here so email_not_received and 
    statement_not_received screens can use this data */
    storageService().setObject('email_detail_hni', emailDetail);
    
    parent.navigate('cams_request_steps');
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