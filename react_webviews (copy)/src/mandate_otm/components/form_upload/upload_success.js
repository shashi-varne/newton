import React, { Component } from 'react';
import Container from '../../common/Container';
import qs from 'qs';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import eta_icon from 'assets/eta_icon.svg';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import ContactUs from '../../../common/components/contact_us';

class UploadSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openDialog: false,
      params: qs.parse(props.history.location.search.slice(1))
    }
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      disableBack: params ? params.disableBack : false
    })
  }


  componentDidMount() {

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Upload',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Feedback OTM Upload'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    // nativeCallback({ action: 'native_back' });
    // let url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate&message=success&code=200&destination=';
    // window.location.replace(url);
    this.sendEvents('next');
    nativeCallback({ action: 'exit' });

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
        events={this.sendEvents('just_set_events')}>
        <div>
          <div className="success-img">
            <img alt="Mandate" src={thumb} width="130" />
          </div>
          <div className="success-great">
            Great!
          </div>
          <div className="success-text-info">
            Bank Mandate(OTM) form has been uploaded
  successfully.
          </div>
          <div className="success-bottom-timer">
            <div>
              <img alt="Mandate" className="success-img-timer" src={eta_icon} width="20" />
              Usually takes ~20 days to get approved
            </div>
          </div>

          <ContactUs />
        </div>
      </Container >
    );
  }
}


export default UploadSuccess;
