import React, { Component } from 'react';
import Container from '../../common/Container';
import Api from 'utils/api';

import qs from 'qs';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';

class MandateProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialog: false,
      showLoader: true,
      address_present: false,
      params: qs.parse(props.history.location.search.slice(1)),
      productName: getConfig().productName
    }
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    let { params } = this.props.location;
    this.setState({
      disableBack: params ? params.disableBack : false
    })
  }


  componentDidMount() {
    Api.get('/api/mandate/campaign/address/' + this.state.params.key).then(res => {
      if (res.pfwresponse.status_code === 200) {
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
      this.setState({
        show_loader: false, showLoader: false
      });
    });
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url + '&key=' + this.state.params.key + '&pc_key=' + this.state.params.pc_key
    });
  }

  handleClick = async () => {
    this.setState({
      show_loader: true
    })
    Api.get('/api/mandate/campaign/address/' + this.state.params.key).then(res => {
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false
        })

        if (!res.pfwresponse.result || res.pfwresponse.result.length === 0) {
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
            <img src={require(`assets/loader_gif_${this.state.productName}.gif`)} alt="" />
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
          title="OTM Process"
          handleClick={this.handleClick}
          fullWidthButton={true}
          onlyButton={true}
          buttonTitle="Continue to Select Address"
        >
          <div>
            <div className="process-tile">
              <div className="process-tile1">
                1.
            </div>
              <div className="process-tile2">
                Get a mandate form delivered at your doorstep
            </div>
            </div>

            <div className="process-tile" style={{ marginBottom: 10 }}>
              <div className="process-tile1">
                2.
            </div>
              <div className="process-tile2">
                Sign the form and send it back to us
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
                Signed form will be sent to your bank for approval
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
