import React, { Component } from 'react';
import qs from 'qs';
import { getConfig } from 'utils/functions';
import Container from '../common/Container';
import info_icon_fisdom from 'assets/info_icon_fisdom.svg'
import info_icon_myway from 'assets/info_icon_myway.svg'
import trust_icon from 'assets/trust_icons_emandate.svg';
import select_icon from 'assets/completed_step.svg';
import toast from '../../common/ui/Toast';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';


class SelectBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      banks: props.location.state.banks,
      params: qs.parse(props.history.location.search.slice(1)),
      info_icon: getConfig().productName !== 'fisdom' ? info_icon_myway : info_icon_fisdom,
      selected_bank: {}
    }
  }

  componentWillMount() {
    let selected_bank = {}
    let index = 0;
    this.state.banks.map((bank, i) => {
      if (bank.primary) {
        index = i;
        return;
      }
    })
    selected_bank = this.state.banks[index]
    this.setState({
      selected_bank: selected_bank
    })

  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  selectBank = (props) => {
    this.setState({
      selected_bank: props
    })
  }

  renderBanks = (props, index) => {
    return (
      <div key={index} className={`bankcard ${(this.state.selected_bank.account_number === props.account_number) ? 'selected' : ''}`} onClick={() => this.selectBank(props)}>
        <div className="display-flex">
          <img src={props.image} width={40} alt="" />
          <div style={{ marginLeft: '20px', lineHeight: '20px' }}>
            <div>{props.short_name}</div>
            <div>{props.obscured_account_number}</div>
          </div>
        </div>
        <div className="display-flex">
          {props.primary &&
            <div style={{ color: '#cbcacc', fontSize: '12px', marginRight: '10px' }}>PRIMARY</div>
          }
          {this.state.selected_bank.account_number === props.account_number &&
            <img width={15} src={select_icon} alt="checked" />
          }
        </div>
      </div>
    )
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })
    try {
      let bank_data = { selected_bank: this.state.selected_bank };
      const res = await Api.post('/api/mandate/enach/user/banks', bank_data);
      if (res.pfwresponse.result) {
        window.location.href = res.pfwresponse.result.enach_start_url + '/' + this.state.params.key
      }
      else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }


    } catch (err) {
      this.setState({
        show_loader: false
      })
      toast("Something went wrong");
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select bank"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="AUTHORISE E-MANDATE"
      >
        <div className="infocard">
          <div className="title">
            Select bank account
        </div>

          <div style={{ marginTop: '15px' }} className="highlight-text highlight-color-info">
            <div className="highlight-text1">
              <img className="highlight-text11" src={this.state.info_icon} />
              <div className="highlight-text12">
                NOTE
        </div>
            </div>
            <div className="highlight-text2">
              This is only for future SIP payments. No amount will be deducted now
      </div>
          </div>
        </div>
        {this.state.banks.map(this.renderBanks)}
        <div style={{ textAlign: 'center', margin: '100px 0 25px 0' }}>
          <div style={{ color: '#636363', marginBottom: '10px' }}>e-mandate powered by</div>
          <img width={'75%'} src={trust_icon} alt="NACH" />
        </div>
      </Container >
    );
  }
}

export default SelectBank;
