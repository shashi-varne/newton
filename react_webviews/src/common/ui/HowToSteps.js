import React, { Component } from 'react';
import './style.scss';
import '../theme/Style.scss';
import { getConfig } from 'utils/functions';
import {Imgc} from './Imgc';

class HowToStepsClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: this.props.baseData,
      productName: getConfig().productName
    };
  }

  renderList = (option, index) => {
    return (
      <div key={index} className="tile tile_step" data-aid={`tile-step-${index+1}`}>
        {option.icon && <Imgc className={`icon ${this.props.classNameIcon}`}
          src={require(`assets/${this.state.productName}/${option.icon}.svg`)} alt="Icon" />}
        {option.img && <Imgc className={`icon ${this.props.classNameIcon}`}
          src={option.img} alt="Icon" />}
        <div className="content content_step" data-aid={`content-step-${index+1}`}>
          {this.state.baseData.show_index && <span> {index + 1}. </span>}
          <div className="content content_step" data-aid={`content-step-list-${index+1}`}>
            {option.title && <div className="content-title" style={{fontSize: '15px', fontWeight: '500'}}>{option.title}</div>}
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
            <b>{this.state.baseData.title}</b>
          </div>
        </div>}

        <div className='common-steps-images common-steps-images_steps'>
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
