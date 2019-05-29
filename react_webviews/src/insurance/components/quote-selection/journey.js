import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';

import process_success from 'assets/completed_step.svg';
import wait_icn from 'assets/not_done_yet_step.svg';
import in_process_icn from 'assets/current_step.svg';

class JourneyIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
    }
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

    let journeyData = [
      {
        title: 'Step-1',
        disc: 'Share basic details and answer few questions to choose the right insurance',
        status: 'init'
      },
      {
        title: 'Step-2',
        disc: 'Complete Insurance Application',
        status: 'pending'
      },
      {
        title: 'Step-3',
        disc: 'Pay first premium',
        status: 'pending'
      },
      {
        title: 'Step-4',
        disc: 'Share relevant documents',
        status: 'pending'
      }
    ];
    this.setState({
      journeyData: journeyData
    })
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/profile/' + this.state.params.insurance_id, {
        groups: 'personal,professional,contact'
      })
      const { name, } = res.pfwresponse.result.profile;
      const { provider } = res.pfwresponse.result.quote_desc;

      this.setState({
        show_loader: false,
        name: name || '',
        provider: provider
      });
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
    this.navigate('personal-details-intro')
  }

  renderJourney(props, index) {
    return (
      <div key={index} className={'journey-process2 ' + (props.status === 'complete' ? 'journey-process2-green' :
        ((props.title === 'Step-4' && props.status !== 'complete') ||
          (props.title === 'Step-5' && props.status === 'init')) ? 'journey-process2-unset' : '')}>
        <div className="journey-process3">
          <img className="journey-process4" src={props.status === 'complete' ? process_success :
            props.status === 'init' ? in_process_icn : wait_icn} alt="" />
        </div>
        <div className="journey-process5">
          <div className={'journey-process6 ' + (props.status === 'pending' ? 'journey-process7-grey' : '')}>{props.title}</div>
          <div className={'journey-process7 ' + (props.status === 'complete' ? 'journey-process7-black' :
            props.status === 'init' ? 'journey-process7-blue' : 'journey-process7-grey')}>{props.disc}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Insurance Journey"
        handleClick={this.handleClick}
        buttonTitle="Let’s start"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >
        <div className="journey-process1">
          {this.state.journeyData && this.state.journeyData.map(this.renderJourney)}
        </div>
      </Container>
    );
  }
}

export default JourneyIntro;
