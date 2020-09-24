import React, { Component } from 'react';
import './style.css';
import 'react-circular-progressbar/dist/styles.css';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import MmYyInModal from 'common/ui/MmYyInModal';
import InputPopup from './InputPopup';
import Input from './Input';

class CheckboxListClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otherInputData: this.props.parent.state.otherInputData || {},
        };

    }

    updateParent = (key, value) => {
        this.setState({
            [key]: value
        })
        this.props.parent.updateParent(key, value);
    }

    handleClick = (index) => {
        let state = this.props.parent.state;

        let options = state.options;
        if (options[index].disabled) {
            return;
        }

        if (options[index].name === 'Other' && !options[index].checked) {
            this.setState({
                openPopUpInput: true
            });
            this.updateParent('dateModalIndex', index);
        }

        if (options[index].name !== 'Other' && !options[index].checked) {
            this.setState({
                openPopUpInputDate: true,
                header_title: options[index].name,
                cta_title: 'OK',
                label: 'Since When',
                name: 'startDateModal',
                id: options[index].id,
                header_sub_title: options[index].description,
            })
            this.updateParent('dateModalIndex', index);
        }

        options[index].checked = !options[index].checked;
        this.updateParent(options, index);
    }

    renderList = (props, index) => {

        return (
            <div key={index} className="CheckBlock2 plus-minus-input"
                style={{ opacity: props.disabled ? 0.4 : 1 }}>
                <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                        <Checkbox
                            // defaultChecked
                            checked={props.checked}
                            color="default"
                            value="checked"
                            style={{ height: 25 }}
                            onChange={() => this.handleClick(index)}
                            className="Checkbox" />
                    </Grid>

                    <Grid item xs={11}>
                        <div className="right-data">
                            <div className="content" style={{ textTransform: 'capitalize' }}>{props.name}</div>
                        </div>
                    </Grid>

                </Grid>

                {props.name === 'Other' && this.props.provider === 'HDFCERGO' && props.checked &&
                    <div className="InputField"
                        onClick={() => {
                            this.setState({
                                openPopUpInput: true
                            })
                        }}
                        style={{ margin: '-10px 0px 0px 33px' }}>
                        <Input
                            error={(this.state.data_error) ? true : false}
                            helperText={this.state.data_error}
                            type="text"
                            width="40"
                            label={this.state.otherInputData.label}
                            class="data"
                            id="input_popup"
                            name="input_popup"
                            value={this.state[this.state.otherInputData.name] || this.props.parent.state[this.state.otherInputData.name] || ''}
                        />
                    </div>}

                {props.name === 'Other' && this.props.provider === 'RELIGARE' && props.checked &&

                    <div>
                        <div className="InputField"
                            onClick={() => {
                                this.setState({
                                    openPopUpInput: true
                                })
                                this.updateParent('dateModalIndex', index);
                            }}
                            style={{ margin: '-10px 0px 0px 33px' }}>
                            <Input

                                error={(this.state.data_error) ? true : false}
                                helperText={this.state.data_error}
                                type="text"
                                width="40"
                                label={this.state.otherInputData.label}
                                class="data"
                                id="input_popup"
                                name="input_popup"
                                value={this.state[this.state.otherInputData.name] || this.props.parent.state[this.state.otherInputData.name] || ''}
                            />
                        </div>

                        <div className="InputField"
                            style={{ margin: '10px 0px 0px 33px' }}>
                            <Input
                                error={(this.state.data_error) ? true : false}
                                helperText={this.state.data_error}
                                type="text"
                                width="40"
                                id="date"
                                class="date_input"
                                label="Since when"
                                name={props.name}
                                value={props.start_date || ''}
                            />
                        </div>
                    </div>
                }

                {this.props.provider === 'RELIGARE' && props.name !== 'Other' && props.checked &&
                    <div className="InputField"
                        onClick={() => {
                            this.setState({
                                openPopUpInputDate: true,
                                dateModalIndex: index,
                                header_title: props.name,
                                header_sub_title: props.description,
                                cta_title: 'OK',
                                id: props.id,
                                name: 'startDateModal',
                            })
                            this.updateParent('dateModalIndex', index);
                        }}
                        style={{ margin: '10px 0px 0px 33px' }}>
                        <Input
                            error={(this.state.data_error) ? true : false}
                            helperText={this.state.data_error}
                            type="text"
                            width="40"
                            id="date"
                            class="date_input"
                            label="Since when"
                            name={props.name}
                            value={props.start_date || ''}
                        />
                    </div>
                }
            </div>
        )
    }

    handleChangeInputPopup = name => event => {

        if (!name) {
            name = event.target.name;
        }

        var value = event.target ? event.target.value : event;
        this.setState({
            [this.state.otherInputData.name]: value,
            [name + '_error']: ''
        })

    };

    render() {

        let member_key = this.props.parent.state.member_key;
        let backend_key = this.props.parent.state.backend_key;
        let dob = this.props.parent.state.lead[backend_key].dob

        return (
            <div>
                {this.props.parent.state.options.map(this.renderList)}
                <InputPopup
                    sinceWhenInput={true}
                    parent={this}
                    header_title={this.state.otherInputData.header_title}
                    cta_title={this.state.otherInputData.cta_title}
                    name={this.state.otherInputData.name}
                    label={this.state.otherInputData.label}
                    value={this.state[this.state.otherInputData.name] || this.props.parent.state[this.state.otherInputData.name]}
                    handleChange={this.handleChangeInputPopup()}
                    dob={dob}
                />
                <MmYyInModal
                    parent={this}
                    header_title={this.state.header_title}
                    header_sub_title={this.state.header_sub_title}
                    cta_title={this.state.cta_title}
                    name={this.state.name}
                    label={this.state.label}
                    id={this.state.id}
                    dob={dob}
                    member_key={member_key}
                    value={this.state[this.state.name] || this.props.parent.state[this.state.name]} />
            </div>
        );
    }
};

const CheckboxList = (props) => (
    <CheckboxListClass
        {...props} />
);

export default CheckboxList;