import React, { Component, Fragment } from 'react';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import { fetchFHCReport } from '../../common/ApiCalls';
import { nativeCallback, openModule } from 'utils/native_callback';
import { capitalize, storageService } from '../../../utils/validators';
import PopUp from '../../common/PopUp';
import { navigate } from '../../common/commonFunctions';

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      report: {},
      openPopup: false,
      show_loader: true,
      popupText: '',
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      const report = await fetchFHCReport(); 
      this.setState({
        report,
        show_loader: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false
      });
      toast(err);
    }
  }

  sendEvents = (user_action, flow, screen_name = 'fhc result') => {
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        screen_name,
        user_action,
        flow,
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClose = () => {
    this.sendEvents('no', null, 'refresh');
    this.setState({
      openPopup: false,
    });
  }

  handleOpen = () => {
    this.sendEvents('yes', null, 'refresh');
    this.sendEvents('next', 'refresh');
    this.navigate('/fhc', { refresh: true });
  }

  restartFHC = () => {
    this.setState({
      openPopup: true,
      popupText: <Fragment>
        Are you sure you want to <b>restart the FHC</b>?
        <br />We will save your information securely.
      </Fragment>,
    });
  }

  redirectToCTA = (cta_path) => {
    storageService().remove('fhc_data'); // remove cached fhc data
    this.sendEvents('next', 'invest');
    if (cta_path === 'invest/term_insurance') {
      this.navigate('/group-insurance/term/intro');
    } else {
      openModule(cta_path, this.props);
    }
  }

  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        banner={false}
        handleClick={this.handleClick}
        edit={this.props.edit}
        resetpage={true}
        topIcon="restart"
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
          ].map((type, i) => (
            <Card
              key={i}
              report={this.state.report[type] || {}}
              ctaRedirect={this.redirectToCTA}
            ></Card>
          ))
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

function Card({ report, ctaRedirect }) {
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
    cta_button = 
      <button
        className="card-report-cta_btn"
        onClick={() => ctaRedirect(report.CTA)}
      >{report.cta_title}</button>
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
