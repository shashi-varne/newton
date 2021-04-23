import React, { Component } from 'react';
import './style.scss';
import '../theme/Style.scss';
import { getConfig } from 'utils/functions';
import {Imgc} from './Imgc';

class LandingStepsClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: this.props.baseData,
      productName: getConfig().productName
    };
  }

  renderList = (option, index) => {
    return (
      <div key={index} className="tile tile_step" onClick={() => {
        if(this.props.handleClick) {
          this.props.handleClick(option, index);
        }
      }}>
       <Imgc className={`icon ${this.props.classNameIcon}`}
          src={require(`assets/${this.state.productName}/${option.icon}.svg`)} alt={this.state.baseData.img_alt} />    
        <div className="content content_step">
            {option.title && <div className="content-title">{option.title}</div>}
            {option.subtitle && <div className="content-subtitle">{option.subtitle}</div>}
        </div>
      </div>
    );
  }

  render() {

    return (

      <div className="common-landing-steps" style={{ border: 'none', ...this.props.style }}>
        {this.state.baseData.title && <div className="top-tile">
          <div className="generic-page-title">
            {this.state.baseData.title}
          </div>
        </div>}

        <div className='common-steps-images common-steps-images_steps'>
          {this.state.baseData.options.map(this.renderList)}
        </div>
      </div>

    );

  }
}

const LandingSteps = (props) => (
  <LandingStepsClass
    {...props} />
);

export default LandingSteps;
