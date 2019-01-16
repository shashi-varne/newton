import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import loader from 'assets/loader_gif.gif';
import qs from 'qs';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class MandateProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialog: false,
      showLoader: true,
      address_present: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      disableBack: params ? params.disableBack : false
    })
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
    Api.get('/api/mandate/otm/address').then(res => {
      if (res.pfwresponse.status_code == 200) {
        this.setState({
          show_loader: false,
          showLoader: false
        })
        if (res.pfwresponse.result.address_present) {
          this.navigate('/mandate/success')
        }
      } else {
        if (res.pfwresponse.result.address_present) {
          this.navigate('/mandate/success')
          this.setState({
            showLoader: false
          });
        } else {
          this.setState({
            show_loader: false,
            showLoader: false,
            openDialog: true, apiError: res.pfwresponse.result.error
          });
        }
      }
    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url
    });
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })
    Api.get('/api/mandate/otm/address').then(res => {
      if (res.pfwresponse.status_code == 200) {
        this.setState({
          show_loader: false
        })

        if (!res.pfwresponse.result || res.pfwresponse.result.length == 0) {
          this.navigate('/mandate/add-address')
        } else {
          this.navigate('/mandate/select-address')
        }
      } else {
        this.setState({
          show_loader: false,
          openDialog: true, apiError: res.pfwresponse.result.error
        });
      }
    }).catch(error => {
      this.setState({ show_loader: false });
      console.log(error);
    });
  }

  handleClose() {
    this.setState({
      openDialog: false
    })
  }

  renderResponseDialog = () => {
    return (
      <Dialog
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.state.apiError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderPageLoader = () => {
    if (this.state.showLoader) {
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

  renderMainUi() {
    if (!this.state.showLoader) {
      return (
        <Container
          summarypage={true}
          showLoader={this.state.show_loader}
          title="Bank Mandate Process"
          handleClick={this.handleClick}
          fullWidthButton={true}
          onlyButton={true}
          buttonTitle="Continue to Select Address"
          type={this.state.type} >
          <div>
            <div className="process-tile">
              <div className="process-tile1">
                1.
            </div>
              <div className="process-tile2">
                Get a bank mandate delivered at your doorstep
            </div>
            </div>

            <div className="process-tile" style={{ marginBottom: 10 }}>
              <div className="process-tile1">
                2.
            </div>
              <div className="process-tile2">
                Sign and send us back for bank's approval
            </div>

            </div>
            <div className="process-address">
              <div className="process-address1">Courier to:</div>
              <div className="process-address2">
                Queens Paradise, No. 16/1, 1st Floor, Curve Road, Shivaji Nagar,
                 Bengaluru, Karnataka 560051
              </div>
            </div>

            <div className="process-tile">
              <div className="process-tile1">
                3.
            </div>
              <div className="process-tile2">
                Mandate processed post bank's approval
            </div>
            </div>

          </div>

        </Container >
      )
    }
  }

  render() {
    return (
      <div>(
        {this.renderMainUi()}
        {this.renderResponseDialog()}
        {this.renderPageLoader()}
      </div>
    );
  }
}


export default MandateProcess;
