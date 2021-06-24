import React, { Component } from 'react';

import Container from '../common/Container';
import Card from '../common/Card';
import Api from 'utils/api';
import wallet from 'assets/earning_wallet_icon.png';
import gift from 'assets/refer_gift_icon.png';
import diwali_banner from 'assets/diwali_banner.svg';
import hand from 'assets/hand_icon.png';
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
      type: getConfig().productName,
      link: getConfig().appLink,
      campaign_id: 5319998917574656
    }
  }

  async componentDidMount() {
    try {
      await Api.get('/api/referral/v2/getactivecampaign/mine').then(res => {
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
      }).catch(error => {
        this.setState({ show_loader: false });
      });
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

  navigate = (pathname) => {
    if (navigator.onLine) {
      let eventObj = {
        "event_name": "earnings_view",
        "properties": {
          "earnings_value": this.state.total_earnings
        }
      };

      nativeCallback({ events: eventObj });

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

  navigateWithparam = (pathname, param) => {
    let eventObj = {
      "event_name": "TnC_click"
    };

    nativeCallback({ events: eventObj });

    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&mobile=' + this.state.mobile
    });
  }

  shareHandler = () => {
    let message = `Try out ${this.state.type}: a simple app to make smart investments with zero paperwork! Use my referral code ${(this.state.referral_code || '').toUpperCase()}. Click here to download: ${this.state.link}`;
    let eventObj = {
      "event_name": "share_clicked",
      "properties": {
        "where": "home",
        "earnings_value": this.state.total_earnings
      }
    };

    nativeCallback({ action: 'share', message: { message: message }, events: eventObj });
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
        title={'Refer & Earn'}
        background='GreyBackground'
        noFooter={true}
      >
        <div className="Refer pad15">
          <Card nopadding={true}>
            {(this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id) ? <img src={diwali_banner} alt="" /> : <img src={gift} alt="" />}
            <div className={`margin_top ${(this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id) ? 'nomargin' : ''}`} style={{ padding: '15px' }}>
              <h1>{this.state.refer_message_1}</h1>
              <p>
                {this.state.refer_message_2}&nbsp;
                {this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id && <span>(Minimum <strong>₹1000</strong> SIP)</span>}
              </p>
              <div className="Share">
                <p>Share your code</p>
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
                  Share Now
                </Button>
              </div>
            </div>
          </Card>

          <Card nopadding={(!this.state.campaign_expiry_date) ? true : false}>
            <Grid container spacing={24} alignItems="center" className={`ReferPaytmGrid (!this.state.campaign_expiry_date) ? ReferTermsGrid : ''`} onClick={() => this.navigate('/referral/earnings')}>
              <Grid item xs>
                <img src={wallet} alt="" />
              </Grid>
              <Grid item xs={6}>
                <p><span className="blue">Pay</span><span className="blue_light">tm</span> earnings</p>
                <h1><span>₹</span>{this.state.total_earnings}</h1>
              </Grid>
              <Grid item xs>
                <h2 className="view">View</h2>
              </Grid>
            </Grid>
            {
              !this.state.campaign_expiry_date &&
              <div className="terms" onClick={() => this.navigateWithparam('/referral/terms')}>
                *View T&C
              </div>
            }
          </Card>

          {
            this.state.campaign_expiry_date &&
            <Card nopadding={true}>
              <Grid container spacing={24} alignItems="center" className="ReferTermsGrid">
                <Grid item xs={3}>
                  <img src={hand} alt="" />
                </Grid>
                <Grid item xs={9}>
                  {(this.state.type === 'fisdom' && this.state.current_campaign_id === this.state.campaign_id && this.state.campaign_start_date) ? <p>Offer is valid from:</p> : <p>Your friends should invest before</p>}
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
