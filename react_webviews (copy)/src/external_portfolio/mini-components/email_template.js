import React, { Component } from 'react';
import Container from '../common/Container';
import InfoBox from './InfoBox';

class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container
        title={this.props.title}
        subtitle={this.props.subtitle}
        goBack={this.props.goBack}
        {...this.props}
      >
        <div>
          <div className="ext-pf-subheader">
            <h4>Search your email under</h4>
            <InfoBox
              classes={{ root: 'info-box-cut-out'}}
              isCopiable={true}
              textToCopy="Consolidated Account Statement - CAMS Mailback Request"
            >
              <span className="info-box-body-text">
                Consolidated Account Statement - CAMS Mailback Request
              </span>
            </InfoBox>
          </div>
          <div className="ext-pf-subheader">
            <h4>Email looks like this</h4>
            <img
              src={require('assets/cas_email.jpg')}
              alt="Email"
              className="email_img"
              width="100" height="200"
            />
          </div>
          {this.props.children}
        </div>
      </Container>
    );
  }
}

export default EmailTemplate;