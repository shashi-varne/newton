import React, { Component } from 'react';

import Container from '../common/Container';
import { nativeCallback } from 'utils/native_callback';
import {getParamsMark} from 'utils/functions';
import { getUrlParams } from '../../utils/validators';

class GiveIndiaRefferal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: 'page',
      params: getUrlParams(),
      loadingText: 'Please wait...'
    }
  }

  componentWillMount() {

      if(this.state.params.exit_now) {
        nativeCallback({ action: 'exit' });
      } else {
          this.setState({
            loadingText: 'Redirecting securely...'
          })
        this.openGiveindia();
      }
      
  }


  openGiveindia = () => {
    
    let back_url  = window.location.href ;
    back_url += getParamsMark(back_url) + 'exit_now=true';
    back_url = encodeURIComponent(back_url)

    this.setState({
        loadingText: 'Please wait...'
    })
    nativeCallback({
        action: 'open_inapp_tab',
        message: {
            url:   'https://fisdom.giveindia.org',
            back_url: back_url
        }
      });
  }
  render() {
    return (
      <Container
        noFooter={true}
        noHeader={true}
        showLoader={this.state.show_loader}
        loaderData={{
            'loadingText': this.state.loadingText
        }}
      >
        
      </Container>
    );
  }
}

export default GiveIndiaRefferal;
