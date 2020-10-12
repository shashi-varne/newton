import React, { Component } from 'react';
import Container from '../../common/Container';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { ghGetMember } from '../../constants';
import HowToSteps from '../../../common/ui/HowToSteps';
import Checkbox from 'material-ui/Checkbox';
import { inrFormatDecimal, numDifferentiationInr, storageService } from 'utils/validators';
import Grid from 'material-ui/Grid';
import SVG from 'react-inlinesvg';
import down_arrow from 'assets/down_arrow.svg';
import up_arrow from 'assets/up_arrow.svg';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { openInBrowser } from './common_data';

import {getGhProviderConfig} from './constants';

const screen_name = 'landing_screen';
class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      productName: getConfig().productName,
      provider: this.props.match.params.provider,
      checked: true,
      offerImageData: [],
      whats_not_covered: [],
      whats_covered: [],
      quoteResume: {},
      common: {},
      screen_name :screen_name,
      selectedIndex: 0,
      providerConfig: getGhProviderConfig(this.props.match.params.provider)
    };

    this.openInBrowser = openInBrowser.bind(this);
  }

  componentWillMount() {

    let { params } = this.props.location || {};
    let openModuleData = params ? params.openModuleData : {}

    let screenData = this.state.providerConfig[screen_name];

    nativeCallback({ action: 'take_control_reset' });

    let stepsContentMapper = {
      title: `Get insured with ease` ,
      options: [
        { 'icon': 'icn_hs_no_document', 'title': 'No document required', 'subtitle': 'Easy and paperless process' },
        { 'icon': 'icn_hs_assistance', 'title': 'Complete assistance', 'subtitle': 'Our experts will help in purchase and claim of policy' },
        { 'icon': 'icn_hs_payment', 'title': 'Secure payment', 'subtitle': 'Smooth and secure online payment process' }
      ]
    }
   
    this.setState({
      stepsContentMapper: stepsContentMapper,
      offerImageData: screenData.offerImageData,
      whats_covered: screenData.whats_covered,
      whats_not_covered: screenData.whats_not_covered,
      screenData: screenData,
      openModuleData: openModuleData
    })
  }

  async componentDidMount() {

    let openModuleData = this.state.openModuleData || {};

    try {
      const res = await Api.get(`api/ins_service/api/insurance/${this.state.providerConfig.provider_api}/lead/get/quoteid`)

      if (!openModuleData.sub_module) {
        this.setState({
          show_loader: false
        })
      }
     
      var resultData = res.pfwresponse.result;

      let lead = {};
      if (res.pfwresponse.status_code === 200) {
        lead = resultData.quote || {};

        lead.member_base = [];

        if (resultData.resume_quote) {
          lead.member_base = ghGetMember(lead, this.state.providerConfig);
        }

      } else {
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }

      this.setState({
        common: resultData,
        quoteResume: lead
      }, () => {
        if(openModuleData.sub_module === 'click-resume') {

          if(!this.state.quoteResume || !this.state.quoteResume.id) {
            this.setState({show_loader: false});
          } else{ 
            this.handleResume();
          }
          
        }
      });


    } catch (err) {
      console.log(err)
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {
    this.sendEvents('next');
    this.navigate(this.state.providerConfig.get_next[screen_name]);
  }


  sendEvents(user_action, data = {}) {
    let eventObj = {
      "event_name": 'health_insurance',
      "properties": {
        "user_action": user_action,
        "product": this.state.providerConfig.provider_api,
        "screen_name": 'introduction',
        "coverage_overview_click": `${(this.state.whats_covered_clicked ? 'what is covered,' : '')} ${(this.state.whats_not_covered_clicked ? 'what is not covered' : '')}`,
        "things_to_know": data.things_to_know || data.more_info || '',
        "benifits_carousel": this.state.selectedIndex + 1,
        "resume_clicked": this.state.resume_clicked ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  renderOfferImages = (props, index) => {
    return (
      <div key={index} className="gold-offer-slider">
        <img className="offer-slide-img"
          src={require(`assets/${props.src}`)} alt="Gold Offer" />
      </div>
    )
  }

  renderCoveredPoints = (props, index) => {
    return (
      <div key={index} className="wic-tile">
        <div className="circle"></div>
        <div className="wic-tile-right">
          {props}
        </div>
      </div>
    );
  }

  handleClickPoints = (key) => {
    this.setState({
      [key + '_open']: !this.state[key + '_open'],
      [key + '_clicked']: true
    })
  }

  handleResume = () => {

    if(!this.state.quoteResume || !this.state.quoteResume.id) {
      return;
    }

    this.setState({
      resume_clicked: true
    }, () => {
      this.sendEvents('next');

      let quoteResume = this.state.quoteResume;
      storageService().set('ghs_ergo_quote_id', quoteResume.id);
      if (quoteResume.status !== 'init' || quoteResume.forms_completed || storageService().getObject('final-summary-reached')) {
        storageService().setObject('backToResume', 'resume');
        this.navigate('final-summary');
      } else {
        this.navigate(`plan-premium-summary`);
      }
    })

  }

  openFaqs = () => {

    this.sendEvents('next', { things_to_know: 'faq' })
    let renderData = this.state.screenData.faq_data;

    this.props.history.push({
      pathname: '/gold/common/render-faqs',
      search: getConfig().searchParams,
      params: {
        renderData: renderData
      }
    });
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.state.providerConfig.title}
        fullWidthButton={true}
        buttonTitle={this.state.quoteResume && this.state.quoteResume.id ? 'GET A NEW QUOTE' : "GET INSURED"}
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle-dark">
          {this.state.providerConfig.subtitle}
        </div>

        <div className="group-health-landing">

          <div style={{ margin: '20px 0 0 0', cursor: 'pointer' }}>
            <Carousel
              showStatus={false} showThumbs={false}
              showArrows={true}
              infiniteLoop={false}
              selectedItem={this.state.selectedIndex}
              onChange={(index) => {
                this.setState({
                  selectedIndex: index,
                  card_swipe: 'yes',
                  card_swipe_count: this.state.card_swipe_count + 1
                });
              }}
            >
              {this.state.offerImageData.map(this.renderOfferImages)}
            </Carousel>
          </div>

          {this.state.quoteResume && this.state.quoteResume.id &&
            <div className="resume-card" onClick={() => this.handleResume()}>
              <div className="rc-title">
                Recent activity
            </div>

              <div className="rc-tile" style={{ marginBottom: 0 }}>
                <div className="rc-tile-left">
                  <div className="">
                    <img src={require(`assets/${this.state.providerConfig.logo_cta}`)} alt="" />
                  </div>
                  <div className="rc-tile-premium-data">
                    <div className="rct-title">{this.state.quoteResume.plan_title}</div>
                    <div className="rct-subtitle">{inrFormatDecimal(this.state.quoteResume.total_amount)}</div>
                  </div>

                </div>

                <div className="generic-page-button-small">
                  RESUME
                </div>


              </div>

              <div className="rc-bottom flex-between">
                <div className="rcb-content">Sum insured: {numDifferentiationInr(this.state.quoteResume.sum_assured)}</div>
                <div className="rcb-content">Cover period: {this.state.quoteResume.tenure} year{this.state.quoteResume.tenure>'1' && <span>s</span>}</div>
              </div>
            </div>}

          <div className="generic-page-title">
            Covers all age groups
          </div>
          <div className="generic-page-subtitle">
           Buy health insurance for yourself, spouse, kids or parents also.
          </div>

          <div className='family-images'>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_couple.svg`)} alt="" />
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_kids.svg`)} alt="" />
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_parents.svg`)} alt="" />
          </div>

          <div className="generic-page-title" style={{ margin: '40px 0 20px 0' }}>
            Overview
          </div>

          <div className="what-is-covered" 
          style={{background: this.state.productName === 'fisdom' ? '#5721AE' : '#19487F'}} 
          onClick={() => this.handleClickPoints('whats_covered')}>
            <div className="top">
              <div className="wic-title">
                What is covered?
              </div>
              <div className="">
                <SVG
                  className="text-block-2-img"
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#fff')}
                  src={this.state.whats_covered_open ? up_arrow : down_arrow}
                />
              </div>
            </div>

            {this.state.whats_covered_open &&
              <div className="content">
                {this.state.whats_covered.map(this.renderCoveredPoints)}
              </div>
            }
          </div>

          <div className="what-is-covered" 
          style={{background: this.state.productName === 'fisdom' ? '#5721AE' : '#19487F'}} 
          onClick={() => this.handleClickPoints('whats_not_covered')}>
            <div className="top">
              <div className="wic-title">
                What is not covered?
              </div>
              <div className="">
                <SVG
                  className="text-block-2-img"
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#fff')}
                  src={this.state.whats_not_covered_open ? up_arrow : down_arrow}
                />
              </div>
            </div>

            {this.state.whats_not_covered_open && this.state.whats_not_covered.map(this.renderCoveredPoints)}
          </div>

          <div className="generic-page-title" style={{ margin: '20px 0 15px 0' }}>
            Benefits of health insurance
          </div>

          <div className="his">
            <div className="horizontal-images-scroll">
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs.png`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs2.png`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs3.png`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs4.png`)} alt="" />
            </div>
          </div>

          <HowToSteps style={{ marginTop: 20, marginBottom: 0 }} baseData={this.state.stepsContentMapper} />


          <div className="generic-page-title">
            Things to know
          </div>
          <div className="generic-hr"></div>
          <div className="flex faq" onClick={() => this.openFaqs()}>
            <div>
              <img className="accident-plan-read-icon"
                src={require(`assets/${this.state.productName}/ic_document_copy.svg`)} alt="" />
            </div>
            <div>
              Frequently asked questions
            </div>
          </div>
          <div className="generic-hr"></div>

          <div className="accident-plan-read" style={{ padding: 0,margin: '20px 0 0 0' }}
            onClick={() => this.openInBrowser(this.state.common.details_doc, 'read_document')}>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_read.svg`)} alt="" />
            <div className="accident-plan-read-text" style={{ color: getConfig().primary }}>Read full-policy description</div>
          </div>
          <div className="CheckBlock2 accident-plan-terms" style={{ padding: 0 }}>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={1} className="TextCenter">
                <Checkbox
                  defaultChecked
                  checked={this.state.checked}
                  color="default"
                  value="checked"
                  name="checked"
                  onChange={() => console.log('Clicked')}
                  className="Checkbox" />
              </Grid>
              <Grid item xs={11}>
                <div className="accident-plan-terms-text" style={{}}>
                I agree to the <span onClick={() => this.openInBrowser(this.state.common.tnc,
                  'tnc')} className="accident-plan-terms-bold" style={{ color: getConfig().primary }}>
                    Terms and conditions</span></div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    );
  }
}

export default GroupHealthLanding;