import React, { Component } from 'react';
import './style.css';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from 'material-ui/Dialog';
import Input from './Input';
import { isValidMonthYear } from "utils/validators";
import { formatMonthandYear, dobFormatTest } from "utils/validators";


class InputPopupClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
           value: this.props.value
        };

    }

    handleClose = () => {
        this.props.parent.updateParent('openPopUpInput', false);
        this.props.parent.updateParent('openPopUpInputDate', false); //to check/ncheck logic
    }

    handleCloseAction = () => {
        this.handleClose();
    }

    handleChange = name => event => {

        
        if (!name) {
            name = event.target.name;
        }  
        var value = event.target ? event.target.value : event;

        if(this.props.sinceWhenInput && name === 'startDateModal') {
    
            if (!dobFormatTest(value)) {
                return
            }
    
            let input = document.getElementById('date_input');
            input.onkeyup = formatMonthandYear;
    
            this.setState({
                [name]: value,
                [name + '_error']: ''
            })
        } else {
            
            this.setState({
                value: value,
                [name + '_error']: ''
            })
        }

        
       

    };

    handleClick = () => {

        if(this.props.sinceWhenInput) {
            let error = '';
            let date = this.state.startDateModal;

            let canProceed = true;

            if (!isValidMonthYear(date)) {
                canProceed =false;
                error = "please enter valid month or year";
                this.setState({
                    startDateModal_error: error
                })
            }
            
            if(!this.state.value) {
                canProceed =false;
                this.setState({
                   pedOther_error: "This can't be empty"
                });
        
            } 
            
            if(canProceed) {
                this.props.parent.updateParent('startDateModal', this.state['startDateModal'])
                this.props.parent.updateParent(this.props.name, this.state.value);
                this.handleClose();
            }
        } else {
            if(!this.state.value) {
                this.setState({
                   pedOther_error: "This can't be empty"
                });
        
            } else {
                this.props.parent.updateParent(this.props.name, this.state.value);
                this.handleClose();
            }
        }
       
    }

    renderPopUp() {
        console.log(this.props);
        if (this.props.parent.state.openPopUpInput) {
            return (
                <Dialog
                    fullWidth={true}
                    open={this.props.parent.state.openPopUpInput}
                    style={{ margin: 0 }}
                    id="generic-input-popup-dialog"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="generic-input-popup-dialog-title">
                        <div className="dialog-head">
                            {this.props.header_title}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content" id="alert-dialog-description">
                            <FormControl className="Dropdown" disabled={this.props.disabled}>
                                <div className="InputField">
                                    <Input
                                        error={!!this.state.pedOther_error}
                                        helperText={this.state.pedOther_error}
                                        type="text"
                                        width="40"
                                        label={this.props.label}
                                        class="data"
                                        id={this.props.name}
                                        name={this.props.name}
                                        value={this.state.value || this.props.value}
                                        onChange={this.handleChange()} />
                                </div>
                                {this.props.sinceWhenInput &&
                                 <div className="InputField">
                                 <Input
                                     type="text"
                                     id="date_input"
                                     label="Since When"
                                     name={'startDateModal'}
                                     className="date"
                                     placeholder="MM/YYYY"
                                     maxLength='7'
                                     value={this.state['startDateModal'] || ''}
                                     error={this.state['startDateModal_error'] ? true : false}
                                     helperText={this.state['startDateModal_error']}
                                     onChange={this.handleChange()}
                                 />
                                 </div>

                                }
                            </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions className="content-button">
                        <Button
                            fullWidth={true}
                            variant="raised"
                            size="large"
                            color="secondary"
                            onClick={this.handleClick}
                            autoFocus>{this.props.cta_title}
                        </Button>
                    </DialogActions>
                </Dialog >
            );
        }
        return null;
    }

    render() {
        return (
            <div className="generic-input-popup">
                {this.renderPopUp()}
            </div>
        );
    }
}

const InputPopup = (props) => (
    <InputPopupClass
        {...props} />
);

export default InputPopup;
