import React, { Component } from 'react';
import qs from 'qs';

import Container from '../common/Container';
import { getConfig } from 'utils/functions';
// import { nativeCallback } from 'utils/native_callback';

class AppUpdateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1))
    }

  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }


  handleClick = async () => {
    this.navigate('details');
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Term Insurance"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Update"
      >
       <div>
           Please update your app for latest products
       </div>

      </Container>

    );
  }
}

export default AppUpdateInfo;
