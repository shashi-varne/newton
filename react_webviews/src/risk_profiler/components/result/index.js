import React, { Component } from 'react';
import qs from 'qs';
import { getConfig } from 'utils/functions';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import meter1 from 'assets/meter1.svg';
import meter2 from 'assets/meter2.svg';
import meter3 from 'assets/meter3.svg';
import meter4 from 'assets/meter4.svg';
import meter5 from 'assets/meter5.svg';
import { nativeCallback } from 'utils/native_callback';

import Api from 'utils/api';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';


class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      openDialogReset: false,
      params: qs.parse(props.history.location.search.slice(1)),
      productName: getConfig().productName
    }
  }


  async componentDidMount() {
    try {

      // let score = JSON.parse(window.sessionStorage.getItem('score'));
      let score;
      const res = await Api.get('/api/risk/profile/user/recommendation');
      if (res.pfwresponse.result.score) {
        score = res.pfwresponse.result.score;
        this.setState({
          score: score,
          show_loader: false
        });
      } else {
        this.navigate('intro');
      }
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        indicator: (this.state.score) ? this.state.score.indicator : false
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Risk Analyser',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Result',
        "risk_tolerance": this.state.score.indicator
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
    this.navigate('recommendation');
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
        img: meter1
      },
      2: {
        title: 'Low risk Investor',
        contennt: 'You have a low risk appetite. Consistent and sustainable returns are what you as an investor need.',
        img: meter2
      },
      3: {
        title: 'Moderate Investor',
        contennt: 'You have a moderate tolerance for risk, investors like you values reducing risks and enhancing returns equally. Also, moderate investors are willing to accept modest risks to seek higher long-term returns.',
        img: meter3
      },
      4: {
        title: 'High risk Investor',
        contennt: 'You are ready to take high risk by investing in risky bets. You seem to be okay with risks as long as the reward compensates well.',
        img: meter4
      },
      5: {
        title: 'Aggressive Investor',
        contennt: 'You have a very high tolerance for risk, investors like you prefer to stay in the market in times of extreme volatility in exchange for the possibility of receiving high relative returns over the time to outpace inflation.',
        img: meter5
      }
    }

    return map[score];
  }

  getImg(score) {
    let map = {
      1: meter1,
      2: meter2,
      3: meter3,
      4: meter4,
      5: meter5

    }
    return map[score];
  }

  renderPageLoader = () => {
    if (!this.state.score) {
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
          topIcon="restart"
          handleReset={this.showDialog}
          resetpage={true}
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
