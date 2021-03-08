import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../common/commonFunctions";
import Api from "utils/api";
import toast from "common/ui/Toast";
import { formatAmountInr } from "../../../utils/validators";

class NpsPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nps_data: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {

    try {
      this.setState({
        show_loader: true,
      });
      const res = await Api.get(`/api/nps/summary`);

      let { result, status_code: status } = res.pfwresponse;

      this.setState({
        show_loader: false,
      });

      if (status === 200) {

        let nps_data = result

        this.setState({
          nps_data: nps_data
        })
      } else {
        toast(result.error || result.message);
      }

    } catch (err) {
      this.setState({
        show_loader: false,
      });
      throw err;
    }
  }

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        noFooter
        title="Pending Orders"
        showLoader={this.state.show_loader}
        // handleClick={replaceFund}
        classOverRideContainer="pr-container"
      >
        <section class="page nps">
          <div class="pending container-padding">
            {this.state.nps_data && this.state.nps_data.pending_orders.map((item, index) =>
              <div class="list" key={index}>
                <div class="fund">
                  <div class="list-item">
                    <div class="text">
                      <div class="tier">TIER {item.tier}</div>
                      <h1>{item.pf_house.name}</h1>
                    </div>
                    <div class="icon">
                      <img src={item.pf_house.image} alt='' />
                    </div>
                  </div>
                  <div class="display-flex">
                    <div>
                      <h3>Total invested value</h3>
                      <span>{formatAmountInr(item.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>)}
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
