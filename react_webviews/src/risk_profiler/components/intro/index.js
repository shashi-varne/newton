import React, { Component } from 'react';
import qs from 'qs';

import Container from '../../common/Container';
import intro from 'assets/risk profiler intro_icn.svg';
import intro_myway from 'assets/risk profiler intro_icn.svg';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      openDialogConfirm: false,
      openDialog: false
    }
    this.handleClose = this.handleClose.bind(this);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    // if (!this.state.openDialogConfirm) {
    //   this.setState({
    //     openDialogConfirm: true
    //   })
    //   return;
    // }
    this.sendEvents('next');

    this.navigate('/risk/question1');
  }

  openDialogConfirmModal = () => {

    if (this.state.openDialogConfirm) {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialogConfirm}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ color: '#4a4a4a' }}>
                Answer a few questions to check risk tolerance and get the right mutual funds to invest.
             </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ textTransform: 'capitalize' }}
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={() => this.handleConfirm()}
              autoFocus>OK
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;

  }

  handleClose() {
    this.setState({
      openDialogConfirm: false,
      openDialog: false
    })
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Risk Analyser',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Intro'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleConfirm = () => {

    this.setState({
      openDialogConfirm: false
    })


    this.navigate('/risk/question1');
    return;
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Risk Analyser"
        handleClick={this.handleClick}
        edit={this.props.edit}
        buttonTitle="Let’s get started"
        events={this.sendEvents('just_set_events')}
      >
        <div style={{ padding: '10px' }}>
          <div className="meter-img">
            <img style={{ width: '100%' }}
              src={getConfig().type !== 'fisdom' ? intro : intro_myway} alt="Risk Profile" />
          </div>
          <div style={{
            textAlign: 'center', marginTop: 50,
            color: '#4a4a4a', fontSize: 16, fontWeight: 500
          }}>
            Answer a few questions to check risk tolerance and get the right mutual funds to invest.
        </div>
        </div>
        {this.openDialogConfirmModal()}
      </Container>

    );
  }
}

export default Intro;
