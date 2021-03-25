import React from 'react';
import Select, { components } from 'react-select';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { isMobile } from 'utils/functions';
import './style.scss';
class SelectDropDown2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.value,
      options: this.props.options,
      multi: this.props.multi,
      value: this.props.value,
    };
  }


  handleFocus = element => {
    // if (this.state.value) {
    //   this.select.state.inputValue = this.state.value.label;
    // }
  };


  handleMenuClose = () => {
    this.select.blur();
    this.setState({ shrink: false })
  };

  onMenuOpen = () => {
    this.setState({ shrink: true })
  }

  handleCreate = (inputValue) => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      const { options } = this.state;
      const newOption = createOption(inputValue);
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption
      });
    }, 1000);
  };


  handleChange = selectedOption => {
    this.setState({
      selectedOption: selectedOption ? selectedOption.value ? selectedOption.value : selectedOption : ''
      , value: selectedOption, inputValue: selectedOption ? selectedOption.label : ""
    })
    this.props.onChange(selectedOption ? selectedOption.value : '');

    // if (selectedOption) {
    //   if (selectedOption.value && (selectedOption.value + "").length) {
    //     this.props.onChange(selectedOption.value);
    //     // eslint-disable-next-line
    //   } else if (selectedOption && selectedOption.label && selectedOption.value && (!!selectedOption.value + "").length || selectedOption && selectedOption.isArray) {
    //     this.props.onChange(selectedOption.label);
    //   }
    // } 
    // else {
    //   this.props.onChange('');
    // }
  }



  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value && this.props.value) { this.setState({ selectedOption: this.props.value }) }
    if (prevState.options !== this.props.options && this.props.options) { this.setState({ options: this.props.options }) }
  }


  render() {
    let components;
    if (this.state.multi) {
      components = { Option, MultiValue, IndicatorSeparator: () => null, Input, DropdownIndicator, ClearIndicator }
    } else {
      components = { IndicatorSeparator: () => null, Input, DropdownIndicator, ClearIndicator: () => null }
    };
    const options = this.props.options.map((ele, index) => {
      if (ele.name) {
        return ({
          'value': ele.value, 'name': ele.name
        })
      } else return ({
        'value': ele, 'name': ele
      })
    });

    const OptionPresent = this.state.selectedOption ? !!this.state.selectedOption.length : false
    const value = options.find(opt => opt.value === this.state.selectedOption || opt.name === this.state.selectedOption);
    let isLableOpen = (!!value || (OptionPresent) || this.state.shrink) || (OptionPresent && this.props.multi);
    isLableOpen = !!isLableOpen;
    return (
      <div>
        <FormControl className="Dropdown label" disabled={this.props.disabled} style={{ marginTop: '5px' }}>
          {(<InputLabel shrink={isLableOpen} htmlFor={this.props.id} style={{ color: isLableOpen ? '' : '#767E86' }}><div
            ref={element => {
              if (element && isLableOpen) {
                element.style.setProperty('margin-top', '6px', 'important');
                element.style.setProperty('margin-left', '13px', 'important');
              } else if (element && !isLableOpen) {
                element.style.setProperty('margin-top', '-7px', 'important');
                element.style.setProperty('margin-left', '12px', 'important');
              }
            }}
            style={{
              position: 'absolute',
              minWidth: '300px',
              color: this.props.error ? '#D0021B' : '',
              fontSize: isLableOpen ? '11px' : '13px', lineHeight: isLableOpen ? '18px' : '21px',
            }}>
            {this.props.label}</div></InputLabel>)}
          <div style={{ borderBottom: this.props.error ? '1px solid #D0021B' : this.state.shrink ? '1px solid #4F2DA7' : '' }}>
            <Select
              ref={ref => {
                this.select = ref;
              }}
              blurInputOnSelect={false}
              onBlurResetsInput={true}
              openMenuOnClick={false}
              menuShouldBlockScroll={true}
              // defaultValue={value}
              // isDisabled={this.state.isLoading}
              // isLoading={this.state.isLoading}
              // onCreateOption={this.handleCreate}
              // onFocus={this.handleFocus}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.value}
              className={this.state.error ? "" : ''}
              onMenuOpen={this.onMenuOpen}
              onMenuClose={this.handleMenuClose}
              placeholder={''}
              isClearable={true}
              isSearchable={this.props.options.length <= 6 ? false : true}
              value={value || ''}
              menuPlacement="auto"
              menuPortalTarget={document.querySelector('body')}
              textFieldProps={{
                label: 'Label',
                InputLabelProps: {
                  shrink: true,
                },
              }}
              isMulti={this.state.multi}
              components={components}
              styles={{
                dropdownIndicator: (provided, state) => ({
                  ...provided,
                  transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
                }),
                menuList: (base) => ({
                  ...base,
                  "::-webkit-scrollbar": {
                    width: "5px",
                    height: '20px',
                    background: '#C4C4C4',
                  },
                  "::-webkit-scrollbar-track": {
                    background: 'white',
                  },
                  "::-webkit-scrollbar-thumb": {
                    background: "#C4C4C4",
                    borderRadius: '100px',
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                    background: "#C4C4C4",
                  }
                }),
              }}
              hideSelectedOptions={false}
              options={options}
              onChange={this.handleChange}
              allowSelectAll={true}
              closeMenuOnSelect={this.state.multi ? false : true}
            />
          </div>
          {(this.props.error || this.state.error) ? <span className='error-radiogrp' style={ErrorMessageStyle}> {this.props.helperText || this.state.helperText || 'Please select an option'} </span> :
            <span className='error-radiogrp' style={ErrorMessageStyle}> {this.props.helperText || this.state.helperText || ''} </span>}
        </FormControl>
      </div>
    );
  }
}

const DropDownNew = (props) => {
  return (<SelectDropDown2 {...props} />)
}

export default DropDownNew;

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <span style={{ marginLeft: '10px', marginTop: '-1px' }}>{props.label}</span>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.name}</span>
  </components.MultiValue>
);
const Input = (props) => <components.Input {...props} isHidden={false} />;



const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, "")
});

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L7 7L13 1" stroke="#767E86" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.66659 1.27334L8.72659 0.333336L4.99992 4.06L1.27325 0.333336L0.333252 1.27334L4.05992 5L0.333252 8.72667L1.27325 9.66667L4.99992 5.94L8.72659 9.66667L9.66659 8.72667L5.93992 5L9.66659 1.27334Z" fill="#767E86" />
      </svg>
    </components.ClearIndicator>
  );
}

const ErrorMessageStyle = {
  lineHeight: '18px',
  fontSize: '11px',
  color: '#D0021B',
  marginLeft: '10px',
  marginTop: '5px'
}