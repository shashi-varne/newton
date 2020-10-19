import React, { Component } from 'react';
import Container from '../common/Container.js';
import { nativeCallback } from 'utils/native_callback';
import { storageService } from '../../utils/validators.js';
import { navigate, setLoader } from '../common/commonFunctions.js';
import { Button } from 'material-ui';
import CamsRequestSteps from '../mini-components/camsRequestSteps.js';

class CamsRequestStepsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigate = navigate.bind(this);
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cams instructions',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
      }
    };
    
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goNext = async () => {
    this.sendEvents('next');
  };

  openCAMSWebsite = () => {
    nativeCallback({
      action: 'open_in_browser',
      message: {
        url: 'https://new.camsonline.com/Investors/Statements/Consolidated-Account-Statement/',
      },
    });
  };

  goBack = (params) => {
    nativeCallback({ events: this.sendEvents('back') });
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
  };

  render() {
    const { show_loader } = this.state;
    return (
      <Container
        hideInPageTitle={true}
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        noHeader={show_loader}
        handleClick={this.goNext}
        noFooter={true}
        showLoader={show_loader}
        goBack={this.goBack}
      >
        <div className="cams-steps-title">
          <div className="header-title-text-hni" id="hni-custom-title">
            How to generate CAS from CAMS website
          </div>
          <img src={require('assets/cams-logo.svg')} alt="cams" style={{ marginLeft: '35px' }} />
        </div>

        <CamsRequestSteps />

        <Button
          variant="raised" color="secondary" fullWidth={true}
          classes={{
            root: 'gen-statement-btn-filled',
            label: 'gen-statement-btn-label-filled'
          }}
          onClick={this.openCAMSWebsite}
        >
          Go to CAMS website
        </Button>
      </Container>
    );
  }
}

export default CamsRequestStepsPage;