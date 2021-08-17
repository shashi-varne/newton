import React, { Component } from "react";
import Container from './Container';
import {Imgc} from 'common/ui/Imgc'

class SystemMaintainence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen_name: "system_maintainence",
    };
  }

  render() {
    return (
      <Container
        hidePageTitle={true}
        noFooter={true}
      >
        <div className="system-maintainence">
           <Imgc src={require(`assets/term_ins_system_maintenance.svg`)} alt="" />
        </div>
      </Container>
    );
  }
}

export default SystemMaintainence;
