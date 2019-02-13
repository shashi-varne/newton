import React, { Component } from 'react';

import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import { numDifferentiation } from 'utils/validators';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import pincode from 'assets/address_details_icon.svg';
import pincode_myway from 'assets/address_details_icn.svg';
import { validateNumber } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { getConfig } from 'utils/functions';

class Pincode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      pincode: '',
      pincode_error: '',
      openDialogOtherProvider: false,
      city: '',
      state: '',
      image: '',
      error: '',
      provider: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: (qs.parse(props.history.location.search.slice(1)).base_url || '').indexOf("mypro.fisdom.com") >= 0,
      ismyway: (qs.parse(props.history.location.search.slice(1)).base_url || '').indexOf("api.mywaywealth.com") >= 0,
    }
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
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
    document.addEventListener('mousedown', this.handleClickOutside);
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'contact'
      })
      const { email, mobile_no, permanent_addr } = res.pfwresponse.result.profile;
      const { image, provider, cover_plan } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        email: email || '',
        mobile_no: mobile_no || '',
        image: image,
        provider: provider,
        'pincode': permanent_addr.pincode,
        cover_plan: cover_plan
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        openDialogOtherProvider: false
      });
    }
  }



  handleChange = () => event => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + '_error']: ''
    });
  };

  async savePincode(pincode, insurance_id) {
    this.setState({ show_loader: true });
    let address = {
      'insurance_app_id': insurance_id,
      'p_addr': {
        'pincode': pincode
      }
    }

    try {
      const res = await Api.post('/api/insurance/profile', address);

      if (res.pfwresponse.status_code === 200) {
        this.setState({ show_loader: false });
        if (this.props.edit) {
          this.navigate('/insurance/summary');
        } else {
          this.navigate('/insurance/summary');
        }

      } else {
        this.setState({ show_loader: false });
        if (res.pfwresponse.result.errors) {
          for (let error of res.pfwresponse.result.errors) {
            if (error.field === 'p_addr') {
              this.setState({ openDialog: true, apiError: error.message });
            }
            this.setState({
              [error.field + '_error']: error.message
            });
          }
        }
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    // if (pincode.length === 6) {
    //   const res = await Api.get('/api/pincode/' + pincode);

    //   if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
    //     this.setState({
    //       city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
    //       state: res.pfwresponse.result[0].state_name
    //     });
    //   } else {
    //     this.setState({
    //       city: '',
    //       state: ''
    //     });
    //   }
    // }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams+ '&resume=' + this.state.params.resume,
      params: {
        disableBack: true
      }
    });
  }

  navigateNew = (pathname, insurance_id) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams + '&resume=' + this.state.params.resume,
      params: {
        disableBack: true
      }
    });
  }

  handleClick = async () => {
    if (!this.state.pincode || this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else {
      try {
        this.setState({ show_loader: true });

        let url = '/api/insurance/ipru/pincode/support?insurance_app_id=' + this.state.params.insurance_id +
          '&pincode=' + this.state.pincode
        const res = await Api.get(url);

        if (res.pfwresponse.status_code === 200) {

          // this.setState({ show_loader: false });
          // this.handlePayment(this.state.params.insurance_id);
          this.savePincode(this.state.pincode, this.state.params.insurance_id);
        } else {
          let error = res.pfwresponse.result.error;
          // this.setState({ show_loader: false });

          this.setState({
            pincode_error: error,
            // show_loader: false
          });

          if (error === 'Pincode is not supported by IPRU') {
            this.checkOtherProvider(this.state.params.insurance_id);
          } else {
            this.setState({ show_loader: false });
          }


        }
      } catch (err) {
        this.setState({
          show_loader: false
        });
        toast('Something went wrong');
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Let's check if ICICI Pru can <b>dispatch insurance</b> to your
        <b> current location</b>.
      </span>
    );
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  async handlePayment(insurance_id) {

    try {
      const res = await Api.get('api/insurance/start/payment/' + insurance_id)

      if (res.pfwresponse && res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result

        this.setState({
          show_loader: true
        });
        let paymentRedirectUrl = encodeURIComponent(
          window.location.protocol + '//' + window.location.host + '/insurance/payment'
        );
        var pgLink = result.payment_link;
        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl;
        window.location.href = pgLink;
        return;

      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }

  async changeProvider(insurance_id) {

    try {
      let data = {
        'old_app_id': this.state.params.insurance_id,
        "quote_id": this.state.otherProvider.id
      };
      const res = await Api.post('/api/insurance/create/hdfc_app/from/ipru', data);

      if (res.pfwresponse.status_code === 200) {

        this.setState({ show_loader: false });
        this.navigateNew('/insurance/additional-info', res.pfwresponse.result.application.id);

      } else {
        let error = res.pfwresponse.result.error;
        this.setState({ show_loader: false });

        this.setState({
          pincode_error: error
        });
        this.setState({ openDialog: true, apiError: error });
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }

  }

  async checkOtherProvider(insurance_id) {

    try {
      let data = {
        'insurance_app_id': this.state.params.insurance_id,
        "provider": "HDFC",
        "change_provider": true
      };
      const res = await Api.post('/api/insurance/quote', data);

      if (res.pfwresponse.status_code === 200) {

        this.setState({
          show_loader: false,

        });

        if (res.pfwresponse.result.errors.length === 0) {
          this.setState({
            openDialogOtherProvider: true,
            otherProvider: res.pfwresponse.result.quotes
          });
        }


      } else {
        let error = res.pfwresponse.result.error;
        this.setState({ show_loader: false });

        this.setState({
          pincode_error: error
        });
        this.setState({ openDialog: true, apiError: error });
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  renderDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderUi() {
    if (!this.state.openDialogOtherProvider) {
      return (
        <Container
          showLoader={this.state.show_loader}
          title="Application Form"
          smallTitle={this.state.provider}
          count={true}
          total={this.state.provider === 'IPRU' ? 5 : 4}
          current={5}
          banner={true}
          bannerText={this.bannerText()}
          handleClick={this.handleClick}
          edit={this.props.edit}
          buttonTitle="Save & Continue"
          logo={this.state.image}
          type={this.state.type}
        >
          <FormControl fullWidth>
            <TitleWithIcon width="14" icon={this.state.type !== 'fisdom' ? pincode_myway : pincode}
              title={(this.props.edit) ? 'Edit Pincode' : 'Pincode'} />

            <div className="InputField">
              <Input
                error={(this.state.pincode_error) ? true : false}
                helperText={this.state.pincode_error}
                type="number"
                icon={location}
                width="40"
                label="Pincode *"
                id="pincode"
                name="pincode"
                value={this.state.pincode}
                onChange={this.handlePincode('pincode')} />
            </div>
          </FormControl>
        </Container>
      )
    }
    return null;
  }

  renderChangeProvide() {
    if (this.state.openDialogOtherProvider) {
      // if (true) {
      return (
        <div style={{ height: '-webkit-fill-available', background: '#919090' }}>
          <div ref={this.setWrapperRef} style={{
            position: 'fixed',
            bottom: 0,
            background: '#fffcfc'
          }}>
            <div style={{
              fontSize: 17,
              padding: 14,
              color: '#574c4c'
            }}>
              ICICI Pru <b>doesn't dispatch insurance</b> to your currnet location,
             go ahead with <b>HDFC Life-</b>
            </div>
            <div className="pincode-footer-img-tile">
              <div className="FooterDefaultLayout">
                <div className="FlexItem1">
                  <img
                    alt=""
                    src={this.state.otherProvider.quote_describer.image}
                    className="FooterImage" />
                </div>
                <div className="FlexItem2 pincode-provider-title">
                  {this.state.otherProvider.quote_json['cover_plan']}
                </div>
              </div>
              <div style={{ margin: '30px 0px 0px 10px' }}>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Cover Amount</div>
                  <div className="pincode-details-tile2">{numDifferentiation(this.state.otherProvider.quote_json['cover_amount'])}</div>
                </div>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Cover Period</div>
                  <div className="pincode-details-tile2">{this.state.otherProvider.term} yrs.</div>
                </div>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Premium frequency</div>
                  <div className="pincode-details-tile2">{this.state.otherProvider.quote_json['payment_frequency']}</div>
                </div>
                <div className="pincode-details-tile">
                  <div className="pincode-details-tile1">Payout</div>
                  <div className="pincode-details-tile2">{this.state.otherProvider.payout_option}</div>
                </div>
              </div>
            </div>
            <div className="pincode-button">
              <div className="FooterDefaultLayout">
                <div className="FlexItem1 pincode-footer-text ">
                  <div style={{ fontWeight: 500 }}>Rs. {this.state.otherProvider.quote_json['premium']}</div>
                  {/* <div style={{ color: '#919090' }}>Save Rs. 1,460</div> */}
                </div>
                <div className="FlexItem2">
                  <Button
                    type={this.state.image}
                    fullWidth={true}
                    variant="raised"
                    size="large"
                    color="default"
                    onClick={() => this.changeProvider(this.state.params.insurance_id)}
                  >Secure My Family</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null;

  }

  render() {
    return (
      <div>
        {this.renderUi()}
        {this.renderChangeProvide()}
        {this.renderDialog()}
      </div>
    );
  }
}

// OutsideAlerter.propTypes = {
//   children: PropTypes.element.isRequired,
// };

export default Pincode;
