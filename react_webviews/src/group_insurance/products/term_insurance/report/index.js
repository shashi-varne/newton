import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../../common/ui/Toast';
import Container from '../../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import Grid from 'material-ui/Grid';
import cover_period from 'assets/cover_period_icon.png';
import claim_settle_icn from 'assets/claim_settle_icn.png';
import nominee from 'assets/personal_details_icon.svg';
import { inrFormatDecimal } from '../../../../utils/validators';
import dropdown_arrow_fisdom from 'assets/fisdom/down_arrow_fisdom.svg';
import dropdown_arrow_myway from 'assets/down_arrow_myway.svg';

import dropup_arrow_fisdom from 'assets/fisdom/down_arrow_fisdom.svg';
import dropup_arrow_myway from 'assets/down_arrow_myway.svg';

class FinalReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      type: getConfig().productName,
      expendAddOnOpen: false
    }
  }

  async componentDidMount() {

    nativeCallback({ action: 'take_control_reset' });
    this.setState({
      dropdown_arrow: this.state.type !== 'fisdom' ? dropdown_arrow_myway : dropdown_arrow_fisdom,
      dropup_arrow: this.state.type !== 'fisdom' ? dropup_arrow_myway : dropup_arrow_fisdom
    })
    try {
      const res = await Api.get('/api/insurance/all/summary');
      this.setState({
        show_loader: false
      });
      let application;

      if (res.pfwresponse.status_code === 200 && res.pfwresponse.result.insurance_apps) {
        if (res.pfwresponse.result.insurance_apps.init.length > 0) {
          application = res.pfwresponse.result.insurance_apps.init[0];
        } else if (res.pfwresponse.result.insurance_apps.submitted.length > 0) {
          application = res.pfwresponse.result.insurance_apps.submitted[0];
        } else if (res.pfwresponse.result.insurance_apps.complete.length > 0) {
          application = res.pfwresponse.result.insurance_apps.complete[0];
        } else {
          application = res.pfwresponse.result.insurance_apps.failed[0];
        }

        this.setState({
          application: application,
          name: (application.provider === 'Maxlife' ? application.profile.first_name :
            application.profile.name)
        });
      } else {
        toast(res.pfwresponse.result.error || 'Something went wrong');
      }

    } catch (err) {
      console.log(err)
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

  expendAddOn() {
    this.setState({
      expendAddOnOpen: !this.state.expendAddOnOpen
    })
  }

  renderUi() {
    if (this.state.application) {
      return (

        <div className="ins-report-tiles">

          <div className="ins-report-tiles1">
            Hey
            <span className="ins-report-tiles1a" style={{ textTransform: 'capitalize' }}> {this.state.name}, </span>
            You have done an excellent job,
            <span className="ins-report-tiles1b"> pay your premiums on time </span>
            & get benefits-
          </div>

          <div className="ins-report-tiles2">
            <div className="ins-report-tiles2a">
              <img className="ins-report-tiles2b" src={this.state.application.quote.quote_provider_logo} alt="Report" />
            </div>
            <div className="ins-report-tiles2c">
              <div className="ins-report-tiles2d">ID: OB11326236</div>
              <div className="ins-report-tiles2e">Premium</div>
              <div className="ins-report-tiles2f">1,11,115 Yearly</div>
            </div>
          </div>

          <div className="ins-report-tiles3" style={{ marginTop: 6 }}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={6}>
                <div className="Title">
                  <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="Icon" style={{ marginRight: 15 }}>
                      <img src={nominee} width="40" alt="" className="journey-image-top" />
                    </div>
                    <div className="Text">
                      <div style={{ color: '#4a4a4a' }}>Insurance for</div>
                      <div className="journey-top-text2" style={{ textTransform: 'capitalize' }}>
                        {this.state.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="Icon" style={{ marginRight: 15 }}>
                    <img src={cover_period} alt="" width="40" />
                  </div>
                  <div className="Text">
                    <div style={{ color: '#4a4a4a' }}>Cover period</div>
                    <div className="journey-top-text2">{this.state.application.quote.term} years</div>
                  </div>
                </div>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={6}>
                <div className="Title">
                  <div className="Item" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="Icon" style={{ marginRight: 15 }}>
                      <img src={claim_settle_icn} alt="" width="40" />
                    </div>
                    <div className="Text">
                      <div style={{ color: '#4a4a4a' }}>Cover</div>
                      <div className="journey-top-text2">{inrFormatDecimal(this.state.application.quote.cover_amount)}</div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* add on benefits */}
          <div className="ins-report-bottom-dropdown">
            <div className="ins-report-bottom-dropdown1" onClick={() => this.expendAddOn()}>
              <div className="ins-report-bottom-dropdown1a">
                <span className="ins-report-bottom-dropdown1b">Nominee details</span>
                <img className="ins-report-bottom-dropdown1c"
                  src={!this.state.expendAddOnOpen ? this.state.dropdown_arrow : this.state.dropdown_arrow} alt="Insurance" />
              </div>
            </div>
            {this.state.expendAddOnOpen &&
              <div className="ins-report-bottom-dropdown-opened" style={{ marginTop: 10 }}>
                <div style={{
                  justifyContent: 'space-between', display: 'flex',
                  margin: '0 40px 0 20px'
                }}>
                  <div className="ins-report-bottom-dropdown-opened1">
                    <span className="ins-report-bottom-dropdown-opened2">Name: </span>
                    <span className="ins-report-bottom-dropdown-opened3">
                      {this.state.application.profile.nominee.name}</span>
                  </div>
                  <div className="ins-report-bottom-dropdown-opened1">
                    <span className="ins-report-bottom-dropdown-opened2">DOB: </span>
                    <span className="ins-report-bottom-dropdown-opened3">
                      {this.state.application.profile.nominee.dob}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', margin: '6px 0 0 20px' }}>
                  <div className="ins-report-bottom-dropdown-opened1">
                    <span className="ins-report-bottom-dropdown-opened2">Relationship: </span>
                    <span className="ins-report-bottom-dropdown-opened3">
                      {this.state.application.profile.nominee.relationship}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      );
    }
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'term_insurance ',
      "properties": {
        "user_action": user_action,
        "screen_name": 'report'
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
        classOverRide="insurance-container-grey-report"
        classOverRideContainer="insurance-container-grey-report"
        showLoader={this.state.show_loader}
        title="Term Insurance"
        noFooter={true}
      >
        {this.renderUi()}
      </Container>
    );
  }
}

export default FinalReport;
