import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';

class EmailSuccess extends Component {
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
    // nativeCallback({ action: 'native_back' });
    let url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate&message=success&code=200&destination=';
    window.location.replace(url);
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
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
        title="OTM"
        handleClick={this.handleClick}
        fullWidthButton={true}
        onlyButton={true}
        disableBack={true}
        buttonTitle="Done"
        type={this.state.type} >
        <div>
          <div className="success-img">
            <img alt="Mandate" src={thumb} width="130" />
          </div>
          <div className="success-great">
            Great!
          </div>
          <div className="success-text-info">
            You will recieve a Bank Mandate(OTM) form on
  your registered email(<span style={{ fontWeight: 600 }}>uttampaswan@live.com</span>)
                                                              Please sign (as per bank records) on OTM form
                                                              and upload on the app.
          </div>
          <div className="success-bottom">
            <div className="success-bottom1">
              For any query, reach us at
            </div>
            <div className="success-bottom2">
              <div className="success-bottom2a">
                +080-48-039999
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


export default EmailSuccess;
