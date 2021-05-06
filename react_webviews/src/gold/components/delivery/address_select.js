import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import completed_step from "assets/completed_step.svg";
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { storageService, inrFormatDecimal2 } from 'utils/validators';
import ConfirmDialog from '../ui_components/confirm_dialog';
import GoldOnloadAndTimer from '../ui_components/onload_and_timer';
import { nativeCallback } from 'utils/native_callback';

class SelectAddressDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      provider: this.props.match.params.provider,
      openDialogDelete: false,
      openConfirmDialog: false,
      product:storageService().getObject('deliveryData') || {},
      orderType: 'delivery'
    }
  }

   // common code start
   onload = () => {
    this.setState({
      openOnloadModal: false
    })
    this.setState({
      openOnloadModal: true
    })
  }

  updateParent(key, value) {

    this.setState({
      [key]: value
    })
  }

  componentWillMount() {
    if (!this.state.product) {
      this.navigate('/gold/delivery-products');
    }
  }

  getAddressData = async () => {
    this.setState({
      selectedIndex: 0
    })
     Api.get('/api/gold/address').then(res => {

      this.setState({ skelton: false, show_loader: false });

      if (res.pfwresponse.status_code === 200) {

        this.setState({
          addressData: res.pfwresponse.result
        })
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    }).catch(error => {
      this.setState({ skelton: false, show_loader: false });
    });
  }


  componentDidMount() {
    this.getAddressData();
    this.onload();
    let bottomButtonData = {
      leftTitle: this.state.product.description,
      leftSubtitle: inrFormatDecimal2(this.state.product.delivery_minting_cost),
      leftArrow: 'up',
      provider: this.state.provider
    }

    this.setState({
      bottomButtonData: bottomButtonData
    })
  }

  navigate = (pathname, address_id) => {
    let searchParams = getConfig().searchParams;
    if (address_id) {
      this.sendEvents('next', {address_change : 'edit'})
      searchParams += '&address_id=' + address_id;
    }

    if(pathname === 'delivery-add-address') {
      this.sendEvents('next', {address_change : 'add'});
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

  handleClick = async () => {

    this.handleClose();
    this.sendEvents('next');
    if (this.state.selectedIndex === -1 || !this.state.addressData) {
      return;
    }

    if(this.state.selectedIndex >=0 && !this.state.addressData[this.state.selectedIndex]) {
      return;
    }

    let selectedAddress = this.state.addressData[this.state.selectedIndex];
    let product = this.state.product;
    product.address = selectedAddress;

    storageService().setObject('deliveryData', product);
    this.navigate('gold-delivery-order');
  }

  handleClose = () => {
    this.setState({
      openConfirmDialog: false,
      openDialogDelete: false
    });

    if(this.state.openPriceChangedDialog && this.state.timeAvailable >0) {
      this.setState({
        openPriceChangedDialog: false
      })
    }
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

  removeAddressDialog = (address_id) => {

    this.sendEvents('next', {address_change : 'remove'});
    if (!address_id) {
      return;
    }

    this.setState({
      address_id_delete: address_id,
      openDialogDelete: true
    })
  }

  removeAddress = async() =>{

    this.setState({
      show_loader: true,
      openDialogDelete: false
    });

    let body = {
      address_id: this.state.address_id_delete,
      changeType: 'delete'
    }
    let res = await Api.post('/api/gold/address', body);

    if (res.pfwresponse.status_code === 200) {
      this.getAddressData();
    } else {
      toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
        'Something went wrong');
      this.setState({ show_loader: false });
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

  renderAddress = (props, index) => {
    return (
      <div className={`address-tile ${index === this.state.selectedIndex ? 'address-tile-selected' : ''}`} key={index}
      >
        <div className="user-name">
          {(props.name || '')[0]}
        </div>
        <div className="select-addressline">
          <div onClick={() => this.chooseAddress(index)}>
            <div style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'baseline' }}>
              <div>
                  <div>
                    <div className="right-name">{props.name}</div>
                    
                  </div>
                  <div className="address-content">
                  {props.addressline1}, {props.addressline2} 
                  , {props.city}
                  </div>
                  <div className="address-content">
                    {props.state} - {props.pincode}
                  </div>
                  <div className="address-content">
                    Mobile: {props.mobile_number}
                  </div>
                </div>
              {index === this.state.selectedIndex &&
                  <img style={{ width: 14 }} src={completed_step} alt="Gold Delivery" />}
            </div>
          </div>
          <div className="action-buttons">
            <div className="er-button" onClick={() => this.navigate('delivery-edit-address', props.id)}>Edit</div>
            <div className="er-button" onClick={() => this.removeAddressDialog(props.id)}>Remove</div>
          </div>
        </div>
      </div >
    )
  }

  handleClick2 = () => {
    if (this.state.selectedIndex === -1) {
      return;
    }
    this.setState({
      openConfirmDialog: true,
      price_summary_clicked: true
    })
  }

  sendEvents(user_action, data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'select_adress',
        'address_change': data.address_change ? data.address_change : '',
        "price_summary_clicked": this.state.price_summary_clicked ? 'yes' : 'no',
        "timeout_alert": this.state.timeout_alert_event ? 'yes' : 'no',
        "refresh_price": this.state.refresh_price_event ? 'yes' : 'no'
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
        summarypage={true}
        showLoader={this.state.show_loader}
        skelton={this.state.skelton}
        title="Select address"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="CONTINUE"
        disable={(this.state.selectedIndex === -1 || (!this.state.addressData ||
          !this.state.addressData.length)) ? true : false}
        withProvider={true}
        buttonData={this.state.bottomButtonData}
        events={this.sendEvents('just_set_events')}
      >
        <div className="gold-delivery-select-address">
          {this.state.addressData && this.state.addressData.map(this.renderAddress)}
          {this.state.addressData && this.state.addressData.length < 3 &&
            <div
              onClick={() => this.navigate('delivery-add-address')}
              className="add-new-button">
              <span style={{
                background: getConfig().styles.highlightColor, padding: '4px 9px 4px 9px',
                color: getConfig().styles.secondaryColor, margin: '0 7px 0 0'
              }}>+</span> Add New Address
              </div>}
        </div>
        {this.renderDialogDelete()}
        <ConfirmDialog parent={this} />

        {this.state.openOnloadModal && 
        <GoldOnloadAndTimer parent={this} />}
      </Container >
    );
  }
}


export default SelectAddressDelivery;
