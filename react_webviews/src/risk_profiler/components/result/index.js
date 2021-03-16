import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import conservative from 'assets/meter-conservative.svg';
import moderatelyConservative from 'assets/meter-moderately-conservative.svg';
import moderate from 'assets/meter-moderate.svg';
import moderatelyAggresive from 'assets/meter-moderately-aggresive.svg';
import aggresive from 'assets/meter-aggresive.svg';
import { nativeCallback } from 'utils/native_callback';

import Api from 'utils/api';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { getUrlParams, isEmpty, storageService } from '../../../utils/validators';
import { pick, get } from 'lodash';

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
    // const entryParams = storageService().getObject('risk-entry-params') || {};
    if (urlParams.fromExternalSrc) {
      storageService().setObject(
        'risk-entry-params',
        pick(urlParams, ['amount', 'flow', 'term', 'type', 'year', 'subType', 'partner_code', 'hideRPReset'])
      );
      storageService().set('flow', urlParams.flow);
    } else {
      urlParams = storageService().getObject('risk-entry-params') || {};
    }
    // return entryParams;

    return urlParams;
  }

  async componentDidMount() {
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
        storageService().setObject('useNewFlow', this.props.useNewFlow);
        this.navigate('intro', true);
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname, replace) => {
    let params = {
      indicator: (this.state.score) ? this.state.score.indicator : false
    };

    if (!replace) {
      this.props.history.push({
        pathname: pathname,
        search: getConfig().searchParams,
        params,
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
        flow: this.state.params.flow,
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
    if (!this.props.useNewFlow) {
      this.navigate('recommendation');
      return;
    }
   
    const openWebModule = getConfig().isWebCode;
    if (openWebModule) {
      window.location.href = this.redirectUrlBuilder();
    } else {
      nativeCallback({ action: 'exit' });
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
    // const webview_redirect_url = encodeURIComponent(
    //   window.location.origin +
    //   '/risk/recommendation' +
    //   getConfig().searchParams
    // );
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
      '&fromRisk=true';
      // '&webview_redirect_url=' + webview_redirect_url;
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

  getScoreData(score) {
    let map = {
      1: {
        title: 'Conservative Investor',
        contennt: 'Investor like you are comfortable in accepting lower returns for a higher degree of liquidity or stability. Typically, a Conservative investor primarly seeks to minimize risk and loss of money.',
        img: conservative
      },
      2: {
        title: 'Moderately Conservative Investor',
        contennt: 'You have a low risk appetite. Consistent and sustainable returns are what you as an investor need.',
        img: moderatelyConservative
      },
      3: {
        title: 'Moderate Investor',
        contennt: 'You have a moderate tolerance for risk, investors like you values reducing risks and enhancing returns equally. Also, moderate investors are willing to accept modest risks to seek higher long-term returns.',
        img: moderate
      },
      4: {
        title: 'Moderately Aggresive Investor',
        contennt: 'You are ready to take high risk by investing in risky bets. You seem to be okay with risks as long as the reward compensates well.',
        img: moderatelyAggresive
      },
      5: {
        title: 'Aggressive Investor',
        contennt: 'You have a very high tolerance for risk, investors like you prefer to stay in the market in times of extreme volatility in exchange for the possibility of receiving high relative returns over the time to outpace inflation.',
        img: aggresive
      }
    }

    return map[score];
  }

  getImg(score) {
    let map = {
      1: conservative,
      2: moderatelyConservative,
      3: moderate,
      4: moderatelyAggresive,
      5: aggresive

    }
    return map[score];
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
          buttonTitle="Fund Recommendation"
          topIcon={this.state.params.hideRPReset !== "true" ? '' : "restart"}
          handleReset={this.showDialog}
          resetpage={this.state.params.hideRPReset !== "true"}
          events={this.sendEvents('just_set_events')}
        >
          <div className="meter-img">
            {this.state.score && <img style={{ width: '70%' }} src={this.getScoreData(this.state.score.score).img} alt="meter" />}
          </div>
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <div style={{ color: '#ffffff', fontSize: 16, marginBottom: 20 }}>{this.getScoreData(this.state.score.score).title}</div>
            <div style={{ color: '#f2f2f2', fontSize: 14 }}>{this.getScoreData(this.state.score.score).contennt}</div>
          </div>
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
