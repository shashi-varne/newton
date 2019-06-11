import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import loader from 'assets/loader_gif.gif';
import { nativeCallback } from 'utils/native_callback';

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

      let application, required_fields, pathname;
      if (res.pfwresponse.status_code === 200) {
        required_fields = res.pfwresponse.result.required;
        if (res.pfwresponse.result.insurance_apps.complete.length > 0) {
          application = res.pfwresponse.result.insurance_apps.complete[0];
          pathname = 'report';
        } else if (res.pfwresponse.result.insurance_apps.failed.length > 0) {
          application = res.pfwresponse.result.insurance_apps.failed[0];
          pathname = 'report';
        } else if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
          pathname = 'journey';
        } else if (res.pfwresponse.result.insurance_apps.submitted.length > 0) {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
          pathname = 'journey';
        } else {
          // intro
          this.navigate('intro');
          return;
        }

        if (application) {
          let data = {
            application: application,
            required_fields: required_fields
          }
          window.localStorage.setItem('homeApplication', JSON.stringify(data));
          let search = application.profile_link.split('?')[1];
          search += '&insurance_v2=true&generic_callback=true';

          // remove this
          search += '&insurance_allweb=true';


          this.navigate(pathname, search);
        }
        console.log(application);
      } else {
        // exit
        this.navigate('intro');
      }
    } catch (err) {
      console.log(err)
      // exit callback to native
      nativeCallback({ action: 'native_back' });
      toast('Something went wrong');
    }
  }


  navigate = (pathname, search) => {
    window.localStorage.setItem('cameFromHome', true);
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
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
