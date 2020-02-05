import React, { Component } from 'react';
import Container from '../../common/Container';
// import Api from 'utils/api';
import completed_step from "assets/completed_step.svg";
import { getConfig } from 'utils/functions';
// import toast from '../../../common/ui/Toast';

import ConfirmDialog from '../ui_components/confirm_dialog';
import GoldLivePrice from '../ui_components/live_price';

class SellSelectBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      selectedIndex: -1,
      provider: this.props.match.params.provider,
      openDialogDelete: false,
      openConfirmDialog: false
    }

    this.renderBanks = this.renderBanks.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {

    let confirmDialogData = {
      buttonData: {
        leftTitle: 'Sell gold worth',
        leftSubtitle: '₹1,000',
        leftArrow: 'down',
        provider: 'safegold'
      },
      buttonTitle: "Ok",
      content1: [
        { 'name': 'Making charges', 'value': '₹194.17' },
        { 'name': 'Shipping charges', 'value': 'Free' }
      ],
      content2: [
        { 'name': 'Total', 'value': '₹200.00' }
      ]
    }

    this.setState({
      confirmDialogData: confirmDialogData
    })


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

  getBankData = async () => {
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

    let bank_data = {
      "bank_name": 'ICICI Bank',
      "account_number": "xxxx-8600"
    };

    let bank_data2 = {
        "bank_name": 'ICICI Bank',
        "account_number": "xxxx-8600",
        "status": 'pending'
    };
    this.setState({
      bankData: [bank_data, bank_data, bank_data2],
      show_loader: false
    })
  }


  componentDidMount() {
    this.getBankData();
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

  chooseBank = (index, bank) => {
    if(bank.status === 'pending') {
        return;
    }
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

    let selectedBank = this.state.bankData[this.state.selectedIndex];

    let product = this.state.product;
    product.address = selectedBank;

    product.isFisdomVerified = true; //Assumption: Hardcoding as we are not doing otp verification

    window.localStorage.setItem('goldProduct', JSON.stringify(product));
    this.navigate('gold-delivery-order');
  }

  handleClose() {
    this.setState({
      openDialogDelete: false,
      openConfirmDialog: false
    })
  }

  renderBanks(props, index) {
    return (
      <div onClick={() => this.chooseBank(index, props)}
       className={`bank-tile ${index === this.state.selectedIndex ? 'bank-tile-selected' : ''}`} 
       key={index}
       style={{opacity: props.status === 'pending' ? 0.4 : 1}}
      >
        <div className="left-icon">
            <img style={{ width: '40px', margin: '0 7px 0 0' }}
                                src={require(`assets/ic_health_myway.svg`)} alt="info" 
            />
        </div>
        <div className="select-bank">
          <div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="bank-name">{props.bank_name}</div>

              <div style={{}}>
                {index === 0 &&
                    <span className="primary-bank">PRIMARY</span>}
                {index === this.state.selectedIndex &&
                    <img style={{ width: 9,margin: '4px 0 0 8px',verticalAlign: 'middle' }} src={completed_step} alt="Gold Delivery" />}
              </div>
              
            </div>
            <div className="account-number">
              {props.account_number}
              {props.status === 'pending' && 
              <span> (Verification pending)</span>}
            </div>
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
        title="Select an account"
        handleClick={this.handleClick}
        handleClick2={this.handleClick2}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="Continue"
        disable={this.state.selectedIndex === -1 ? true : false}
        withProvider={true}
        buttonData={{
          leftTitle: 'Sell gold worth',
          leftSubtitle: '₹1,000',
          leftArrow: 'up',
          provider: 'safegold'
        }}
      >
        <div className="common-top-page-subtitle">
            Amount will be credited to selected account
        </div>

        <GoldLivePrice parent={this} />
        <div className="gold-sell-select-bank">
          {this.state.bankData && this.state.bankData.map(this.renderBanks)}
          {this.state.bankData && this.state.bankData.length < 3 &&
            <div
              onClick={() => this.navigate('add-address-delivery')}
              className="add-new-button">
              <span style={{
                background: '#F0F7FF', padding: '4px 9px 4px 9px',
                color: getConfig().secondary, margin: '0 9px 0 0'
              }}>+</span> Add Bank
              </div>}
        </div>
        <ConfirmDialog parent={this} />
      </Container >
    );
  }
}


export default SellSelectBank;
