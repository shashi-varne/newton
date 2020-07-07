import React, { Component } from 'react';
import Container from '../../common/Container';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class GroupHealthLanding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      type: getConfig().productName
    }
  }


  async componentDidMount() {

    try {
      const res = await Api.get('/api/ins_service/api/insurance/application/summary')

      this.setState ({
          show_loader: false
      });
      var resultData = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200) {

        this.setState({
          resultData: resultData
        })


      } else {
        toast(resultData.error || resultData.message
          || 'Something went wrong');
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

  handleClick = () => {

  }


  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'health_insurance',
       "properties": {
        "user_action": user_action,
        "product": 'health suraksha',
                "flow": this.state.insured_account_type || '',
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
        title="Insurance"
        fullWidthButton={true}
        buttonTitle="YoYo"
        onlyButton={true}
        handleClick={() => this.handleClick()}
    >
      </Container>
    );
  }
}

export default GroupHealthLanding;