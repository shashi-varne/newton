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
import { openInBrowser } from './common_data';


class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      productName: getConfig().productName,
      provider: 'HDFCERGO',
      checked: true,
      offerImageData: [],
      whats_not_covered: [],
      whats_covered: [],
      quoteResume: {},
      common: {},
      selectedIndex: 0
    }

    this.openInBrowser = openInBrowser.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });

    let stepsContentMapper = {
      title: 'Why choose us?',
      options: [
        { 'icon': 'icn_hs_no_document', 'title': 'No document required', 'subtitle': 'Easy and paperless process' },
        { 'icon': 'icn_hs_assistance', 'title': 'Complete assistance', 'subtitle': 'Our experts will help in purchase and claim of policy' },
        { 'icon': 'icn_hs_payment', 'title': 'Secure payment', 'subtitle': 'Smooth and secure online payment process via billdesk' }
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
      'Diseases occurred before policy issuance will be covered after 3 years',
      'Ayurveda, unani, sidha and homeopathy  treatments',
      '60 days pre and 180 days post hospitalization expenses',
      'Organ donor expenses',
      'Mental health and home health care'
    ];
    let whats_not_covered = [
      'Maternity',
      'Self-inflicted injuries',
      'Adventure sport injuries',
      'Injuries caused due to participation in defense operations/war',
      'Venereal or Sexually transmitted diseases'
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

      this.setState({
        show_loader: false
      });
      var resultData = res.pfwresponse.result;

      if (res.pfwresponse.status_code === 200) {
        let lead = resultData.quote || {};

        lead.member_base = [];

        if (resultData.resume_quote) {
          lead.member_base = ghGetMember(lead);
        }

        this.setState({
          quoteResume: lead
        })


      } else {
        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }

      this.setState({
        common: resultData
      })
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
    this.sendEvents('next');
    this.navigate('insure-type')
  }


  sendEvents(user_action, data = {}) {
    let eventObj = {
      "event_name": 'health_insurance',
      "properties": {
        "user_action": user_action,
        "product": 'health suraksha',
        "screen_name": 'introduction',
        "coverage_overview_click": `${(this.state.whats_covered_clicked ? 'what is covered,' : '')} ${(this.state.whats_not_covered_clicked ? 'what is not covered' : '')}`,
        "things_to_know": data.things_to_know || '',
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
          src={require(`assets/${this.state.productName}/${props.src}`)} alt="Gold Offer" />
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

    this.setState({
      resume_clicked: true
    }, () => {
      this.sendEvents('next');

      storageService().set('ghs_ergo_quote_id', this.state.quoteResume.id);
      if (this.state.quoteResume.status !== 'init') {
        this.navigate('final-summary');
      } else {
        this.navigate(`personal-details/${this.state.quoteResume.member_base[0].key}`);
      }

    })


  }

  openFaqs = () => {

    this.sendEvents('next', { things_to_know: 'faq' })
    let options = [
      {
        'title': 'Why do I need health insurance?',
        'subtitle': 'With the advancement in technology and the availability of more effective treatments, the cost of healthcare has steeply increased. Health insurance policy ensures that medical bills and hospitalization expenses should not get paid from your hard-earned money. It takes care of the hospitalization and treatment charges as well as provides assured tax benefit under section 80D of Income Tax.'
      },
      {
        'title': 'What are the benefits of having a health insurance policy?',
        'subtitle': 'Having a health insurance policy covers expenses incurred due to hospitalization. This includes in-patient treatments, pre and post hospitalization expenses, daycare procedures, home healthcare, etc.'
      },
      {
        'title': 'Can I change the hospital during the course of treatment?',
        'subtitle': 'Yes, if needed you can change the hospital during the treatment. However, you might need to provide the necessary information for a smooth claim process of your health insurance plan.'
      },
      {
        'title': 'Is the health insurance coverage applicable worldwide?',
        'subtitle': 'In certain conditions, you might be eligible for reimbursement of overseas treatment, such as pre-diagnosed planned hospitalization, outpatient treatment, and second opinion in case of sudden illness while traveling under your health insurance plan.'
      },
      {
        'title': 'Does my policy cover diagnostic charges?',
        'subtitle': 'Most pre-hospitalization and post-hospitalization expenses (up to 60 days) are covered under the health insurance policy, such as X - rays, CT scans, MRI, ultrasound nursing, physicians, medicines, etc.'
      }
    ];

    let renderData = {
      'header_title': 'Frequently asked questions',
      'header_subtitle': 'my: health Suraksha',
      'steps': {
        'options': options
      },
      'cta_title': 'OK'
    }


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
        title={this.state.providerData.title}
        fullWidthButton={true}
        buttonTitle={this.state.quoteResume && this.state.quoteResume.id ? 'GET A NEW QUOTE' : "GET INSURED"}
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

          <div className="accident-plan-read" style={{ padding: 0 }}
            onClick={() => this.openInBrowser(this.state.common.details_doc, 'read_document')}>
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
                  I accept <span onClick={() => this.openInBrowser(this.state.common.tnc,
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