import React, { Component } from 'react';
import Container from '../common/Container';
import ContactUs from '../../common/components/contact_us'

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import '../common/Style.scss'

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName,
      insuranceProducts: [],
    }

    this.renderPorducts = this.renderPorducts.bind(this);
  }

  componentWillMount() {

    nativeCallback({ action: 'take_control_reset' });
    
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
    this.setState({
      insuranceProducts: insuranceProducts,
    })
  }


  componentDidMount() {
    this.setState({
      show_loader: false
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
    this.sendEvents('next', "")
    this.navigate('/group-insurance/group-insurance/add-policy');
  }

  handleClick = (product_key, events) => {
    this.sendEvents('next', events)

    var fullPath = '';
    if (product_key === 'LIFE_INSURANCE') {
      fullPath = 'life-insurance/entry';
    } else if (product_key === 'Other_Insurance') {
      fullPath = 'other-insurance/entry';
    } else if (product_key === 'HEALTH_INSURANCE') {
      fullPath = 'health/landing';
    }
    this.navigate('group-insurance/' + fullPath);
  }

  renderPorducts(props, index) {
    return (
      <div key={index} onClick={() => this.handleClick(props.key , props.title)} style={{
        display: 'flex', alignItems: 'center', borderBottomWidth: '1px',
        borderBottomColor: '#EFEDF2', borderBottomStyle: this.state.insuranceProducts.length - 1 !== index ? 'solid' : '', paddingTop: '15px',
        paddingBottom: '15px', justifyContent: 'space-between', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex' }}>
          <img src={ require(`assets/${props.icon}_${this.state.type}.svg`)  } alt="" style={{ marginRight: '20px' }} />
          <div>
            <div style={{ color: '#160d2e', fontSize: '15px', fontWeight: 500 , lineHeight : '20px' , margin : '5px 0 5px 0'}}>{props.title}
            </div>
            <div style={{ color: '#7e7e7e', fontSize: '13px' }}>{props.subtitle}</div>
          </div>
        </div>
        {props.resume_flag && <div style={{background: '#ff6868', color: '#fff', fontSize: 8, letterSpacing: 0.1, textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3 }}>RESUME</div>}
      </div>
    )
  }

  sendEvents(user_action, insurance_type ) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance',
        "insurance_type": insurance_type ? insurance_type : ''
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        noFooter={true}
        showLoader={this.state.show_loader}
        title="Insurance">
           <div  style={{ marginTop: '40px' }}>
           <div onClick={this.policymove}>
           <img style={{ margin: '-15px 5px 15px 0', minWidth: '100%' }} src={ require(`../../assets/${this.state.type}/icn_crousal_card_1.svg`)} alt="" />
           </div>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '20px' , margin : '10px 0 9px 0'}}>What are you looking for ?</h1>
            <div> {this.state.insuranceProducts.map(this.renderPorducts)}</div>
            <div style={{ margin: "25px 0 20px 0", fontWeight : '700', fontSize : '17px', lineHeight:'20.15px' }}> Get Insured with ease </div>
          <div className="his">
            <div className="horizontal-images-scroll">
              <img className="image"  src={require(`assets/${this.state.type}/icn_free.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_assistance.svg`)} alt="" />
              <img className="image" src={require(`assets/${this.state.type}/icn_zero_paper.svg`)} alt="" />
            </div>
          </div>

          <div style={{ margin: "40px 0 20px 0", fontWeight : '700', fontSize : '17px', lineHeight:'20.15px' }}> What our customer says </div>
          <div className="his"> <div className="horizontal-images-scroll">
              <img className="image" src={require(`assets/${this.state.type}/icn_review_1.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_review_2.svg`)} alt=""/>
              <img className="image" src={require(`assets/${this.state.type}/icn_review_3.svg`)} alt=""/>
            </div>
          </div>

          <div  className="generic-subtitle-heading">Insurance with fisdom is 100% safe</div>
                    <div style={{display : 'flex' , justifyContent : 'center', height : '20px'}}>
                     <div><img className="image" src={require(`assets/${this.state.type}/irdanewlogo1.svg`)} alt="" style={{marginRight : '2px'}}/>  </div>
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