import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Input from './Input';
import './style.css';
import Dialog, {
    DialogActions,
    DialogContent, 
    DialogTitle
} from 'material-ui/Dialog';
import SVG from 'react-inlinesvg';
import close_icn from 'assets/close_icn.svg';
import { isValidMonthYear } from "utils/validators";
import { formatMonthandYear, dobFormatTest } from "utils/validators";

class MmYyInModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            name: this.props.name
        }
    };

    handleClose = () => {
        this.props.parent.updateParent('openPopUpInputDate', false)
    }

    handleCloseAction = () => {
        this.handleClose();
    }

    handleChange = name => event => {

        if (!name) {
            name = event.target.name;
        }

        let value = event.target.value;

        if (!dobFormatTest(value)) {
            return
        }

        let input = document.getElementById('date_input');
        input.onkeyup = formatMonthandYear;

        this.setState({
            value: value,
            name: name,
            [name + '_error']: ''
        })
    }

    handleClick = () => {

        let error = '';
        let date = this.state.value;
        let name = this.state.name;

        if (!isValidMonthYear(date)) {
            error = "please enter valid month or year";
            this.setState({
                [name + '_error']: error
            })
        } else {
            this.props.parent.updateParent(this.props.name, this.state.value)
            this.handleClose();
        }
    }

    renderPopUp() {

        if (this.props.parent.state.openPopUpInputDate) {
            return (
                <Dialog
                    fullWidth={true}
                    open={this.props.parent.state.openPopUpInputDate}
                    style={{ margin: 0 }}
                    id="generic-input-popup-dialog"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"  
                >
                    <DialogTitle  id="dropdown-in-modal-dialog-title">
                        <div onClick={this.handleClose} style={{cursor: 'pointer'}}>
                            <SVG
                                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                                src={close_icn}
                            />
                        </div>
                        <div className="dialog-head">
                            {this.props.header_title}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content" id="alert-dialog-decription">
                            <div className="content">
                                {this.props.header_sub_title}
                            </div>
                            <FormControl>
                                <div className="InputField">
                                <Input
                                    type="text"
                                    id="date_input"
                                    label="Since When"
                                    name={this.props.name}
                                    className="date"
                                    placeholder="MM/YYYY"
                                    maxLength='7'
                                    value={this.state.value || ''}
                                    error={this.state[this.state.name+'_error'] ? true : false}
                                    helperText={this.state[this.state.name+'_error']}
                                    onChange={this.handleChange()}
                                />
                                </div>
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
                </Dialog>
            )
        }
    }

    render() {
        return (
            <div className="generic-input-popup">
                {this.renderPopUp()}
            </div>
        )
    }

}

export default MmYyInModal;
