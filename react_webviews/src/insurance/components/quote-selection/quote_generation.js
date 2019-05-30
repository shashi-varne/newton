import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import dropdown_arrow_fisdom from 'assets/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';
import { numDifferentiation, inrFormatDecimal } from 'utils/validators';

import DropdownInPage from '../../../common/ui/DropdownInPage';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';

// import CoverAmount from './components/quote-selection/cover_amount';

class QuoteGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      quoteData: JSON.parse(window.localStorage.getItem('quoteData')) || {},
      canRenderList: false,
      openPopUp: false,
      renderList: []
    }

    this.renderQuotes = this.renderQuotes.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  componentWillMount() {
    console.log(this.state.quoteData)
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

  async getQuotes() {
    this.setState({
      show_loader: true
    })
    let insuranceData = {
      tobacco_choice: this.state.quoteData.tobacco_choice,
      cover: this.state.quoteData.cover_amount,
      term: this.state.quoteData.cover_period,
      payment_frequency: 'Monthly',
      death_benefit_option: '',
      dob: this.state.quoteData.dob,
      gender: this.state.quoteData.gender,
      annual_income: this.state.quoteData.annual_income,
      accident_benefit: '',
      ci_benefit: '',
      annual_quote_required: true//v2 only, always true
    };
    try {
      const res = await Api.post('/api/insurance/quote', insuranceData)

      let result = res.pfwresponse.result.quotes;
      console.log(result);
      this.setState({
        show_loader: false,
        result: result,
        quote: result[0],
        quotes: result
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  componentDidMount() {
    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom
    })
    this.getQuotes();
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.navigate('journey')
  }

  quotesAfterFilter(type, index) {
    let quoteData = this.state.quoteData;
    if (type === 'cover-amount') {
      quoteData.cover_amount = quoteData.coverAmountList[index].value;
    } else if (type === 'cover-period') {
      quoteData.cover_period = quoteData.coverPeriodList[index];
    } else if (type === 'smoke') {
      quoteData.tobacco_choice = quoteData.smokeList[index] === 'Yes' ? 'Y' : 'N';
    }

    this.setState({
      quoteData: quoteData
    });
    this.getQuotes();
  }

  handleClose = () => {
    this.setState({
      openPopUp: false
    });
  }

  handleCloseAction = () => {
    this.setState({
      openPopUp: false
    });
    this.quotesAfterFilter(this.state.filterType, this.state.selectedIndex)
  }


  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          style={{ borderRadius: 6, width: '-webkit-fill-available' }}
          id="payment"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="quote-filter-dialog-head">
              {this.state.filterHead}
            </div>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              {this.renderList()}
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

  renderList() {
    if (this.state.canRenderList) {
      return (
        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.renderList}
            value={this.state.selectedIndex}
            onChange={this.setValue}
            recommendedIndex={2}
            dataType={this.state.filterType === 'cover-amount' ? 'AOB' : ''}
            keyToShow="value" />
        </div>
      )
    }
    return null;
  }

  setValue(index) {
    console.log("returned index : " + index)
    this.setState({
      selectedIndex: index
    })
  }

  renderQuotes(props, index) {
    return (
      <div key={index} className="quote-tiles" style={{ marginTop: index !== 0 ? 18 : 42 }}>
        <div className="quote-tiles1">
          <div className="quote-tiles1a">
            <img style={{ width: 90 }} src={props.quote_provider_logo} alt="Insurance" />
          </div>
          <div className="quote-tiles1b">{props.insurance_title}</div>
        </div>
        <div className="quote-tiles2">
          <span className="quote-tiles2a">Payout: </span>
          <span className="quote-tiles2b">Lump sum in case of death</span>
        </div>

        <div className="quote-tiles2">
          <span className="quote-tiles2a">Full waiver of future premiums: </span>
        </div>

        <div className="quote-tiles2">
          <span className="quote-tiles2a">A. </span>
          <span className="quote-tiles2b">On Accidental Total Permanent Disability</span>
        </div>

        <div className="quote-tiles2">
          <span className="quote-tiles2a">B. </span>
          <span className="quote-tiles2b">In case of diagnosis of Terminal Illness</span>
        </div>

        <div className="quote-tiles3">
          <div className="quote-tiles3a">
            <div className="quote-tiles3aa">
              <span className="bold-premium"> {inrFormatDecimal(props.quote_json.premium)}</span> monthly
              </div>
          </div>
          <div className="quote-tiles3b">
            <div className="quote-tiles3ba">
              <span className="bold-premium">{inrFormatDecimal(props.annual_quote_json.premium)}</span> annually
              </div>
            <div className="quote-tiles3bb">
              Save {inrFormatDecimal(props.annual_quote_json.total_savings)}
            </div>
          </div>
        </div>

      </div>
    )
  }

  filterHandler(type) {
    console.log(type);
    console.log(this.state.quoteData);
    if (type === 'cover-amount') {
      this.setState({
        renderList: this.state.quoteData.coverAmountList,
        filterHead: 'Cover Amount'
      });
    } else if (type === 'cover-period') {
      this.setState({
        renderList: this.state.quoteData.coverPeriodList,
        filterHead: 'Cover Period'
      });
    } else if (type === 'smoke') {
      this.setState({
        renderList: this.state.quoteData.smokeList,
        filterHead: 'Smoke'
      });
    }

    this.setState({
      canRenderList: true,
      openPopUp: true,
      selectedIndex: 0,
      filterType: type
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Select the Insurance"
        smallTitle="Premiums are inclusive of GST"
        handleClick={this.handleClick}
        buttonTitle="Save & Continue"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >

        <div className="quote-top-tiles">
          <div className="quote-top-tiles1" onClick={() => this.filterHandler('cover-amount')}>
            <div className="quote-top-tiles1a" >
              <div className="quote-top-tiles1b">Cover</div>
              <div className="quote-top-tiles1c">{numDifferentiation(this.state.quoteData.cover_amount)}</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div className="quote-top-tiles1" onClick={() => this.filterHandler('cover-period')}>
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Cover upto</div>
              <div className="quote-top-tiles1c">{this.state.quoteData.cover_period} years</div>
            </div>
            <div className="quote-top-tiles1c">
              <img className="quote-top-tiles1d" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>

          <div className="quote-top-tiles1" onClick={() => this.filterHandler('smoke')}>
            <div className="quote-top-tiles1a">
              <div className="quote-top-tiles1b">Smoke</div>
              <div className="quote-top-tiles1c">
                {this.state.quoteData.tobacco_choice === 'Y' ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="quote-top-tiles1d">
              <img className="quote-top-tiles1e" src={this.state.dropdown_arrow} alt="Insurance" />
            </div>
          </div>
        </div>
        {this.state.quotes && this.state.quotes.map(this.renderQuotes)}

        {this.renderPopUp()}
      </Container>
    );
  }
}

export default QuoteGeneration;
