import React, { Component, Fragment } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import InfoBox from './InfoBox';
import { isFunction, storageService } from '../../utils/validators';
import { getConfig } from '../../utils/functions';
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement';
import { regenTimeLimit } from '../constants';
import WVButton from '../../common/ui/Button/WVButton';
import { requestStatement } from '../common/ApiCalls';
import { setLoader } from '../common/commonFunctions';
import toast from '../../common/ui/Toast';
import StatementTriggeredPopUp from './StatementTriggeredPopUp';

const { emailDomain } = getConfig();

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
    this.setLoader = setLoader.bind(this);
  }

  componentDidMount() {
    let showRegenerateBtn = false;
    const { emailDetail } = this.props;
    if (emailDetail.latest_statement) {
      showRegenerateBtn =
        (new Date() - new Date(emailDetail.latest_statement.dt_updated)) / 60000 >= regenTimeLimit;
    }

    this.setState({ showRegenerateBtn });
  }

  setActiveStep = (step) => {
    this.setState({ activeStep: step });
  }

  regenerateStatement = async () => {
    const { emailDetail, parent } = this.props;

    try {
      this.setLoader('button');
      parent.sendEvents('regenerate_stat');

      await requestStatement({
        email: emailDetail.email,
        statement_id: emailDetail.latest_statement.statement_id,
        retrigger: 'true',
      });
      this.setLoader(false);
      this.setState({
        openPopup: true
      });
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  regenerateComplete = () => {
    this.setState({ openPopup: false });
    storageService().remove('hni-emails');
    this.props.onRegenerateComplete();
  }

  renderStep1 = () => {
    const {
      classes = {},
      emailLinkClick,
    } = this.props;

    return (<Fragment>
      <p>
        You will recieve an email with your consolidated portfolio statement
      </p>
      {this.state.showRegenerateBtn &&
        <WVButton
          fullWidth
          contained
          showLoader={this.state.show_loader}
          style={{ marginBottom: '10px' }}
          onClick={this.regenerateStatement}
        >
          Regenerate Statement
        </WVButton>
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
      <StatementTriggeredPopUp
        isOpen={this.state.openPopup}
        onCtaClick={this.regenerateComplete}
      />
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
    
    return (
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