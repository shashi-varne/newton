import React, { Component } from 'react';

import LoaderModal from '../../../common/Modal'; 
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import qs from 'qs';
import { nativeCallback } from '../../../../utils/native_callback';
import {getConfig} from 'utils/functions';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true,
      params: qs.parse(props.history.location.search.slice(1)),
      productName: getConfig().productName
    };
  }

  componentWillMount() {
    const { status } = this.props.match.params;
    const { insurance_id } = this.props.match.params;

    nativeCallback({ action: 'take_control_reset' });

    this.setState({
      paymentStatus: status,
      insurance_id: insurance_id
    })
  }

  renderPageLoader = () => {
    if (this.state.show_loader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderModal = () => {
    let message = `Wait a moment, you will be redirected to <b>${this.state.quote_provider}</b> for the payment.`;
    return (
      <LoaderModal 
        open={this.state.openModal}
        message={message}
      />
    );
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParamsMustAppend + '&insurance_id=' + this.state.insurance_id
    });
  }

  navigateResume = (pathname) => {
    let search = getConfig().searchParamsMustAppend + '&insurance_id=' + this.state.insurance_id;
    this.props.history.push({
      pathname: pathname,
      search: search,
      params: {
        disableBack: true
      }
    });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      show_loader: true
    });
    this.navigateResume('/group-insurance/term/journey');
  }

  renderResponseDialog = () => {

    if (this.state.paymentStatus === 'success') {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <img className="img-payment" src={'https://plutus-web.appspot.com/assets/img/thumpsup.png'} alt="" width="40" />
              <span className="text-payment1">Payment success.</span>
              <span className="text-payment2">Compete rest of the application.
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClose}
              autoFocus>Ok
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else if (this.state.paymentStatus === 'pending') {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <img className="img-payment" src={'https://plutus-web.appspot.com/assets/img/error.png'} alt="" width="40" />
              <span className="text-payment1">Oh! looks like your payment failed.</span>
              <span className="text-payment2">No worries, you can try again. Incase your
                  bank account has been deducted, it will be
                  reverted back in 3-4 working days.
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClose}
              autoFocus>Ok
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else if (this.state.paymentStatus === 'failed') {
      return (
        <Dialog
          id="payment"
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <img className="img-payment" src={'https://plutus-web.appspot.com/assets/img/error.png'} alt="" width="40" />
              <span className="text-payment1">Oh! looks like your payment failed.</span>
              <span className="text-payment2">You can give it another try.
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClose}
              autoFocus>Retry Payment
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;

  }

  render() {
    return (
      <div>
        {this.renderResponseDialog()}
        {this.renderPageLoader()}
      </div >
    );
  }
}


export default Payment;
