import React, { Component } from "react";
import Container from "fund_details/common/Container";

class NpsSipDate extends Component {
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
        buttonTitle="CONFIRM DATES"
        hideInPageTitle
        hidePageTitle
        title="Confirm Delivery Details"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund} /api/nps/summary
        classOverRideContainer="pr-container"
      >
        <section class="page nps">
          <div class="container-padding">
            <div class="nps-sip">
              <p class="helper">
                Select a monthly <span class="bold">installment date</span> for
                auto debit towards SIP
              </p>
              <div class="list">
                <md-input-container class="md-block">
                  <md-radio-group name="dates" ng-model="sipDateSelected">
                    <md-radio-button
                      class="md-primary"
                      value="{{date}}"
                      ng-repeat="date in sipDates track by $index"
                    >
                      <span class="bold">{"{ date }}{{ nthVal(date) }"}</span>{" "}
                      of every month
                    </md-radio-button>
                  </md-radio-group>
                </md-input-container>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <md-button
              ng-disabled="isApiRunning"
              ng-class="{'button-loading' : isApiRunning}"
              ng-click="updateNewDates($event)"
              class="cta-button md-raised md-primary"
            >
              Confirm Dates
            </md-button>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsSipDate;
