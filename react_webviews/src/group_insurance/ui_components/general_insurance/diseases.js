import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
class RenderDiseasesClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      diseasesData: {
        product_diseases_covered: []
      },
      type: getConfig().productName,
      color: getConfig().styles.primaryColor,
    };

    this.handleClickCurrent = this.handleClickCurrent.bind(this);
  }

  componentWillMount() {
   
    let { params } = this.props.location || {};
    this.setState({
        diseasesData: params ? params.diseasesData : {
            product_diseases_covered: []
        },
    })
  }
  
  renderDiseases = (props, index) => {
    return (
      <div key={index} className={`plan-details-item ${(props.isDisabled) ? 'disabled' : ''}`}>
        <div className="plan-diseases-text">{index + 1}. {props}</div>
      </div>
    )
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  async handleClickCurrent() {
    this.sendEvents('next');
    this.props.history.goBack();
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": '',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Back To Plan'
        onlyButton={true}
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        handleClick={() => this.handleClickCurrent()}
        title={this.state.diseasesData.dieseasesTitle}
        classOverRideContainer="accident-plan">
     
          <div style={{ marginTop: '40px',marginBottom: 40, padding: '0 15px' }}>
            <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>Diseases covered</div>

            <div className="plan-details">
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {this.state.diseasesData && this.state.diseasesData.product_diseases_covered &&
                this.state.diseasesData.product_diseases_covered.map(this.renderDiseases)}
            </div>
          </div>

      
      </Container>
    );
  }
}

const RenderDiseasesComponent = (props) => (
  <RenderDiseasesClass
    {...props} />
);

export default RenderDiseasesComponent;