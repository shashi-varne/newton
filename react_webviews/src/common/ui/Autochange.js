import React from "react";
import styled from "@emotion/styled";
import './style.scss';
// eslint-disable-next-line
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from "react-dropdown-select";

export default class Autochange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      multi: true,           // For multi Activate
      itemRenderer: true,   // For multi Select with checkbox
      disabled: false,
      loading: false,
      contentRenderer: false,
      dropdownRenderer: false,
      inputRenderer: false,
      optionRenderer: false,
      noDataRenderer: false,
      selectValues: [],
      searchBy: "username",
      clearable: false,
      searchable: true,
      create: false,
      separator: false,
      forceOpen: false,
      handle: true,
      addPlaceholder: "",
      labelField: "username",
      valueField: "email",
      color: "#EEEEEE",
      keepSelectedInList: true,
      closeOnSelect: false,
      dropdownPosition: "bottom",
      direction: "ltr",
      dropdownHeight: "280px",
      options: this.props.options,
    };
  }

  setValues = selectValues => this.setState({ selectValues });

  contentRenderer = ({ props, state }) => {
    return (
      <div>
        {state.values.length} of {props.options.length} Selected
      </div>
    );
  };

  noDataRenderer = () => {
    return (
      <p style={{ textAlign: "center" }}>
        <strong>Ooops!</strong> No data found
      </p>
    );
  };

  itemRenderer = ({ item, itemIndex, props, state, methods }) => (
    <div key={item[props.valueField]} onClick={() => methods.addItem(item)}>
      <div style={{ margin: "10px" }}>
        <input type="checkbox" checked={methods.isSelected(item)} />
        &nbsp;&nbsp;&nbsp;{item[props.labelField]}
      </div>
    </div>
  );

  dropdownRenderer = ({ props, state, methods }) => {
    const regexp = new RegExp(state.search, "i");
    // const options = this.state.options;

    return (
      <div>
        <SearchAndToggle color={this.state.color}>
          <Buttons>
            <div>Search and select:</div>
            {methods.areAllSelected() ? (
              <Button className="clear" onClick={methods.clearAll}>
                Clear all
              </Button>
            ) : (
              <Button onClick={methods.selectAll}>Select all</Button>
            )}
          </Buttons>
          <input
            type="text"
            value={state.search}
            onChange={methods.setSearch}
            placeholder="Type anything"
          />
        </SearchAndToggle>
        <Items>
          {props.options
            .filter(item =>
              regexp.test(item[props.searchBy] || item[props.labelField])
            )
            .map(option => {
              if (
                !this.state.keepSelectedInList &&
                methods.isSelected(option)
              ) {
                return null;
              }

              return (
                <Item
                  disabled={option.disabled}
                  key={option[props.valueField]}
                  onClick={
                    option.disabled ? null : () => methods.addItem(option)
                  }
                >
                  <input
                    type="checkbox"
                    onChange={() => methods.addItem(option)}
                    checked={state.values.indexOf(option) !== -1}
                  />
                  <ItemLabel>{option[props.labelField]}</ItemLabel>
                </Item>
              );
            })}
        </Items>
      </div>
    );
  };

  optionRenderer = ({ option, props, state, methods }) => (
    <React.Fragment>
      <div onClick={event => methods.removeItem(event, option, true)}>
        {option.label}
      </div>
    </React.Fragment>
  );

  inputRenderer = ({ props, state, methods }) => (
    <input
      tabIndex="1"
      className="react-dropdown-select-input"
      size={methods.getInputSize()}
      value={state.search}
      onClick={() => methods.dropDown("open")}
      onChange={methods.setSearch}
      placeholder="Type in"
    />
  );

  render() {

    const options = this.state.options

    return (    
        <FormControl className="Dropdown label" disabled={this.props.disabled}>
        {/* <InputLabel htmlFor={this.props.id}>{"label"} *</InputLabel> */}
      {/* <div className={this.props.className}> */}
      <span className="label2">label</span>
        <div>
          <div style={{ width: "280px" , height: '52px',}}>
            <StyledSelect
              placeholder=""
              addPlaceholder={this.state.addPlaceholder}
              color={this.state.color}
              disabled={this.state.disabled}
              loading={this.state.loading}
              searchBy={this.state.searchBy}
              separator={this.state.separator}
              clearable={this.state.clearable}
              searchable={this.state.searchable}
              create={this.state.create}
              keepOpen={this.state.forceOpen}
              dropdownHandle={this.state.handle}
              dropdownHeight={this.state.dropdownHeight}
              direction={this.state.direction}
              multi={this.state.multi}
              values={[options.find(opt => opt.username === "Delphine")]}
              labelField={this.state.labelField}
              valueField={this.state.valueField}
              options={options}
              dropdownGap={5}
              keepSelectedInList={this.state.keepSelectedInList}
              onDropdownOpen={() => undefined}
              onDropdownClose={() => undefined}
              onClearAll={() => undefined}
              onSelectAll={() => undefined}
              onChange={values => this.setValues(values)}
              noDataLabel="No matches found"
              closeOnSelect={this.state.closeOnSelect}
              noDataRenderer={
                this.state.noDataRenderer
                  ? () => this.noDataRenderer()
                  : undefined
              }
              dropdownPosition={this.state.dropdownPosition}
              itemRenderer={
                this.state.itemRenderer
                  ? (item, itemIndex, props, state, methods) =>
                      this.itemRenderer(item, itemIndex, props, state, methods)
                  : undefined
              }
              inputRenderer={
                this.state.inputRenderer
                  ? (props, state, methods) =>
                      this.inputRenderer(props, state, methods)
                  : undefined
              }
              optionRenderer={
                this.state.optionRenderer
                  ? (option, props, state, methods) =>
                      this.optionRenderer(option, props, state, methods)
                  : undefined
              }
              contentRenderer={
                this.state.contentRenderer
                  ? (innerProps, innerState) =>
                      this.contentRenderer(innerProps, innerState)
                  : undefined
              }
              dropdownRenderer={
                this.state.dropdownRenderer
                  ? (innerProps, innerState, innerMethods) =>
                      this.dropdownRenderer(
                        innerProps,
                        innerState,
                        innerMethods
                      )
                  : undefined
              }
            />
          </div>
        </div>


            { /* --------------------  Drop Down ------------------    */}

      {/* </div> */}
      </FormControl>
    );
  }
}

