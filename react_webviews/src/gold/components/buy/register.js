import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';

class GoldRegister extends Component {
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
    Api.get('/api/gold/user/account').then(res => {
      if (res.pfwresponse.status_code == 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        let userInfo = result.gold_user_info.user_info;
        if (userInfo.registration_status == "pending" ||
          !userInfo.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }

        this.setState({
          show_loader: false,
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: userInfo,
          isRegistered: isRegistered
        });

        if (userInfo.mobile_verified == false &&
          isRegistered == false) {
          // $state.go('my-gold');
          return;
        }
        // this.checkPincode();

      } else {
        this.setState({
          show_loader: false, openDialog: true,
          apiError: res.pfwresponse.result.error || res.pfwresponse.result.message
        });
      }

    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
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
        title="Registration"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Proceed"
        type={this.state.type}
      >
        <div>Lorum Ipsum</div>
      </Container>
    );
  }
}

export default GoldRegister;
