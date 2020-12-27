import React from "react";
import Autosuggest from "react-autosuggest";
import { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";

const getSuggestions = (value, language, others) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  let list = language.filter(
    (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );

  return inputLength === 0
    ? []
    : list.length === 0
    ? [{ name: "OTHERS", value: "OTHERS" }]
    : list;
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: [],
      input: [],
    };
  }

  componentWillMount() {
    this.setState({
      value: this.props.value,
      input: this.props.inputs,
    });
  }

  onChange = (event, { newValue }) => {
    this.props.onChange(newValue);
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    let inputs = this.props.inputs;

    this.setState({
      input: inputs,
    });

    this.setState({
      suggestions: getSuggestions(value, this.state.input, false),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
    };

    return (
      <FormControl className="Dropdown" disabled={this.props.disabled}>
        <InputLabel shrink={true} htmlFor={this.props.id}>{this.props.label}</InputLabel>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <span className="error-radiogrp">
          {this.props.error
            ? this.props.helperText
              ? this.props.helperText
              : "Please select an option"
            : ""}
        </span>
      </FormControl>
    );
  }
}

export default Example;
