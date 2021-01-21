import React, { Component } from 'react';
import Container from '../common/Container';
import ContactUs from '../../common/components/contact_us'
import qs from 'qs'; 

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import '../common/Style.scss'

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)) 
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {
    window.sessionStorage.setItem('group_insurance_payment_started', '');
    window.sessionStorage.setItem('group_insurance_payment_urlsafe', '');
    window.sessionStorage.setItem('group_insurance_plan_final_data', '');
    nativeCallback({ action: 'take_control_reset' });
    window.sessionStorage.setItem('group_insurance_payment_url', '');
    
    let insuranceProducts = [
      {
        key: 'LIFE_INSURANCE',
        title: 'Life Insurance',
        subtitle: 'Must have plans for your family',
        icon: 'icn_life insurance'
      },
      {
        key: 'HEALTH_INSURANCE',
        title: 'Health Insurance',
        subtitle: 'Explore best plans for your health',
        icon: 'icn_health_insurance'
      },{
        key: 'Other_Insurance',
        title: 'Other Insurance',
        subtitle: 'Insurance plans for specific needs',
        icon: 'icn_other_insurance'
      }
    ];

    let { params } = this.props.location || {}
    let openModuleData = params ? params.openModuleData : {}

    let redirect_url = decodeURIComponent(getConfig().redirect_url);
    if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
      window.location.href = redirect_url;
    }
    this.setState({
      insuranceProducts: insuranceProducts,
      openModuleData : openModuleData
    })
  }


  navigate = (pathname, search) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      // params: {
      //   fromHome: true
      // }
    });
  }


  policymove = ()=> {
    this.sendEvents('next', "" , true)
    this.navigate('/group-insurance/group-insurance/add-policy');
  }

  handleClick = (product_key , events) => {

    this.sendEvents('next',  events ? events : product_key)
    var fullPath = '';

      if (product_key === 'LIFE_INSURANCE') {
        fullPath = 'life-insurance/entry';
      } else if (product_key === 'Other_Insurance') {
        fullPath = 'other-insurance/entry';
      } else if (product_key === 'HEALTH_INSURANCE') {
        fullPath = 'health/landing';
      }
      else {
         this.navigate('/group-insurance/term/intro');
        return;
      }

    this.navigate('group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {
    return (
      <div key={index} onClick={() => this.handleClick(props.key , props.title)} style={{
        display: 'flex', alignItems: 'center', width : '100%', justifyContent: 'space-between', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex' , width : '100%' }}>
          <img src={ require(`assets/${props.icon}_${this.state.type}.svg`)  } alt="" style={{ marginRight: '26px' }} />
          <div style={{  borderBottomWidth: '1px',  width : '100%',
                          borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '25px' ,   paddingBottom: '25px'}} >
            <div style={{ color: '#160d2e', fontSize: '15px', fontWeight: "500" , lineHeight : '20px' , margin : '5px 0 5px 0'}}>{props.title}
            </div>
            <div style={{ color: '#767E86', fontSize: '13px', fontWeight: '400', lineHeight: '15.41px' }}>{props.subtitle}</div>
          </div>
        </div>
      </div>
    )
  }

  sendEvents(user_action, insurance_type, banner_clicked, callback_clicked) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance',
        "insurance_type": insurance_type ? insurance_type : '',
        'banner_clicked' : banner_clicked ? true : false,
        'callback_clicked' : callback_clicked ?  true : false
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  callBackScreen = () =>{
    this.sendEvents('next', "", "", true);
    this.navigate('/group-insurance/call-back-details');
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        showLoader={this.state.show_loader}
        title="Insurance">
           <div  style={{ marginTop: '30px' }}>
           <div onClick={this.policymove}>
           <img style={{ margin: '-15px 5px 30px 0', width: '100%' }} src={ require(`../../assets/${this.state.type}/icn_crousal_card_1.svg`)} alt="" />
           </div>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '17px' , marginTop:'10px', marginBottom:'4px' , lineHeight : '20.15px'}}>What are you looking for?</h1>
            <div> {this.state.insuranceProducts.map(this.renderPorducts)}</div>
            <div style={{ margin: "18px 0 26px 0", fontWeight : '700', fontSize : '17px', lineHeight:'20.15px', color: '#160d2e' }}> Get Insured with ease </div>
          <div className="his">
            <div className="horizontal-images-scroll">
              <img className="image"  src={require(`assets/${this.state.type}/icn_free.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_assistance.svg`)} alt="" />
              <img className="image" src={require(`assets/${this.state.type}/icn_zero_paper.svg`)} alt="" />
            </div>
          </div>

          <div className="callback-button-container">
            <img className="image" style={{cursor: 'pointer'}} src={require(`assets/${this.state.type}/landing_call_back_button.svg`)} onClick={() => this.callBackScreen()} alt=""/>
          </div>

          <div style={{ margin: "40px 0 20px 0", fontWeight : '700', fontSize : '17px', lineHeight:'20.15px' , color: '#160d2e' }}> What our customers say </div>
          <div className="his"> <div className="horizontal-images-scroll">
              <img className="image" src={require(`assets/${this.state.type}/icn_review_1.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_review_2.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_review_3.svg`)} alt=""/>
            </div>
          </div>

          <div  className="generic-subtitle-heading">Insurance with fisdom is 100% safe</div>
                    <div style={{display : 'flex' , justifyContent : 'center', height : '20px'}}>
                     <div><img className="image" src={require(`assets/irdanewlogo1.svg`)} alt="" style={{marginRight : '2px'}}/>  </div>
                     <span className='generic-subtitle-heading-IRDAI'>
                       <div>IRDAI REGISTERED </div>  
                       <div className='generic-subtitle-heading-IRDAI-number'>CA0505</div>
                       </span>
                    </div>
         <ContactUs/>
        </div>
      </Container>
    );
  }
}                     

export default Landing;