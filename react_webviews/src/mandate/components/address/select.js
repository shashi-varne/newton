import React, { Component } from 'react';
import Container from '../../common/Container';
import Grid from 'material-ui/Grid';
import Api from 'utils/api';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import qs from 'qs';
import Checkbox from 'material-ui/Checkbox';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class SelectAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      checked: true
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

    var data = {
      "addressline": "kolkata howrah road",
      "landmark": "bda complex",
      "pincode": "560097",
      "country": "india",
      "house_no": "1222",
      "street": "2nd cross",
    }

    Api.post('/api/mandate/otm/address', data).then(res => {
      Api.get('/api/mandate/otm/address').then(res => {

      }).catch(error => {
        this.setState({ show_loader: false });
        console.log(error);
      });
      this.setState({
        show_loader: false
      });
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

  handleChange = () => event => {
    if (event.target.name === 'checked') {
      this.setState({
        [event.target.name]: event.target.checked
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        [event.target.name + '_error']: ''
      });
    }
  };

  bannerText = () => {
    return (
      <span>
        Delivery address for <b>Mandate form</b>
      </span>
    );
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
        buttonTitle="Continue"
        banner={true}
        bannerText={this.bannerText()}
        type={this.state.type} >
        <div style={{ display: 'flex' }}>
          <div >
            <Checkbox style={{ height: 'auto' }}
              defaultChecked
              checked={this.state.checked}
              color="default"
              value="checked"
              name="checked"
              onChange={this.handleChange()}
              className="Checkbox" />

          </div>
          <div className="select-addressline">
            Annaya 28, ground floor, 10th a cross road, ejipoura,
            bangalore, karnataka - 560064
          </div>
          <div className="select-edit-button">
            Edit
            </div>
        </div>
        <div
          onClick={() => this.navigate('/mandate/add-address')}
          className="select-add-new-button">
          + Add New Address
        </div>
      </Container >
    );
  }
}


export default SelectAddress;
