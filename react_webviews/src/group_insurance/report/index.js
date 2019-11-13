import React, { Component } from 'react';
import Container from '../common/Container';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class Report extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      reportData: []
    };

  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async componentDidMount() {

    try {

      let res = await Api.get('ins_service/api/insurance/get/report')

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var policyData = res.pfwresponse.result.response;

        let reportData = [];
        let group_insurance_policies = policyData.group_insurance.ins_policies;
        // let term_insurance = policyData.term_insurance;

        for (var i = 0; i < group_insurance_policies.length; i++) {
          let policy = group_insurance_policies[i];
          let obj = {
            status: policy.status,
            product_name: policy.product_name,
            cover_amount: policy.sum_assured,
            premium: policy.premium
          }

          reportData.push(obj);
        }
        console.log(policyData)
        console.log(reportData)

        this.setState({
          policyData: policyData,
          reportData: reportData
        })

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }


  }

  renderReportCards(props, index) {
    return (
      <div key={index} className="card">
        <div className="report-color-state">{props.status}</div>
        <div className="report-ins-name">{props.product_name}</div>
        <div className="report-cover">
          <div className="report-cover-amount"><span>Cover amount:</span> {props.cover_amount}</div>
          <div className="report-cover-amount"><span>Premium:</span> {props.premium}/yr</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Container
        noFooter={true}
        title="Insurance report"
        showLoader={this.state.show_loader}
        classOverRideContainer="report"
      >
        <div>
          {this.state.reportData.map(this.renderReportCards)}
        </div>
      </Container>
    );
  }
}

export default Report;