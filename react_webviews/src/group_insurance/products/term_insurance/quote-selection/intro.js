import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig, isFeatureEnabled } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import dropdown_arrow_fisdom from 'assets/fisdom/down_arrow_fisdom.svg';
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
      skelton: true,
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
        skelton: false
      })
      if (res2.pfwresponse.status_code === 200) {

        window.sessionStorage.setItem('excluded_providers', '');
        window.sessionStorage.setItem('required_providers', '');
        window.sessionStorage.setItem('quoteSelected', '');
        window.sessionStorage.setItem('quoteData', '');
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
          }

          if (application) {
            let data = {
              application: application,
              required_fields: required_fields
            }
            window.sessionStorage.setItem('cameFromHome', true);
            window.sessionStorage.setItem('homeApplication', JSON.stringify(data));
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
        skelton: false
      });
      toast('Something went wrong');
    }
  }

  setErrorData = (type) => {

    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Fetch again',
          title1: ''
        },
        'submit': {
          handleClick1: this.onload,
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


  onload = async () => {

    this.setErrorData('onload');

    let error = ''
    window.sessionStorage.setItem('quote_redirect_data', ''); 
    try {
    this.setState({
      skelton: true,
    });
      const res = await Api.get('/api/ins_service/api/insurance/providers/all');
      this.getTermInsurance();
      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.providers) {
        let result = res.pfwresponse.result;

        let quotes = result.providers;
        this.setState({
          quotes: quotes
        });
      } else {
        this.setState({
          quotes: []
        });
        error = res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong';
        // toast(res.pfwresponse.result.error);
      }
    }catch (err) {
      this.setState({
        skelton: false,
        showError: 'page'
      });
    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error
        },
        showError: 'page'
      })
    }
  }

   componentDidMount() {
    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom,
    })
  }

  async componentDidMount() {
    this.onload();
  }

  navigate = (pathname, search, params) => {
    this.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams
    });
  }

  selectQuote(quote, index) {

    let tnc = quote.terms_and_conditions;
    window.sessionStorage.setItem('term_ins_tnc', tnc);

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
    } else if (quote.quote_provider === 'EDELWEISS') {
      this.navigate('etli/personal-details1');
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

    if(props.quote_provider === 'EDELWEISS' && !isFeatureEnabled(getConfig(), 'etli_download')) {
      return null;
    }

    // && !this.state.termRedirectData.resumeFlag
    if(props.quote_provider === 'HDFC') {
      return;
    }
    if(!quotePointsPorivders[props.quote_provider]) {
      return null;
    }
    return (
      <div className="quote-tiles-term" key={index} >
        <div className="quote-tiles" style={{ margin: index !== 0 ? '20px 0 0 0' : '' }}>
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
              {props.claim_settled_ratio}% {props.quote_provider === 'EDELWEISS' && <span className="hash-right">#</span>}
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

       {props.quote_provider === 'EDELWEISS' && 
          <div className="bottom-extra-info">
            <div className="hash-info-tile">
              <div className="left">#</div>
              <div className="right">
                  Individual-Death Claim settled and as per published in 
                  IRDAI Annual Report for FY’18-19.
              </div>
            </div>
            <div className="hash-info-tile">
              <div className="left">^</div>
              <div className="right">
                  Tax benefits are subject to changes in the tax laws.
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  sendEvents(user_action, quote) {

    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'term insurance',
        'insurance_provider': quote ? quote.quote_provider : this.state.quoteSelected &&
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
        showError={this.state.showError}
        skelton={this.state.skelton}
        errorData={this.state.errorData}
        title="Term Insurance"
        onlyButton={true}
        handleClick={() => this.handleClickCurrent()}
      >

        {this.state.quotes && this.state.quotes.map(this.renderQuotes)}
      </Container>
    );
  }
}

export default Intro;
