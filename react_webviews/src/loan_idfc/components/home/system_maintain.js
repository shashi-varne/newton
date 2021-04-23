import React, { Component } from "react";
import Container from "../../common/Container";
import { initialize } from "../../common/functions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screen_name: "home_screen",
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {};

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        hidePageTitle={true}
        noFooter={true}
      >
        <div className="system-maintainence">
            System is under maintainence
            <div style={{fontSize:'15px', marginTop:'10px'}}>Please try again after some time ...</div>
        </div>
      </Container>
    );
  }
}

export default Home;
