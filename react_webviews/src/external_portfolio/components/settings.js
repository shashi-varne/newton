import React, { Component } from 'react';
import Container from '../common/Container';
import EmailExpand from '../mini-components/EmailExpand';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container
        title="Investment email ids"
        subtitle="Resync to track the recent transactions in your portfolio"
        buttonTitle="Add new email"
      >
        <EmailExpand parent={this} comingFrom="settings"></EmailExpand>
        <EmailExpand parent={this} comingFrom="settings"></EmailExpand>
        {/* <EmailExpand></EmailExpand>
        <EmailExpand></EmailExpand>
        <EmailExpand></EmailExpand>
        <EmailExpand></EmailExpand>
        <EmailExpand></EmailExpand>
        <EmailExpand></EmailExpand> */}
      </Container>
    );
  }
}