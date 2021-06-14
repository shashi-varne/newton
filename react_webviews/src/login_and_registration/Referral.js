
import React, { Component } from 'react';
import Container from "../dashboard/common/Container";
import { getConfig } from 'utils/functions';


class Referral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      insurance_details: {},
      productName: getConfig().productName,
    }
  }

  componentWillMount() {


  }


  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        onlyButton={true}
        // handleClick={() => this.handleClick()}
        buttonTitle="GIVE ME A CALL"
        showLoader={this.state.show_loader}
        title="Let's talk &#38; help you out">



        <h>hello man!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</h>




      </Container>
    )
  }
}

export default Referral;
