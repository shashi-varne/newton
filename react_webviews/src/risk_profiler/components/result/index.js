import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import Api from 'utils/api';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getUrlParams, storageService } from '../../../utils/validators';
import { pick, get, isEmpty } from 'lodash';
import { riskProfileMap } from '../../constants';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialogReset: false,
      params: this.setEntryParams(),
      productName: getConfig().productName
    };    
  }

  setEntryParams = () => {
    let urlParams = getUrlParams();
    const routeParams = get(this.props, 'location.state');
    
    if (!isEmpty(routeParams)) {
      urlParams = routeParams
    }

    if (urlParams.fromExternalSrc) {
      storageService().setObject(
        'risk-entry-params',
        pick(
          urlParams,
          [
            'amount',
            'flow',
            'term',
            'type',
            'year', 
            'subType',
            'hideRPReset',
            'hideClose',
            'internalRedirect'
          ]
        )
      );
    } else {
      urlParams = storageService().getObject('risk-entry-params') || {};
    }
    // return entryParams;

    return urlParams;
  }
  
  async componentDidMount() {
    storageService().setObject('useNewFlow', this.props.useNewFlow);
    try {
      // let score = JSON.parse(window.sessionStorage.getItem('score'));
      const res = await Api.get('/api/risk/profile/user/recommendation');
      const score = get(res, 'pfwresponse.result.score');
      if (!isEmpty(score) && score.score) {

        if (this.state.params.type === 'saveforgoal') {
          const { pfwresponse: { result: recommRes }} = await Api.get('/api/invest/recommendv2', {
            type: 'investsurplus',
            term: parseInt(this.state.params.year - new Date().getFullYear(), 10),
            rp_enabled: true,
          });

          this.setState({
            stockSplit: recommRes.recommendation.equity,
            bondSplit: recommRes.recommendation.debt,
            stockReturns: recommRes.recommendation.expected_return_eq,
            bondReturns: recommRes.recommendation.expected_return_debt,
          });
        }

        this.setState({
          score: score,
          show_loader: false,
        });
      } else {
        this.navigate('intro', true);
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname, replace, state) => {
    let params = {
      indicator: (this.state.score) ? this.state.score.indicator : false
    };

    if (!replace) {
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        params,
        state: state
      });
    } else {
      this.props.history.replace({
        pathname: pathname,
        search: getConfig().searchParams,
        params,
      });
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Risk Analyser',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Result',
        "risk_tolerance": this.state.score.indicator,
        flow: this.state.params.flow || 'risk analyser',
      }
    };
    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  redirectToInvestFlow = () => {
    const entryParams = this.state.params || {};

    if (entryParams.type === 'saveforgoal') {
      this.navigate(`/invest/savegoal/${entryParams.subType}/amount`);
    } else {
      this.navigate(
        '/invest/recommendations',
        false,
        {
          fromRiskProfiler: true,
        }
      );
    }
  }

  handleClick = async () => {
    this.sendEvents('next');
    if (!this.props.useNewFlow) {
      this.navigate('recommendation');
      return;
    }
   
    const openWebModule = getConfig().isWebOrSdk;
    if (openWebModule) {
      if (get(this.state, 'params.internalRedirect')) {
        this.redirectToInvestFlow();
      } else {
        this.navigate('/');
      }
    } else {
      const entryParams = this.state.params || {};

      if (!entryParams.type) {
        // When coming from anywhere except from within funnel
        nativeCallback({ action: 'exit' });
        return;
      }

      let messageBody = pick(
        entryParams,
        ['amount', 'flow', 'term', 'type', 'year', 'subType']
      );
      if (entryParams.type === 'saveforgoal') {
        const monthlyAmount = this.calculateMonthlyAmount(
          parseInt(entryParams.year - new Date().getFullYear(), 10),
          entryParams.amount
        );
        messageBody.monthlyAmount = monthlyAmount;
      }
      nativeCallback({
        action: 'on_success',
        message: messageBody,
      });
    }
  }

  calculateMonthlyAmount = (term, corpusValue) => {
    var n = term * 12;
    var r = this.getRateOfInterest();
    var a = corpusValue;
    var i = (r / 12) / 100;
    var tmp = Math.pow((1 + i), n) - 1;
    var monthlyInvestment = (a * i) / tmp;
    var monthlyAmount = monthlyInvestment;
    if (monthlyAmount < 500) {
      monthlyAmount = 500;
    }
    return Math.floor(monthlyAmount);
  }

  getRateOfInterest = () => {
    var range = Math.abs(this.state.stockReturns - this.state.bondReturns);
    if (this.state.stockSplit < 1) {
      return this.state.bondReturns;
    } else if (this.state.stockSplit > 99) {
      return this.state.stockReturns;
    } else {
      var rateOffset = (range * this.state.stockSplit) / 100;
      return this.state.bondReturns + rateOffset;
    }
  }

  redirectUrlBuilder = () => {
    const entryParams = this.state.params;
    let webPath = '';

    if (entryParams.type === 'saveforgoal') {
      const monthlyAmount = this.calculateMonthlyAmount(
        parseInt(entryParams.year - new Date().getFullYear(), 10),
        entryParams.amount
      );
      webPath = "invest/savegoal/" +
        `${entryParams.subType}/` +
        `${entryParams.year}/` +
        `${monthlyAmount}/` +
        `${entryParams.amount}`;
      return getConfig().webAppUrl + webPath; 
    } 
    
    if (!entryParams.type) {
      webPath='invest';
    } else {
      webPath = 'risk-v2/recommendations';
    }

    return getConfig().webAppUrl + 
      webPath + '?' +
      'amount=' + entryParams.amount +
      '&type=' + entryParams.type +
      '&term=' + entryParams.term +
      '&flow=' + entryParams.flow +
      '&fromRisk=true';
  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialogReset}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset all the questions ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default">
            No
          </Button>
          <Button onClick={this.handleReset} color="default" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  showDialog = () => {
    this.setState({ openDialogReset: true });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openDialogReset: false,
      show_loader: false
    });
    this.sendEvents('restart_no');
  }

  handleReset = async () => {
    this.sendEvents('restart_yes');
    this.setState({
      openDialog: false, openDialogReset: false, show_loader: true
    });

    try {

      const res = await Api.delete('/api/risk/profile/user/questionnaire');
      this.setState({
        show_loader: false
      });
      if (res.pfwresponse.result.message === 'success') {
        window.sessionStorage.setItem('questionnaireResponse', '');
        this.navigate('intro');
      } else {
        toast(res.pfwresponse.result.message || res.pfwresponse.result.console.error
          || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  showDialog = () => {
    this.setState({ openDialogReset: true });
  }

  getScoreDataProp(prop) {
    const score = this.state?.score?.score;
    if (score) {
      return riskProfileMap[score][prop] || '';
    }
  }

  renderPageLoader = () => {
    if (!this.state.score) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  allowReset = () => {
    return !["true", true].includes(this.state.params.hideRPReset);
  }

  renderUi() {
    if (this.state.score) {
      return (
        <Container
          showLoader={this.state.show_loader}
          title="Risk Tolerance"
          classOverRide="result-container-risk"
          classOverRideContainer="result-container-risk"
          handleClick={this.handleClick}
          edit={this.props.edit}
          buttonTitle="Invest Now"
          handleReset={this.showDialog}
          resetpage={this.allowReset()}
          events={this.sendEvents('just_set_events')}
        >
          {this.state.score ?
            <>
              <div className="meter-img">
                <img
                  src={this.getScoreDataProp('img')}
                  alt="meter"
                />
              </div>
              <div className="risk-meter-desc" style={{ textAlign: 'center' }}>
                <div className="risk-meter-desc-title">{this.getScoreDataProp('title')}</div>
                <div className="risk-meter-desc-content" style={{}}>{this.getScoreDataProp('contennt')}</div>
              </div>
            </> :
            <div className="risk-result-error">
              <b>Oops! No risk profile found.</b>
              <br />
              <br />
              Please click the restart icon to redo your risk questionnaire
            </div>
          }
        </Container>
      )
    } else {
      return (
        <Container
          showLoader={true}
        >
        </Container>
      )
    }
  }

  render() {
    return (
      <div style={{height:'inherit'}}>
        {this.renderUi()}
        {this.renderDialog()}
        {this.renderPageLoader()}
      </div>
    );
  }
}

export default Result;
