import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import update_insurance_fisdom from 'assets/update_insurance_fisdom.svg';
import update_insurance_myway from 'assets/update_insurance_myway.svg';

class FinityAppUpdateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      update_insurance_icon: getConfig().productName !== 'fisdom' ? update_insurance_myway : update_insurance_fisdom
    }
  }

  handleClick = async () => {
    let url = getConfig().appLink;
    this.openInBrowser(url);
  }

  openInBrowser(url) {

    nativeCallback({
      action: 'open_browser',
      message: {
        url: url
      }
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Update"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="UPDATE NOW"
        data-aid='kyc-esign-finity-app-update-screen'
      >
        <div style={{textAlign: 'center'}} data-aid='finity-app-update-info-page'>
            <div>
                <img src={this.state.update_insurance_icon} alt="" />
            </div>

            <div style={{fontSize: 24,color: 'black' , fontWeight: 500,
                margin: '20px 0 10px 0'}}>
                <span data-aid='version-text'>New version available</span>
            </div>

            <div style={{color: '#6d7278', fontSize: 13}} data-aid='bottom-text'>
            We have changed our brand name from 'Mywaywealth' to 'Finity'. Please update to get latest features and the best experience.
            </div>
        </div>
      </Container>
    );
  }
}

export default FinityAppUpdateInfo;
