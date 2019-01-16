import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import safegold_logo from 'assets/safegold_logo_60x60.png';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import one_gm_front from 'assets/1gm_front.png';
import two_gm_front from 'assets/2gm_front.png';
import five_gm_front from 'assets/5gm_front.png';
import five_gmbar_front from 'assets/5gmbar_front.png';
import ten_gm_front from 'assets/10gm_front.png';
import ten_gmbar_front from 'assets/10gmbar_front.png';
import twenty_gmbar_front from 'assets/20gmbar_front.png';

class GoldLocker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      value: 0
    }
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

  componentDidMount() {
    this.setState({
      show_loader: false,
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  productImgMap = () => {
    const prod_image_map = {
      2: one_gm_front,
      3: two_gm_front,
      1: five_gm_front,
      14: five_gmbar_front,
      8: ten_gm_front,
      12: ten_gmbar_front,
      15: twenty_gmbar_front,
    };
    
    return (
      <img alt="Gold" className="delivery-icon" src={prod_image_map[3]} width="80" />
    );
  }

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        title="My 24K Safegold Locker"
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="FlexRow">
          <div className="FlexRow" style={{justifyContent: 'flex-start', flex: 1, marginRight: '2px', background: '#fff', padding: '10px'}}>
            <img className="img-mygold" src={safegold_logo} width="35" style={{marginRight: 10}} />
            <div>
              <div className="grey-color" style={{marginBottom: 5}}>Gold Quantity</div>
              <div>3.3329 gm</div>
            </div>
          </div>
          <div style={{flex: 1, background: '#fff', padding: '10px'}}>
            <div className="grey-color" style={{marginBottom: 5}}>Gold Value</div>
            <div>₹ 10,498.64</div>
          </div>
        </div>
        <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Sell" />
            <Tab label="Deliver" />
          </Tabs>
          {this.state.value === 0 && <div className="page home" id="goldSection">
          <div className="page-body-gold" id="goldInput">
            <div className="buy-info1">
              <div className="FlexRow">
                <span className="buy-info2a">Current Buying Price</span>
                <span className="buy-info2b">Price valid for
                  <span className="timer-green">1:45</span>
                </span>
              </div>
              <div className="buy-info3">
                ₹ 3,998.25/gm
              </div>
            </div>
            <div className="buy-input">
              <div className="buy-input1">
                Enter amount of gold you want to buy
              </div>
              <div className="label">
                <div className="FlexRow">
                  <div>
                    <div className="input-above-text">In Rupees (₹)</div>
                    <div className="input-box">
                      <input type="text" placeholder="Amount" />
                    </div>
                    <div className="input-below-text">Min ₹1.00 - *Max ₹-0.757.95</div>
                  </div>
                  <div className="symbol">
                    =
                  </div>
                  <div>
                    <div className="input-above-text">In Grams (gm)</div>
                    <div className="input-box">
                      <input type="text" placeholder="Weight" />
                    </div>
                    <div className="input-below-text">*Max -0.234 gm</div>
                  </div>
                </div>
                <div className="disclaimer">
                  *You can place your order for sell/delivery after 2 working day from your buying transaction date
                </div>
              </div> 
            </div>
          </div>
        </div>}
        {this.state.value === 1 && <div>
          <div className="FlexRow" style={{justifyContent: 'center', flexWrap: 'wrap'}}>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
            <div className="delivery-tile">
              {this.productImgMap()}
              
              <div className="">1gm SafeGold Gold Coin</div>
              <div className="">Charges Rs. 360</div>
            </div>
          </div>
        </div>}
      </Container>
    );
  }
}

export default GoldLocker;
