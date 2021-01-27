import React, { Component } from "react";
import Container from "fund_details/common/Container";
import Input from '../../../common/ui/Input';

class EnterAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {},
      pan: "",
      dob: "",
      mobile_no: "",
      is_nps_contributed: "",
    };
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
                </div>


                <div className="tags">
                  <div className="tag-container">
                    <div
                      className="tag"
                    ></div>
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
