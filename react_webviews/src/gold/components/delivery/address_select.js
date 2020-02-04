import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import completed_step from "assets/completed_step.svg";
import {getConfig} from 'utils/functions';
import toast from '../../../common/ui/Toast';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import { WithProviderLayout } from '../../common/footer/layout';


class SelectAddressDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      selectedIndex: -1,
      provider: this.props.match.params.provider,
      openDialogDelete: false,
      openConfirmDialog: false
    }

    this.renderAddress = this.renderAddress.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
  }

  componentWillMount() {
    let product = {};
    if (window.localStorage.getItem('goldProduct')) {
      product = JSON.parse(window.localStorage.getItem('goldProduct'));
    } else {
      this.navigate('my-gold-locker');
    }
    this.setState({
      product: product
    })
  }

  getAddressData = async () => {
    //  Api.get('/api/mandate/campaign/address/' + this.state.params.key).then(res => {

    //   this.setState({ show_loader: false });

    //   if (res.pfwresponse.status_code === 200) {

    //     this.setState({
    //       addressData: res.pfwresponse.result
    //     })
    //   } else {
    //     toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
    //       'Something went wrong');
    //   }
    // }).catch(error => {
    //   this.setState({ show_loader: false });
    // });

    let addressline = {
      "pincode": '560046',
      "country": "india",
      'addressline1': "Aajdbvhjdbjvd",
      'addressline2': "vbvhd hdhdv hdhdh",
      "name": "vinod jat",
      "mobile_number": "8271961955"
    };
    this.setState({
        addressData: [addressline, addressline],
        show_loader: false
    })
  }


  componentDidMount() {
    this.getAddressData();
  }

  navigate = (pathname, address_id) => {
    let searchParams = getConfig().searchParams;
    if(address_id) {
      searchParams += '&address_id=' + address_id;
    }

    this.props.history.push({
      pathname: pathname,
      search: searchParams,
    });
  }

  chooseAddress = (index) => {
    this.setState({
      selectedIndex: index
    })
  }

  verifyMobile = async () => {
    this.setState({
      show_loader: true
    });

    let options = {
      mobile_number: this.state.userInfo.mobile_no,
    }
    try {
      const res = await Api.post('/api/gold/user/verify/delivery/mobilenumber', options);
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
        });

        let result = res.pfwresponse.result;
        if (result.resend_verification_otp_link !== '' && result.verification_link !== '') {
          window.localStorage.setItem('fromType', 'delivery')
          var message = 'An OTP is sent to your mobile number ' + this.state.userInfo.mobile_no + ', please verify to place delivery order.'
          this.props.history.push({
            pathname: 'verify',
            search: getConfig().searchParams,
            params: {
              resend_link: result.resend_verification_otp_link,
              verify_link: result.verification_link,
              message: message, fromType: 'delivery'
            }
          });
          toast(message);
        }
      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong', 'error');
    }
  }


  handleClick = async () => {

    if (this.state.selectedIndex === -1) {
      return;
    }

    let selectedAddress = this.state.addressData[this.state.selectedIndex];

    let product = this.state.product;
    product.address = selectedAddress;

    product.isFisdomVerified = true; //Assumption: Hardcoding as we are not doing otp verification

    window.localStorage.setItem('goldProduct', JSON.stringify(product));
    this.navigate('gold-delivery-order');
  }

  handleClose () {
    this.setState({
      openDialogDelete: false,
      openConfirmDialog: false
    })
  }

  renderDialogDelete = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialogDelete}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            CANCEL
          </Button>
          <Button onClick={this.removeAddress} color="secondary" autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  removeAddressDialog (address_id){
    // if (!address_id) {
    //   return;
    // }

    this.setState({
      address_id_delete: address_id,
      openDialogDelete: true
    })
  }

  async removeAddress() {

    this.setState({
      show_loader: true,
      openDialogDelete: false
    });

    let res = await Api.get('/api/mandate/campaign/address/confirm'+
      '?address_id=' + this.state.address_id_delete);

    this.setState({ show_loader: false });
    if (res.pfwresponse.status_code === 200) {
     
      this.getAddressData();
    } else {
      toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
        'Something went wrong');
    }
  }

  getFullAddress(address) {
    let addressline = '';
    if (address.addressline1) {
      addressline += address.addressline1;
    }

    if (address.addressline2) {
      addressline += ', ' + address.addressline2;
    }

    if (address.city) {
      addressline += ', ' + address.city;
    }

    if (address.state) {
      addressline += ', ' + address.state;
    }

    if (address.pincode) {
      addressline += '- ' + address.pincode;
    }

    return addressline;
  }

  renderAddress(props, index) {
    return (
      <div className={`address-tile ${index === this.state.selectedIndex ? 'address-tile-selected': ''}`} key={index}
      >
        <div className="user-name">
            {(props.name || '')[0]}
        </div>
        <div className="select-addressline">
            <div onClick={() => this.chooseAddress(index)}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div className="right-name">{props.name}</div>
                  {index === this.state.selectedIndex && 
                  <img style={{width: 14}} src={completed_step} alt="Gold Delivery" />}
              </div>
              <div>
                {this.getFullAddress(props)}
              </div>
            </div>
            <div className="action-buttons">
                <div className="er-button" onClick={() => this.navigate('edit-address-delivery', props.id)}>Edit</div>
                <div className="er-button" onClick={() => this.removeAddressDialog(props.id)}>Remove</div>
            </div>
        </div>
      </div >
    )
  }

  renderConfirmDialog = () => {
    return (
      <Dialog
        id="bottom-popup"
        open={this.state.openConfirmDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="gold-dialog" id="alert-dialog-description">
            <div className="mid-buttons">
              <WithProviderLayout type="default"
                 handleClick2={this.handleClose}
                 handleClick={this.handleClick}
                 buttonTitle="Continue"
                 buttonData= {{
                   leftTitle: 'Buy gold worth',
                   leftSubtitle: '₹1,000',
                   leftArrow: 'down',
                   provider: 'safegold'
                 }}
              />
            </div>

            <div className="hr"></div>

            <div className="content">
                 <div className="content-points">
                    <div className="content-points-inside-text">
                    Making charges
                    </div>
                    <div className="content-points-inside-text">
                      ₹194.17
                    </div>
                 </div>

                 <div className="content-points">
                    <div className="content-points-inside-text">
                    Shipping charges
                    </div>
                    <div className="content-points-inside-text">
                   Free
                    </div>
                 </div>
            </div>

            <div className="hr"></div>

            <div className="content2">
                 <div className="content2-points">
                    <div className="content2-points-inside-text">
                      Total
                    </div>
                    <div className="content2-points-inside-text">
                      ₹200.00
                    </div>
                 </div>
            </div>

            <div className="hr"></div>
          </div>
        </DialogContent>
      </Dialog >
    );

}

handleClick2 = () => {
  if(this.state.selectedIndex === -1) {
    return;
  }
  this.setState({
    openConfirmDialog: true
  })
}


  render() {
    return (
      <Container
        summarypage={true}
        showLoader={this.state.show_loader}
        title="Select Address"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="Continue"
        disable={this.state.selectedIndex === -1 ? true : false}
        withProvider={true}
        buttonData= {{
          leftTitle: '0.5g Lotus…',
          leftSubtitle: '₹1,000',
          leftArrow: 'up',
          provider: 'safegold'
        }}
      >
          <div className="gold-delivery-select-address">
              {this.state.addressData && this.state.addressData.map(this.renderAddress)}
              {this.state.addressData && this.state.addressData.length < 3 &&
                  <div
                  onClick={() => this.navigate('add-address-delivery')}
                  className="add-new-button">
                  <span style={{background: '#F0F7FF', padding: '4px 9px 4px 9px',
              color: getConfig().secondary, margin: '0 9px 0 0'}}>+</span> Add New Address
              </div>}
          </div>
          {this.renderDialogDelete()}
          {this.renderConfirmDialog()}
      </Container >
    );
  }
}


export default SelectAddressDelivery;
