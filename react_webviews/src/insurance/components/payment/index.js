import React, { Component } from 'react';
import loader from 'assets/loader_gif.gif';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
// import toast from '../../../common/ui/Toast';
// import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: true,
    };
  }

  componentWillMount() {
    const { status } = this.props.match.params;
    let insurance_search = {};
    if (window.localStorage.getItem('insurance_search')) {
      insurance_search = JSON.parse(localStorage.getItem('insurance_search'));
    }

    // let search = '?insurance_id=' + insurance_search.insurance_id + '&resume=yes&base_url=' + insurance_search.base_url;
    // this.props.history.push({
    //   search: search
    // });

    this.setState({
      paymentStatus: status,
      insurance_search: insurance_search
    })

  }

  renderPageLoader = () => {
    if (this.state.show_loader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={loader} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderModal = () => {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.openModal}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 4, minWidth: 320, padding: 25, textAlign: 'center' }}>
          <div style={{ padding: '20px 0 30px' }}>
            <img src={loader} alt="" />
          </div>
          <Typography variant="subheading" id="simple-modal-description" style={{ color: '#444' }}>
            Wait a moment, you will be redirected to <b>{this.state.quote_provider}</b> for the payment.
          </Typography>
        </div>
      </Modal>
    );
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: '?insurance_id=' + this.state.insurance_search.insurance_id + '&base_url=' + this.state.insurance_search.base_url
    });
  }

  navigateResume = (pathname) => {
    let search = '?insurance_id=' + this.state.insurance_search.insurance_id + '&resume=yes&base_url=' + this.state.insurance_search.base_url;
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
    if (this.state.paymentStatus === 'success') {
      // if (this.state.insurance_search.provider === 'HDFC') {
      //   this.navigateResume('/insurance/edit-contact1');
      // } else {
      //   this.navigateResume('/insurance/journey');
      // }
      this.navigateResume('/insurance/journey');
    } else if (this.state.paymentStatus === 'pending') {
      this.navigateResume('/insurance/journey');
    } else if (this.state.paymentStatus === 'failed') {
      //   Api.get('api/insurance/start/payment/' + this.state.insurance_search.insurance_id)
      //     .then(res => {
      //       if (res.pfwresponse.status_code === 200) {
      //         console.log(res.pfwresponse.result);
      //         let result = res.pfwresponse.result
      //         this.setState({
      //           payment_link: result.payment_link,
      //           show_loader: false
      //         });
      //         let paymentRedirectUrl = encodeURIComponent(
      //           window.location.protocol + '//' + window.location.host + '/insurance/payment'
      //         );
      //         var pgLink = this.state.payment_link;
      //         pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl;
      //         window.location.href = pgLink;
      //       }
      //     });
      this.navigateResume('/insurance/journey');
    }

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
              {/* {this.state.apiError} */}
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
              color="default"
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
              {/* {this.state.apiError} */}
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
              color="default"
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
              {/* {this.state.apiError} */}
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
              color="default"
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
