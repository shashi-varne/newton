import React, { Component } from 'react';
import InfoBox from './InfoBox';

class EmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyText: `Consolidated Account Statement - ${this.props.statementSource === 'cams' ? 'CAMS' : 'KFINTECH' } Mailback Request`
    };
  }

  render() {
    return (
      <div>
        <div className="ext-pf-subheader">
          <h4>{this.props.imageTitle}</h4>
          <img
            src={require(`assets/${this.props.statementSource === 'cams' ? 'cas' : 'karvy'}_email.png`)}
            alt="Email"
            className="email_img"
            width="100" height="200"
          />
        </div>
        <div className="ext-pf-subheader">
          <h4>Search your email under</h4>
          <InfoBox
            classes={{ root: 'info-box-cut-out' }}
            isCopiable={true}
            textToCopy={this.state.copyText}
          >
            <span className="info-box-body-text">
              {this.state.copyText}
            </span>
          </InfoBox>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default EmailTemplate;