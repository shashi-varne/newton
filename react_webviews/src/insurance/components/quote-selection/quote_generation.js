import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import dropdown_arrow from 'assets/down_arrow_blue.svg';

class QuoteGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      quoteData: JSON.parse(window.localStorage.getItem('quoteData')) || {}
    }
  }

  componentWillMount() {
    console.log(this.state.quoteData)
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
    let insuranceData = {
      tobacco_choice: this.state.quoteData.tobacco_choice,
      cover: this.state.quoteData.cover_amount,
      term: this.state.quoteData.cover_period,
      payment_frequency: 'Yearly',
      death_benefit_option: '',
      dob: this.state.quoteData.dob,
      gender: this.state.quoteData.gender,
      annual_income: this.state.quoteData.annual_income,
      accident_benefit: '',
      ci_benefit: '',
      annual_quote_required: true//v2 only, always true
    };
    try {
      const res = await Api.post('/api/insurance/quote', insuranceData)

      // const res = { "pfwuser_id": 4709613628817409, "pfwresponse": { "status_code": 200, "requestapi": "", "result": { "quotes": [{ "status": "init", "term": 28, "payout_option": "Lump sum", "annual_income": "10-15", "quotation_dump": "", "quote_provider": "HDFC", "dob": "07/03/1973", "gender": "MALE", "insurance_title": "HDFC Life Click 2 Protect 3D Plus", "cover_amount": 20000000, "quote_provider_logo": "https://monica-dot-plutus-staging.appspot.com/static/img/insurance/hdfc_logo.png", "cover_plan": "Life", "quote_describer": { "image": "https://monica-dot-plutus-staging.appspot.com/static/img/insurance/hdfc_logo.png", "explainer": "<style media='screen'> body {margin: 0;padding-bottom:12px;}div.no-span{margin-bottom: 10px; font-weight: bold; border-top: 1px solid #efefef; width: 100%;}</style><div style='font-size: 14px;font-family: Roboto;'><div style='display:-webkit-box;padding: 12px;padding-bottom: 0px;'> <img style='width: 120px;margin-bottom: 15px;' src='https://monica-dot-plutus-staging.appspot.com/static/img/insurance/hdfc_logo.png' alt='' /><div style='width: 50%; margin: 11px 0 0 10px;color: #4a4a4a;font-weight: 600;'>HDFC Life Click 2 Protect 3D Plus</div></div><div class='no-span' style='color: #444;margin-bottom: 10px;font-weight: bold;'></div><div style='color: #878787;margin-bottom: 5px;padding-left:12px;'><b>Payout: </b>Lump sum in case of death</div><div style='color:#878787;padding-left:12px;'><b>Full waiver of future premiums:</b><div style='margin-top: 5px;'><div style='margin-bottom: 5px;'> <b>A.</b> On Accidental Total Permanent Disability </div><div> <b>B.</b> In case of diagnosis of Terminal Illness </div></div></div></div>", "provider": "HDFC" }, "dt_created": "29/05/2019", "accident_benefit": 0, "payment_frequency": "YEARLY", "tobacco_choice": "Y", "id": 6544606705483777, "ci_benefit": "N", "quote_json": { "total_tax": "865", "premium": "5673", "quote_date": "25/02/2019", "base_premium": "4808", "cover_amount": "5000000", "app_num": "", "payment_frequency": "Annual", "quote_id": "1559122704.15", "product_name": "HDFC Life Click 2 Protect 3D Plus", "cover_plan": "Life Option" } }, { "status": "init", "term": 28, "payout_option": "Lump sum", "annual_income": "10-15", "quotation_dump": "", "quote_provider": "IPRU", "dob": "07/03/1973", "gender": "MALE", "insurance_title": "iProtectSmart", "cover_amount": 20000000, "quote_provider_logo": "https://monica-dot-plutus-staging.appspot.com/static/img/insurance/ipru_logo.png", "cover_plan": "Life", "quote_describer": { "image": "https://monica-dot-plutus-staging.appspot.com/static/img/insurance/ipru_logo.png", "explainer": "<style media='screen'> body {margin: 0;padding-bottom:12px;}div.no-span{margin-bottom: 10px; font-weight: bold; border-top: 1px solid #efefef; width: 100%;}</style><div style='font-size: 14px;font-family: Roboto;'><div style='display:-webkit-box;padding: 12px;padding-bottom: 0px;'> <img style='width: 120px;margin-bottom: 15px;' src='https://monica-dot-plutus-staging.appspot.com/static/img/insurance/ipru_logo.png' alt='' /><div style='width: 40%; margin: 11px 0 0 10px;color: #4a4a4a;font-weight: 600;'>ICICI Pru iProtect Smart</div></div><div class='no-span' style='color: #444;margin-bottom: 10px;font-weight: bold;'></div><div style='color: #878787;margin-bottom: 5px;padding-left:12px;'><b>Payout: </b>Lump sum in case of death</div><div style='color:#878787;padding-left:12px;'><b>Full waiver of future premiums:</b><div style='margin-top: 5px;'><div style='margin-bottom: 5px;'> <b>A.</b> On Accidental Total Permanent Disability </div><div> <b>B.</b> In case of diagnosis of Terminal Illness </div></div></div></div>", "provider": "IPRU" }, "dt_created": "29/05/2019", "accident_benefit": 0, "payment_frequency": "YEARLY", "tobacco_choice": "Y", "id": 4715019356864513, "ci_benefit": "N", "quote_json": { "total_tax": "13986", "premium": "91683", "base_premium": "77697", "cover_amount": "20000000", "payment_frequency": "Yearly", "product_name": "iProtectSmart", "cover_plan": "Life" } }], "errors": [] } }, "pfwmessage": "Success", "pfwutime": "", "pfwstatus_code": 200, "pfwtime": "2019-05-29 09:38:23.874491" }
      let result = res.pfwresponse.result.quotes;
      console.log(result);
      this.setState({
        show_loader: false,
        result: result,
        quote: result[0]
      });
    } catch (err) {
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

  handleClick = async () => {
    this.navigate('journey')
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select the Insurance"
        smallTitle="Premiums are inclusive of GST"
        handleClick={this.handleClick}
        buttonTitle="Save & Continue"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >

        <div className="quote-top-tiles">
          <div className="quote-top-tiles1">
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Cover</div>
              <div className="quote-top-tiles1c">2Cr.</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div className="quote-top-tiles1">
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Cover upto</div>
              <div className="quote-top-tiles1c">40 years</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div className="quote-top-tiles1">
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Smoke</div>
              <div className="quote-top-tiles1c">NO</div>
            </div>
            <div className="quote-top-tiles1d">
              <img className="quote-top-tiles1e" src={dropdown_arrow} alt="Insurance" />
            </div>
          </div>
        </div>


        {this.state.quote && <div className="quote-tiles">
          <div className="quote-tiles1">
            <div className="quote-tiles1a">
              <img style={{ width: 90 }} src={this.state.quote.quote_provider_logo} alt="Insurance" />
            </div>
            <div className="quote-tiles1b">{this.state.quote.insurance_title}</div>
          </div>
          <div className="quote-tiles2">
            <span className="quote-tiles2a">Payout: </span>
            <span className="quote-tiles2b">Lump sum in case of death</span>
          </div>

          <div className="quote-tiles2">
            <span className="quote-tiles2a">Full waiver of future premiums: </span>
          </div>

          <div className="quote-tiles2">
            <span className="quote-tiles2a">A. </span>
            <span className="quote-tiles2b">On Accidental Total Permanent Disability</span>
          </div>

          <div className="quote-tiles2">
            <span className="quote-tiles2a">B. </span>
            <span className="quote-tiles2b">In case of diagnosis of Terminal Illness</span>
          </div>

          <div className="quote-tiles3">
            <div className="quote-tiles3a">
              <div className="quote-tiles3aa">
                2,546 monthly
              </div>
            </div>
            <div className="quote-tiles3b">
              <div className="quote-tiles3ba">
                29,612 annually
              </div>
            </div>
          </div>

        </div>}
      </Container>
    );
  }
}

export default QuoteGeneration;
