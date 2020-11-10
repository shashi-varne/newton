import React, { Component } from 'react';
import ReactSearchBox from 'react-search-box'
import './style.scss';
class AutosuggestInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      suggestions_list: this.props.suggestions_list || [],
      suggestions: [],
      options : []
    };
  }
  componentDidUpdate(prevState) {
    if (prevState.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
    if (prevState.suggestions_list !== this.props.suggestions_list) {
      this.setState({ suggestions_list: this.props.suggestions_list })
    }
  }
  handleChange = (value) => {
    this.props.onChange(value);
  };
  componentDidMount(){
      var object = this.props.options.map(element => {
         return {
           key : element,
           value : element
         }        
      });
      this.setState({
        options : object
      })
  }
  render() {
    return (
      <div className="searchbox">
        <div className="label-custom">
        {this.props.label}
        </div>
        <ReactSearchBox
          placeholder={this.props.placeholder}
          data={this.props.value && this.props.value.length >= 2 ? this.state.options : []}
          // onSelect={record => console.log(record)}
          // onFocus={() => {
          //   console.log('This function is called when is focussed')
          // }}
          onChange={(value) => this.handleChange(value)}
          // fuseConfigs={{
          //   threshold: 0.05,
          // }}
          value={this.props.value}
        />
        <span className={`${this.props.error ? 'error-radiogrp' : 'helper-text'}`}>{this.props.helperText}</span>
      </div>
    );
  }
}
const Autosuggests = (props) => (
  <AutosuggestInput
    {...props} />
);
export default Autosuggests;