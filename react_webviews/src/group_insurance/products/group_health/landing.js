import React, { Component } from 'react';
import Container from '../../common/Container';

// import Api from 'utils/api';
// import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../constants';
import HowToSteps from '../../../common/ui/HowToSteps';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //   show_loader: true,
      productName: getConfig().productName,
      provider: 'HDFC_ERGO',
      checked: true
    }
  }

  componentWillMount() {
   

    let stepsContentMapper = {
      title: 'Why buy on ' + this.state.productName + '??',
      options: [
        { 'icon': 'ic_gold_provider', 'title': 'No document required', 'subtitle': 'Easy and paperless process' },
        { 'icon': 'ic_make_payment', 'title': 'Complete assistance', 'subtitle': 'Our experts will help in purchase and claim of policy' },
        { 'icon': 'deliver', 'title': 'Secure payment', 'subtitle': 'Smooth and secure online payment process via razorpay' }
      ]
    }

    this.setState({
      providerData: health_providers[this.state.provider],
      stepsContentMapper: stepsContentMapper
    })
  }


  async componentDidMount() {

    // try {
    //   const res = await Api.get('/api/ins_service/api/insurance/application/summary')

    //   this.setState ({
    //       show_loader: false
    //   });
    //   var resultData = res.pfwresponse.result;
    //   if (res.pfwresponse.status_code === 200) {

    //     this.setState({
    //       resultData: resultData
    //     })


    //   } else {
    //     toast(resultData.error || resultData.message
    //       || 'Something went wrong');
    //   }
    // } catch (err) {
    //   console.log(err)
    //   this.setState({
    //     show_loader: false
    //   });
    //   toast('Something went wrong');
    // }
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

  render() {


    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title={this.state.providerData.title}
        fullWidthButton={true}
        buttonTitle="Get insured"
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
        <div className="common-top-page-subtitle-dark">
          {this.state.providerData.subtitle}
        </div>

        <div className="group-health-landing">

          <div className="generic-page-title">
          Coverage for all
          </div>
          <div className="generic-page-subtitle">
          Option to cover your entire family (spouse, kids and parents)
          </div>

          <div className='family-images'>
          <img className="accident-plan-read-icon" 
            src={require(`assets/${this.state.productName}/icn_couple.svg`)}  alt="" />
            <img className="accident-plan-read-icon" 
            src={require(`assets/${this.state.productName}/icn_kids.svg`)}  alt="" />
            <img className="accident-plan-read-icon" 
            src={require(`assets/${this.state.productName}/icn_parents.svg`)}  alt="" />
          </div>

          <div className="generic-page-title">
          Overview
          </div>

          <div className="generic-page-title">
          Why to have health insurance?
          </div>

          <HowToSteps baseData={this.state.stepsContentMapper} />

          <div className="accident-plan-read" style={{padding:0}}
            onClick={() => this.openInBrowser(this.state.quoteData.read_document, 'read_document')}>
            <img className="accident-plan-read-icon" 
            src={require(`assets/${this.state.productName}/ic_read.svg`)}  alt="" />
            <div className="accident-plan-read-text" style={{ color: getConfig().primary }}>Read Detailed Document</div>
          </div>
          <div className="CheckBlock2 accident-plan-terms" style={{padding:0}}>
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