import React, { Component } from "react";
import RadioWithoutIcon from "../../../../common/ui/RadioWithoutIcon";
import Checkbox from "material-ui/Checkbox";
import { FormControl } from "material-ui/Form";
import Input from "../../../../common/ui/Input";
import Grid from "material-ui/Grid";
import { capitalizeFirstLetter } from 'utils/validators';

class radioAndCheckboxList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    this.onload();
  }

  onload() {
    let { account_type, list, name } = this.props;

    this.setState({
      account_type: account_type,
      name: name,
      list: list,
    });
  }

  renderInputs = (name) => {
    let form_data, date_error, desc_error;

    let { life_style_question } = this.props;
    
    if (!name) { name = 'self'};

    form_data = life_style_question[name] || '';
    date_error = life_style_question[name].date_error || '';
    desc_error = life_style_question[name].desc_error || '';

    return (
      <FormControl fullWidth>
        <div className="InputField">
          <Input
            type="text"
            label="description"
            name={name}
            id="description"
            placeholder="Lorem ipsum lorem ipsum"
            value={form_data.answer_description || ""}
            error={desc_error ? true : false}
            helperText={desc_error}
            onChange={(event) => this.props.handleChange(event)}
          />
        </div>
        <div className="InputField">
          <Input
            type="text"
            id={!name ? 'date' : name + "_date"}
            label="Since When"
            name={name}
            className="date"
            placeholder="MM/YYYY"
            maxLength="7"
            value={form_data.start_date || ""}
            error={date_error ? true : false}
            helperText={date_error}
            onChange={(event) => this.props.handleChange(event)}
          />
        </div>
      </FormControl>
    );
  };

  render() {
    let { account_type, list, name } = this.state;
    let { life_style_question, medical_questions } = this.props;
    let object = life_style_question || medical_questions;

    return (
      <div style={{ marginBottom: "40px" }}>
        {list.map((item, index) => (
          <div
            key={index}
            style={{ color: "#0A1D32", lineHeight: "1.8", fontSize: "13px" }}
          >
            <p>{item.label}</p>

            {item.input_type === "radio" && (
              <div>
                <RadioWithoutIcon
                  style={{ width: "20px" }}
                  isVertical={false}
                  options={item.options}
                  id={name}
                  name={name}
                  error={object[item.key+'_error'] ? true : false}
                  helperText={object[item.key+'_error'] || ''}
                  value={(life_style_question ? object[item.key].answer : object[item.key]) || ""}
                  onChange={(event) => this.props.handleChangeRadio(item.key, event)}
                />
                <br />
                {life_style_question && life_style_question[item.key] && life_style_question[item.key].answer === 'Yes' &&
                  this.renderInputs()}
              </div>
            )}

            {item.input_type === "checkbox" &&
              name === "lifeStyle details" &&
              item.options.map((option, index) => (
                <div key={index}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                      <Checkbox
                        checked={
                          life_style_question[option]
                            ? life_style_question[option].checked
                            : false
                        }
                        color="primary"
                        value={option}
                        id={option}
                        name={option}
                        disableRipple
                        onChange={(event) => this.props.handleCheckbox(event)}
                        className="Checkbox"
                      />
                    </Grid>
                    <Grid item xs={11} style={{ fontSize: "14px" }}>
                      {capitalizeFirstLetter(option)}
                    </Grid>
                  </Grid>
                  {life_style_question[option] &&
                    life_style_question[option].checked &&
                    option !== "None" && (
                      <Grid container spacing={16} alignItems="center">
                        <Grid item xs={1} className="TextCenter"></Grid>
                        <Grid item xs={11} style={{ fontSize: "14px" }}>
                          {this.renderInputs(option)}
                        </Grid>
                      </Grid>
                    )}
                </div>
              ))}

            {item.input_type === "checkbox" && name === "medical history" && (
              <Grid container spacing={0}>
                {item.options[account_type].map((option, index) => (
                  <Grid item xs key={index}>
                    <Grid item xs>
                      <Checkbox
                        checked={this.state[option]}
                        color="primary"
                        value={option}
                        name={item.key}
                        disableRipple
                        onChange={(event) => this.props.handleCheckbox(event)}
                        className="Checkbox"
                      />
                      {option}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default radioAndCheckboxList;