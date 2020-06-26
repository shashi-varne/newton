import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Button } from 'material-ui';
import { navigate } from '../common/commonFunctions';
import EmailRegenerationStepper from './Stepper';

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

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="email-expand-container">
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div id="email-expand-title">
                email ID
              </div>
              <div className="info-box-body-text">
                ashok@fisdom.com
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {/* <Typography> */}
              <Button
                variant="outlined" color="secondary"
                classes={{
                  root: 'resync-btn',
                  label: 'gen-statement-btn-label'
                }}
                size="small"
                onClick={() => this.goNext('statement_request')}
              >
                Resync
              </Button>
              <div id="resync-update-text">Last updated: Jan 30, 2019</div>
              <div className="ext-pf-subheader">
                <h4>Statement request sent</h4>
                <EmailRegenerationStepper
                  emailLinkTrigger={() => this.navigate('email_entry', { comingFrom: 'settings'})}
                  classes={{ emailBox: 'info-box-email-expand' }}
                />
              </div>
              <div id="remove-email">Remove email</div>
              {/* </Typography> */}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </MuiThemeProvider>
    );
  }
}