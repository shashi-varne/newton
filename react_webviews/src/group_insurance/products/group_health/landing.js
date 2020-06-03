import React, { Component } from 'react';
import Container from '../../common/Container';

// import Api from 'utils/api';
// import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {health_providers} from '../../constants';

class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
    //   show_loader: true,
      type: getConfig().productName,
      provider: 'HDFC_ERGO'
    }
  }

  componentWillMount() {
    this.setState({
      providerData: health_providers[this.state.provider]
    })
  }


  async componentDidMount() {

    // try {
    //   const res = await Api.get('/api/ins_service/api/insurance/application/summary')

    //   this.setState ({
    //       show_loader: false
    //   });
    //   var resultData = res.pfwresponse.result;
    //   if (res.pfwresponse.status_code === 200) {

    //     this.setState({
    //       resultData: resultData
    //     })


    //   } else {
    //     toast(resultData.error || resultData.message
    //       || 'Something went wrong');
    //   }
    // } catch (err) {
    //   console.log(err)
    //   this.setState({
    //     show_loader: false
    //   });
    //   toast('Something went wrong');
    // }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: this.state.provider + '/' + pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = () => {
    this.navigate('insure-type')
  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_suraksha',
      "properties": {
        "user_action": user_action,
        "screen_name": 'insurance'
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
        title={this.state.providerData.title}
        fullWidthButton={true}
        buttonTitle="Get insured"
        onlyButton={true}
        handleClick={() => this.handleClick()}
    >
                <div className="common-top-page-subtitle-dark">
                    {this.state.providerData.subtitle}
                </div>

                <div className="group-health-landing">
                
                  
                </div>
      </Container>
    );
  }
}

export default GroupHealthLanding;