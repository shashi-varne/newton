import React, { Component } from 'react';
import Container from '../common/Container';
import FundDetailCard from '../mini-components/FundDetailCard';
import { fetchAllHoldings } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import toast from '../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { setLoader } from '../common/commonFunctions';
class FundHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holdings: [],
      show_loader: false,
    };
    this.setLoader = setLoader.bind(this);
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'fund holdings',
        fund_card_clicked: this.state.fundClicked,
      }
    };
    console.log(JSON.stringify(eventObj));
    if (['just_set_events'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  onFundClicked = () => {
    this.setState({ fundClicked: true });
  }

  async componentDidMount() {
    try {
      this.setLoader(true);
      const selectedPan = storageService().get('user_pan');
      if (!selectedPan) {
        throw 'Please select a PAN';
      }
      const holdings = await fetchAllHoldings({ pan: selectedPan });
      this.setState({
        holdings,
        show_loader: false, // same as this.setLoader(false);
      });
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  render() {
    return (
      <Container
        title="Fund holdings"
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        noFooter={true}
      >
        {this.state.holdings.length ? this.state.holdings.map((holding, idx) => (
          <FundDetailCard
            onFundClicked={this.onFundClicked}
            fundDetails={holding}
            key={idx}
          />
        )) : 'No fund holdings found'}
      </Container>
    );
  }
}

export default FundHoldings;