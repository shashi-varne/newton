import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import Button from 'material-ui/Button';
import Input from './Input';
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
            onChange: this.props.onChange,
            value: this.props.value
        }
    };

    handleChange = (event) => {
        let value = event.target.value;

        if (!dobFormatTest(value)) {
            return;
        }

        let input = document.getElementById('date');
        input.onkeyup = formatMonthandYear;

        this.setState({
            value: value,
            error: ''
        })
    }

    handleCloseAction = () => {
        let error = '';
        let date = this.state.value;

        if (!isValidMonthYear(date)) {
            error = "please enter valid month or year";
            this.setState({
                error: error
            })
        } else {
            this.handleClose();
        }
        
    }

    handleClose = () => {
        this.setState({
            openPopUp: false
        })
    }
    
    render() {
        return (
            <Dialog
                fullWidth={true}
                fullScreen={!getConfig().isMobileDevice}
                style={{margin: 0}}
                id="modal-dialog"
                paper={{
                    margin: '0px'
                }}
                open={this.props.open}
                onClose={this.handleClose}
            >
                <DialogTitle>
                    <div onClick={this.handleClose}>
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
                    <div className="content">
                        {this.props.header_sub_title}
                    </div>
                    <div className="InputField">
                    <Input 
                        type="text"
                        id="date"
                        label="Since When"
                        name={this.props.name}
                        className="date"
                        placeholder="MM/YYYY"
                        maxLength='7'
                        value={this.state.value || ''}
                        error={this.state.error ? true : false}
                        helperText={this.props.error}
                        onChange={(event) => this.handleChange(event)}
                    />
                </div>
                </DialogContent>
                <DialogActions className="content-button">
                    <Button
                        fullWidth={true}
                        variant="raised"
                        size="large"
                        color="secondary"
                        onClick={this.handleCloseAction}
                        autoFocus={this.props.cta_title}
                    />
                </DialogActions>
            </Dialog>
        )
    }
}

export default MmYyInModal;