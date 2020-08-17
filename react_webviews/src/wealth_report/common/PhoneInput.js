import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CountryData from "country-telephone-data";
import InputMask from "react-input-mask";
import Select from "@material-ui/core/Select";

class WrPhoneInput extends Component {

  render() {
    const result = CountryData.allCountries.filter(
      (code, index) => code.format !== undefined
    );
    let { phone, format, number } = this.props;
    return (
      <div className="wr-input-form">
        <FormControl className="wr-code-input">
          <Select
            value={phone}
            renderValue={(phone) => `+${phone.split("/")[0]}`}
            onChange={this.props.onCodeChange}
            disableUnderline={true}
            inputProps={{
              name: "phone",
            }}
            classes={{ root: "wr-select-input" }}
          >
            {result.map((code, index) => (
              <MenuItem key={index} value={code.dialCode + "/" + code.format}>
                {`${code.name} +${code.dialCode}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="wr-mob-input" style={{ width: "70%" }}>
          <InputMask
            mask={format}
            maskChar=""
            value={number}
            onChange={this.props.onInputChange}
          >
            {() => (
              <form onSubmit={this.props.submit}>
                <TextField
                  margin="normal"
                  type="text"
                  value={number}
                  placeholder={format}
                  InputProps={{
                    disableUnderline: true,
                    root: "wr-mob-input",
                  }}
                />
              </form>
            )}
          </InputMask>
        </FormControl>
      </div>
    );
  }
}

export default WrPhoneInput;
