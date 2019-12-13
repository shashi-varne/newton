import React, { Component } from 'react';
import Container from '../common/Container';
import qs from 'qs';
import sip_resumed_fisdom from 'assets/sip_resumed_illustration_fisdom.svg';
import sip_resumed_myway from 'assets/sip_resumed_illustration_myway.svg';
import { getConfig } from 'utils/functions';

class MandateSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      sip_resumed: getConfig().productName !== 'fisdom' ? sip_resumed_myway : sip_resumed_fisdom
    }
  }

  componentWillMount() {
    let { params } = this.props.location;
  }


  componentDidMount() {

  }

  handleClick = () => {
    // nativeCallback({ action: 'native_back' });
    let url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate&message=success&code=200&destination=';
    window.location.replace(url);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Authorisation successful"
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="Ok"
      >
        <div>
          <div className="success-img">
            <img alt="Mandate" src={this.state.sip_resumed} width="100%" />
          </div>
          <div className="success-text">
            Congrats! easySIP authorised
          </div>
          <div className="success-text-info">
            e-mandate approval from bank takes 3-4 working days. Once approved, funds will get debited on schedule SIP day
          </div>

          <div className="success-bottom">
            <div className="success-bottom1">
              For any query, reach us at
            </div>
            <div className="success-bottom2">
              <div className="success-bottom2a">
                {getConfig().mobile}
              </div>
              <div className="success-bottom2b">
                |
              </div>
              <div className="success-bottom2a">
                {getConfig().askEmail}
              </div>
            </div>
          </div>
        </div>
      </Container >
    );
  }
}


export default MandateSuccess;
