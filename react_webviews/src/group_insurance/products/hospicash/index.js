import React, { Component } from 'react';
import Container from '../../common/Container';

class Test extends Component {
  render() {
    return (
      <Container
        noFooter={true}
        title="Test">
        <div>
          Hello
        </div>
      </Container>
    );
  }
}

export default Test;