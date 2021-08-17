import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import qs from 'qs';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';

class SelectAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      checked: true,
      indexCheckBox: -1,
      openDialogConfirm: false,
      openDialog: false
    }

    this.renderAddress = this.renderAddress.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      disableBack: params ? params.disableBack : false
    })
  }


  componentDidMount() {

    Api.get('/api/mandate/campaign/address/' + this.state.params.key).then(res => {
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          addressData: res.pfwresponse.result,
          show_loader: false
        })
      } else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }
    }).catch(error => {
      this.setState({ show_loader: false });
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key,
    });
  }

  navigateSuccess = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key,
      params: {
        disableBack: true
      }
    });
  }

  handleChange = (index) => event => {
    if (event.target.name === 'checked') {
      let changedIndex = index;
      if (this.state.indexCheckBox === changedIndex) {
        changedIndex = -1;
      }
      this.setState({
        [event.target.name]: event.target.checked,
        indexCheckBox: changedIndex
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  handleClose() {
    this.setState({
      openDialogConfirm: false,
      openDialog: false
    })
  }

  handleConfirm = () => {
    this.setState({
      openDialogConfirm: false
    })

    this.handleClick(true);
    return;
  }

  openDialogConfirmModal = () => {

    if (this.state.openDialogConfirm) {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialogConfirm}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span>
                Please make sure that you will be available to collect the courier
             </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ textTransform: 'capitalize' }}
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={() => this.handleConfirm()}
              autoFocus>Yes I'll be available
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;

  }

  handleClick = async () => {

    if (this.state.indexCheckBox === -1) {
      return;
    }

    if (!this.state.openDialogConfirm) {
      this.setState({
        openDialogConfirm: true
      })
      return;

    }
    this.setState({
      show_loader: true,
      openDialogConfirm: false
    });
    let mandateAddress = this.state.addressData[this.state.indexCheckBox];
    // let addressline = {
    //   "pincode": mandateAddress.pincode,
    //   "country": "india",
    //   'addressline1': mandateAddress.addressline1,
    //   'addressline2': mandateAddress.addressline2,
    //   'address_id': mandateAddress.id

    // };

    // let res = await Api.post('/api/mandate/campaign/address/' + this.state.params.pc_key, addressline);
    let res = await Api.get('/api/mandate/campaign/address/confirm/' + this.state.params.key +
      '?address_id=' + mandateAddress.id);

    if (res.pfwresponse.status_code === 200) {

      this.setState({ show_loader: false });
      this.navigateSuccess('/mandate/success');
    } else {
      this.setState({
        show_loader: false,
        openDialog: true, apiError: res.pfwresponse.result.error
      });

    }
  }

  bannerText = () => {
    return (
      <span>
        Delivery address for <b>Mandate form</b>
      </span>
    );
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

  editAddress(id) {
    this.props.history.push({
      pathname: '/mandate/edit-address',
      search: 'base_url=' + this.state.params.base_url + '&address_id=' + id + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key
    });
  }

  renderAddress(props, index) {
    return (
      <div key={index} style={{ display: 'flex', margin: '10px 0 20px 0' }}>
        <div >
          <Checkbox
            style={{
              height: 'auto'
            }}
            defaultChecked
            checked={this.state.indexCheckBox === index}
            color="primary"
            value="checked"
            name="checked"
            onChange={this.handleChange(index)}
            className="Checkbox" />

        </div>
        <div className="select-addressline">
          {this.getFullAddress(props)}
        </div>
        <div onClick={() => this.editAddress(props.id)} className="select-edit-button">
          Edit
        </div>
      </div >
    )
  }

  renderMainUi() {
    if (this.state.openDialogConfirm === false) {
      return (
        <Container
          summarypage={true}
          showLoader={this.state.show_loader}
          title="Select Address"
          handleClick={this.handleClick}
          fullWidthButton={true}
          onlyButton={true}
          buttonTitle="Continue"
          banner={true}
          bannerText={this.bannerText()}
          isDisabled={this.state.indexCheckBox === -1 ? true : false}
        >
          {this.state.addressData && this.state.addressData.map(this.renderAddress)}
          {this.state.addressData && this.state.addressData.length < 3 &&
            <div
              style={{color: getConfig().styles.secondaryColor}}
              onClick={() => this.navigate('/mandate/add-address')}
              className="select-add-new-button">
              + Add New Address
        </div>}
        </Container >
      );
    }
    return null;
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
      <div>
        {this.renderMainUi()}
        {this.openDialogConfirmModal()}
        {this.renderResponseDialog()}
      </div>
    );
  }
}


export default SelectAddress;
