import React, { Component } from 'react';

import Container from '../common/Container';
import Card from '../common/Card';
import Api from 'utils/api';
import wallet from 'assets/wallet_icon.svg';
import gift from 'assets/refer_gift_icon.png';
import diwali_banner from 'assets/diwali_banner.svg';
import Button from 'material-ui/Button';
import Grid from '@material-ui/core/Grid';
import { nativeCallback } from 'utils/native_callback';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from '../../utils/functions';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      amount_per_referral: 0,
      campaign_expiry_date: '',
      campaign_start_date: '',
      refer_message_1: '',
      refer_message_2: '',
      referral_code: '',
      current_campaign_id: '',
      mobile: '',
      total_earnings: 0.00,
      openDialog: false,
      active_campaign: true,
      type: getConfig().productName,
      link: getConfig().appLink,
      campaign_id: 5319998917574656
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/referral/v2/getactivecampaign/mine');
      if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 200) {
        const { amount_per_referral, campaign_expiry_date, refer_message_1, refer_message_2, referral_code, mobile, total_earnings, current_campaign_id, campaign_start_date } = res.pfwresponse.result;
        this.setState({
          show_loader: false,
          amount_per_referral,
          campaign_expiry_date,
          refer_message_1,
          refer_message_2,
          referral_code,
          mobile,
          total_earnings,
          current_campaign_id,
          campaign_start_date
        });
      } else if (res.pfwstatus_code === 200 && res.pfwresponse.status_code === 400) {
        this.setState({
          show_loader: false,
          active_campaign: false,
          refer_message_1: 'Sharing is caring',
          refer_message_2: 'Invite your family & friends to start their investment journey on Finity'
        });

      } else {
        this.setState({ show_loader: false });
      }
    } catch (error) {
      this.setState({ show_loader: false });
    }
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  sendEvents(user_action, tncClicked) {
    let eventObj = {
      event_name: "refer_earn",
      event_category: "refer_earn",
      properties: {
        user_action: user_action,
        event_name: "refer_earn",
        screen_name: "refer_and_earn",
        tnc_clicked: tncClicked ? "yes" : "no",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  navigate = (pathname) => {
    if (navigator.onLine) {
      this.sendEvents("next");
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams
      });
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  navigateWithparam = (pathname) => {
    this.sendEvents("next", true)

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&mobile=' + this.state.mobile
    });
  }

  shareHandler = () => {
    let message = `Try out ${this.state.type}: a simple app to make smart investments with zero paperwork! Use my referral code ${(this.state.referral_code || '').toUpperCase()}. Click here to download: ${this.state.link}`;

    this.sendEvents("share")

    if (getConfig().Android) {
      message = `Try out ${this.state.type}: a simple app to make smart investments with zero paperwork! Use my referral code ${(this.state.referral_code || '').toUpperCase()}. Click here to download:`
      let url = `${getConfig().actionUrl}?action_type=native&native_module=app%2Frefer_via_apps&message=${message}`
      nativeCallback({ action: 'open_module', message: { action_url: url } });
    }

    if (getConfig().iOS) {
      nativeCallback({ action: 'share', message: { message: message } });
    }
  }

  getExpiryDate = () => {
    if (this.state.campaign_start_date) {
      let d = new Date(this.state.campaign_start_date);
      return <h3>{d.getDate()} - {this.state.campaign_expiry_date}</h3>
    } else {
      return <h3>{this.state.campaign_expiry_date}</h3>
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={'Refer and Earn'}
        background='GreyBackground'
        noFooter={true}
        events={this.sendEvents("just_set_events")}
      >
        <div className="Refer">
          <Card nopadding={true}>
            {(this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id) ? <img src={diwali_banner} alt="" /> : <img src={gift} alt="" />}
            <div className={`margin_top ${(this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id) ? 'nomargin' : ''}`} style={{ padding: '15px' }}>
              <h1>{this.state.refer_message_1}</h1>
              <p>
                {this.state.refer_message_2}&nbsp;
                {this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id && <span>(Minimum <strong>₹1000</strong> SIP)</span>}
              </p>
              <div className="Share">
                <p>REFERRAL CODE</p>
                <h2>{this.state.referral_code}</h2>
              </div>
              <div className="ShareButton">
                <Button
                  disableRipple={true}
                  disableFocusRipple={true}
                  fullWidth={true}
                  variant="raised"
                  size="large"
                  color="secondary"
                  onClick={this.shareHandler} >
                  REFER NOW
                </Button>
              </div>
            </div>
          </Card>
          {this.state.active_campaign &&
            <Card nopadding={true}>
              <Grid container spacing={24} alignItems="center" className={`ReferPaytmGrid (!this.state.campaign_expiry_date) ? ReferTermsGrid : ''`} onClick={() => this.navigate('/referral/earnings')}>
                <Grid item xs>
                  <img src={wallet} alt="" />
                </Grid>
                <Grid item xs={6}>
                  <p><span className="blue">Pay</span><span className="blue_light">tm</span> earnings</p>
                  <h1><span>₹</span>{this.state.total_earnings}</h1>
                </Grid>
                <Grid item xs>
                  <h2 className="view">VIEW</h2>
                </Grid>
              </Grid>
              {
                !this.state.campaign_expiry_date &&
                <div className="terms" onClick={() => this.navigateWithparam('/referral/terms')}>
                  *View T&C
                </div>
              }
            </Card>
          }

          {
            (this.state.campaign_expiry_date && this.state.active_campaign) &&
            <Card nopadding={true}>
              <Grid container spacing={24} alignItems="center" className="ReferTermsGrid">
                <Grid item xs={3}>
                  <img src={require(`assets/${this.state.type}/hand.svg`)} alt="" />
                </Grid>
                <Grid item xs={9}>
                  {(this.state.current_campaign_id === this.state.campaign_id && this.state.campaign_start_date) ? <p>Offer is valid from:</p> : <p>Your friends should invest before</p>}
                  {this.getExpiryDate()}
                </Grid>
              </Grid>
              <div className="terms" onClick={() => this.navigateWithparam('/referral/terms')}>
                *View T&C
              </div>
            </Card>
          }
        </div>
        {this.renderDialog()}
      </Container>
    );
  }
}

export default Details;