const StyledSelect = styled(Select)`
  ${({ dropdownRenderer }) =>
    dropdownRenderer &&
    `
		.react-dropdown-select-dropdown {
			overflow: initial;
		}
	`}
`;

const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;

  input {
    margin: 10px 10px 0;
    line-height: 30px;
    padding: 0 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    :focus {
      outline: none;
      border: 1px solid ${({ color }) => color};
    }
  }
`;

const Items = styled.div`
  overflow: auto;
  min-height: 10px;
  max-height: 200px;
`;

const Item = styled.div`
  display: flex;
  margin: 10px;
  align-items: baseline;
  cursor: pointer;
  border-bottom: 1px dotted transparent;

  :hover {
    border-bottom: 1px dotted #ccc;
  }

  ${({ disabled }) =>
    disabled
      ? `
  	opacity: 0.5;
  	pointer-events: none;
  	cursor: not-allowed;
  `
      : ""}
`;

const ItemLabel = styled.div`
  margin: 5px 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;

  & div {
    margin: 10px 0 0 10px;
    font-weight: 600;
  }
`;

const Button = styled.button`
  background: none;
  border: 1px solid #555;
  color: #555;
  border-radius: 3px;
  margin: 10px 10px 0;
  padding: 3px 5px;
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;

  &.clear {
    color: tomato;
    border: 1px solid tomato;
  }

  :hover {
    border: 1px solid deepskyblue;
    color: deepskyblue;
  }
`;
// eslint-disable-next-line
const StyledHtmlSelect = styled.select`
  padding: 0;
  margin: 0 0 0 10px;
  height: 23px !important;
  color: #0071dc;
  background: #fff;
  border: 1px solid #0071dc;
`;
// eslint-disable-next-line
const StyledInput = styled.input`
  margin: 0 0 0 10px;
  height: 23px !important;
  color: #0071dc;
  background: #fff;
  border: 1px solid #0071dc;
  border-radius: 3px;
  padding: 13px 10px;
  width: 70px;
`;
