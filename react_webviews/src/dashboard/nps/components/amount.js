import React, { Component } from "react";
import Container from "fund_details/common/Container";
import Input from "../../../common/ui/Input";

class EnterAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    };
  }

  handleChange = event => {
    let value = event.target.value;

    this.setState({
        amount: value,
        amount_error: value < parseInt(500) ? 'Minimum amount is ₹500' : ''
    })
  }

  render() {
    return (
      <Container
        classOverRIde="pr-error-container"
        buttonTitle="SHOW FUNDS"
        title="Enter Amount"
        classOverRideContainer="pr-container"
        handleClick={() => this.handleClick()}
      >
        <div className="enter-amount">
          <section className="page nps">
            <div className="container-padding">
              <div className="nps-card">
                <div className="inner-container">
                  <div className="title">Enter amount to invest in NPS</div>
                  <Input
                    error={!!this.state.amount_error}
                    helperText={this.state.amount_error}
                    type="number"
                    width="40"
                    // label="Personal email id"
                    id="amount"
                    name="amount"
                    value={this.state.amount || ""}
                    onChange={this.handleChange}
                  />
                </div>
                <p class="help-text">Save tax upto: <span>{"'{ taxSaved | inrFormat }'} {'{(stateParams.type == 'sip') ? 'yearly' : ''}'"}</span></p>

                <div className="tags">
                  <div className="tag-container">
                    <div className="tag">
                        ₹ 5000
                    </div>
                    <div className="tag">
                        ₹ 5000
                    </div>
                    <div className="tag">
                        ₹ 5000
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-footer"></div>
          </section>
        </div>
      </Container>
    );
  }
}

export default EnterAmount;
