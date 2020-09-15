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

        if(options[index].name === 'Other' && !options[index].checked) {
            this.setState({
                openPopUpInput: true
            })
        }

        if(options[index].name !== 'Other' && !options[index].checked) {
            this.setState({
                openPopUpInputDate: true,
                header_title: options[index].name,
                cta_title: 'OK',
                label: 'Since When',
                name: options[index].name
            })
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
                            defaultChecked
                            checked={props.checked || false}
                            color="default"
                            value="checked"
                            style={{height: 25}}
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

                {props.name !== 'Other' && props.checked &&
                <div className="InputField"
                onClick={() => {
                    this.setState({
                        openPopUpInputDate: true,
                        header_title: props.name,
                        cta_title: 'Ok'
                    })
                }}
                 style={{margin: '-10px 0px 0px 33px'}}>
                    <Input
                        error={(this.state.data_error) ? true : false}
                        helperText={this.state.data_error}
                        type="text"
                        width="40"
                        id="date"
                        label="Since When"
                        name={props.name}
                        value={this.state[this.state.name] || this.props.parent.state[this.state.name]}
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
                <MmYyInModal
                    parent={this}
                    header_title={this.state.header_title}
                    cta_title={this.state.cta_title}
                    name={this.state.name}
                    label={this.state.label}
                    value={this.state[this.state.name] || this.props.parent.state[this.state.name]}
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
