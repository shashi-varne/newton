import React, { Component } from 'react';
import Container from '../common/Container';


class StatementRequest extends Component {
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
        </div>
      </Container>
    );
  }
}

export default StatementRequest;