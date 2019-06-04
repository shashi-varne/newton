import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import dropdown_arrow_fisdom from 'assets/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';
import DropdownInPage from '../../../common/ui/DropdownInPage';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';
import { validateNumber, inrFormatDecimal, numDifferentiation } from 'utils/validators';

class AddOnBenefits extends Component {

  constructor(props) {
    var insuranceData = JSON.parse(window.localStorage.getItem('insuranceData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      openPopUp: false,
      insurance_app_id: 5829705409232897,
      insuranceData: insuranceData,
      openPopUpCoverAmount: false
    }
    this.renderList = this.renderList.bind(this);
    this.setValue = this.setValue.bind(this);
    this.renderListCoverAmount = this.renderListCoverAmount.bind(this);
  }

  componentWillMount() {
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

  async getRiders() {
    try {
      const res = await Api.get('/api/insurance/fetch/riders/' + this.state.insurance_app_id + '?ci_amount=500000&adb=500000')
      let result = res.pfwresponse.result;
      let riders_info = result.riders_info;

      var i = 0;

      let inputToRender = {
        error: false,
        helperText: this.state.cover_amount_error,
        type: "text",
        width: "40",
        label: "Cover Amount",
        class: "Income",
        id: "income",
        name: "cover_amount",
        onChange: this.handleChange('cover_amount'),
        min: result.min,
        max: result.max,
      }

      for (i in riders_info) {
        (riders_info[i].cover_amount).push('Other');
        let row = riders_info[i];
        let cover_amount_min_max = 'Min ' + inrFormatDecimal(row.min) + ' - Max ' + inrFormatDecimal(row.max);
        inputToRender.cover_amount_min_max = cover_amount_min_max;
        inputToRender.value = row.recommended;
        riders_info.inputToRender = inputToRender;
        var j = 0;
        for (j in riders_info[i].cover_amount) {
          if (riders_info[i].cover_amount[j].recommended === riders_info[i].pay_amount) {
            riders_info[i].recommendedIndex = j;
            riders_info[i].selectedIndex = j;
          }
        }
      }
      this.setState({
        show_loader: false,
        riders_info: riders_info,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  async componentDidMount() {

    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom
    })
    this.getRiders()
  }


  navigate = (pathname, annual_income) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        annual_income: annual_income
      }
    });
  }

  handleClick = async () => {

    // window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    // this.navigate('cover-amount', quoteData.annual_income);
  }

  setValue(index) {
    console.log("returned index : " + index)
    this.setState({
      selectedIndex: index
    })
  }

  changeAmount(index) {
    console.log("change amount : " + index)
    this.setState({
      selectedRiderList: this.state.riders_info[index],
      selectedIndex: index,
      openPopUpCoverAmount: true
    })
  }

