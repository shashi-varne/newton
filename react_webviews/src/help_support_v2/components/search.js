import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";
import { getConfig } from "utils/functions";
import PropTypes from "prop-types";

const styles = (theme) => ({
  bootstrapInput: {
    backgroundColor: "var(--highlight)",
    fontSize: 13,
    padding: "8px 11px",
    width: "calc(100% - 24px)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    color: "#0A1D32",
  },
  InputAdornmentPosition: {
    margin: 0,
    maxHeight: "100%",
    padding: "0 11px",
    backgroundColor: "var(--highlight)",
    cursor: "pointer",
  },
  container: {
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: '10px'
  },
});

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: getConfig().productName,
      value: props.value,
    };
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
    if (this.props.value.length > 0) {
      this.props.onChange("");
    }
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <TextField
          id="input-with-icon-textfield"
          placeholder="Search for the issue"
          onChange={(value) => this.props.onChange(value)}
          inputRef={this.textInput}
          value={this.props.value}
          autoComplete='off'
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className={this.props.classes.InputAdornmentPosition}
                onClick={this.focusTextInput}
              >
                <img
                  src={require(`assets/${this.state.productName}/${
                    this.props.value.length > 0 ? "cross" : "search"
                  }.svg`)}
                  alt=""
                  width="13"
                />
              </InputAdornment>
            ),
            disableUnderline: true,
            classes: {
              input: this.props.classes.bootstrapInput,
            },
          }}
        />
      </div>
    );
  }
}

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchInput);
