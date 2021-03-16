import React from "react";
import styled from "@emotion/styled";
import { InputLabel } from 'material-ui/Input';
import './style.scss';
// eslint-disable-next-line
import { FormControl } from 'material-ui/Form';
import Select from "react-dropdown-select";

class SelectDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            multi: false,           // For multi Activate
            itemRenderer: false,   // For multi Select with checkbox
            disabled: false,
            loading: false,
            contentRenderer: true,
            dropdownRenderer: false,
            inputRenderer: false,
            optionRenderer: false,
            noDataRenderer: false,
            selectValues: [],
            searchBy: "name",
            clearable: false,
            searchable: true,
            create: false,
            separator: false,
            forceOpen: false,
            handle: true,
            addPlaceholder: "",
            placeholder: 'selected',
            labelField: "name",
            valueField: "value",
            color: "#EEEEEE",
            keepSelectedInList: true,
            closeOnSelect: false,
            dropdownPosition: "auto",
            direction: "ltr",
            dropdownHeight: "280px",
            options: this.props.options,
            selectedValue: this.props.value,
            isplaceholder: this.props.value ? false : true,
            error: this.props.error,
            helperText: this.props.helperText,
        };
    }

    componentDidUpdate(prevState) {
        if (prevState.value !== this.props.value && this.props.value) { this.setState({ selectedValue: this.props.value }) }
        if (prevState.options !== this.props.options && this.props.options) { this.setState({ options: this.props.options }) }
    }



// componentWillReceiveProps(nextProps) {
//     if (nextProps.value !== this.props.value) {
//     //   const clinicId = nextProps.match.params;
//         // console.log(nextProps , this.props.value)
//     }
//   }





    setValues = selectValues => {
        if (!selectValues.length) {
            return (
                null // this.setState({ error: !this.state.error })
            )
        }

        this.setState({ selectValues,  error: false })
        if (selectValues[0]) {
            if (selectValues[0].value && (selectValues[0].value + "").length) {
                this.props.onChange(selectValues[0].value);
                // eslint-disable-next-line
            } else if (selectValues[0] && selectValues[0].name && selectValues[0].value && (!!selectValues[0].value + "").length || selectValues[0] && selectValues[0].isArray) {
                this.props.onChange(selectValues[0].name);
            }
        } else {
        }
    }

    contentRenderer = ({ props, state, methods }) => {
        return (
            <div style={{ marginTop: '5px' }}>
                {!!props.values[0].name.length && props.values[0] && props.values[0].name}
                {!props.values[0].name.length && state.values[0] && state.values[0].name}
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
        <div key={item[props.valueField]} onClick={() => methods.addItem(item)} className={methods.isSelected(item) ? 'colorbackground colorbackground2' : 'colorbackground'}>
            <input type="checkbox" checked={methods.isSelected(item)} />
        &nbsp;&nbsp;&nbsp;<span>{item[props.labelField]}</span>
        </div>
    );

    dropdownRenderer = ({ props, state, methods }) => {
        const regexp = new RegExp(state.search, "i");

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

    inputRenderer = ({ props, state, methods }) => {
        return (
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
    }

    removeIns() {
        this.setState({
            contentRenderer: false,
        })
        let paragraphs = document.getElementsByTagName("ins");
        var loop = function () {
            for (var i = 0, len = paragraphs.length; i < len; i++) {
                paragraphs[i].parentNode.removeChild(paragraphs[i]);
            }
        };
        loop();
    }

    render() {
        let options = this.props.options;
        if (!!options.length && !options[0].value && !options[0].name) {
            options = this.state.options.map((ele, index) => {
                return ({
                    'name': ele, 'value': index, 'isArray': true
                })
            })
        }
        window.addEventListener('load', function () {
            let paragraphs = document.getElementsByTagName("ins");
            var loop = function () {
                for (var i = 0, len = paragraphs.length; i < len; i++) {
                    paragraphs[i].parentNode.removeChild(paragraphs[i]);
                }
            };
            loop();
        })

        const value = options.find(opt => opt.value === this.props.value || opt.name === this.props.value);

        if (!!options.length) {
            return (
                <FormControl className="Dropdown label" disabled={this.props.disabled} style={{ margin: '2px 0px' }}>
                   {/* <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>   */}
                    {/* {(!value && !this.state.selectValues[0]) && <span className="label3" style={{ marginLeft: '10px' }}>{this.props.label || 'label'}</span>}
                    {(value || !!this.state.selectValues[0]) && <span className="label2">{this.props.label || 'label'}</span>} */}
                    <div>
                        <div style={{ width: "100%", height: '52px', }}>
                            <Select 
                                // placeholder={"" || this.props.label}
                                placeholder=''
                                addPlaceholder={this.state.addPlaceholder}
                                color={this.state.color}
                                disabled={this.state.disabled}
                                loading={this.state.loading}
                                searchBy={this.state.searchBy}
                                separator={this.state.separator}
                                clearable={true || this.state.clearable}
                                searchable={options.length <= 6 ? false : true}
                                clearOnSelect={true}
                                create={this.state.create}
                                keepOpen={this.state.forceOpen}
                                dropdownHandle={this.state.handle}
                                dropdownHeight={this.state.dropdownHeight}
                                direction={this.state.direction}
                                multi={this.state.multi}
                                values={value ? [{ name: value.name }] : [{ name: '' }]}
                                labelField={this.state.labelField}
                                valueField={this.state.valueField}
                                options={!!options.length ? this.props.options : []}
                                dropdownGap={5}
                                keepSelectedInList={this.state.keepSelectedInList}
                                onDropdownOpen={() => this.removeIns()}
                                onDropdownClose={() => this.setState({ contentRenderer: this.state.multi ? false : true })}
                                onClearAll={() => console.log("hello")}
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


                                // contentRenderer={
                                //    ( this.state.contentRenderer && !this.state.multi)
                                //         ? (innerProps, innerState) =>
                                //             this.contentRenderer(innerProps, innerState)
                                //         : undefined
                                // }

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
                            {(this.props.error || this.state.error) ? <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || 'Please select an option'} </span> :
                                <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || ''} </span>}
                        </div>
                    </div>
                </FormControl>
            );
        }
        else {
            return (
                <FormControl className="Dropdown label" disabled={this.props.disabled} style={{ margin: '2px 0px' }}>
                    {(!value && !this.state.selectValues[0]) && <span className="label3" style={{ marginLeft: '10px' }}>{this.props.label || 'label'}</span>}
                    {(value || !!this.state.selectValues[0]) && <span className="label2">{this.props.label || 'label'}</span>}
                    <div>
                        <div style={{ width: "100%", height: '52px', }}> <StyledSelect color={this.state.color} placeholder='' />
                            {(this.props.error || this.state.error ) ? <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || 'Please select an option'} </span> :
                                <span className='error-radiogrp'> {this.props.helperText || this.state.helperText || ''} </span>}
                        </div>
                    </div>
                </FormControl>
            )
        }
    }
}

const DropDownNew2 = (props) => {
    return (<SelectDropDown {...props} />)
}

export default DropDownNew2;
// eslint-disable-next-line
{ /*-------------------------------------------------------- [ Drop Down  Style Below ] ----------------------------------------------------------*/ }

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
