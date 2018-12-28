import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
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
      show_loader: false,
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
    console.log(this.state.params);
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

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: 'base_url=' + this.state.params.base_url
    });
  }

  render() {
    return (
      <Container
        summarypage={true}
        showLoader={this.state.show_loader}
        title="Bank Mandate Process"
        handleClick={() => this.navigate('/mandate/select-address')}
        fullWidthButton={true}
        onlyButton={true}
        buttonTitle="Continue to Select Address"
        type={this.state.type} >
        <div>
          <div className="process-tile">
            <div className="process-tile1" style={{ marginTop: 10 }}>
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
    );
  }
}


export default MandateProcess;
