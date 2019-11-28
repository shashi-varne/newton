import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import safegold_logo from 'assets/safegold_logo@2x.png';
import idbi from 'assets/idbi_trustee2.png';
import brinks from 'assets/brinks-logo.png';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';

class KnowMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Know More'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.sendEvents('next');
    this.navigate('my-gold');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="About Safegold"
        edit={this.props.edit}
        buttonTitle="Proceed"
        handleClick={this.handleClick}
        events={this.sendEvents('just_set_events')}
      >
        <div className="Knowmore">
          <div className="gold-about-text-know-more">
            <img alt="Gold" src={safegold_logo} />
            <div className="about-img-tile-know-more">
              <span className="about-img-span-know-more"> <span className="know-more-buy">SafeGold</span> is a product of Digital Gold India Private Limited, an institutionally owned company that is committed to using technology to improving transparency and efficiency of the gold market.
              </span>
            </div>
          </div>
          <div className="gold-about-text-know-more">
            <img alt="Gold" src={idbi} />
            <div className="about-img-tile-know-more">
              <span className="about-img-span-know-more"><span className="know-more-buy">IDBI</span> Trusteeship Services Limited is India’s Leading Trusteeship Company. The company is jointly promoted by IDBI Bank Ltd., LIC of India, and GIC of India. Leading Independent Trusteeship helps us to place customer interests above anything else, at all times.
              </span>
            </div>
          </div>
          <div className="gold-about-text-know-more">
            <img alt="Gold" src={brinks} />
            <div className="about-img-tile-know-more">
              <span className="about-img-span-know-more"><span className="know-more-buy">BRINK’s</span> Global is the leading provider of gold and cash custodianship. The security BRINK’s offer for their services is unmatched.
              </span>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default KnowMore;
