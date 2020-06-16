import React, { Component } from 'react';
import tick_icon_fisdom from 'assets/selected_option.png';
import tick_icon_myway from 'assets/check_selected_blue.svg';
import './style.css';
import { getConfig } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed'
import close_icn from 'assets/close_icn.svg';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from 'material-ui/Dialog';
import { InputLabel } from 'material-ui/Input';
import down_arrow from 'assets/down_arrow.svg';
import SVG from 'react-inlinesvg';
class DropdownInModalClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: this.props.selectedIndex !== "" && this.props.selectedIndex >= 0 ? Number(this.props.selectedIndex) : '',
            options: this.props.options,
            onChange: this.props.onChange,
            tick_icon: getConfig().type !== 'fisdom' ? tick_icon_myway : tick_icon_fisdom,
            inputToRender: this.props.inputToRender,
            view_scrolled: false
        };

        this.handleShow.bind(this, this.props.selectedIndex)
    }


    componentDidMount() {
        this.handleShow(this.state.selectedIndex)
    }

    componentDidUpdate(prevState) {
        if (!this.state.view_scrolled) {
          this.handleShow(this.props.value);
        }
    
        if (prevState.value !== this.props.value) {
          this.setState({
            selectedValue: this.props.value
          })
        }
    
        if (prevState.options !== this.props.options) {
          this.setState({
            options: this.props.options
          })
        }
      }

    handleChange(index) {
        this.setState({ selectedIndex: index });
        this.props.onChange(index);
    };

    handleShow(i) {
        let element = document.getElementById(i);
        if (!element || element === null) {
            return;
        }
        this.setState({
            view_scrolled: true
        })

        scrollIntoView(element, {
            block: 'center',
            inline: 'nearest',
        })

    }

    handleClose = () => {
        this.setState({
            openPopUp: false
        })
    }

    handleCloseAction = () => {
        this.props.onChange(this.state.selectedIndex);
        this.handleClose();
    }

    renderList = (props, index) => {

        let isSelected = this.state.selectedIndex === index;
        return (
            <div key={index} id={index} ref={index} onClick={() => this.handleChange(index)}
                className={'row-scroll' + (isSelected ? ' row-scroll-selected' : '')}>
                <div>
                    <div className="flex-between">
                        <div className={isSelected ? 'content-selected' : ''}>
                            <span>{props}</span>
                        </div>

                        {isSelected && <img style={{
                            width: 14, position: 'absolute',
                            right: 20, cursor: 'pointer'
                        }}
                            src={require(`assets/completed_step.svg`)} alt="" />}
                    </div>
                </div>
            </div>
        )
    }

    renderPopUp() {
        if (this.state.openPopUp) {
            return (
                <Dialog
                    fullWidth={true}
                    fullScreen={true}
                    style={{ margin: 0 }}
                    id="dropdown-in-modal-dialog"
                    paper={{
                        margin: '0px'
                    }}
                    open={this.state.openPopUp}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >

                    <DialogTitle id="dropdown-in-modal-dialog-title">
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
                        <div className="content" id="alert-dialog-description">
                            {this.props.options.map(this.renderList)}
                        </div>
                    </DialogContent>
                    <DialogActions className="content-button">
                        <Button
                            fullWidth={true}
                            variant="raised"
                            size="large"
                            color="secondary"
                            onClick={this.handleCloseAction}
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
            <div className="dropdown-in-modal">
                {this.renderPopUp()}

                <FormControl className="Dropdown" disabled={this.props.disabled}
                    onClick={() => {
                        this.setState({
                            openPopUp: true
                        })
                    }}>
                    <InputLabel htmlFor={this.props.id}>{this.props.label} *</InputLabel>

                    <div className="input-box">
                    <div className="input-value">{this.props.value}</div>
                        <SVG
                            className="text-block-2-img"
                            preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                            src={down_arrow}
                        />
                    </div>
                    <span className='error-radiogrp'>{(this.props.error) ?
                        this.props.helperText || 'Please select an option' : ''}</span>
                </FormControl>
            </div>
        );
    }
}

const DropdownInModal = (props) => (
    <DropdownInModalClass
        {...props} />
);

export default DropdownInModal;
