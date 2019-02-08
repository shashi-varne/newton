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

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      openDialogConfirm: false,
      openDialog: false
    }
    this.handleClose = this.handleClose.bind(this);
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {
    // if (!this.state.openDialogConfirm) {
    //   this.setState({
    //     openDialogConfirm: true
    //   })
    //   return;
    // }

    this.navigate('question1');
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

  handleConfirm = () => {
    this.setState({
      openDialogConfirm: false
    })

    this.navigate('question1');
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
        type={this.state.type}
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
            Check your risk tolerance, and get the right mix of funds to invest.
        </div>
        </div>
        {this.openDialogConfirmModal()}
      </Container>

    );
  }
}

export default Intro;
