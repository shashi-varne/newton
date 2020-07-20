import React, { Component } from 'react';
import Container from '../common/Container';
import FundDetailCard from '../mini-components/FundDetailCard';
import { fetchAllHoldings, hitNextPage } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import toast from '../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { setLoader } from '../common/commonFunctions';
class FundHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holdings: [],
      next_page_url: '',
      show_loader: false,
      loading_more: false,
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
        // eslint-disable-next-line
        throw 'Please select a PAN';
      }
      const { response, next_page_url } = await fetchAllHoldings({ pan: selectedPan });
      this.setState({
        holdings: response.holdings || [],
        next_page_url,
        show_loader: false, // same as this.setLoader(false);
      });
    } catch (err) {
      this.setLoader(false);
      console.log(err);
      toast(err);
    }
  }

  loadMore = async() => {
    if (this.state.loading_more) return;
    
    this.setState({ loading_more: true });
    try {
      const { response, next_page_url } = await hitNextPage(this.state.next_page_url);
      const existingHoldings = JSON.parse(JSON.stringify(this.state.holdings));

      this.setState({
        holdings: existingHoldings.concat(response.holdings),
        next_page_url,
      });
    } catch(err) {
      console.log(err);
      toast(err);
    }
    this.setState({ loading_more: false });
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
        {!!this.state.next_page_url && !this.state.loading_more &&
          <div className="show-more" onClick={() => this.loadMore()}>
            SHOW MORE
          </div>
        }
        {this.state.loading_more &&
          <div className="loader">Loading...</div>
        }
      </Container>
    );
  }
}

export default FundHoldings;