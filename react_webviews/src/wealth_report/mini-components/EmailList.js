import React, { Component } from 'react';
import WrButton from '../common/Button';
import { capitalize } from '../../utils/validators';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export default class EmailList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderEmail(emailDetail = {}) {
    return (
      <div className="wr-email-list-item">
        <div>
          <span className="wr-eli-email">{capitalize('abishmathew21@yahoo.co.in')}</span>
          <span className="wr-eli-synced">Synced on Jun 23, 09:45am</span>
        </div>
        <img src={require('assets/fisdom/ic-email-sync.svg')} alt="sync" />
      </div>
    );
  }

  render() {
    return (
      <div  style={{width:'300px'}}>
        <WrButton
          fullWidth={true}
          classes={{ root: 'wr-add-email-btn' }}>
          <AddCircleOutlineIcon style={{ fontSize: '18px', marginRight: '10px' }}/>
          Add new Email
        </WrButton>
        <div>
          <div id="wr-email-list-title">All Emails</div>
          <div id="wr-email-list">
            {this.renderEmail()}
          </div>
        </div>
      </div>
    );
  }
}