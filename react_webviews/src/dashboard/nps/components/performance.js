import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../common/commonFunctions";
import { storageService } from "utils/validators";
import { formatAmountInr } from "utils/validators";

class NpsPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nps_performance: '',
      pran: ''
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = async () => {
    const nps_performance = storageService().getObject('nps_performance');
    const pran = storageService().get('pran');

    this.setState({
      nps_performance: nps_performance,
      pran
    });
  }

  getFullName = (type) => {
    if (type === 'E') {
      return 'Equity';
    } else if (type === 'C') {
      return 'Corporate bonds';
    } else if (type === 'G') {
      return 'Government securities';
    } 
    return '';
  };

  render() {
    return (
      <Container
        data-aid='nps-track-performance-screen'
        title="Track NPS Performance"
        showLoader={this.state.show_loader}
        noFooter
      >
        <section className="page nps">
          <div className="pending container-padding">
            <div className="list" data-aid='nps-track-performance'>
              {this.state.nps_performance && this.state.nps_performance.map((item, index) =>
              (<div className="fund" data-aid='nps-fund'>
                <div className="list-item" data-aid='nps-list-item'>
                  <div className="text">
                    <div className="tier">TIER {item.account_type}</div>
                    <h1>{item.name}</h1>
                  </div>
                  <div className="icon">
                    <img src={item.image} alt='' />
                  </div>
                </div>
                <div className="display-flex" data-aid='nps-total-invested-amount'>
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
                {item.schemes.map((el, index) => <div className="nps-npsscheme" key={index} data-aid='nps-npsscheme'>
                  <div className="text" data-aid='nps-text'>
                    <div
                      className={`category ${el.category === 'E' ? 'equity' : el.category === 'C' ? 'corporate' : 'gov'}`}
                    >
                      {this.getFullName(el.category)}
                    </div>
                  </div>
                  <div className="display-flex" data-aid='nps-closing-balance'>
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
            <div className="tnc" data-aid='nps-tnc'>
              *Total invested value that you have invested for your PRAN:{" "}
              {this.state.pran} through any source.
            </div>
          </div>
        </section>
      </Container>
    );
  }
}

export default NpsPerformance;
