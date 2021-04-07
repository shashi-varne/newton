import React from "react";
import Autosuggest from "react-autosuggest";
import { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import DotDotLoader from "common/ui/DotDotLoader";

const getSuggestions = (value, inputs) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  let list = inputs.filter(
    (item) => item.name.toLowerCase().slice(0, inputLength) === inputValue
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

  componentDidMount() {
    this.setState({
      value: this.props.value,
      input: this.props.inputs,
    });
  }

  componentDidUpdate(prevState) {
    if (prevState.inputs !== this.props.inputs) {
      this.setState({ input: this.props.inputs });
      let value = this.state.value;
      this.onSuggestionsFetchRequested({ value: value });
    }
  }

  onChange = (event, { newValue }) => {
    this.props.onChange(newValue);
    this.setState({
      value: newValue,
    }, () => {
      this.onSuggestionsFetchRequested({ value: newValue })
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(
        value || "",
        this.props.inputs || [],
      ),
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
        <InputLabel shrink={true} htmlFor={this.props.id}>
          <div style={{ display: "flex", lineHeight: 0.2 }}>
            <span>{this.props.label}</span>
            <span>{this.props.isApiRunning ? <DotDotLoader /> : ""}</span>
          </div>
        </InputLabel>
        <Autosuggest
          className="Select"
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        {(this.props.error || this.props.helperText) && <span className="error-radiogrp">
          {this.props.error
            ? this.props.helperText
              ? this.props.helperText
              : "Please select an option"
            : this.props.helperText}
        </span>}
      </FormControl>
    );
  }
}

export default Example;
