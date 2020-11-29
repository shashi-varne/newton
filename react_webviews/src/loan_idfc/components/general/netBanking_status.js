import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import { getUrlParams } from 'utils/validators';
import { storageService } from 'utils/validators';

const commonMapper = {
    'failed': {

    }
}

class KycStatus extends Component {
    constructor(props) {
      super(props);
      this.state = {
        show_loader: true,
        params: getUrlParams(),
        commonMapper: {},
        okyc_id: storageService().get('loan_okyc_id'),
        timeAlloted: 20000,
        onloadApi: true
      }
  
      this.initialize = initialize.bind(this);
    }
