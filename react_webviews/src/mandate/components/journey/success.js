import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'qs';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import eta_icon from 'assets/eta_icon.svg';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class MandateSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      disableBack: params ? params.disableBack : false
    })
    console.log(params);

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

  }

  handleClick = () => {
    nativeCallback({ action: 'native_back' });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url
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

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Bank Mandate"
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={this.state.disableBack}
        buttonTitle="Ok"
        type={this.state.type} >
        <div>
          <div className="success-img">
            <img src={thumb} width="130" />
          </div>
          <div className="success-great">
            Great!
          </div>
          <div className="success-text-info">
            You will receive a Bank Mandate form.
          </div>
          <div className="success-text-info">
            Please put your signature and send back to us.
          </div>
          <div className="success-bottom-timer">
            <div>
              <img className="success-img-timer" src={eta_icon} width="20" />
              Usually takes 3-4 working day
            </div>
          </div>

          <div className="success-bottom">
            <div className="success-bottom1">
              For any query, reach us at
            </div>
            <div className="success-bottom2">
              <div className="success-bottom2a">
                +80-30-408363
              </div>
              <div className="success-bottom2b">
                |
              </div>
              <div className="success-bottom2a">
                ask@fisdom.com
              </div>
            </div>
          </div>
        </div>
      </Container >
    );
  }
}


export default MandateSuccess;
