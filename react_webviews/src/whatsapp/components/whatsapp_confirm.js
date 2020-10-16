import React, { Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { initialize } from "../common/functions";
import { getConfig } from "utils/functions";

class WhastappConfirmNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
    };

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  sendEvents(user_action) {
    let eventObj = {
      event_name: "whatsapp_updates",
      properties: {
        user_action: user_action,
        screen_name: "confirm mobile number",
      },
    };

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleClick = () => {
    this.navigate('whatsapp-edit')
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="WhatsApp mobile number"
        events={this.sendEvents("just_set_events")}
        handleClick={this.handleClick}
        buttonTitle="CONFIRM"
        headerData={{
          icon: "close",
        }}
      >
        <div style={{fontSize:'13px', color:'#8D879B', marginBottom:'20px'}}>
          Tap on confirm to proceed further or click on edit to change your
          WhatsApp number
        </div>

        <div style={{backgroundColor: "#f7f6fc", borderStyle:'dashed', borderColor:'#DFD8EF', borderWidth:'2px'}}>
          <div style={{fontSize: '15px', padding: '20px 20px'}}>
            +9
            <span style={{fontWeight: '1000', color: '#4f2da7', letterSpacing: '2'}}>
              1 797 512 3538
            </span>
            <span style={{fontSize: '13px', fontWeight:'bold', color:'#00bc32', float:'right'}} onClick={this.handleClick}>
              EDIT
            </span>
          </div>
        </div>
      </Container>
    );
  }
}

export default WhastappConfirmNumber;
