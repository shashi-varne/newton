import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import './style.scss';
import '../theme/Style.scss';

class AutosuggestInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
      suggestions_list: this.props.suggestions_list || [],
      suggestions: []
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

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters((value || '').trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.props.parent.state.suggestions_list.filter(data => regex.test(data.name));
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion, { query }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
    return (
      <span>
        {parts.map((part, index) => {
          const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
    if(typeof event.target.value === 'number') {
      this.props.onChange(this.state.suggestions[event.target.value].value);
    } else {
      this.props.onChange(event.target.value);
    }
    
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderItem(item, isHighlighted) {
    return (
      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item.name}
      </div>
    );
  }

  handleSuggestionClick =   (e, {suggestion, suggestionValue}) => {
    this.setState({
      value: suggestionValue
    })
  }

  render() {
    const inputProps = {
      value: this.state.value,
      onChange: this.handleChange
    };

    return (
      <FormControl className="Dropdown" disabled={this.props.disabled}>
        <InputLabel shrink={true} htmlFor={this.props.id}>{this.props.label} *</InputLabel>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.handleSuggestionClick}
          inputProps={inputProps}
        />
        <span className='error-radiogrp'>{(this.props.error) ? (this.props.helperText ? this.props.helperText : 'Please select an option') : ''}</span>
      </FormControl>
    );
  }
}

const Autosuggests = (props) => (
  <Grid container spacing={16} alignItems="flex-end">
    <Grid item xs={12}>
      <AutosuggestInput
        {...props} />
    </Grid>
  </Grid>
);

export default Autosuggests;
