import React, { Component } from 'react';
import Container from '../../common/Container';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers, ghGetMember } from '../../constants';
import HowToSteps from '../../../common/ui/HowToSteps';
import Checkbox from 'material-ui/Checkbox';
import { inrFormatDecimal, numDifferentiationInr, storageService } from 'utils/validators';
import Grid from 'material-ui/Grid';
import SVG from 'react-inlinesvg';
import down_arrow from 'assets/down_arrow.svg';
import up_arrow from 'assets/up_arrow.svg';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
        show_loader: true,
      productName: getConfig().productName,
      provider: 'HDFC_ERGO',
      checked: true,
      offerImageData: [],
      whats_not_covered: [],
      whats_covered: [],
      quoteResume: {}
    }
  }

  componentWillMount() {


    storageService().remove('groupHealthPlanData');

    let stepsContentMapper = {
      title: 'Why buy on ' + this.state.productName + '??',
      options: [
        { 'icon': 'ic_gold_provider', 'title': 'No document required', 'subtitle': 'Easy and paperless process' },
        { 'icon': 'ic_make_payment', 'title': 'Complete assistance', 'subtitle': 'Our experts will help in purchase and claim of policy' },
        { 'icon': 'deliver', 'title': 'Secure payment', 'subtitle': 'Smooth and secure online payment process via razorpay' }
      ]
    }

    let offerImageData = [
      {
        src: 'icn_landing_card_1.svg',
      },
      {
        src: 'icn_landing_card_2.svg',
      },
      {
        src: 'icn_landing_card_3.svg',
      }
    ];

    let whats_covered = [
      'Diseases occured before policy issuance will be covered after 3 year',
      'Ayurveda, unani, sidha and homeopathy  treatments',
      '60 days pre and 180 days post hospitalization expenses',
      'Organ donor expenses',
      'Mental health and home health care'
    ];
    let whats_not_covered = [
      'Diseases occured before policy issuance will be covered after 3 year',
      'Ayurveda, unani, sidha and homeopathy  treatments',
      '60 days pre and 180 days post hospitalization expenses',
      'Organ donor expenses',
      'Mental health and home health care'
    ]

    this.setState({
      providerData: health_providers[this.state.provider],
      stepsContentMapper: stepsContentMapper,
      offerImageData: offerImageData,
      whats_covered: whats_covered,
      whats_not_covered: whats_not_covered
    })
  }

  async componentDidMount() {

    try {
      const res = await Api.get('api/ins_service/api/insurance/hdfcergo/lead/get/quoteid')

      this.setState ({
          show_loader: false
      });
      var resultData = res.pfwresponse.result;

     
      if (res.pfwresponse.status_code === 200) {
        let lead = resultData.quote;
        lead.member_base = ghGetMember(lead);
        this.setState({
          quoteResume: lead
        })


      } else {
        toast(resultData.error || resultData.message
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: this.state.provider + '/' + pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {
    this.navigate('insure-type')
  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_suraksha',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance'
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
          src={require(`assets/${this.state.productName}/${props.src}`)} alt="Gold Offer" />
      </div>
    )
  }

  renderCoveredPoints = (props, index) => {
    return(
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
      [key + '_open'] : !this.state[key + '_open']
    })
  }

  handleResume = () => {

    storageService().set('ghs_ergo_quote_id', this.state.quoteResume.id);
    if(this.state.quoteResume.status === 'ready_to_pay') {
      this.navigate('final-summary');
    } else {
      this.navigate(`personal-details/${this.state.quoteResume.member_base[0].key}`);
    }
    
  }

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.state.providerData.title}
        fullWidthButton={true}
        buttonTitle="GET INSURED"
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle-dark">
          {this.state.providerData.subtitle}
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
            Complete your health protection 
            </div>

            <div className="rc-tile" style={{ marginBottom: 0 }}>
                <div className="rc-tile-left">
                  <div className="">
                      <img src={require(`assets/${this.state.providerData.logo_cta}`)} alt="" />
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
              <div className="rcb-content">Sum assured: {numDifferentiationInr(this.state.quoteResume.sum_assured)}</div>
              <div className="rcb-content">Cover period: {this.state.quoteResume.tenure} year</div>
            </div>
          </div>}

          <div className="generic-page-title">
            Coverage for all
          </div>
          <div className="generic-page-subtitle">
            Option to cover your entire family (spouse, kids and parents)
          </div>

          <div className='family-images'>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_couple.svg`)} alt="" />
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_kids.svg`)} alt="" />
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/icn_parents.svg`)} alt="" />
          </div>

          <div className="generic-page-title" style={{margin: '40px 0 20px 0'}}>
            Overview
          </div>

          <div className="what-is-covered" onClick={() => this.handleClickPoints('whats_covered')}>
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
              <div  className="content">
                  {this.state.whats_covered.map(this.renderCoveredPoints)}
              </div>
             }
          </div>

          <div className="what-is-covered" onClick={() => this.handleClickPoints('whats_not_covered')}>
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

          <div className="generic-page-title" style={{margin: '20px 0 15px 0'}}>
            Why to have health insurance?
          </div>

          <div className="his">
            <div className="horizontal-images-scroll">
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs2.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs3.svg`)} alt="" />
              <img className='image' src={require(`assets/${this.state.productName}/ic_why_hs4.svg`)} alt="" />
            </div>
          </div>

          <HowToSteps style={{marginTop: 20}} baseData={this.state.stepsContentMapper} />


          <div className="generic-page-title">
            Things to know
          </div>
          <div className="generic-hr"></div>
          <div className="flex faq">
            <div>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_document_copy.svg`)} alt="" />
            </div>
            <div>
              Frequently asked questions
            </div>
          </div>
          <div className="generic-hr"></div>

          <div className="accident-plan-read" style={{ padding: 0 }}
            onClick={() => this.openInBrowser(this.state.quoteData.read_document, 'read_document')}>
            <img className="accident-plan-read-icon"
              src={require(`assets/${this.state.productName}/ic_read.svg`)} alt="" />
            <div className="accident-plan-read-text" style={{ color: getConfig().primary }}>Read Detailed Document</div>
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
                  I accept <span onClick={() => this.openInBrowser(this.state.quoteData.terms_and_conditions || this.state.quoteData.tnc,
                  'terms_and_conditions')} className="accident-plan-terms-bold" style={{ color: getConfig().primary }}>
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