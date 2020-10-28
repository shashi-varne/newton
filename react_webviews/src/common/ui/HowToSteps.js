import React, { Component } from 'react';
import './style.scss';
import '../theme/Style.scss';
import { getConfig } from 'utils/functions';

class HowToStepsClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: this.props.baseData,
      productName: getConfig().type
    };
  }

  renderList = (option, index) => {
    return (
      <div key={index} className="tile">
        {option.icon && <img className="icon"
          src={require(`assets/${this.state.productName}/${option.icon}.svg`)} alt="Gold" />}
        {option.img && <img className="icon"
          src={option.img} alt="Gold" />}
        <div className="content">
          {this.state.baseData.show_index && <span> {index + 1}. </span>}
          <div className="content">
            {option.title && <div className="content-title">{option.title}</div>}
            {option.subtitle && <div className="content-subtitle">{option.subtitle}</div>}
          </div>
        </div>
      </div>
    );
  }

  render() {

    return (

      <div className="common-how-steps" style={{ border: 'none', ...this.props.style }}>
        {this.state.baseData.title && <div className="top-tile">
          <div className="generic-page-title">
            {this.state.baseData.title}
          </div>
        </div>}

        <div className='common-steps-images' style={{ margin: '-10px 0 0 0' }}>
          {this.state.baseData.options.map(this.renderList)}
        </div>
      </div>

    );

  }
}

const HowToSteps = (props) => (
  <HowToStepsClass
    {...props} />
);

export default HowToSteps;
