import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import contact from 'assets/address_details_icon.svg';
import contact_finity from 'assets/address_icon_myway.svg';

import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import location from 'assets/location_dark_icn.png';
import Api from 'utils/api';
import { validateNumber, validateLength, validateMinChar, validateConsecutiveChar, validateEmpty } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { getConfig } from '../../../utils/functions';

class AddEditAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialogReset: false,
      pincode: '',
      pincode_error: '',
      addressline1: '',
      addressline1_error: '',
      addressline2: '',
      addressline2_error: '',
      city: '',
      state: '',
      checked: true,
      error: '',
      apiError: '',
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
    }
  }

  componentDidMount() {

    if (this.props.edit) {
      if (this.state.params.address_id) {
        Api.get('/api/mandate/campaign/address/' + this.state.params.key + '?address_id=' + this.state.params.address_id).then(res => {
          if (res.pfwresponse.result) {
            let address = res.pfwresponse.result[0];
            this.setState({
              show_loader: false,
              pincode: address.pincode || '',
              addressline1: address.addressline1 || '',
              addressline2: address.addressline2 || '',
              city: address.city || '',
              state: address.state || '',
            });
          }
          else {
            this.setState({
              show_loader: false,
              openDialog: true, apiError: res.pfwresponse.result.error
            });
          }


        }).catch(error => {
          this.setState({ show_loader: false });
        });
      } else {
        this.setState({ show_loader: false });
      }
    } else {
      this.setState({ show_loader: false });
    }

  }

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  handlePincode = name => async (event) => {
    const pincode = event.target.value;

    this.setState({
      [name]: pincode,
      [name + '_error']: ''
    });

    if (pincode.length === 6) {
      const res = await Api.get('/api/pincode/' + pincode);

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.length > 0) {
        if (name === 'pincode') {
          this.setState({
            city: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            state: res.pfwresponse.result[0].state_name
          });
        } else {
          this.setState({
            ccity: res.pfwresponse.result[0].taluk || res.pfwresponse.result[0].district_name,
            cstate: res.pfwresponse.result[0].state_name
          });
        }
      } else {
        this.setState({
          city: '',
          state: '',
          ccity: '',
          cstate: ''
        });
      }
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key
    });
  }

  handleClick = async () => {
    if (this.state.pincode.length !== 6 || !validateNumber(this.state.pincode)) {
      this.setState({
        pincode_error: 'Please enter valid pincode'
      });
    } else if (!validateEmpty(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Enter your address'
      });
    } else if (!validateConsecutiveChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLength(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Maximum length of address is 30'
      });
    } else if (!validateMinChar(this.state.addressline1)) {
      this.setState({
        addressline1_error: 'Address should contain minimum two characters'
      });
    } else if (!validateEmpty(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Enter your street and locality'
      });
    } else if (!validateConsecutiveChar(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Address can not contain more than 3 same consecutive characters'
      });
    } else if (!validateLength(this.state.addressline2)) {
      this.setState({
        addressline2_error: 'Maximum length of address is 30'
      });
    } else {
      this.setState({ show_loader: true });
      let addressline = {
        "pincode": this.state.pincode,
        "country": "india",
        'addressline1': this.state.addressline1,
        'addressline2': this.state.addressline2,

      };

      let res;
      if (this.props.edit) {
        addressline.address_id = this.state.params.address_id;
        res = await Api.put('/api/mandate/campaign/address/' + this.state.params.key, addressline);
      } else {
        res = await Api.post('/api/mandate/campaign/address/' + this.state.params.key, addressline);
      }

      if (res.pfwresponse.status_code === 200) {


        this.setState({ show_loader: false });
        this.navigate('/mandate/select-address');
      } else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }
    }
  }

  bannerText = () => {
    return (
      <span>
        Delivery address for <b>Mandate Form</b>
      </span>
    );
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openDialogReset: false
    });
  }

  handleReset = async () => {
    this.setState({
      openResponseDialog: false,
      show_loader: true,
      apiError: '', openDialog: false, openDialogReset: false,
      openModalMessage: 'Wait a moment while we reset your application'
    });
    const res = await Api.delete('/api/mandate/campaign/address/' + this.state.params.key + '?address_id=' + this.state.params.address_id);
    if (res.pfwresponse.status_code === 200) {
      // this.setState({ openModal: false });
      this.navigate('/mandate/select-address');
    } else {
      this.setState({ openModal: false, openModalMessage: '', openResponseDialog: true, apiError: res.pfwresponse.result.error });
    }
  }

  showDialog = () => {
    this.setState({ openDialogReset: true });
  }

  showDialog = () => {
    this.setState({ openDialogReset: true });
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialogReset}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure, you want to delete this address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            No
          </Button>
          <Button onClick={this.handleReset} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderResponseDialog = () => {
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
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title={(this.props.edit) ? 'Edit Address' : 'Add New Address'}
        rightIcon={this.props.edit ? 'delete' : ''}
        resetpage={this.props.edit ? true : false}
        handleReset={this.showDialog}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Save Address"
        logo={this.state.image}
      >
        {/* Permanent Address Block */}
        <FormControl fullWidth>
          <TitleWithIcon width="16" icon={ getConfig().productName !== 'fisdom' ?  contact_finity :contact} title="Address Details" />
          <div className="InputField">
            <Input
              error={(this.state.addressline1_error) ? true : false}
              helperText={this.state.addressline1_error}
              type="text"
              id="addressline1"
              label="Address line 1 *"
              name="addressline1"
              placeholder="ex: 16/1 Queens paradise"
              value={this.state.addressline1}
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              error={(this.state.addressline2_error) ? true : false}
              helperText={this.state.addressline2_error}
              type="text"
              id="addressline2"
              label="Address line 2 *"
              name="addressline2"
              placeholder="ex: Curve Road, Shivaji Nagar"
              value={this.state.addressline2}
              onChange={this.handleChange()} />
          </div>
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
          <div className="InputField">
            <Input
              disabled={true}
              id="city"
              label="City *"
              value={this.state.city}
              name="city"
              onChange={this.handleChange()} />
          </div>
          <div className="InputField">
            <Input
              disabled={true}
              id="state"
              label="State *"
              value={this.state.state}
              name="state"
              onChange={this.handleChange()} />
          </div>
        </FormControl>

        {this.renderDialog()}
        {this.renderResponseDialog()}
      </Container >
    );
  }
}

export default AddEditAddress;
