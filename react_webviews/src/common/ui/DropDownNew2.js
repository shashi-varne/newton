import React from 'react';
import Select, { components  } from 'react-select';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
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
    if (this.state.value) {
      this.select.state.inputValue = this.state.value.label;
    }
  };


  handleMenuClose = () => {
    this.select.blur();
    this.setState({ shrink: false })
  };

  hello = () => {
    if (this.state.value) {
      this.select.state.inputValue = this.state.value.label;
    }
    this.setState({ shrink: true })
  }

  handleCreate = (inputValue) => { console.log(inputValue)
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
    this.setState({ selectedOption , value : selectedOption , inputValue : selectedOption ? selectedOption.label : ""  })

    if (selectedOption) {
      if (selectedOption.value && (selectedOption.value + "").length) {
        this.props.onChange(selectedOption.value);
        // eslint-disable-next-line
      } else if (selectedOption && selectedOption.label && selectedOption.value && (!!selectedOption.value + "").length || selectedOption && selectedOption.isArray) {
        this.props.onChange(selectedOption.label);
      }
    } else {
      this.props.onChange('');
    }
  }



  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value && this.props.value) { this.setState({ selectedOption: this.props.value }) }
    if (prevState.options !== this.props.options && this.props.options) { this.setState({ options: this.props.options }) }
  }

  componentWillMount() {
    const value = this.props.options.find(opt => opt.value === this.props.value || opt.name === this.props.value);
    this.setState({ selectedOption: value })
  }

  render() {

    var classname = document.getElementsByClassName("css-g1d714-ValueContainer");
    for (var i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click',  () => console.log("clicked") );
  }

    let components;
    if (this.state.multi) {
      components = { Option, MultiValue, IndicatorSeparator: () => null ,  Input}
    } else components = { IndicatorSeparator: () => null , Input }

    const options = this.props.options.map((ele, index) => {
      return ({
        'value': ele.value, 'label': ele.name
      })
    })

    const value = options.find(opt => opt.value === this.state.selectedOption || opt.name === this.state.selectedOption);
    return (
      <FormControl className="Dropdown label" disabled={this.props.disabled} style={{ margin: '2px 0px' }}>
        {(<InputLabel shrink={(  !!value || (!!this.state.selectedOption)  || this.state.shrink) || (this.state.selectedOption && this.state.multi)} htmlFor={this.props.id}><div
          style={{ marginLeft: '12px', position: 'absolute', marginTop: (!!value || this.state.shrink) || (this.state.selectedOption && this.state.multi) ? '2px' : '0px' ,
          minWidth: '300px' , color : this.props.error ? '#D0021B' : '',
          }}>
          {this.props.label}</div></InputLabel>)}
        {/* {(!this.state.multi && <span className="label2">{this.props.label || 'label'}</span> )} */}
        <div style={{ borderBottom: this.props.error ? '1px solid red' : '' }}>
        <Select
          defaultValue={value}
          ref={ref => {
            this.select = ref;
          }}
          blurInputOnSelect={true}
          isDisabled={this.state.isLoading}
          isLoading={this.state.isLoading}
          onCreateOption={this.handleCreate}
          onMenuClose={this.handleMenuClose}
          onFocus={this.handleFocus}
          className={this.state.error ? "" : ''}
          // onMenuOpen={() => this.setState({ shrink: true })}
          onMenuOpen={this.hello}
          placeholder={''}  
          isClearable={true}
          isSearchable={this.props.options.length <= 6 ? false : true}
          value={value}
          // maxMenuHeight={false}
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
            })
          }}
          hideSelectedOptions={false}
          options={options}
          onChange={this.handleChange}
          allowSelectAll={true}
          closeMenuOnSelect={false}
          // menuIsOpen={true}
        />
        </div>
        {(this.props.error || this.state.error) ? <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || 'Please select an option'} </span> :
          <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || ''} </span>}
      </FormControl>
    );
  }
}

const DropDownNew2 = (props) => {
  return (<SelectDropDown2 {...props} />)
}

export default DropDownNew2;

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <span style={{ marginLeft: '10px' }}>{props.label}</span>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);
const Input = (props) => <components.Input {...props} isHidden={false} />;



const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, "")
});