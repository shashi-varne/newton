import React, { Component } from 'react';
import Container from '../common/Container';
import { insuranceStateMapper } from '../constants';
import insurance_fisdom from 'assets/ic_fisdom_insurance_fisdom.svg';
import insurance_myway from 'assets/ic_fisdom_insurance_myway.svg';
// import health_fisdom from 'assets/ic_health_fisdom.svg';
// import health_myway from 'assets/ic_health_myway.svg';
import hospicash_fisdom from 'assets/ic_hospicash_fisdom.svg';
import hospicash_myway from 'assets/ic_hospicash_myway.svg';
import accident_fisdom from 'assets/ic_personal_accident_fisdom.svg';
import accident_myway from 'assets/ic_personal_accident_myway.svg';
import wallet_fisdom from 'assets/ic_wallet_fisdom.svg';
import wallet_myway from 'assets/ic_wallet_myway.svg';
import term_fisdom from 'assets/ic_term_insurance_fisdom.svg';
import term_myway from 'assets/ic_term_insurance_myway.svg';
// import resume_tag from 'assets/resume_tag.png';

import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { getBhartiaxaStatusToState } from '../constants';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: []
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

    let insurance = this.state.type !== 'fisdom' ? insurance_myway : insurance_fisdom;
    //  let  health_icon  = this.state.type !== 'fisdom' ? health_myway : health_fisdom;
    let hospicash = this.state.type !== 'fisdom' ? hospicash_myway : hospicash_fisdom;
    let accident_icon = this.state.type !== 'fisdom' ? accident_myway : accident_fisdom;
    let wallet_icon = this.state.type !== 'fisdom' ? wallet_myway : wallet_fisdom;
    let term_icon = this.state.type !== 'fisdom' ? term_myway : term_fisdom;

    let insuranceProducts = [
      // {
      //   key: 'PERSONAL_ACCIDENT',
      //   title: 'Personal accident',
      //   subtitle: 'Starts from Rs 200 annually',
      //   icon: health_icon
      // },
      {
        key: 'PERSONAL_ACCIDENT',
        title: 'Personal accident',
        subtitle: 'Starts from Rs 200 annually',
        icon: accident_icon
      },
      {
        key: 'HOSPICASH',
        title: 'Hospicash',
        subtitle: 'Starts from Rs 133 annually',
        icon: hospicash
      },
      {
        key: 'SMART_WALLET',
        title: 'Smart wallet',
        subtitle: 'Starts from Rs 250 annually',
        icon: wallet_icon
      },
      {
        key: 'TERM_INSURANCE',
        title: 'Term insurance',
        subtitle: 'Get comprehensive life coverage',
        icon: term_icon
      }
    ]

    this.setState({
      insuranceProducts: insuranceProducts,
      insurance: insurance
    })
  }

  async componentDidMount() {

    try {
      const res = await Api.get('/ins_service/api/insurance/application/summary')

      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {

        var resultData = res.pfwresponse.result.response;
        console.log(resultData);

        let group_insurance = resultData.group_insurance;
        let term_insurance = resultData.term_insurance;

        let resumeFlagTerm = this.setTermInsData(term_insurance);

        let resumeFlagAll = {
          'TERM_INSURANCE': resumeFlagTerm
        }
        let BHARTIAXA = group_insurance.insurance_apps.BHARTIAXA;

        let BHARTIAXA_APPS = {
          'PERSONAL_ACCIDENT': BHARTIAXA['PERSONAL_ACCIDENT'],
          'HOSPICASH': BHARTIAXA['HOSPICASH'],
          'SMART_WALLET': BHARTIAXA['SMART_WALLET']
        }

        for (var key in BHARTIAXA_APPS) {
          let policy = BHARTIAXA_APPS[key];
          if (policy && policy.length > 0) {
            let data = policy[0];
            if (data.status !== 'complete' && data.lead_payment_status === 'payment_done') {
              resumeFlagAll[data.product_name] = true;
            } else {
              resumeFlagAll[data.product_name] = false;
            }
          }
        }

        let insuranceProducts = this.state.insuranceProducts;
        for (var i =0; i < insuranceProducts.length;i++) {
          let key = insuranceProducts[i].key;
          insuranceProducts[i].resume_flag = resumeFlagAll[key];
        }

        this.setState({
          group_insurance: group_insurance,
          term_insurance: term_insurance,
          BHARTIAXA_APPS: BHARTIAXA_APPS,
          insuranceProducts:insuranceProducts
        })

      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message
          || 'Something went wrong');
      }
    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        fromHome: true
      }
    });
  }

  getLeadId(product_key) {
    let id = ''
    if (product_key !== 'term_insurance') {
      if (this.state.BHARTIAXA_APPS[product_key] &&
        this.state.BHARTIAXA_APPS[product_key].length > 0) {
        id = this.state.BHARTIAXA_APPS[product_key][0].lead_id;
      }
    }

    return id;
  }

  setTermInsData(termData) {

    window.localStorage.setItem('excluded_providers', '');
    window.localStorage.setItem('required_providers', '');
    window.localStorage.setItem('quoteSelected', '');
    window.localStorage.setItem('quoteData', '');
    let pathname = '';
    let resumeFlagTerm = false;

    if (!termData.error) {
      let insurance_apps = termData.insurance_apps;
      let application, required_fields;
      required_fields = termData.required;
      if (insurance_apps.complete.length > 0) {
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        application = insurance_apps.failed[0];
        pathname = 'report';
      } else if (insurance_apps.init.length > 0) {
        application = insurance_apps.init[0];
        resumeFlagTerm = true;
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        resumeFlagTerm = true;
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
        return;
      }

      if (application) {
        let data = {
          application: application,
          required_fields: required_fields
        }
        window.localStorage.setItem('cameFromHome', true);
        window.localStorage.setItem('homeApplication', JSON.stringify(data));
        pathname = 'journey';
      }
    } else {
      pathname = 'intro';
    }

    let fullPath = '/group-insurance/term/' + pathname;

    this.setState({
      redirectTermPath: fullPath
    })

    return resumeFlagTerm;

  }

  handleClick = (product_key) => {

    var BHARTIAXA_PRODUCTS = ['PERSONAL_ACCIDENT', 'HOSPICASH', 'SMART_WALLET', 'HEALTH'];

    var lead_id = '';
    var path = '';
    var fullPath = '';
    if (BHARTIAXA_PRODUCTS.indexOf(product_key) !== -1) {
      if (this.state.BHARTIAXA_APPS[product_key] &&
        this.state.BHARTIAXA_APPS[product_key].length > 0) {
        let data = this.state.BHARTIAXA_APPS[product_key][0];
        lead_id = data.lead_id;

        path = getBhartiaxaStatusToState(data);
        if (data.status === 'complete') {
          lead_id = '';
        }

      } else {
        path = 'plan';
      }

      console.log("path :" + path)

      fullPath = insuranceStateMapper[product_key] + '/' + path;
    } else {
      this.navigate(this.state.redirectTermPath);

      return;
    }


    window.localStorage.setItem('group_insurance_lead_id_selected', lead_id || '');
    this.navigate('group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {
    return (
      <div key={index} onClick={() => this.handleClick(props.key)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#dfd8ef', borderBottomStyle: this.state.insuranceProducts.length -1 !== index ?  'solid': '', paddingTop: '15px',
        paddingBottom: '15px', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex' }}>
          <img src={props.icon} alt="" style={{ marginRight: '15px' }} />
          <div>
            <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>{props.title}</div>
            <div style={{ color: '#7e7e7e', fontSize: '13px' }}>{props.subtitle}</div>
          </div>
        </div>
        {props.resume_flag && 
        <div style={{ background: '#ff6868', color: '#fff', fontSize: 8, letterSpacing: 0.1,
         textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3 }}>RESUME</div>
        }
      </div>
    )
  }

  render() {


    return (
      <Container
        noFooter={true}
        showLoader={this.state.show_loader}
        title="Insurance">
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '16px', lineHeight: '24px', color: '#160d2e', margin: 0, fontWeight: '500' }}>Insurance is a priority, <br></br> not an option.</h1>
            <img src={this.state.insurance} alt="" />
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '24px', color: '#4a4a4a' }}>Get insured with ease</div>
          <div style={{ marginTop: '20px', color: '#4a4a4a', fontSize: '10px', lineHeight: '24px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>Instant | No medical | Zero paperwork</div>
          <div className='products' style={{ marginTop: '50px' }}>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' }}>Get started</h1>
            <div>
              {/* <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.health} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Health (Idemnity)</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 23 per month</div>
                </div>
              </div> */}

              {/* <div onClick={() => this.handleClick('TERM_INSURANCE')} style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.term} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Term insurance</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Get comprehensive life coverage</div>
                </div>
              </div> */}
              {this.state.insuranceProducts.map(this.renderPorducts)}

            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Landing;