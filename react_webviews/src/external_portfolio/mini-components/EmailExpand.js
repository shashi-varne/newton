import React, { Component, Fragment } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from 'material-ui';
import toast from '../../common/ui/Toast';
import { navigate } from '../common/commonFunctions';
import EmailRequestSteps from './EmailRequestSteps';
import { requestStatement } from '../common/ApiCalls';
import { formattedDate } from '../../utils/validators';

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
    this.state = {};
    this.navigate = navigate.bind(this);
  }

  resync = async () => {
    const { email, parent } = this.props;
    try {
      await requestStatement({ email_id: email.email, resync: true });
      parent.navigate('statement_request', {
        navigateBackTo: 'settings',
        email: email.email,
        noEmailChange: true,
      });
    } catch (err) {
      console.log(err);
      toast(err);
    }
  }

  renderResync = () => {
    const { email } = this.props;
    return (
      <Fragment>
        <Button
          variant="outlined" color="secondary"
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
    const showRegenerateBtn = (new Date() - new Date(email.latest_statement.dt_updated)) / 60000 >= 30;
    return (
      <div className="ext-pf-subheader">
        <h4>Statement request sent</h4>
        <EmailRequestSteps
          parent={parent}
          emailDetail={email}
          emailForwardedHandler={this.props.emailForwardedHandler}
          showRegenerateBtn={showRegenerateBtn}
          classes={{ emailBox: 'info-box-email-expand' }}
        />
      </div>
    );
  }

  render() {
    const { email, clickRemoveEmail, allowRemove } = this.props;
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
              {email.latest_statement.statement_status === 'success' ?
                this.renderResync() : this.renderStatementPending()
              }
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