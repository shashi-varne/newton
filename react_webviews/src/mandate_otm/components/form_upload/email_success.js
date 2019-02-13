import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
// import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
class EmailSuccess extends Component {
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

      // let score = JSON.parse(window.localStorage.getItem('score'));
      let score;
      const res = await Api.get('/api/risk/profile/user/recommendation');
      if (res.pfwresponse.Upload.score) {
        score = res.pfwresponse.Upload.score;
        this.setState({
          score: score,
          show_loader: false
        });
      } else {
        this.navigate('intro');
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
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {

    this.navigate('recommendation');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="OTM"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Done"
        type={this.state.type}
      >
      </Container>
    );
  }
}

export default EmailSuccess;
