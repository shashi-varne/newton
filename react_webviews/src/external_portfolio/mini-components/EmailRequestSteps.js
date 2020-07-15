import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import InfoBox from './InfoBox';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import RegenerateOptsPopup from './RegenerateOptsPopup';
import { isFunction, storageService } from '../../utils/validators';

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
  return ['Wait for CAS email', 'Forward the email', 'View portfolio instantly'];
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
    const { emailLinkClick } = this.props;
    if (!emailLinkClick) {
      return (
        <span style={{color: 'red'}}>
          Error: Please provide parent or emailLinkClick function props
        </span>
      );
    }
    return (<Fragment>
      You'll be receiving the statement email on your email id shortly

      <div
        className="email_example_link"
        onClick={emailLinkClick}
      >
        The email looks like this
      </div>
    </Fragment>);
  }

  renderStep2 = () => {
    let classes = this.props.classes || {};
    const { showRegenerateBtn } = this.props;
    return (<Fragment>
      Please forward the email (and <b>not the statement</b> ) to
      <InfoBox
        classes={{ root: `info-box-cut-out ${classes.emailBox}` }}
        isCopiable={true}
        textToCopy="cas@fisdom.com"
      >
        <span className="info-box-body-text">
          cas@fisdom.com
        </span>
      </InfoBox>
      {showRegenerateBtn &&
        <Button
          variant="outlined" color="secondary" fullWidth={true}
          classes={{
            root: 'gen-statement-btn',
            label: 'gen-statement-btn-label'
          }}
          onClick={this.generateStatement}
        >
          Regenerate Statement
        </Button>
      }
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

  generateStatement = () => {
    const { parent, emailDetail } = this.props;
    if (parent) {
      parent.sendEvents('regenerate_stat');
    }
    /* Store email detail in LS here so email_not_received and 
    statement_not_received screens can use this data */
    storageService().setObject('email_detail_hni', emailDetail);
    this.setState({ popupOpen: true });
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
    const { emailForwardedHandler } = this.props;
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
                <StepLabel icon={customStepIcon(index)}>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <RegenerateOptsPopup
            emailForwardedHandler={() => { this.onPopupClose(); emailForwardedHandler(); }}
            notReceivedClick={this.notReceivedHandler}
            onPopupClose={this.onPopupClose}
            open={this.state.popupOpen}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const customStepIcon = (idx) => {
  const iconMap = {
    0: (<DoneIcon style={{fontSize: '18px', fontWeight: 'bold'}}/>),
    1: '2',
    2: '3',
  };
  return (
    <div
      id="hni-custom-step-icon"
      style={{
        color: idx === 2 ? '#767e86' : 'white',
        background: idx === 2 ? 'white' : 'var(--primary)',
        lineHeight: idx === 0 ? '30px' : '22px',
      }}>
      {iconMap[idx]}
    </div>
  );
};