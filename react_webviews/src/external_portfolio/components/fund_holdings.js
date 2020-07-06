import React, { Component } from 'react';
import Container from '../common/Container';
import FundDetailCard from '../mini-components/FundDetailCard';
import { fetchAllHoldings } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import toast from '../../common/ui/Toast';
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