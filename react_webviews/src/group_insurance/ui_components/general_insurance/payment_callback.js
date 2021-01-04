import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import failed_fisdom from 'assets/error_illustration_fisdom.svg';
import failed_myway from 'assets/error_illustration_myway.svg';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../../common/ui/Toast';
import { insuranceStateMapper } from '../../constants';
import Api from 'utils/api';

class PaymentCallbackClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skelton: false,
      failed_icon: getConfig().productName !== 'fisdom' ? failed_myway : failed_fisdom,
    };
  }

  componentWillMount() {

    let lead_id = window.sessionStorage.getItem('group_insurance_lead_id_selected');
    let group_insurance_payment_urlsafe = window.sessionStorage.getItem('group_insurance_payment_urlsafe');
    
    this.setState({
      lead_id: lead_id || '',
      group_insurance_payment_urlsafe: group_insurance_payment_urlsafe || ''
    })

  }

  async componentDidMount(){

    if (!this.state.group_insurance_payment_urlsafe) {
        this.navigate('/group-insurance');
        return;
    }
    try {
        this.setState({
          skelton: true
        })
        let res;
        res = await Api.get('api/ins_service/api/insurance/bhartiaxa/confirm/payment/' + this.state.group_insurance_payment_urlsafe)
        
        this.setState({
            skelton: false
        })
        if (res.pfwresponse.status_code === 200) {
            
            if(res.pfwresponse.result.payment_status === 'success') {
                this.navigate('payment-success');
            }
        } else {
          this.setState({
            skelton: false
          })
          toast(res.pfwresponse.result.error || res.pfwresponse.result.message
            || 'Something went wrong');
        }
  
      } catch (err) {
        toast('Something went wrong');
      }
  }

  async handleClick() {

    try {
      this.setState({
        show_loader: 'button'
      })
      let res2;
      res2 = await Api.get('api/ins_service/api/insurance/bhartiaxa/start/payment?lead_id=' + this.state.lead_id)

      
      if (res2.pfwresponse.status_code === 200) {

        let current_url =  window.location.origin + '/group-insurance/' + 
        insuranceStateMapper[this.props.parent.state.product_key] + '/summary' + getConfig().searchParams

        let nativeRedirectUrl = current_url;

        let paymentRedirectUrl = encodeURIComponent(
          window.location.origin + '/group-insurance/' + insuranceStateMapper[this.props.parent.state.product_key] + '/payment'
        );

        var payment_link = res2.pfwresponse.result.payment_link;
        var pgLink = payment_link;
        let app = getConfig().app;
        var back_url = encodeURIComponent(current_url);
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl +
          '&app=' + app + '&back_url=' + back_url;
        if (getConfig().generic_callback) {
          pgLink += '&generic_callback=' + getConfig().generic_callback;
        }
        this.sendEvents('next');

        window.sessionStorage.setItem('group_insurance_payment_url', pgLink);
        window.sessionStorage.setItem('group_insurance_payment_urlsafe', res2.pfwresponse.result.insurance_payment_urlsafe || '');
        window.sessionStorage.setItem('group_insurance_payment_started', true);

        if (getConfig().app === 'ios') {
          nativeCallback({
            action: 'show_top_bar', message: {
              title: 'Payment'
            }
          });
        }
        
        nativeCallback({
          action: 'take_control', message: {
            back_url: nativeRedirectUrl,
            back_text: 'Are you sure you want to exit the payment process?'
          }
        });

        window.location.href = pgLink;

      } else {
        this.setState({
          show_loader: false
        })
        toast(res2.pfwresponse.result.error || res2.pfwresponse.result.message
          || 'Something went wrong');
      }

    } catch (err) {
      toast('Something went wrong');
    }
  }


  navigate = (pathname) => {
    this.props.parent.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'late_confirm_failure'
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
        fullWidthButton={true}
        buttonTitle='Make new payment'
        onlyButton={true}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        handleClick={() => this.handleClick()}
        title="Payment Failed"
        classOverRideContainer="payment-failed"
      >
        <div>
          <div className="payment-failed-icon"><img src={this.state.failed_icon} alt="" /></div>
          <div className="payment-failed-title">Sorry, your payment has been failed</div>
          <div className="payment-failed-subtitle">Any amount if debited from the bank account will get refunded within 5-7 days. Please try again to get policy.</div>
        </div>
      </Container>
    );
  }
}

const PaymentCallback = (props) => (
  <PaymentCallbackClass
    {...props} />
);

export default PaymentCallback;