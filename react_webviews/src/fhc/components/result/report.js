import React, { Component, Fragment } from 'react';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';

import { capitalize } from '../../../utils/validators';
import { getConfig } from '../../../utils/functions';
import PopUp from '../../common/PopUp';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      report: {},
      openPopup: false,
      popupText: '',
    };
  }

  async componentDidMount() {
    try {
      const res = await Api.get('page/financialhealthcheck/view/mine', {
        format: 'json',
      });
      let report = res.pfwresponse.result;
      this.setState({
        report,
        show_loader: false,
      });
  
      console.log(report);
    } catch (e) {
      console.log(e);
      this.setState({
        show_loader: false
      });
      toast('Failed to fetch data. Please try again');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents = (user_action) => {
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'check results',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClose = () => {
    this.setState({
      openPopup: false,
    });
  }

  handleOpen = () => {
    this.navigate('/fhc');
  }

  restartFHC = () => {
    this.setState({
      openPopup: true,
      popupText: <Fragment>
        Are you sure you want to <b>restart the FHC</b>?
        <br />We will save your information securely.`
      </Fragment>,
    });
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        banner={false}
        handleClick={this.handleClick}
        edit={this.props.edit}
        resetpage={true}
        handleReset={this.restartFHC}
        noFooter={true}
        classOverRideContainer="bg-grey"
      >
        {
          [
            'investing',
            'tax',
            'life_insurance',
            'mediclaim',
            'dependents',
            'savings'
          ].map(type => <Card report={this.state.report[type] || {}}></Card>)
        }
      <PopUp
        openPopup={this.state.openPopup}
        popupText={this.state.popupText}
        handleNo={this.handleClose}
        handleYes={this.handleOpen}
        handleClose={this.handleClose}
      ></PopUp>
      </Container>
    );
  }
}

function Card({ report }) {
  if (!Object.keys(report).length) return '';
  let steps = [];
  
  let indicator_color = '';
  if (report.points < 3) indicator_color = '#ef0b0b';
  else if (report.points === 3) indicator_color = '#fcbd00';
  else indicator_color = '#35cb5d';

  for (var i = 0; i < 5; i++) {
    if (report.points > i) {
      steps.push(<span className='indicator'
        style={{ background: indicator_color }} key={i}></span>);
    } else {
      steps.push(<span className='indicator' key={i}></span>);
    }
  }

  let cta_button = '';
  if (report.cta_title) { // show cta button only if title exists
    cta_button = <button className="card-report-cta_btn">{report.cta_title}</button>
  }
  
  const summary = report.summary.split(' ').map(capitalize).join(' '); // Capitalize summary words
  return (
    <div className="card-report">
      <span className="card-report-summary">{summary}</span>
      <p className="card-report-data">{report.li[0]}</p>
      <div className="card-report-footer">
        {
          steps && <div className="health-indicator">
            {steps}
          </div>
        }
        {
          cta_button
        }
      </div>
    </div>
  )
}

export default Report;
