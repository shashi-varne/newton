import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsPerformance extends Component {
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
            <div class="list">
              <div class="fund" ng-repeat="fund in npsPerformance">
                <div class="list-item">
                  <div class="text">
                    <div class="tier">TIER {"{ fund.account_type }"}</div>
                    <h1>{"{ fund.name }"}</h1>
                  </div>
                  <div class="icon">
                    {/* <div style="background-image: url({{fund.image}});background-size: contain;background-repeat: no-repeat;background-position: center;height: 50px;width: 50px;"></div> */}
                  </div>
                </div>
                <div class="display-flex">
                  <div>
                    <h3>Total invested value</h3>
                    <span>{"{fund.total_invested_amount | inrFormat}"}</span>
                  </div>
                  <div>
                    <h3>Current value</h3>
                    <span>{"{fund.total_current_amount | inrFormat"}</span>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="npsscheme" ng-repeat="item in fund.schemes">
                  <div class="text">
                    <div
                      class="category"
                      ng-class="{'equity': item.category == 'E', 'corporate': item.category == 'C', 'gov': item.category == 'G'}"
                    >
                      {"{ getFullName(item.category) }"}
                    </div>
                  </div>
                  <div class="display-flex">
                    <div>
                      <h3>Invested : {"{item.scheme_amount | inrFormat}"}</h3>
                    </div>
                    <div>
                      <h3>Current : {"{item.closing_balance | inrFormat}"}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tnc">
              *Total invested value that you have invested for your PRAN:{" "}
              {"{npsData.pran}"} through any source.
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsPerformance;
