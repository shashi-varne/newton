import React, { Component } from "react";
import RadioWithoutIcon from "../../../../common/ui/RadioWithoutIcon";
import Checkbox from "material-ui/Checkbox";
import { FormControl } from "material-ui/Form";
import Input from "../../../../common/ui/Input";
import Grid from "material-ui/Grid";
import { capitalizeFirstLetter } from 'utils/validators';
import { childeNameMapper } from '../../../constants';

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

  renderInputs = (option, index) => {
    return (
      <FormControl fullWidth>
        <div className="InputField">
          <Input
            type="text"
            label="Description"
            name="answer_description"
            id="answer_description"
            placeholder="Lorem ipsum lorem ipsum"
            value={option.life_style_question.answer_description || ""}
            error={!!option.life_style_question.answer_description_error}
            helperText={option.life_style_question.answer_description_error}
            onChange={(event) => this.props.handleChange(event, index)}
          />
        </div>
        <div className="InputField">
          <Input
            type="text"
            id={"date_" + option.key}
            label="Since when"
            name="start_date"
            className="date"
            placeholder="MM/YYYY"
            maxLength="7"
            value={option.life_style_question.start_date || ""}
            error={!!option.life_style_question.start_date_error}
            helperText={option.life_style_question.start_date_error}
            onChange={(event) => this.props.handleChange(event, index)}
          />
        </div>
      </FormControl>
    );
  };

  render() {
    let { list, name } = this.state;
    return (
      <div style={{ marginBottom: "40px" }}>
        {list.map((item, index) => (
          <div
            key={index}
            style={{ color: "#0A1D32", lineHeight: "1.8", fontSize: "13px" }}
          >
            <p>{item.label}</p>

            {item.input_type === "radio" &&
              name === "lifeStyle details" &&
              item.options.map((option, index) => (
                <div key={index}>
                  <RadioWithoutIcon
                    style={{ width: "20px" }}
                    isVertical={false}
                    options={option.radio_options}
                    id={name}
                    name={name}
                    value={option.life_style_question_exists || ""}
                    error={!!option.life_style_question_exists_error}
                    helperText={option.life_style_question_exists_error}
                    onChange={(event) => this.props.handleChangeRadio(event, index)}
                  />
                  <br />
                  {option.life_style_question_exists === 'Yes' &&
                    this.renderInputs(option, index)}
                </div>
              ))}

            {item.input_type === "radio" &&
              name === "medical history" &&
              <RadioWithoutIcon
                style={{ width: "20px" }}
                isVertical={false}
                options={item.radio_options}
                id={name}
                name={name}
                value={(list[index].question_value)}
                error={!!list[index].question_value_error}
                helperText={list[index].question_value_error}
                onChange={(event) => this.props.handleChangeRadio(event, index)}
              />
            }

            {list[index].question_value === 'Yes' && this.props.account_type !== 'self' && name === "medical history" && (
              <div>
                <p>Who is the member?</p>
              <Grid container spacing={0}>
                
                {item.members.map((member, index_member) => (
                  member.key !== 'applicant' && <div key={index_member}>
                    <Grid item xs key={index}>
                      <Grid item xs>
                        <Checkbox
                          checked={item.inputs[member.backend_key]}
                          color="primary"
                          // value={member}
                          id={member.backend_key}
                          name={member.backend_key}
                          disableRipple
                          onChange={(event) => this.props.handleCheckbox(event, index, member)}
                          className="Checkbox"
                        />
                        <span style={{ fontSize: "14px", marginRight: '50px' }}>
                          {capitalizeFirstLetter(childeNameMapper(member.key))}
                        </span>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
              </div>
            )}

            { item.input_type === "checkbox" &&
              name === "lifeStyle details" &&
              item.options.map((option, index) => 
                option.key !== 'applicant' && <div key={index}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                      <Checkbox
                        checked={option.life_style_question_exists || false}
                        color="primary"
                        // value={option.life_style_question_exists}
                        id={option.backend_key}
                        name={option.backend_key}
                        disableRipple
                        onChange={(event) => this.props.handleCheckbox(event, index)}
                        className="Checkbox"
                      />
                    </Grid>
                    <Grid item xs={11} style={{ fontSize: "14px" }}>
                      {capitalizeFirstLetter(childeNameMapper(option.key))}
                    </Grid>
                  </Grid>
                  {option.life_style_question_exists && option.key !== 'none' && (
                    <Grid container spacing={16} alignItems="center">
                      <Grid item xs={1} className="TextCenter"></Grid>
                      <Grid item xs={11} style={{ fontSize: "14px" }}>
                        {this.renderInputs(option, index)}
                      </Grid>
                    </Grid>
                  )}
                </div>
              )}


          </div>
        ))}
      </div>
    );
  }
}

export default radioAndCheckboxList;