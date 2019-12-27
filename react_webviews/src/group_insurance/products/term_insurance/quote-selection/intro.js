import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import dropdown_arrow_fisdom from 'assets/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';
// import kotak_logo from 'assets/kotak_life_logo.png';
import {
  inrFormatDecimal
} from '../../../../utils/validators';
import '../../../../utils/native_listner_otm';

import { quotePointsPorivders } from '../../../constants';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      termRedirectData: {},
      canRenderList: false,
      openPopUp: false,
      renderList: [],
      paymentFreqRadio: 'Monthly',
      expendAddOnOpen: false,
      provider: 'KOTAK'
    }

    this.renderQuotes = this.renderQuotes.bind(this);
    this.renderQuotePoints = this.renderQuotePoints.bind(this);
  }

  componentWillMount() {
    nativeCallback({ action: 'take_control_reset' });
  }

  async getTermInsurance() {
    try {
      const res2 = await Api.get('/api/insurance/all/summary');

      this.setState({
        show_loader: false
      })
      if (res2.pfwresponse.status_code === 200) {

        window.localStorage.setItem('excluded_providers', '');
        window.localStorage.setItem('required_providers', '');
        window.localStorage.setItem('quoteSelected', '');
        window.localStorage.setItem('quoteData', '');
        let pathname = '';
        let resumeFlagTerm = false;
        let termData = res2.pfwresponse.result;
        let application;
        if (!termData.error) {
          let insurance_apps = termData.insurance_apps;
          let required_fields;
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
            this.setState({
              termApplication: application
            })
          }
        } else {
          pathname = 'intro';
        }

        let fullPath = '/group-insurance/term/' + pathname;

        this.setState({
          redirectTermPath: fullPath
        })

        let termRedirectData = {
          resumeFlag: resumeFlagTerm,
          resumeRedirectPath: fullPath,
          provider: resumeFlagTerm && application ? application.provider: ''
        };

        this.setState({
          termRedirectData: termRedirectData
        })

      } else {

      }


    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  async getQuotes() {

    
    try {
      const res = await Api.get('/api/ins_service/api/providers/all');
      this.getTermInsurance();
      // this.setState({
      //   show_loader: false
      // });

      // let quotesData = [

      //   {
      //     'quote_provider': 'KOTAK',
      //     'premium': '231',
      //     'quote_provider_logo': kotak_logo,
      //     'claim_settled_ratio': '97.4',
      //     'insurance_title': 'Kotak Life Insurance'
      //   },
      //   {
      //     'quote_provider': 'HDFC',
      //     'premium': '417',
      //     'quote_provider_logo': 'https://kotak-dot-plutus-staging.appspot.com/static/img/insurance/hdfc_logo.png',
      //     'claim_settled_ratio': '98',
      //     'insurance_title': 'HDFC Life Click 2 Protect 3D Plus'
      //   }
      // ]

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.providers) {
        let result = res.pfwresponse.result;
        this.setState({
          quotes: result.providers
        });
      } else {
        this.setState({
          quotes: []
        });
        toast(res.pfwresponse.result.error);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  componentDidMount() {

    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom,
    })
    this.getQuotes();
  }


  navigate = (pathname, search, params) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  selectQuote(quote, index) {

    this.setState({
      quoteSelected: quote,
      selectedIndexQuote: index,
    })

    this.sendEvents('next', quote);
    if (this.state.termRedirectData.resumeFlag &&
      this.state.termRedirectData.provider === quote.quote_provider) {
      this.navigate(this.state.termRedirectData.resumeRedirectPath)
      return;
    }

    if (quote.quote_provider === 'HDFC') {
      this.navigate('personal-details-intro')
    } else {
      let search = getConfig().searchParams + '&provider=' + quote.quote_provider
      this.navigate('personal-details-redirect', search)
    }

  }

  renderQuotePoints(props, index) {
    return (
      <div key={index}>
        <div className="quote-tiles2" style={{ marginLeft: '5%' }}>
          <span className="quote-tiles2a">{index + 1}. {props}</span>
        </div>
        {props.points && props.points.map((row, i) => (
          <div key={i} className="quote-tiles2">
            <span className="quote-tiles2b">- {row}</span>
          </div>
        ))}
      </div>
    )
  }

  renderAddOnPoints(props, index) {
    return (
      <div key={index}>
        <div className="quote-tiles2">
          <span className="quote-tiles2a">{index + 1}. {props}</span>
        </div>
        {props.points && props.points.map((row, i) => (
          <div key={i} className="quote-tiles2">
            <span className="quote-tiles2b">- {row}</span>
          </div>
        ))}
      </div>
    )
  }

  expendAddOn(index) {

    let quotes = this.state.quotes;
    quotes[index].expendAddOnOpen = !quotes[index].expendAddOnOpen;
    this.setState({
      quotes: quotes
    })
  }

  renderQuotes(props, index) {
    return (
      <div key={index} className="quote-tiles" style={{ margin: index !== 0 ? '20px 0 0 0' : '' }}>
        <div className="quote-tiles1">
          <div className="quote-tiles1a">
            <img style={{ width: 90 }} src={props.quote_provider_logo} alt="Insurance" />
          </div>
          <div className="quote-tiles1b">{props.insurance_title}</div>
        </div>

        <div className="quote-tiles4" style={{
          padding: '0 11px 10px 17px',
          margin: '0 0 10px 0px', borderBottom: '1px solid #efefef'
        }}>
          <div className="quote-tiles4a">
            Claim Settled
          </div>
          <div className="quote-tiles4a" style={{ color: getConfig().primary, fontWeight: 500 }}>
            {props.claim_settled_ratio}%
          </div>
        </div>
        <div className="quote-tiles4">
          <div className="quote-tiles4a">
            Basic benefits
            </div>
        </div>

        {/* basic benefits */}
        {props.quote_provider &&
          quotePointsPorivders[props.quote_provider].basic_benefits.map(this.renderQuotePoints)}

        {/* add on benefits */}
        <div className="quote-addon-tiles11">
          <div className="quote-addon-tiles1" onClick={() => this.expendAddOn(index, props.quote_provider)}>
            <div className="quote-addon-tiles1a">
              Add on benefits
          </div>
            <div className="quote-addon-tiles1b">
              <img className="quote-addon-tiles1c" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
          {props.expendAddOnOpen &&
            <div style={{ marginTop: 10 }}>
              {props.quote_provider && quotePointsPorivders[props.quote_provider].add_on_benefits.map(this.renderQuotePoints)
              }
            </div>
          }
        </div>

        {(props.quote_provider !== this.state.termRedirectData.provider ||
          (props.quote_provider === 'HDFC' && !this.state.termRedirectData.resumeFlag)) && <div className="quote-tiles3">
            <div className="quote-tiles3a-providers">
              <div className="quote-tiles3aa" style={{ display: 'grid', textAlign: 'left' }}>
                <span> Starts from</span>
                <span> {inrFormatDecimal(props.starting_premium_monthly)}/month*</span>
              </div>
            </div>
            <div className="quote-tiles3b" style={{ padding: '14px', width: '48%' }} onClick={() => this.selectQuote(props, index)}>
              <div className="quote-tiles3ba">
                <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>Get Free Quote</span>
              </div>
            </div>
          </div>}

        {this.state.termRedirectData.resumeFlag && (props.quote_provider === this.state.termRedirectData.provider) && <div className="quote-tiles3">
          <div className="quote-tiles3b" style={{ padding: '14px', width: '90%', margin: '0 0 0 13px' }} onClick={() => this.selectQuote(props, index)}>
            <div className="quote-tiles3ba">
              <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>Resume</span>
            </div>
          </div>
        </div>}
      </div>
    )
  }

  sendEvents(user_action, quote) {

    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'select_provider',
        'provider_name': quote ? quote.quote_provider : this.state.quoteSelected &&
          this.state.quoteSelected.quote_provider ? this.state.quoteSelected.quote_provider : '',
        'resume': this.state.termRedirectData.resumeFlag && quote &&
          this.state.termRedirectData.provider === quote.quote_provider ? 'yes' : 'no'
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
        title="Term Insurance"
        onlyButton={true}
      >

        {this.state.quotes && this.state.quotes.map(this.renderQuotes)}
      </Container>
    );
  }
}

export default Intro;
