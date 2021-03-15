import React from 'react';
import Select from 'react-select';


class SelectDropDown2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption:this.props.value,
            options: this.props.options
        };
    }

    
  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };



    componentDidUpdate(prevState) {
        if (prevState.value !== this.props.value && this.props.value) { this.setState({ selectedOption: this.props.value }) }
        if (prevState.options !== this.props.options && this.props.options) { this.setState({ options: this.props.options }) }
    }


  render() {
    const { selectedOption } = this.state.selectedOption;

    const options = this.props.options.map((ele, index) => {
        return ({
           'value': ele.value, 'label': ele.name
        })
    })

    const value = options.find(opt => opt.value === this.props.value || opt.name === this.props.value);

    return (
      <Select
        defaultValue={value}
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        // isMulti={true}
      />
    );
  }
}

const DropDownNew2 = (props) => {
    return (<SelectDropDown2 {...props} />)
}

export default DropDownNew2;