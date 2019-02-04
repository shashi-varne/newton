import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import intro_gold from 'assets/intro_gold@2x.png';
import safegold_logo from 'assets/safegold_logo@2x.png';
import buy_gold_icon from 'assets/buy_gold_icon@2x.png';
import track_gold_icon from 'assets/track_gold_icon@2x.png';
import sell_gold_icon from 'assets/sell_gold_icon@2x.png';
import deliver_gold_icon from 'assets/deliver_gold_icon@2x.png';
import { ToastContainer } from 'react-toastify';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { inrFormatDecimal } from 'utils/validators';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openResponseDialog: false,
      minAmount: '',
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
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

  async componentDidMount() {
    try {
      const res = await Api.get('/api/gold/buy/currentprice');

      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        this.setState({
          show_loader: false,
          minAmount: result.buy_info.minimum_buy_price
        });

      } else {
        this.setState({
          show_loader: false
        });
        toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: true
      });
      toast('Something went wrong', 'error');
    }

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = () => {
    this.navigate('my-gold');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Gold"
        edit={this.props.edit}
        handleClick={this.handleClick}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="gold-about-card">
          <div className="Banner">
            <img alt="Gold" src={intro_gold} />
            <div className="BannerContent">
              <div className="BannerText">Introducing Gold</div>
              <div className="SafeGoldImage">
                <img alt="Gold" src={safegold_logo} />
              </div>
              <div className="FlexRow">
                <div>24 Karat</div>
                <div>|</div>
                <div>99.5% Purity</div>
              </div>
              <div className="helper" onClick={() => this.navigate('details')} >Know More</div>
            </div>
          </div>
          <div className="BannerBody">
            <div className="gold-about-text">
              <div className="gold-dot"></div>
              <div className="about-img-tile">
                <span className="about-img-span2">Buy 24K gold & skip the responsibility of safe-keeping & traditional lockers.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <div className="gold-dot"></div>
              <div className="about-img-tile">
                <span className="about-img-span2">You get a free & secure locker from <span className="know-more-buy">BRINK's</span>, global leader in gold custodian services with 100% insurance cover.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <div className="gold-dot"></div>
              <div className="about-img-tile">
                <span className="about-img-span2">Sell your gold with one click, anywhere and anytime.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <div className="gold-dot"></div>
              <div className="about-img-tile">
                <span className="about-img-span2">Get your gold delivered to your doorstep, hassle-free.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="gold-about-card card-padding">
          <div>
            <h3>How It Works?</h3>
          </div>
          <div >
            <div className="gold-about-text">
              <img alt="Gold" className="about-img" src={buy_gold_icon} width="54" />
              <div className="about-img-tile">
                <span className="about-img-span2"> <span className="know-more-buy">Buy</span> the desired quantity or amount of gold above {inrFormatDecimal(this.state.minAmount)} and purchase it at the live price quoted.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <img alt="Gold" className="about-img" src={track_gold_icon} width="54" />
              <div className="about-img-tile">
                <span className="about-img-span2"><span className="know-more-buy">Track</span> your gold value & transactions anytime from your gold locker.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <img alt="Gold" className="about-img" src={sell_gold_icon} width="54" />
              <div className="about-img-tile">
                <span className="about-img-span2"><span className="know-more-buy">Sell</span> any amount of gold above Rs. 1 & get the amount credited in your bank account within 72 hours.
                </span>
              </div>
            </div>
            <div className="gold-about-text">
              <img alt="Gold" className="about-img" src={deliver_gold_icon} width="54" />
              <div className="about-img-tile">
                <span className="about-img-span2">Select any gold product of your choice when you have more than 1 gm in
                  your gold locker & track your <span className="know-more-buy">Delivery</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer autoClose={3000} />
      </Container>
    );
  }
}

export default About;
