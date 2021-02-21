import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";
import Contact from "common/components/contact_us";
import { formatAmount, formatAmountInr } from "utils/validators";
import SVG from 'react-inlinesvg';
import back_arrow from 'assets/back_arrow.svg';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      get_lead: true,
      getLeadBodyKeys: ['vendor_info']
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
        classOverRide={'loanMainContainer'}
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

          <div className="container">
            <div className="content" style={{background:'#e7e6e6'}}>
              <div className="head" style={{color:'#cb3535'}}>
                <span className="dot" style={{background:'#cb3535'}}></span>
                PENDING ON 04 OCT 2019
              </div>
              <div className="items">
                <div>Principal:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Interest:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Additional charges</div>
                <div>{formatAmountInr()}</div>
              </div>
              <hr />
              <div className="credit">
                <div>EMI amount:</div>
                <div>{formatAmountInr()}</div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="content" style={{background:'var(--highlight)'}}>
            <div className="circle"></div>
              <div className="head" style={{color:'#35cb5d'}}>
                <span className="dot" style={{background:'#35cb5d'}}></span>
                PAID ON 04 NOV 2019
              </div>
              <div className="items">
                <div>Principal:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Interest:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Additional charges</div>
                <div>{formatAmountInr()}</div>
              </div>
              <hr style={{ color: "green" }} />
              <div className="credit">
                <div>EMI amount:</div>
                <div>{formatAmountInr()}</div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="content" style={{background:'#ffffff'}}>
              <div className="head" style={{color:'#cbad35'}}>
                <span className="dot" style={{background:'#cbad35'}}></span>
                DUE ON 04 DEC 2019
              </div>
              <div className="items">
                <div>Principal:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Interest:</div>
                <div>{formatAmountInr()}</div>
              </div>
              <div className="items">
                <div>Additional charges</div>
                <div>{formatAmountInr()}</div>
              </div>
              <hr style={{ background: "#ccd3db" }} />
              <div className="credit">
                <div>EMI amount:</div>
                <div>{formatAmountInr()}</div>
              </div>
            </div>
          </div>

          <div className="view-more"><b>VIEW MORE</b>
            <SVG
            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#35cb5d')}
            className="arrow"
            src={back_arrow}
          />
          </div>
          <Contact />
        </div>
      </Container>
    );
  }
}

export default Transactions;
