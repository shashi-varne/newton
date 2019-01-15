import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';

class About extends Component {
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
        title="Gold"
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

export default About;
