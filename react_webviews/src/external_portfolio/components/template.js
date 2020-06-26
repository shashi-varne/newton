import React, { Component } from 'react';
import Container from '../common/Container';


class StatementRequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container
        title="Statement request sent"
        noFooter={true}
      >
        <div className="ext-pf-subheader">
          <h4></h4>
        </div>
      </Container>
    );
  }
}

export default StatementRequestPage;