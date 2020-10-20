import React, { Component } from 'react';
import Container from '../common/Container.js';
import { Drawer } from 'material-ui';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { navigate } from '../common/commonFunctions.js';
import { nativeCallback } from 'utils/native_callback';
import CamsRequestSteps from '../mini-components/camsRequestSteps.js';

export default class CamsWebpageSwipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      instructions_clicked: false,
    };
    this.navigate = navigate.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cams web',
        instructions_clicked: this.state.instructions_clicked,
      }
    };

    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goBack = (params) => {
    if (params && params.comingFrom === 'statement_request') {
      this.navigate(
        `statement_request/${params.email}`,
        {
          fromApp: params.fromApp,
          exitToApp: params.exitToApp,
          navigateBackTo: params.exitToApp ? null : params.navigateBackTo,
        },
        true
      );
    } else {
      this.props.history.goBack();
    }
  }

  toggleDrawer = (val) => {
    this.setState({ open: val });
    if (val) {
      this.setState({ instructions_clicked: true });
    }  
  }

  render() {
    const toggleDrawer = this.toggleDrawer;
    const { open } = this.state;

    return (
      <Container
        hideInPageTitle={true}
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        goBack={this.goBack}
      >
        <div style={{ height: 'auto', margin: '-15px' }}>
          <iframe
            className="cams-iframe"
            src="https://new.camsonline.com/Investors/Statements/Consolidated-Account-Statement/"
            title="fisdom"
            frameBorder="0"
            wmode="Opaque"
          ></iframe>
          <div className="cams-steps-pull" onTouchEnd={() => toggleDrawer(true)} onClick={() => toggleDrawer(true)}>
            <div id="csp-text">
              Instructions to generate CAMS
          </div>
            <ExpandLessIcon color="primary" style={{ width: '1.3em', height: '1.3em' }} />
          </div>
          <Drawer
            anchor="bottom"
            open={open}
            classes={{ paper: 'cams-steps-drawer' }}
            transitionDuration={500}
            variant="temporary">
            <div className="cams-steps-pull" onTouchEnd={() => toggleDrawer(false)} style={{ position: 'relative' }}>
              <div id="csp-text">
                Instructions to generate CAMS
            </div>
              <ExpandMoreIcon color="primary" style={{ width: '1.3em', height: '1.3em' }} />
            </div>
            <div style={{ padding: '20px', overflowY: 'scroll' }}>
              <CamsRequestSteps />
            </div>
          </Drawer>
        </div>
      </Container>
    );
  }
}