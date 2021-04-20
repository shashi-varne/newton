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
      <div key={index} className="cover-details-item">
        <div><img className="cover-details-icon" src={props.icon} alt="" /></div>
        <div>
          {props.header &&
            <div className="cover-details-header">{props.header}</div>
          }
          <div className="cover-details-text" style={{marginBottom: '20px'}}>{props.text}</div>
          <div className="cover-details-text">{props.text2}</div>
        </div>
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
        "screen_name": this.state.diseasesData.key,
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

        <div style={{ padding: '0 15px' }}>

          <div className="plan-details">
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: '20px', flexDirection : 'column' }}>
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