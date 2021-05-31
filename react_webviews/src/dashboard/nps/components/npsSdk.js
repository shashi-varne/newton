import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../common/commonFunctions";
import { storageService } from "utils/validators";

class NpsSdk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let currentUser = storageService().getObject("user");
    let npsData = storageService().getObject("nps_data");

    if (currentUser.nps_investment || npsData.investment_status) {
      if (npsData.registration_details.additional_details_status) {
        storageService.setObject('nps_additional_details_required', false);
        if (currentUser.kyc_registration_v2 === 'init' || currentUser.kyc_registration_v2 === 'incomplete') {
          this.navigate('/kyc/journey');
        } else {
          this.navigate('/nps/investments');
        }
      } else {
        storageService.setObject('nps_additional_details_required', true);
        if (currentUser.kyc_registration_v2 === 'init' || currentUser.kyc_registration_v2 === 'incomplete') {
          this.navigate('/kyc/journey');
        } else {
          this.navigate('/nps/identity');
        }
      }
    } else {
      this.navigate('/nps/info');
    }
  }

  render() {
    return (
      <Container
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        showLoader={this.state.show_loader}
        noFooter
      >
        <div></div>
      </Container>
    );
  }
}

export default NpsSdk;