  renderListCoverAmount() {
    console.log("render coverrrrr");
    console.log(this.state);
    if (this.state.openPopUpCoverAmount) {
      return (
        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.selectedRiderList.cover_amount}
            value={this.state.selectedRiderList.selectedIndex || 0}
            onChange={this.setValue}
            recommendedIndex={this.state.selectedRiderList.recommendedIndex || ''}
            dataType=""
            inputKeyName="Other"
            inputToRender={this.state.selectedRiderList.inputToRender} />
        </div>
      )
    }
    return null;
  }

  handleChange = name => event => {
    let value = event.target.value.replace(/,/g, "");
    let inputToRender = this.state.inputToRender;
    if (!value) {
      let error = 'Cover Amount cannot be empty';
      this.setState({
        cover_amount_error: error,
        inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
      });
    } else if ((!validateNumber(value) || !value)) {
      let error = 'Invalid Cover Amount';
      this.setState({
        cover_amount_error: error,
        inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
      });
    } else if (value < this.state.min) {
      let error = 'Minimum Cover Amount is ' + inrFormatDecimal(inputToRender.min);
      this.setState({
        cover_amount_error: error,
        inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
      });
    } else if (value > this.state.max) {
      let error = 'Maximum Cover Amount is ' + inrFormatDecimal(inputToRender.max);
      this.setState({
        cover_amount_error: error,
        inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
      });
    } else if ((!validateNumber(value) || !value)) {
      let error = 'Invalid Cover Amount';
      this.setState({
        cover_amount_error: error,
        inputToRender: { ...this.state.inputToRender, helperText: error, error: true }
      });
    } else {


      let quoteData = this.state.quoteData;
      quoteData.cover_amount = value;
      inputToRender.helperText = this.state.cover_amount_min_max;
      inputToRender.error = false;
      inputToRender.value = value;
      this.setState({
        [name]: value,
        [name + '_error']: '',
        inputToRender: inputToRender,
        quoteData: quoteData
      });
    }

  };

  handleCloseAction = () => {
    this.setState({
      openPopUpCoverAmount: false
    });
    this.getRiders()
  }

  renderPopUpCoverAmount() {
    if (this.state.openPopUpCoverAmount) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="payment"
          open={this.state.openPopUpCoverAmount}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="quote-filter-dialog-head">
              Cover Amount
            </div>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              {this.renderListCoverAmount()}
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleCloseAction}
              autoFocus>OK
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  handleClose = () => {
    this.setState({
      openPopUp: false,
      openPopUpCoverAmount: false
    });
  }

  openPopUp() {
    this.setState({
      openPopUp: true
    })
  }

  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          style={{ borderRadius: 6 }}
          id="payment"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Why annual Income?
             </div>
              <div className="annual-inc-popup-content">
                Our goal is to recommend the best policy for your famliy. We need your total
                annual income to determine the adequate cover amount for your family.
             </div>
            </div>
          </DialogContent>
          <DialogActions className="annual-inc-dialog-button">
            <Button
              fullWidth={true}
              variant="raised"
              size="large"
              color="secondary"
              onClick={this.handleClose}
              autoFocus>Got it!
            </Button>
          </DialogActions>
        </Dialog >
      );
    }
    return null;
  }

  renderList(props, index) {
    return (
      <div style={{ marginTop: index === 0 ? 0 : 20 }} key={index} className="ins-riders-tiles">
        <div className="ins-riders-tiles1">
          <div className="ins-riders-tiles1a">{props.title}
            <span className="ins-riders-tiles1aa">(For non diabetic patient only)</span>
          </div>
          <div className="ins-riders-tiles1b"
            style={{ color: getConfig().primary }}
            onClick={() => this.openPopUp()}>INFO</div>
        </div>

        <div className="ins-riders-tiles2" onClick={() => this.changeAmount(index)}>
          <div className="ins-riders-tiles2a">Cover Amount</div>
          <div className="ins-riders-tiles2b">
            <div className="ins-riders-tiles2c">{props.recommended}</div>
            <div className="ins-riders-tiles2d">
              <img className="ins-riders-tiles2e" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
        </div>

        <div className="ins-riders-tiles3">
          <div className="ins-riders-tiles3a">
            <span className="ins-riders-tiles3b">Pay + Rs.</span>
            <span className="ins-riders-tiles3c">{numDifferentiation(props.pay_amount)} Monthly</span>
          </div>
          <div className="ins-riders-tiles3d">
            Add
        </div>
        </div>
      </div>
    )
  }

  bannerText = () => {
    return (
      <span>
        Select any add ons and enhance your plan
      </span>
    );
  }

  render() {
    return (
      <Container
        classOverRide="insurance-container-grey"
        classOverRideContainer="insurance-container-grey"
        showLoader={this.state.show_loader}
        title="Add on Benifits"
        smallTitle="ICICI PRU IPROTECT SMART"
        handleClick={this.handleClick}
        buttonTitle="Next"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
        banner={true}
        bannerText={this.bannerText()}
      >

        {this.state.riders_info && this.state.riders_info.map(this.renderList)}
        {this.renderPopUp()}

        {this.renderPopUpCoverAmount()}
      </Container>
    );
  }
}

export default AddOnBenefits;
