import React from 'react';
import Select from 'react-select';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import './style.scss';

class SelectDropDown2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.value,
      options: this.props.options
    };
  }


  handleChange = selectedOption => {
    // if (!selectedOption.length) {
    //   return (
    //     null // this.setState({ error: !this.state.error })
    //   )
    // }


    this.setState({ selectedOption })
    if (selectedOption) {
      if (selectedOption.value && (selectedOption.value + "").length) {
        this.props.onChange(selectedOption.value);
        // eslint-disable-next-line
      } else if (selectedOption && selectedOption.label && selectedOption.value && (!!selectedOption.value + "").length || selectedOption && selectedOption.isArray) {
        this.props.onChange(selectedOption.label);
      }
    } else {
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

    //  const Option = props => { return ( <div> <components.Option {...props}> <input type="checkbox" checked={props.isSelected} onChange={() => null} /> <label>{props.value}</label> </components.Option> </div> ); };

    const options = this.props.options.map((ele, index) => {
      return ({
        'value': ele.value, 'label': ele.name
      })
    })

    const value = options.find(opt => opt.value === this.state.selectedOption || opt.name === this.state.selectedOption);
    return (
      <FormControl className="Dropdown label" disabled={this.props.disabled} style={{ margin: '2px 0px' }}>
        {(<InputLabel shrink={!!this.state.selectedOption || this.state.shrink } htmlFor={this.props.id}><span
        style={{ marginLeft: '10px', position: 'absolute' , marginTop: '1px'}} >{this.props.label}</span></InputLabel>)}
        {/* {(!value && <span className="label2">{this.props.label || 'label'}</span> )} */}
        <Select
          // components={{ Option }}
          defaultValue={value}
          onMenuOpen={() =>  this.setState({shrink: true})}
          onMenuClose={() => this.setState({shrink: false})}
          placeholder={''}
          isClearable
          isSearchable={this.props.options.length <= 6 ? false : true}
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={options}
          menuPlacement={'top'}
          textFieldProps={{
            label: 'Label',
            InputLabelProps: {
              shrink: true,
            },
          }}
          // isMulti={true}
          components={{
            IndicatorSeparator: () => null
          }}
        // defaultMenuIsOpen={true}
        />
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