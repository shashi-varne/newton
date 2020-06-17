import React, { Component } from 'react';
import Container from '../common/Container';

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
        {...this.props}
      >
        <div>
          <div className="ext-pf-subheader">
            Search your email under
            <div class="info-box info-box-extra">
              <div class="info-box-body">
                <span id="info-box-body-text" className="info-box-body-text-extra">
                  Consolidated Account Statement - CAMS Mailback Request
                </span>
              </div>
              <div class="info-box-ctrl">
                <span>COPY</span>
              </div>
            </div>
          </div>
          <div className="ext-pf-subheader">
            Email looks like this
            <img
              src={require('../../assets/cas_email.jpg')}
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