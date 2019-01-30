import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../ui/Toast';
import Container from '../../common/Container';
import meter1 from 'assets/meter1.svg';
import meter2 from 'assets/meter2.svg';
import meter3 from 'assets/meter3.svg';
import meter4 from 'assets/meter4.svg';
import meter5 from 'assets/meter5.svg';
// import { nativeCallback } from 'utils/native_callback';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: ''
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

      let score = JSON.parse(window.localStorage.getItem('score'));
      console.log(score);
      this.setState({
        show_loader: false,
        score: score
      });
      console.log(this.state)
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
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {

    this.navigate('recommendation');
  }

  getImg(score) {
    let map = {
      1: meter1,
      2: meter2,
      3: meter3,
      4: meter4,
      5: meter5

    }
    return map[score];
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Risk Tolerance"
        classOverRide="result-container"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Fund Recommendation"
        type={this.state.type}
        topIcon="restart"
      >
        <div className="meter-img">
          {this.state.score && <img style={{ width: '70%' }} src={this.getImg(this.state.score.score)} alt="meter" />}
        </div>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <div style={{ color: '#ffffff', fontSize: 16, marginBottom: 20 }}>Conservative Investor</div>
          <div style={{ color: '#f2f2f2', fontSize: 14 }}>Investor like you are comfortable in accepting
  lower returns for a higher degree of liquidity or
  stability. Typlically, a Conservative investor
  primarly seeks to minimize risk and loss of
money.</div>
        </div>
      </Container>
    );
  }
}

export default Result;
