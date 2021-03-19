import React, { Component } from 'react';
import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import { getUrlParams } from 'utils/validators';
import ContactUs from '../../common/components/contact_us';

class DigiStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      params: getUrlParams()
    }
  }

  handleClick = () => {
    // nativeCallback({ action: 'exit_web' });
    this.props.history.push({
      pathname: '/invest',
      search:  getConfig().searchParams
    })
  }

  render() {
    const { show_loader, productName } = this.state;
    const { status = "failed" } = this.state.params;
    const headerData = {
      icon: "close",
      goBack: this.handleClick
    }

    return (
      <Container
        showLoader={show_loader}
        title={status === "success" ? 'eSign KYC completed' : 'eSign KYC failed'}
        handleClick={this.handleClick}
        buttonTitle='OKAY'
        headerData={headerData}
      >
        <div className="nsdl-status">
          <img
            src={require(`assets/${productName}/ils_esign_${status}.svg`)}
            style={{ width: "100%" }}
            alt="Nsdl Status"
          />
          {status === "success" ?
            <div className="nsdl-status-text">
              You have successfully signed your KYC documents.
            </div>
            :
            <div className="nsdl-status-text">
              Sorry! the eSign verification is failed. Please try again.
            </div>
          }
        </div>
        <ContactUs />
      </Container>
    );
  }
}

export default DigiStatus;
