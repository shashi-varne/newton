import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
    };
  }
  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        buttonTitle="CONTINUE"
        hideInPageTitle
        hidePageTitle
        title="Confirm Delivery Details"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <section class="page nps">
          <div class="pending container-padding">
            <div class="list" ng-repeat="fund in npsPending">
              <div class="fund">
                <div class="list-item">
                  <div class="text">
                    <div class="tier">TIER {"{ fund.tier }"}</div>
                    <h1>{"{ fund.pf_house.name }"}</h1>
                  </div>
                  <div class="icon">
                    <div
                    //   style={{background-image: url({{fund.pf_house.image}}), backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '50px', width: '50px'}}
                    ></div>
                  </div>
                </div>
                <div class="display-flex">
                  <div>
                    <h3>Total invested value</h3>
                    <span>{"{fund.amount | inrFormat}"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tnc">
              *It might take upto 5 working days for your contribution to
              reflect in your portfolio.
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsPending;
