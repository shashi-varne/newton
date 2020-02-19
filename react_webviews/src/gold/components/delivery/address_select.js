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
import { storageService } from 'utils/validators';
import ConfirmDialog from '../ui_components/confirm_dialog';

class SelectAddressDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      selectedIndex: -1,
      provider: this.props.match.params.provider,
      openDialogDelete: false,
      openConfirmDialog: false,
      product:storageService().getObject('deliveryData') || {}
    }

    this.renderAddress = this.renderAddress.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
  }

  componentWillMount() {
    if (!this.state.product) {
      this.navigate('/gold/delivery-products');
    }
  }

  getAddressData = async () => {
     Api.get('/api/gold/address').then(res => {

      this.setState({ show_loader: false });

      if (res.pfwresponse.status_code === 200) {

        this.setState({
          addressData: res.pfwresponse.result
        })
      } else {
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
          'Something went wrong');
      }
    }).catch(error => {
      this.setState({ show_loader: false });
    });
  }


  componentDidMount() {
    this.getAddressData();
  }

  navigate = (pathname, address_id) => {
    let searchParams = getConfig().searchParams;
    if (address_id) {
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

  handleClick = async () => {

    this.setState({
      openConfirmDialog: false
    })

    if (this.state.selectedIndex === -1) {
      return;
    }

    let selectedAddress = this.state.addressData[this.state.selectedIndex];
    let product = this.state.product;
    product.address = selectedAddress;

    storageService().setObject('deliveryData', product);
    this.navigate('gold-delivery-order');
  }

  handleClose() {
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

  removeAddressDialog(address_id) {
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

    let body = {
      address_id: this.state.address_id_delete,
      changeType: 'delete'
    }
    let res = await Api.post('/api/gold/address', body);
   
    toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
      'Something went wrong');
    if (res.pfwresponse.status_code === 200) {
      this.getAddressData();
    } else {
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

  renderAddress(props, index) {
    return (
      <div className={`address-tile ${index === this.state.selectedIndex ? 'address-tile-selected' : ''}`} key={index}
      >
        <div className="user-name">
          {(props.name || '')[0]}
        </div>
        <div className="select-addressline">
          <div onClick={() => this.chooseAddress(index)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="right-name">{props.name}</div>
              {index === this.state.selectedIndex &&
                <img style={{ width: 14 }} src={completed_step} alt="Gold Delivery" />}
            </div>
            <div>
              {this.getFullAddress(props)}
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
        buttonData={this.state.bottomButtonData}
      >
        <div className="gold-delivery-select-address">
          {this.state.addressData && this.state.addressData.map(this.renderAddress)}
          {this.state.addressData && this.state.addressData.length < 3 &&
            <div
              onClick={() => this.navigate('delivery-add-address')}
              className="add-new-button">
              <span style={{
                background: getConfig().highlight_color, padding: '4px 9px 4px 9px',
                color: getConfig().secondary, margin: '0 9px 0 0'
              }}>+</span> Add New Address
              </div>}
        </div>
        {this.renderDialogDelete()}
        <ConfirmDialog parent={this} />
      </Container >
    );
  }
}


export default SelectAddressDelivery;
