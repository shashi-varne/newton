import React, { Component } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  TextField
} from "material-ui";
import CountryData from "country-telephone-data";
import InputMask from "react-input-mask";

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
                <TextField
                  margin="normal"
                  type="text"
                  value={number}
                  placeholder={format}
                  InputProps={{
                    disableUnderline: true,
                    style: { minHeight: '56px' },
                  }}
                  onKeyDown={this.props.onKeyDown}
                  autoFocus={this.props.autoFocus}
                />
            )}
          </InputMask>
        </FormControl>
      </div>
    );
  }
}

export default WrPhoneInput;
