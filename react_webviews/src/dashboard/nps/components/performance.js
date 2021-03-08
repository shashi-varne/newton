import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { initialize } from "../common/commonFunctions";
import Api from "utils/api";
import toast from "common/ui/Toast";
import { formatAmountInr } from "../../../utils/validators";

class NpsPerformance extends Component {
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

  getFullName = (type) => {
    if (type == 'E') {
      return 'Equity';
    } else if (type == 'C') {
      return 'Corporate bonds';
    } else if (type == 'G') {
      return 'Government securities'
    } else {
      return '';
    }
  };

  render() {
    return (
      <Container
        classOverRide="pr-error-container"
        fullWidthButton
        hideInPageTitle
        hidePageTitle
        title="Track NPS Performance"
        showLoader={this.state.show_loader}
        noFooter
        classOverRideContainer="pr-container"
      >
        <section className="page nps">
          <div className="pending container-padding">
            <div className="list">
              {this.state.nps_data && this.state.nps_data.portfolio_data.map((item, index) =>
              (<div className="fund">
                <div className="list-item">
                  <div className="text">
                    <div className="tier">TIER {item.account_type}</div>
                    <h1>{item.name}</h1>
                  </div>
                  <div className="icon">
                    <img src={item.image} alt='' />
                  </div>
                </div>
                <div className="display-flex">
                  <div>
                    <h3>Total invested value</h3>
                    <span>{formatAmountInr(item.total_invested_amount)}</span>
                  </div>
                  <div>
                    <h3>Current value</h3>
                    <span>{formatAmountInr(item.total_current_amount)}</span>
                  </div>
                </div>
                <div className="divider"></div>
                {item.schemes.map((el, index) => <div className="npsscheme" key={index}>
                  <div className="text">
                    <div
                      className={`category ${el.category === 'E' ? 'equity' : el.category === 'C' ? 'corporate' : 'gov'}`}
                    >
                      {this.getFullName(el.category)}
                    </div>
                  </div>
                  <div className="display-flex">
                    <div>
                      <h3>Invested : {"{item.scheme_amount | inrFormat}"}</h3>
                    </div>
                    <div>
                      <h3>Current : {"{item.closing_balance | inrFormat}"}</h3>
                    </div>
                  </div>
                </div>)}
              </div>))}
            </div>
            <div className="tnc">
              *Total invested value that you have invested for your PRAN:{" "}
              {this.state.nps_data.pran} through any source.
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsPerformance;
