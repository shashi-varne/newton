import React, { Component } from 'react';
import Container from '../common/Container';
import insurance_fisdom from 'assets/ic_fisdom_insurance_fisdom.svg';
import insurance_myway from 'assets/ic_fisdom_insurance_myway.svg';
import health_fisdom from 'assets/ic_health_fisdom.svg';
import health_myway from 'assets/ic_health_myway.svg';
import hospicash_fisdom from 'assets/ic_hospicash_fisdom.svg';
import hospicash_myway from 'assets/ic_hospicash_myway.svg';
import accident_fisdom from 'assets/ic_personal_accident_fisdom.svg';
import accident_myway from 'assets/ic_personal_accident_myway.svg';
import wallet_fisdom from 'assets/ic_wallet_fisdom.svg';
import wallet_myway from 'assets/ic_wallet_myway.svg';
import term_fisdom from 'assets/ic_term_insurance_fisdom.svg';
import term_myway from 'assets/ic_term_insurance_myway.svg';


import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
    }
  }

  async componentDidMount() {
    this.setState({
      insurance: this.state.type !== 'fisdom' ? insurance_myway : insurance_fisdom,
      health: this.state.type !== 'fisdom' ? health_myway : health_fisdom,
      hospicash: this.state.type !== 'fisdom' ? hospicash_myway : hospicash_fisdom,
      accident: this.state.type !== 'fisdom' ? accident_myway : accident_fisdom,
      wallet: this.state.type !== 'fisdom' ? wallet_myway : wallet_fisdom,
      term: this.state.type !== 'fisdom' ? term_myway : term_fisdom
    })

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

        let BHARTIAXA = group_insurance.insurance_apps.BHARTIAXA;

        let BHARTIAXA_APPS  = {
          'PERSONAL_ACCIDENT' : BHARTIAXA['PERSONAL_ACCIDENT'],
          'HOSPICASH' : BHARTIAXA['HOSPICASH'],
          'SMART_WALLET' : BHARTIAXA['SMART_WALLET']
        }

        this.setState({
          group_insurance: group_insurance,
          term_insurance : term_insurance,
          BHARTIAXA_APPS: BHARTIAXA_APPS
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

  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  getLeadId (product_key) {
    let id = ''
    if (product_key !== 'term_insurance') {
      if(this.state.BHARTIAXA_APPS[product_key].length > 0) {
        id = this.state.BHARTIAXA_APPS[product_key][0].lead_id;
      }
    }

    return id;
  }

  handleClick = (product_key) => {

    console.log(product_key)
    var stateMapper = {
      'HEALTH' : '',
      'SMART_WALLET': '',
      'PERSONAL_ACCIDENT': 'accident/plan',
      'HOSPICASH': '',
      'term_insurance': ''
    }

    var group_insurance_lead_id_selected = this.getLeadId(product_key)
    window.localStorage.setItem('group_insurance_lead_id_selected', group_insurance_lead_id_selected || '');
    this.navigate('group-insurance/'+ stateMapper[product_key]);
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
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.health} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Health (Idemnity)</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 23 per month</div>
                </div>
              </div>
              <div onClick={() => this.handleClick('PERSONAL_ACCIDENT')} style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.accident} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Personal accident</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 200 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.hospicash} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Hospicash</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 133 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.wallet} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Smart wallet</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 250 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={this.state.term} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Term insurance</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Get comprehensive life coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Landing;