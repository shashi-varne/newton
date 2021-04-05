import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../common/commonFunctions";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";

class NpsPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nps_pending_orders: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {

    let nps_pending_orders = storageService().getObject('nps_pending_orders');

    this.setState({
      nps_pending_orders: nps_pending_orders
    })
  }

  render() {
    return (
      <Container
        noFooter
        title="Pending Orders"
        showLoader={this.state.show_loader}
      >
        <section className="page nps">
          <div className="pending container-padding">
            {this.state.nps_pending_orders && this.state.nps_pending_orders.map((item, index) =>
              <div className="list" key={index}>
                <div className="fund">
                  <div className="list-item">
                    <div className="text">
                      <div className="tier">TIER {item.tier}</div>
                      <h1>{item.pf_house.name}</h1>
                    </div>
                    <div className="icon">
                      <img src={item.pf_house.image} alt='' />
                    </div>
                  </div>
                  <div className="display-flex">
                    <div>
                      <h3>Total invested value</h3>
                      <span>{formatAmountInr(item.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>)}
            <div className="tnc">
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
