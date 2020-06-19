import React, { Component, Fragment } from 'react';
import Container from '../common/Container';
import FundDetailCard from '../mini-components/FundDetailCard';
class FundHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fund: {
        fundName: 'HDFC Multicap Builder Capital growth fund',
        fundType: 'equity',
        investmentDate: '01 Jan 2013',
        currentValue: '1,20,83,345',
        annualReturn: '10.3',
        investedAmt: '98,32,345',
      }
    };
  }

  render() {
    return (
      <Container
        title="Fund Holdings"
        noFooter={true}
      >
        <FundDetailCard
          fundDetails={this.state.fund}
        />
      </Container>
    );
  }
}

export default FundHoldings;