import React, { Component, Fragment } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from 'material-ui';
import { getConfig } from '../../utils/functions';
import toast from '../../common/ui/Toast';
import { getStatementStatus, navigate, setLoader } from '../common/commonFunctions';
import EmailRequestSteps from './EmailRequestSteps';
import { requestStatement } from '../common/ApiCalls';
import { formattedDate } from '../../utils/validators';
import ActionStatus from './ActionStatus';
import WVButton from '../../common/ui/Button/WVButton';
import WVDisableBodyTouch from '../../common/ui/DisableBodyTouch/WVDisableBodyTouch';

const { productName, emailDomain } = getConfig();

const theme = createMuiTheme({
  overrides: {
    MuiExpansionPanel: {
      root: {
        boxShadow: 'none',
      },
      expanded: {
        boxShadow: 'none',
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        border: '1px solid #0000000a !important',
        boxShadow: '0px 2px 4px 0px #0000000a !important',
        borderRadius: '4px !important',
        padding: '0 8px 0 20px !important',
      },
      content: {
        margin: '18px 0',
        display: 'block',
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: '20px',
        background: 'var(--highlight)',
        border: 'none',
        display: 'block',
        borderRadius: '4px',
      }
    }
  }
});

export default class EmailExpand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendlyStatementStatus: getStatementStatus(
        props?.email?.latest_statement.statement_status
      ),
    };
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  resync = async () => {
    const { email, parent } = this.props;
    parent.sendEvents('resync');
    try {
      parent.setLoader(true);
      await requestStatement({
        email: email.email,
        resync: 'true',
      });
      parent.navigate(`statement_request/${email.email}`, {
        navigateBackTo: 'settings',
        noEmailChange: true,
        fromResync: true,
      });
    } catch (err) {
      parent.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  regenerateStatement = async () => {
    const { email, parent } = this.props;

    try {
      this.setLoader('button');
      parent.sendEvents('regenerate_stat');
      const email_detail = email;
      await requestStatement({
        email: email_detail.email,
        statement_id: email_detail.latest_statement.statement_id,
        retrigger: 'true',
      });
      this.setLoader(false);
      this.props.onEmailUpdate();
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  renderResync = () => {
    const { email } = this.props;
    return (
      <Fragment>
        <Button
          color="secondary"
          classes={{
            root: 'resync-btn',
            label: 'gen-statement-btn-label',
          }}
          size="small"
          onClick={this.resync}
        >
          Resync
        </Button>
        <div id="resync-update-text">
          Last updated: {
            formattedDate(email.latest_success_statement.statement_end_date, 'd m y')
          }
        </div>
      </Fragment>
    );
  }

  renderStatementPending = () => {
    const { email, parent } = this.props;
    // const showRegenerateBtn = (new Date() - new Date(email.latest_statement.dt_updated)) / 60000 >= regenTimeLimit;
    return (
      <div className="ext-pf-subheader">
        <h4>Statement request sent</h4>
        <EmailRequestSteps
          parent={parent}
          emailDetail={email}
          emailForwardedHandler={this.props.emailForwardedHandler}
          emailLinkClick={() => parent.navigate('email_example_view', {
            comingFrom: 'settings',
            statementSource: email.latest_statement?.statement_source
          })}
          boxStyle={{ background: productName === 'fisdom' ? '#DFD8EF' : '#D6ECFF' }}
        />
      </div>
    );
  }

  renderInvalidStatement = () => {
    return (
      <div className="ext-pf-subheader">
        <ActionStatus type="error">
          INVALID CAS
        </ActionStatus>
        <h4 style={{ marginBottom: '10px' }}>
          Forward CAS
        </h4>
        <p>
          The email you sent could not be processed. Please ensure you forward the email as received to
          <span id="epsr-forward-email">&nbsp;cas@{emailDomain}</span>
        </p>
        <WVButton
          color="primary"
          contained
          fullWidth
          showLoader={this.state.show_loader}
          style={{ marginTop: '10px' }}
          onClick={this.regenerateStatement}
        >
          Regenerate statement
        </WVButton>
        <WVDisableBodyTouch disableTouch={this.state.show_loader} />
      </div>
    );
  }

  render() {
    const { email, clickRemoveEmail, allowRemove } = this.props;
    const renderFuncMap = {
      'failure': this.renderInvalidStatement,
      'success': this.renderResync,
      'other': this.renderStatementPending,
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className="email-expand-container">
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div id="email-expand-title">
                email ID
              </div>
              <div className="info-box-body-text">
                {email.email}
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {renderFuncMap[this.state.friendlyStatementStatus]()}
              {allowRemove && 
                <div id="remove-email" onClick={clickRemoveEmail}>Remove email</div>
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </MuiThemeProvider>
    );
  }
}