import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';


class InsuranceHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      productName: getConfig().productName
    }
  }

  async componentDidMount() {
    window.sessionStorage.setItem('excluded_providers', '');
    window.sessionStorage.setItem('required_providers', '');
    window.sessionStorage.setItem('quoteSelected', '');
    window.sessionStorage.setItem('quoteData', '');
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
          window.sessionStorage.setItem('homeApplication', JSON.stringify(data));
          let search = application.profile_link.split('?')[1];
          let searchParamsMustAppend = getConfig().searchParamsMustAppend.split('?')[1];
          search +=  '&' + searchParamsMustAppend;
          this.navigate(pathname, search);
        }
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
    window.sessionStorage.setItem('cameFromHome', true);
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  handleClick = async () => {
    // window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
    // this.navigate('cover-amount', quoteData.annual_income);
  }

  renderPageLoader = () => {
    if (this.state.show_loader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={require(`assets/loader_gif_${this.state.productName}.gif`)} alt="" />
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
