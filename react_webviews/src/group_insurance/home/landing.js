import React, { Component } from 'react';
import Container from '../common/Container';
import ContactUs from '../../common/components/contact_us'
import qs from 'qs'; 
import Api from "utils/api";
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import '../common/Style.scss';
import {storageService} from "utils/validators";
import { setRecommendationData } from '../advisory/common_data'
import '../common/Style.scss'
import { isEmpty } from 'utils/validators';
import Button from 'material-ui/Button';
import {setReportData, getReportCardsData, getProviderObject, getProviderObject_offline} from '../products/group_health/common_data';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // skelton: 'p',
      skelton: true,
      type: getConfig().productName,
      insuranceProducts: [],
      params: qs.parse(props.history.location.search.slice(1)),
      advisory_button_text: "LET'S FIND OUT" 
    }

    this.renderPorducts = this.renderPorducts.bind(this);
    this.getReportCardsData = getReportCardsData.bind(this);
    this.setReportData = setReportData.bind(this);
    this.getProviderObject = getProviderObject.bind(this);
    this.getProviderObject_offline = getProviderObject_offline.bind(this);
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
    if(!isEmpty(openModuleData)){
      if(!openModuleData.sub_module && redirect_url && redirect_url.includes("exit_web")) {
        window.location.href = redirect_url;
      }
    }
    this.setState({
      insuranceProducts: insuranceProducts,
      openModuleData : openModuleData
    })
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClick,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false
            })
          },
          button_text2: 'Edit'
        }
      };
  
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      })
    }
  }

  componentDidMount(){
    this.onload();
  }

  onload = async() => {
    storageService().remove('from_advisory')
    this.setErrorData('onload')
    this.setState({
      skelton: true,
    })
    let error = ''
    let errorType = ''
    try{
      var res = await Api.get(`api/insurancev2/api/insurance/advisory/resume/check`);
        var resultData = res.pfwresponse.result;

        if (res.pfwresponse.status_code === 200) {
          var advisory_resume_present = resultData.resume_present;
          var advisory_resume_status = resultData.insurance_advisory.status;
          var advisory_id = resultData.insurance_advisory.id;

          var next_advisory_page = 'landing';
          var advisory_button_text = this.state.advisory_button_text
          if(advisory_resume_present && advisory_resume_status === 'incomplete'){
            advisory_button_text = "RESUME";
            storageService().setObject('advisory_resume_present', true)
            storageService().setObject("advisory_id", advisory_id)
            next_advisory_page = 'basic-details';
          }else if(advisory_resume_present && advisory_resume_status === 'complete'){
            storageService().setObject("advisory_id", advisory_id)
            var advisory_data = storageService().getObject('advisory_data') || {};
            var recommendation_data = resultData.coverage_gap_dict;
            var user_data = resultData.insurance_advisory;
            setRecommendationData(advisory_data, recommendation_data, user_data) 
            
            advisory_button_text = "VIEW REPORT";
            next_advisory_page = 'recommendations';
          }

          this.setState({
            advisory_button_text: advisory_button_text,
            next_advisory_page: next_advisory_page, 
            advisory_id: advisory_id
          })
          await this.getReportCardsData();
          var filteredReportData = this.state.filteredReportData;
          var showCustomReportCardText = false;
          var customReportCardText = '';
          
          if(!isEmpty(filteredReportData.activeReports)){
            showCustomReportCardText = true;
            customReportCardText = filteredReportData.activeReports[0].product_category;
          }else if(!isEmpty(filteredReportData.pendingReports)){
            showCustomReportCardText = true;
            customReportCardText = filteredReportData.pendingReports[0].product_category;
          }
          
          if((this.state.reportCount.active + this.state.reportCount.pending) > 1){
            var noOfReports = this.state.reportCount.active + this.state.reportCount.pending;
            this.setState({noOfReports})
          }
          
          this.setState({customReportCardText, showCustomReportCardText})
        } else {
          error = resultData.error || resultData.message || true;
      }
    }catch(err){
      this.setState({
        show_loader: false,
        showError: true,
      });
      errorType = 'crash';
      error = true;
    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: 'page',
      })
    }
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

  sendEvents(user_action, insurance_type, banner_clicked, callback_clicked, advisory_clicked) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance',
        "insurance_type": insurance_type ? insurance_type : '',
        'banner_clicked' : banner_clicked ? true : false,
        'callback_clicked' : callback_clicked ?  true : false,
        'advisory_card_cta' : this.state.advisory_button_text,
        'insurance_advisory_card_clicked': advisory_clicked ? true : false
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  goToAdvisory = (e) =>{
    e.preventDefault();
    this.sendEvents('next', "", "", "", true);
    this.navigate(`/group-insurance/advisory/${this.state.next_advisory_page}`)
    return;
  }
  toToReports = () =>{
    // this.sendEvents()
    this.navigate('/group-insurance/common/report')
    return;
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
        skelton={this.state.skelton}
        showLoader={this.state.show_loader}
        showError={this.state.showError}
        errorData={this.state.errorData}
        title="Insurance">
           <div  style={{ marginTop: '30px' }}>
           {/* <div onClick={this.policymove}>
            <img style={{ margin: '-15px 5px 30px 0', width: '100%', cursor: 'pointer' }} src={ require(`../../assets/${this.state.type}/icn_crousal_card_1.svg`)} alt="" />
           </div> */}
           <div className="hi-landing-banner">
              <p className="hi-landing-banner-header">{getConfig().productName} HealthProtect</p>
              <p className="hi-landing-banner-text">₹10 Lakh health cover @ just ₹728/m</p>
              <p className="hi-landing-banner-text">100% additional personal accident cover</p>
              <img className="hi-landing-banner-img" src={require(`../../assets/hi-banner-image.svg`)} alt="" />
              <Button variant="raised"
                size="large" color="secondary" autoFocus className="button" onClick={() => this.navigate('/group-insurance/group-health/GMC/landing')}>
                GET INSURED
              </Button>
            </div>
            <h1 style={{ fontWeight: '700', color: '#160d2e', fontSize: '17px' , marginTop:'10px', marginBottom:'4px' , lineHeight : '20.15px'}}>What are you looking for?</h1>
            <div> {this.state.insuranceProducts.map(this.renderPorducts)}</div>
            <div className="inactive-entry-card" onClick={this.toToReports}>
              <img alt="inactive-policy-card" src={require(`assets/${this.state.type}/policy_icon.svg`)} />
              <div className="inactive-right">
                <p className="inactive-title">Your policies</p>
                <p className="inactive-subtitle">{this.state.showCustomReportCardText ? `${this.state.customReportCardText} ${this.state.noOfReports > 1   ? '+' + this.state.noOfReports + ' more': '' }` :'Looks like you have zero coverage'}</p>
              </div>
            </div>
            <div className="advisory-entry-container" onClick={(e)=>this.goToAdvisory(e)}>  
              <img className="advisory-entry" src={require(`assets/${this.state.type}/entry_insurance_advisory.svg`)} alt=""/>
              <p className="adivsory-card-heading">Do you have adequate insurance coverage?</p>
              <button className="advisory-entry-button">{this.state.advisory_button_text}</button>
            </div>
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