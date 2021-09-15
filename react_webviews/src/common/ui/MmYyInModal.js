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
import { formatMonthandYear, dobFormatTest, IsFutureMonthYear, IsPastMonthYearfromDob } from "utils/validators";

class MmYyInModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
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
            [this.props.id]: value,
            [name + '_error']: ''
        })
    }

    handleClick = () => {
        let value = this.state[this.props.id] !== undefined ? this.state[this.props.id] : this.props.start_date
        this.setState({
            [this.props.id]: value
        })

        let error = '';
        let date = value;
        let name = this.props.name;
        let dob = this.props.dob

        if (!date) {
            error = "please enter month and year";
            this.setState({
                [name + '_error']: error
            })
        }

        if (!isValidMonthYear(date)) {
            error = "please enter valid month or year";
            this.setState({
                [name + '_error']: error
            })
        } else if (IsFutureMonthYear(date)) {
            error = "future month or year is not allowed";
            this.setState({
                [name + '_error']: error
            })
        } else if (IsPastMonthYearfromDob(date, dob)) {
            error = "month or year less than dob is not allowed";
            this.setState({
                [name + '_error']: error
            })
        } else {
            this.props.parent.updateParent(this.props.name, value)
            this.handleClose();
        }
    }

    renderPopUp() {
        let name = this.props.name;

        if (this.props.parent.state.openPopUpInputDate) {
            return (
                <Dialog
                    fullWidth={true}
                    fullScreen={!!getConfig().isMobileDevice}
                    style={{ margin: 0 }}
                    id="dropdown-in-modal-dialog"
                    paper={{
                        margin: '0px'
                    }}
                    open={this.props.parent.state.openPopUpInputDate}
                    // id="generic-input-popup-dialog"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"  
                >
                    <DialogTitle  id="dropdown-in-modal-dialog-title" style={{height: 60}}>
                        <div onClick={this.handleClose} style={{cursor: 'pointer'}}>
                            <SVG
                                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
                                src={close_icn}
                            />
                        </div>
                        <div className="dialog-head">
                            {this.props.header_title}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content" style={{margin: '20px 0 0 6px'}} id="alert-dialog-decription">
                            <div className="content" style={{margin: '0 0 20px 0'}}>
                                {this.props.header_sub_title}
                            </div>
                            <FormControl disabled={this.props.disabled}>
                                <div className="InputField">
                                <Input
                                    type="text"
                                    id="date_input"
                                    label="Since when"
                                    name={this.props.name}
                                    className="date"
                                    placeholder="MM/YYYY"
                                    maxLength='7'
                                    value={this.state[this.props.id] !== undefined ? (this.state[this.props.id] || '') : this.props.start_date}
                                    error={this.state[name+'_error'] ? true : false}
                                    helperText={this.state[name+'_error']}
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