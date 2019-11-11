import React, { Component } from 'react';
import Container from '../common/Container';
import insurance from 'assets/ic_fisdom_insurance.svg';
import health from 'assets/ic_health.svg';
import hospicash from 'assets/ic_hospicash.svg';
import accident from 'assets/ic_personal_accident.svg';
import wallet from 'assets/ic_wallet.svg';
import term from 'assets/ic_term_insurance.svg';


import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { getConfig } from 'utils/functions';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/ins_service/api/insurance/application/summary')
      
      this.setState({
        show_loader: false
      })
      if (res.pfwresponse.status_code === 200) {
        
        var resultData = res.pfwresponse.result;
        console.log(resultData);
       
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

  handleClick = (product_key) => {

    console.log(product_key)
    var stateMapper = {
      'health' : '',
      'smart_wallet': '',
      'accident': 'accident/plan',
      'hospicash': '',
      'term_insurance': ''
    }

    var group_insurance_lead_id_selected = '5761475289284608';
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
            <img src={insurance} alt="" />
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '24px', color: '#4a4a4a' }}>Get insured with ease</div>
          <div style={{ marginTop: '20px', color: '#4a4a4a', fontSize: '10px', lineHeight: '24px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>Instant | No medical | Zero paperwork</div>
          <div className='products' style={{ marginTop: '50px' }}>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' }}>Get started</h1>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={health} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Health (Idemnity)</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 23 per month</div>
                </div>
              </div>
              <div onClick={() => this.handleClick('accident')} style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={accident} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Personal accident</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 200 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={hospicash} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Hospicash</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 133 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', borderBottomWidth: '1px', borderBottomColor: '#dfd8ef', borderBottomStyle: 'solid', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={wallet} alt="" style={{ marginRight: '15px' }} />
                <div>
                  <div style={{ color: '#160d2e', fontSize: '16px', marginBottom: '5px' }}>Smart wallet</div>
                  <div style={{ color: '#7e7e7e', fontSize: '13px' }}>Starts from Rs 250 annually</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
                <img src={term} alt="" style={{ marginRight: '15px' }} />
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