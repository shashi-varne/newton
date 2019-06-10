import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import loader from 'assets/loader_gif.gif';

class InsuranceHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: ''
    }
  }

  componentWillMount() {
    console.log(this.state.quoteData);
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/all/summary')

      let application;
      if (res.pfwresponse.status_code === 200) {
        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else if (res.pfwresponse.result.insurance_apps.submitted.length > 0) {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        } else if (res.pfwresponse.result.insurance_apps.complete.length > 0) {
          application = res.pfwresponse.result.insurance_apps.complete[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.failed[0];
        }
      } else {
        // exit
      }
    } catch (err) {

      toast('Something went wrong');
    }
  }


  navigate = (pathname, annual_income) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        annual_income: annual_income
      }
    });
  }

  handleClick = async () => {
    // window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    // this.navigate('cover-amount', quoteData.annual_income);
  }

  renderPageLoader = () => {
    if (this.state.show_loader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={loader} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }


  render() {
    return (
      <div>
        {this.renderPageLoader()}
      </div>
    );
  }
}

export default InsuranceHome;
