import React, { Component } from 'react';
import tick_icon_fisdom from 'assets/selected_option.png';
import tick_icon_myway from 'assets/check_selected_blue.svg';
import './style.css';
import { getConfig } from 'utils/functions';

import { FormControl } from 'material-ui/Form';
import Input from './Input';
import { inrFormatDecimalWithoutIcon } from 'utils/validators';

class SelectGrp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.value * 1,
      options: this.props.options,
      onChange: this.props.onChange,
      recommendedIndex: this.props.recommendedIndex * 1,
      dataType: this.props.dataType,
      keyToShow: this.props.keyToShow,
      inputKeyName: this.props.inputKeyName,
      tick_icon: getConfig().productType !== 'fisdom' ? tick_icon_myway : tick_icon_fisdom,
      inputToRender: this.props.inputToRender
    };

    this.renderList = this.renderList.bind(this);
  }

  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value) {
      this.setState({
        selectedValue: this.props.value * 1
      })
    }

    if (prevState.options !== this.props.options) {
      this.setState({
        options: this.props.options
      })
    }

    if (prevState.recommendedIndex !== this.props.recommendedIndex) {
      this.setState({
        recommendedIndex: this.props.recommendedIndex * 1
      })
    }

    if (prevState.inputToRender !== this.props.inputToRender) {
      this.setState({
        inputToRender: this.props.inputToRender
      })
    }
  }

  handleChange(index) {
    this.setState({ selectedValue: index });
    this.props.onChange(index);
  };

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.handleChange(index)}
        className={'ins-row-scroll' + (this.state.selectedValue === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedValue !== index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '28%' }}>
              {this.state.dataType === 'AOB' &&
                <span>{props[this.state.keyToShow]}</span>
              }
              {this.state.dataType !== 'AOB' &&
                <span>{props}</span>
              }
            </div>
            {index === this.state.recommendedIndex &&
              props[this.state.keyToShow] !== this.state.inputKeyName &&
              <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
            }
          </div>
        }


        {this.state.selectedValue === index &&

          <div>
            <div style={{ display: '-webkit-box' }}>
              <div style={{ width: index === this.state.recommendedIndex ? '28%' : '88%', color: getConfig().primary, fontWeight: 500 }}>
                {this.state.dataType === 'AOB' &&
                  <span>{props[this.state.keyToShow]}</span>
                }
                {this.state.dataType !== 'AOB' &&
                  <span>{props}</span>
                }
              </div>
              {index === this.state.recommendedIndex &&
                props[this.state.keyToShow] !== this.state.inputKeyName &&
                <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
              }
              <img width="20" src={this.state.tick_icon} alt="Insurance" />
            </div>

            {props[this.state.keyToShow] === this.state.inputKeyName && this.state.inputToRender &&
              <FormControl >
                <div style={{ margin: '10px 0 0 0' }} className="InputField">
                  <Input
                    error={this.state.inputToRender.error}
                    helperText={this.state.inputToRender.helperText}
                    type={this.state.inputToRender.type}
                    width={this.state.inputToRender.width}
                    label={this.state.inputToRender.label}
                    class={this.state.inputToRender.class}
                    id={this.state.inputToRender.id}
                    name={this.state.inputToRender.name}
                    value={inrFormatDecimalWithoutIcon(this.state.inputToRender.value * 1 || '')}
                    onChange={this.state.inputToRender.onChange}
                    min={this.state.inputToRender.min}
                    max={this.state.inputToRender.max}
                    autoComplete="off"
                  />
                </div>
              </FormControl>}
          </div>
        }

      </div>
    )
  }

  render() {
    console.log(this.state);
    // const { options } = this.state;
    return (
      <div style={{ marginBottom: 50 }}>
        {this.state.options.map(this.renderList)}
      </div>
    );
  }
}

const DropdownInPage = (props) => (
  <SelectGrp
    {...props} />
);

export default DropdownInPage;
