import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import stopwatch from 'assets/stopwatch.png';

class BuyOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
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

  handleClick = async () => {
    this.navigate('my-gold');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Buy Gold"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div className="order-tile">
          <div className="FlexRow order-heading">
            <div className="order-tile-head">
              Order Summary
            </div>
            <div className="">
              <div className="stopwatch-title">Price valid for </div>
              <div className="FlexRow stopwatch">
                <img className="stopwatch-order" src={stopwatch} width="15" />
                <span className="timer">3:13</span>
              </div>
            </div>
          </div>
          <div className="order-tile2">
            <span className="order-tile-total1">Total payble amount</span>
            <span className="float-right order-tile-total1">10000</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Gold grams to be added to your vault</span>
            <span className="float-right order-tile-other-text">2.8776 gm</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Rate</span>
            <span className="float-right order-tile-other-text">3900/gm</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Total GST (3%)</span>
            <span className="float-right order-tile-other-text">291.98</span>
          </div>
          <div className="order-tile2">
            <span className="order-tile-other-text">Net purchase amount</span>
            <span className="float-right order-tile-other-text">9708.23</span>
          </div>
        </div>
      </Container>
    );
  }
}

export default BuyOrder;
