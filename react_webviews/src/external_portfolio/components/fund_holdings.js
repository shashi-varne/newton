import React, { Component, Fragment } from 'react';
import Container from '../common/Container';
import FundDetailCard from '../mini-components/FundDetailCard';
import { fetchAllHoldings } from '../common/ApiCalls';
import { storageService } from '../../utils/validators';
import { toast } from 'react-toastify';
class FundHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holdings: [],
      show_loader: false,
    };
  }

  async componentWillMount() {
    try {
      this.setState({
        show_loader: true,
      })
      const pan = storageService().getObject('user_PAN');
      if (!pan) {
        throw 'Please select a PAN';
      }
      const holdings = await fetchAllHoldings({
        pan,
      });
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast(err);
    }
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