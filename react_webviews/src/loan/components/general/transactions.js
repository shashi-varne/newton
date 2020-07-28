import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import Contact from "common/components/contact_us";
import { formatAmount, formatAmountInr } from "utils/validators";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions
  };

  render() {
    return (
      <Container
        show_loader={this.state.show_loader}
        title="Transaction"
        noHeader={this.state.show_loader}
        noFooter={true}
        styleContainer={{
            background: '#f6f6f6'
        }}
      >
        <div className="loan-transactions">
          <div className="block">
            <div>
              <div className="block-head">Loan amount</div>
              <div className="block-amount">{'₹ '+formatAmount(300000)}</div>
            </div>
            <div>
              <div className="block-head">Principle paid</div>
              <div className="block-amount">{'₹ '+formatAmount(92345)}</div>
            </div>
            <div>
              <div className="block-head">Closing principle</div>
              <div className="block-amount" style={{color:'#35cb5d'}}><b>{'₹ '+formatAmount(288000)}</b></div>
            </div>
          </div>

          
          <Contact />
        </div>
      </Container>
    );
  }
}

export default Transactions;
