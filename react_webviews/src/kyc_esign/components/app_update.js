import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import update_insurance_fisdom from 'assets/update_insurance_fisdom.svg';
import update_insurance_myway from 'assets/update_insurance_myway.svg';

class AppUpdateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      update_insurance_icon: getConfig().productName !== 'fisdom' ? update_insurance_myway : update_insurance_fisdom
    }
  }

//   navigate = (pathname) => {
//     this.props.history.push({
//       pathname: pathname,
//       search: getConfig().searchParams
//     });
//   }

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
        data-aid='kyc-esign-update-screen'
      >
        <div style={{textAlign: 'center'}} data-aid='kyc-esign-update-page'>
            <div>
                <img src={this.state.update_insurance_icon} alt="" />
            </div>

            <div style={{fontSize: 24,color: 'black' , fontWeight: 500,
                margin: '20px 0 10px 0'}}>
                <span data-aid='kyc-esign-update-text'>Update your application</span>
            </div>

            <div style={{color: '#6d7278', fontSize: 13}} data-aid='kyc-esign-digilocker-text'>
                Hey! Investing is now much easier with the latest update. Experience quick and seamless KYC process with Digilocker in your new {getConfig().productName} app.
            </div>
        </div>
      </Container>
    );
  }
}

export default AppUpdateInfo;
