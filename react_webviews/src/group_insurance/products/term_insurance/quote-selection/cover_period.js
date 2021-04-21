import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig, manageDialog } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import cover_age_icn from 'assets/cover_age_icn.png';
import DropdownInPage from '../../../../common/ui/DropdownInPage';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent
} from 'material-ui/Dialog';

import { checkValidNumber } from 'utils/validators';

class CoverPeriod extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.sessionStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      selectedIndex: checkValidNumber(quoteData.selectedIndexCoverPeriod, ''),
      cover_period: 0,
      coverPeriodList: [],
      quoteData: quoteData,
      info_clicked: 'no'
    }
    this.setValue = this.setValue.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/recommend/cover_term?dob=' + this.state.quoteData.dob)
      this.setState({
        show_loader: false
      });
      let result = res.pfwresponse.result;
      let coverPeriodList = result.list;
      coverPeriodList.push(result.recommendation);
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          coverPeriodList: coverPeriodList,
          recommendation: result.recommendation
        });
        for (var i = 0; i < coverPeriodList.length; i++) {
          if (result.recommendation === coverPeriodList[i]) {
            this.setState({
              selectedIndex: checkValidNumber(this.state.selectedIndex, i),
              recommendedIndex: i
            })
            this.setValue(this.state.selectedIndex);
          }
        }
      } else {
        toast(result.error || result.message);
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
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    this.sendEvents('next');
    let quoteData = this.state.quoteData;
    quoteData.cover_period = this.state.cover_period;
    quoteData.selectedIndexCoverPeriod = this.state.selectedIndex;
    quoteData.coverPeriodList = this.state.coverPeriodList;
    quoteData.recommendedIndexCoverPeriod = this.state.recommendedIndex;
    window.sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('lifestyle')
  }

  setValue(index) {
    this.setState({
      selectedIndex: index,
      cover_period: this.state.coverPeriodList[index]
    })
  }

  handleClose = () => {
    manageDialog('general-dialog', 'flex', 'enableScroll');
    this.setState({
      openPopUp: false
    });
  }

  openPopUp() {
    this.setState({
      openPopUp: true,
      info_clicked: 'yes'
    })
    manageDialog('general-dialog', 'flex', 'disableScroll');
  }

  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <Dialog
          style={{ borderRadius: 6 }}
          id="general-dialog"
          open={this.state.openPopUp}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className="annual-inc-dialog" id="alert-dialog-description">
              <div className="annual-inc-popup-title">
                Cover Period
             </div>

              <div className="annual-inc-popup-title-inside">
                Cover period:
             </div>
              <div className="annual-inc-popup-content">
                Cover defines the coverage period of the policy. In case something happens with
                 your life within the covered period, your family will get the benefits as per
                 policy.
             </div>

              <div className="annual-inc-popup-title-inside">
                <span style={{ textTransform: 'capitalize' }}>{this.state.type}</span> recommendation
             </div>
              <div className="annual-inc-popup-content">
                Get your family covered for atleast till the time you celebrate
                your 70th Birthday.
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

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'cover_period',
        'cover_period': this.state.cover_period,
        'info': this.state.info_clicked
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Cover Period"
        count={true}
        total={5}
        current={4}
        handleClick={this.handleClick}
        buttonTitle="Next"
        fullWidthButton={true}
        onlyButton={true}
        closePopup={this.handleClose}
      >

        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={cover_age_icn} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>I would like to cover my family</div>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: '4px 0 0 0px', fontSize: 16, color: ' #4a4a4a' }}>for the next</div>
              <div className="annual-income-data-mid" style={{
                width: 'fit-content', margin: '3px 0 0 7px',
                minWidth: 30, textAlign: 'center'
              }}>
                {this.state.cover_period}
              </div>
              <div style={{ margin: '4px 0 0 8px', fontSize: 16, color: ' #4a4a4a' }}>years</div>
            </div>
          </div>
          <div className="annual-income-info-button"
            style={{ color: getConfig().styles.primaryColor }}
            onClick={() => this.openPopUp()}>INFO</div>
        </div>

        <div style={{ marginTop: 60 }}>
          <DropdownInPage
            options={this.state.coverPeriodList}
            value={this.state.selectedIndex}
            onChange={this.setValue}
            recommendedIndex={this.state.recommendedIndex}
            keyToShow="value" />
        </div>
        {this.renderPopUp()}
      </Container>
    );
  }
}

export default CoverPeriod;
