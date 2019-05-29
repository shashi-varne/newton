import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';

import selected_option from 'assets/selected_option.png';
import comver_amount_icon from 'assets/life_cover_icon.png';
import { FormControl } from 'material-ui/Form';
import Input from '../../../common/ui/Input';
import { validateNumber, inrFormatDecimal } from 'utils/validators';

class CoverAmount extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.localStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      selectedIndex: quoteData.selectedIndexCoverAmount || 0,
      // cover_amount: 0,
      coverAmountList: [{
        name: '', value: ''
      }],
      cover_amount_error: '',
      quoteData: quoteData
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location || {};
    console.log(params)
    let annual_income = params && params.annual_income ? params.annual_income : this.state.quoteData.annual_income;
    if (!annual_income) {
      this.navigate('annual-income');
      return;
    }
    this.setState({
      annual_income: annual_income
    })


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
    try {
      const res = await Api.get('/api/insurance/recommend/cover_amount?annual_income=' + this.state.annual_income)
      this.setState({
        show_loader: false
      });
      let result = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200) {
        result.list.push({ name: 'Other' });
        this.setState({
          coverAmountList: result.list,
          min: result.min,
          max: result.max,
          cover_amount_min_max: 'Min ' + inrFormatDecimal(result.min) + ' - Max ' + inrFormatDecimal(result.max)
        });
        for (var i in result.list) {
          if (result.recommendation.name === result.list[i].name) {
            this.setState({
              selectedIndex: i,
              recommendedIndex: i * 1
            })
            this.setValue(i);
          }
        }

      } else {
        toast(result.error || result.message);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  redirectNow() {
    let quoteData = this.state.quoteData;
    quoteData.cover_amount = this.state.coverAmountList[this.state.selectedIndex].value;
    quoteData.selectedIndexCoverAmount = this.state.selectedIndex;
    window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('cover-period')
  }

  handleClick = async () => {

    if (this.state.coverAmountList[this.state.selectedIndex].name === 'Other') {
      if (!this.state.cover_amount) {
        this.setState({
          cover_amount_error: 'Cover Amount cannot be empty'
        });
      } else if ((!validateNumber(this.state.cover_amount) || !this.state.cover_amount)) {
        this.setState({
          cover_amount_error: 'Invalid Cover Amount'
        });
      } else if (this.state.cover_amount < this.state.min) {
        this.setState({
          cover_amount_error: 'Minimum Cover Amount is ' + inrFormatDecimal(this.state.min)
        });
      } else if (this.state.cover_amount > this.state.max) {
        this.setState({
          cover_amount_error: 'Maximum Cover Amount is ' + inrFormatDecimal(this.state.max)
        });
      } else if ((!validateNumber(this.state.cover_amount) || !this.state.cover_amount)) {
        this.setState({
          cover_amount_error: 'Invalid Cover Amount'
        });
      } else {
        this.redirectNow();
      }
    } else {
      this.redirectNow();
    }

  }

  setValue(index) {
    if (this.state.otherIndex === index) {
      return;
    } else {
      this.setState({
        otherIndex: -1
      })
    }
    let cover_amount = this.state.coverAmountList[index].name;
    if (this.state.coverAmountList[index].name === 'Other') {
      cover_amount = '';
      this.setState({
        otherIndex: index
      })
    }
    // eslint-disable-next-line
    index = parseInt(index);
    this.setState({
      selectedIndex: index,
      cover_amount: cover_amount,
      name: this.state.coverAmountList[index].name
    })
  }

  renderPopUp() {
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value.replace(/,/g, ""),
      [name + '_error']: ''
    });
  };

  handleKeyChange = name => event => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      // valid
    } else {
      // invalid
      event.preventDefault();
    }
  }

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.setValue(index)}
        style={{ height: 'auto' }}
        className={'ins-row-scroll' + (this.state.selectedIndex === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedIndex !== index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '28%' }}>{props.name}</div>
            {props.name !== 'Other' && index === this.state.recommendedIndex &&
              <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
            }
          </div>
        }
        {this.state.selectedIndex === index &&
          <div>
            <div style={{ display: '-webkit-box' }}>
              <div style={{ width: index === this.state.recommendedIndex ? '28%' : '88%', color: '#4f2da7', fontWeight: 500 }}>{props.name}</div>
              {props.name !== 'Other' && index === this.state.recommendedIndex * 1 &&
                <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
              }
              < img width="20" src={selected_option} alt="Insurance" />

            </div>
            {props.name === 'Other' &&
              <FormControl >
                <div style={{ margin: '10px 0 0 0' }} className="InputField">
                  <Input
                    error={(this.state.cover_amount_error) ? true : false}
                    helperText={this.state.cover_amount_error || this.state.cover_amount_min_max}
                    type="text"
                    width="40"
                    label="Cover Amount"
                    class="Income"
                    id="income"
                    name="coveR_amount"
                    value={this.state.cover_amount}
                    onChange={this.handleChange('cover_amount')}
                    onKeyChange={this.handleKeyChange('cover_amount')} />
                </div>
              </FormControl>}
          </div>
        }
      </div>
    )
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Cover Amount"
        count={true}
        total={5}
        current={3}
        handleClick={this.handleClick}
        buttonTitle="Next"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >
        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={comver_amount_icon} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>I want my family to receive</div>
            <div style={{ display: 'flex' }}>
              <div className="annual-income-data-mid" style={{ width: 'fit-content' }}>₹ {this.state.cover_amount}</div>
              <div style={{ margin: '4px 0 0 8px', fontSize: 16, color: ' #4a4a4a' }}>In my absence</div>
            </div>
          </div>
          <div className="annual-income-info-button" onClick={() => this.renderPopUp()}>INFO</div>
        </div>

        <div style={{ marginTop: 60 }}>
          {this.state.coverAmountList.map(this.renderList)}
        </div>
      </Container>
    );
  }
}

export default CoverAmount;
