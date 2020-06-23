import React, { Component } from 'react';
import './style.css';
import 'react-circular-progressbar/dist/styles.css';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

import InputPopup from './InputPopup';
import Input from './Input';

class CheckboxListClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otherInputData: this.props.parent.state.otherInputData || {}
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

        options[index].checked = !options[index].checked;
        this.updateParent(options);
    }

    renderList = (props, index) => {
        return (
            <div key={index} className="CheckBlock2 plus-minus-input"
                style={{ opacity: props.disabled ? 0.4 : 1 }}>
                <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                        <Checkbox
                            defaultChecked
                            checked={props.checked || false}
                            color="default"
                            value="checked"
                            onChange={() => this.handleClick(index)}
                            className="Checkbox" />
                    </Grid>

                    <Grid item xs={11}>
                        <div className="right-data">
                            <div className="content" style={{ textTransform: 'capitalize' }}>{props.name}</div>
                        </div>
                    </Grid>

                </Grid>

                {props.name === 'Other' && props.checked &&
                 <div className="InputField"
                 onClick={() => {
                     this.setState({
                        openPopUpInput: true
                     })
                 }}
                 style={{margin: '-10px 0px 0px 33px'}}>
                    <Input
                        error={(this.state.data_error) ? true : false}
                        helperText={this.state.data_error}
                        type="text"
                        width="40"
                        label={this.state.otherInputData.label}
                        class="data"
                        id="input_popup"
                        name="input_popup"
                        value={this.state[this.state.otherInputData.name] || this.props.parent.state[this.state.otherInputData.name]}
                    />
                </div>}
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
        return (
            <div>
                {this.props.parent.state.options.map(this.renderList)}
                <InputPopup
                    parent={this}
                    header_title={this.state.otherInputData.header_title}
                    cta_title={this.state.otherInputData.cta_title}
                    name={this.state.otherInputData.name}
                    label={this.state.otherInputData.label}
                    value={this.state[this.state.otherInputData.name] || this.props.parent.state[this.state.otherInputData.name]}
                    handleChange={this.handleChangeInputPopup()}
                />
            </div>
        );
    }
};

const CheckboxList = (props) => (
    <CheckboxListClass
        {...props} />
);

export default CheckboxList;
