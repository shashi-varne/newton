import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsSchedule extends Component {
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
        // handleClick={replaceFund} /api/nps/summary
        classOverRideContainer="pr-container"
      >
        <section class="page nps">
          <div class="sip-schedule container-padding">
            <div ng-repeat="item in sipIntents" class="list">
              <div class="list-item">
                <div class="calender_parent">
                  <div class="calender_card">
                    <img src="../assets/img/calender_white.png" width="30" />
                    <span class="calender_date">
                      {"{{ item.day }}<sup>{{ nthVal(item.day) }}</sup>"}
                    </span>
                    <div>of every Month</div>
                  </div>
                  <div class="calender_right">
                    <h4>{"{ item.recommendation.pension_house.name }"}</h4>
                    <div class="amount">{"{item.amount | inrFormat}"}</div>
                  </div>
                </div>
              </div>
              <div class="sipstatus">
                Status
                <div class="purple">{"{ item.status }"}</div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsSchedule;
