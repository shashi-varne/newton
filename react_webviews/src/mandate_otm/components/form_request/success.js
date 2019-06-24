import React, { Component } from 'react';
import qs from 'qs';

// import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import thumb from 'assets/thumb.svg';
import { nativeCallback } from 'utils/native_callback';

class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      openDialog: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName
    }
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Campaign OTM Address',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Feedback Popup'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    nativeCallback({ action: 'exit' });
  }

  handleClose() {
    this.setState({
      openDialog: false,
      show_loader: true
    });
  }

  renderDialog() {
    return (
      <Dialog
        fullWidth={true}
        id="succes"
        open={this.state.openDialog}
        onClose={this.handleClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="payment-dialog" id="alert-dialog-description">
            {/* <img className="img-payment" src={thumb} alt="" width="40" />
            <span className="text-payment1">Oh! looks like your payment failed.</span>
            <span className="text-payment2">You can give it another try.
          </span> */}
            <div>
              <div className="success-img">
                <img alt="Mandate" src={thumb} width="130" />
              </div>
              <div className="success-great">
                Great!
              </div>
              <div className="success-text-info">
                You will recieve a Bank Mandate form on your
              registered email (<span style={{ fontWeight: 600 }}>{this.state.params.email}</span>)
                                  Please sign (as per bank records) on OTM form
                                  and upload on the app.
              </div>
              <div className="success-bottom-timer">
              </div>

              <div className="success-bottom">
                <div className="success-bottom1">
                  For any query, reach us at
                </div>
                <div className="success-bottom2">
                  <div className="success-bottom2a">
                    {getConfig().mobile}
                  </div>
                  <div className="success-bottom2b">
                    |
                  </div>
                  <div className="success-bottom2a">
                    {getConfig().askEmail}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </DialogContent>
        <DialogActions>
          <Button
            fullWidth={true}
            variant="raised"
            size="large"
            color="secondary"
            onClick={this.handleClick}
            style={{ textTransform: 'capitalize' }}
            autoFocus>Continue
        </Button>

        </DialogActions>
      </Dialog>

    )
  }

  render() {
    return (
      <div>
        {this.renderDialog()}
      </div>

    );
  }
}

export default Success;
