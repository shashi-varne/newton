import React, { Component } from 'react';
import qs from 'qs';

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
      params: qs.parse(props.history.location.search.slice(1)),
      update_insurance_icon: getConfig().productName !== 'fisdom' ? update_insurance_myway :
      update_insurance_fisdom
    }

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }


  handleClick = async () => {
    let url = getConfig().appLink;
    this.openInBrowser(url);
  }

  openInBrowser(url) {

    nativeCallback({
      action: 'open_in_browser',
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
        fullWidthButton={true}
        onlyButton={true}
      >
      <div style={{textAlign: 'center'}}>
       <div>
           <img src={this.state.update_insurance_icon} alt="" />
       </div>

       <div style={{fontSize: 24,color: 'black' , fontWeight: 500,
      margin: '20px 0 10px 0'}}>
       <span>Update your application</span>
       
       </div>

       <div style={{color: '#6d7278', fontSize: 13}}>
       We have addded new insurance products and fixed bugs to make your experience as smooth as possible.
       </div>
      </div>
      </Container>

    );
  }
}

export default AppUpdateInfo;
