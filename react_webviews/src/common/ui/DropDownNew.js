import React from 'react'
import { findDOMNode } from 'react-dom';
import Select, { components } from 'react-select';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { Casesensitivity } from 'utils/validators';
import './style.scss';
import SVG from 'react-inlinesvg';
import check_icon from 'assets/check_icon.svg'
class SelectDropDown2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.value,
      options: this.props.options,
      multi: this.props.multi,
      value: this.props.value,
      dropUp: false,
    };
    this.myRef = React.createRef();
    this.determineDropUp = this.determineDropUp.bind(this);
  }


  determineDropUp(props = {}) {
    const options = props.options || this.props.options || [];
    const node = findDOMNode(this.myRef);
    if (!node) return;
    const windowHeight = window.innerHeight;
    const menuHeight = Math.min(MAX_MENU_HEIGHT, (options.length * AVG_OPTION_HEIGHT));
    const instOffsetWithMenu = node.getBoundingClientRect().bottom + menuHeight;
    document.getElementsByClassName("Container")[0].style.height =  '100%'
    this.setState({
      dropUp: instOffsetWithMenu >= windowHeight,
      shrink: true
    });
  }

  handleMenuClose = () => {
    document.getElementsByClassName("Container")[0].style.height =  '100%'
    setTimeout(() => {
      document.getElementsByClassName("Container")[0].style.height =  '100%'
    }, 3000);
    this.setState({ shrink: false })
    window.removeEventListener('resize', this.determineDropUp);
    window.removeEventListener('scroll', this.determineDropUp);
    this.myRef.select.blur()
  };

  onMenuOpen = () => {
    this.determineDropUp(this.props);
    window.addEventListener('resize', this.determineDropUp);
    window.addEventListener('scroll', this.determineDropUp);
    setTimeout(() => {
      document.getElementsByClassName("Container")[0].style.height =  '100%'
    }, 1000);
  }

  handleChange = selectedOption => {
    if (this.state.multi) {
      this.setState({
        selectedOption: selectedOption,
      })
      return;
    }
    let OptionSelected = ''
    if (selectedOption) {
      if (selectedOption.value + '') {
        OptionSelected = selectedOption.value
      }
      else {
        OptionSelected = selectedOption
      }
    }
    this.setState({
      selectedOption: OptionSelected,
    })
    this.props.onChange(selectedOption ? selectedOption.value : '');
  }

  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value && (this.props.value + '')) { this.setState({ selectedOption: this.props.value}) }
    if (prevState.options !== this.props.options && this.props.options) { this.setState({ options: this.props.options }) }
  }


  render() {
    let components;
    if (this.state.multi) {
      components = { Option, MultiValue, IndicatorSeparator: () => null, Input, DropdownIndicator, ClearIndicator }
    } else {
      components = { IndicatorSeparator: () => null, Input, DropdownIndicator, ClearIndicator: () => null, }
    };
    var options = this.props.options.map((ele, index) => {
      if (ele.name) {
        return ({
          'value': ele.value, 'name': Casesensitivity(ele.name)
        })
      } else return ({
        'value': ele, 'name': Casesensitivity(ele)
      })
    }); setTimeout(() => {
      document.getElementsByClassName("Container")[0].style.height =  '100%'
    }, 2000);
    const OptionPresent = this.state.selectedOption ? !!this.state.selectedOption.length : false;// eslint-disable-next-line
    var value = options.find(opt => opt.value === this.state.selectedOption || opt.name === this.state.selectedOption);
    let isLableOpen = (!!value || (OptionPresent) || this.state.shrink) || (OptionPresent && this.props.multi);
    isLableOpen = !!isLableOpen;
    return (
      <div>
        <FormControl className="Dropdown label" disabled={this.props.disabled}>
          {(<InputLabel shrink={isLableOpen} htmlFor={this.props.id} style={{ color: isLableOpen ? '' : '#767E86' }}><div
            ref={element => {
              if (element && isLableOpen) {
                element.style.setProperty('margin-top', '6px', 'important');
                element.style.setProperty('margin-left', '10px', 'important');
              } else if (element && !isLableOpen) {
                element.style.setProperty('margin-top', '-7px', 'important');
                element.style.setProperty('margin-left', '10px', 'important');
              }
            }}
            style={{
              position: 'absolute',
              minWidth: '300px',
              color: this.props.error ? '#D0021B' : '',
              fontSize: isLableOpen ? '' : '13px', lineHeight: isLableOpen ? '18px' : '21px',
            }}>
            {this.props.label}</div></InputLabel>)}
          <div style={{ borderBottom: this.props.error ? '1px solid #D0021B' : this.state.shrink ? '1px solid #4F2DA7' : '1px solid #D6D6D6' }}>
            <Select
              ref={inst => (this.myRef = inst)}
              blurInputOnSelect={false}
              onBlurResetsInput={true}
              openMenuOnClick={true}
              className='react-select-container'
              classNamePrefix="react-select"
              menuPosition="absolute"
              defaultValue={value}
              onFocus={this.onMenuOpen}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.value}
              buildMenuOptions
              autoBlur
              onMenuOpen={() => {
                setTimeout(() => {
                  this.myRef.select.scrollToFocusedOptionOnUpdate = true;
                  this.myRef.select.setState({
                    focusedOption: value,
                  });
                }, 0);
              }}
              onMenuClose={this.handleMenuClose}
              placeholder={''}
              isClearable={true}
              isSearchable={this.props.options.length <= 6 ? false : true}
              value={this.state.multi ? value : (value || '')}
              menuPlacement={this.state.dropUp ? 'top' : 'bottom'}
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
                  },
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginTop: 0,
                  borderRadius: '0px 0xp 4px 4px',
                  maxHeight: '246px',
                }),
                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                  return {
                    ...styles,
                    backgroundColor: (isSelected) ? "#EEEEEE" : null,
                    ':hover': {
                      backgroundColor: '#EEEEEE'
                    },
                    color: "#161A2E",
                    minHeight: '41px',
                    fontSize: '13px',
                    padding: '10px',
                    paddingTop: '13px',
                    paddingLeft: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    ':active': {
                      backgroundColor: "#EEEEEE"
                    }
                  };
                },
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
        <div className="multi-checkbox-container">
        <div className="multi-checkbox" style={{backgroundColor: props.isSelected ? "#4F2DA7" : "#fff", border: props.isSelected ? 'none' : '' }}>
        <SVG className="tickmark-img"
             preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#fff')}
             src={check_icon}
        />
        </div>
        <span style={{ marginLeft: '10px', marginTop: '-1px' }}>{Casesensitivity(props.label)}</span>
        </div>
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
const MAX_MENU_HEIGHT = 256;
const AVG_OPTION_HEIGHT = 41;
const ErrorMessageStyle = {
  lineHeight: '18px',
  fontSize: '11px',
  color: '#D0021B',
  marginLeft: '10px',
  marginTop: '0px',
  paddingBottom : '5px'
}