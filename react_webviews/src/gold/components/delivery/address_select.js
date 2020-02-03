import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';
import qs from 'qs';
import completed_step from "assets/completed_step.svg";
import {getConfig} from 'utils/functions';

class SelectAddressDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      checked: true,
      indexCheckBox: -1,
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

    // Api.get('/api/mandate/campaign/address/' + this.state.params.key).then(res => {

    //   if (res.pfwresponse.status_code === 200) {

    //     this.setState({
    //       addressData: res.pfwresponse.result,
    //       show_loader: false
    //     })
    //   } else {
    //     this.setState({
    //       show_loader: false,
    //       openDialog: true, apiError: res.pfwresponse.result.error
    //     });
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
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


  handleClick = async () => {

    if (this.state.indexCheckBox === -1) {
      return;
    }

    this.setState({
      show_loader: true
    });
    let selectedAddress = this.state.addressData[this.state.indexCheckBox];

    let res = await Api.get('/api/mandate/campaign/address/confirm'+
      '?address_id=' + selectedAddress.id);

    if (res.pfwresponse.status_code === 200) {

      this.setState({ show_loader: false });
    //   navigate
    } else {
      this.setState({
        show_loader: false,
        openDialog: true, apiError: res.pfwresponse.result.error
      });

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

  editAddress(id) {
    this.props.history.push({
      pathname: '/mandate/edit-address',
      search: 'base_url=' + this.state.params.base_url + '&address_id=' + id + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key
    });
  }

  renderAddress(props, index) {
    return (
      <div className="address-tile" style={{margin: index === 0 ? '10px 0px 20px 0px' : '',
      paddingLeft: index === 0 ? '20px' : '' }} key={index}>
        <div className="user-name">
            {(props.name || '')[0]}
        </div>
        <div className="select-addressline">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className="right-name">{props.name}</div>
                <img style={{width: 14}} src={completed_step} alt="Gold Delivery" />
            </div>
            <div>
              {this.getFullAddress(props)}
            </div>
            <div className="action-buttons">
                <div className="er-button" onClick={() => this.editAddress(props.id)}>Edit</div>
                <div className="er-button">Remove</div>
            </div>
        </div>
      </div >
    )
  }

  renderMainUi() {
    if (true) {
      return (
        <Container
          summarypage={true}
          showLoader={this.state.show_loader}
          title="Select Address"
          handleClick={this.handleClick}
          fullWidthButton={true}
          onlyButton={true}
          buttonTitle="Continue"
          isDisabled={this.state.indexCheckBox === -1 ? true : false}
        >
            <div className="gold-delivery-select-address">
                {this.state.addressData && this.state.addressData.map(this.renderAddress)}
                {this.state.addressData && this.state.addressData.length < 3 &&
                    <div
                    onClick={() => this.navigate('/mandate/add-address')}
                    className="add-new-button">
                    <span style={{background: '#F0F7FF', padding: '4px 9px 4px 9px',
                color: getConfig().secondary, margin: '0 9px 0 0'}}>+</span> Add New Address
                </div>}
            </div>
        </Container >
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderMainUi()}
      </div>
    );
  }
}


export default SelectAddressDelivery;
