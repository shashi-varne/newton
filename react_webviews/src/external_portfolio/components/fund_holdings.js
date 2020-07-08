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
      }
    };

    if (['just_set_events'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  async componentWillMount() {
    try {
      this.setLoader(true);
      const selectedPan = storageService().getObject('user_pan');
      if (!selectedPan || !selectedPan.pan) {
        throw 'Please select a PAN';
      }
      const holdings = await fetchAllHoldings({ pan: selectedPan.pan });
      this.setState({ holdings });
    } catch (err) {
      toast(err);
    }
    this.setLoader(false);
  }

  render() {
    return (
      <Container
        title="Fund Holdings"
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        noFooter={true}
      >
        {this.state.holdings.length ? this.state.holdings.map(holding => (
          <FundDetailCard
            fundDetails={holding}
            key={holding.isin}
          />
        )) : 'No fund holdings found'}
      </Container>
    );
  }
}

export default FundHoldings;