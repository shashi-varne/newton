import React, { Component } from 'react';
import tick_icon_fisdom from 'assets/selected_option.png';
import tick_icon_myway from 'assets/check_selected_blue.svg';
import './style.css';
import { getConfig } from 'utils/functions';
import scrollIntoView from 'scroll-into-view-if-needed';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import down_arrow from 'assets/down_arrow.svg';
import SVG from 'react-inlinesvg';
import { formatAmountInr } from 'utils/validators';
import WVButton from './Button/WVButton';
import WVFullscreenDialog from './FullscreenDialog/WVFullscreenDialog';

class DropdownInModalClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex:
        this.props.selectedIndex !== '' && this.props.selectedIndex >= 0
          ? Number(this.props.selectedIndex)
          : '',
      options: this.props.options,
      onChange: this.props.onChange,
      tick_icon: getConfig().productName !== 'fisdom' ? tick_icon_myway : tick_icon_fisdom,
      inputToRender: this.props.inputToRender,
      view_scrolled: false,
      value: this.props.value,
    };

    this.handleShow.bind(this, this.props.selectedIndex);
  }

  componentDidMount() {
    this.handleShow(this.state.selectedIndex);
  }

  componentDidUpdate(prevState) {
    if (!this.state.view_scrolled) {
      this.handleShow(this.state.selectedIndex);
    }

    if (prevState.selectedIndex !== this.props.selectedIndex) {
      this.setState({
        selectedIndex: this.props.selectedIndex,
      });
    }

    if (prevState.options !== this.props.options) {
      this.setState({
        options: this.props.options,
      });
    }
  }

  handleChange(index) {
    this.setState({ selectedIndex: index });
  }

  handleShow(i) {
    i = 'scroll_' + i;
    let element = document.getElementById(i);
    if (!element || element === null) {
      return;
    }
    this.setState({
      view_scrolled: true,
    });

    scrollIntoView(element, {
      block: 'center',
      inline: 'nearest',
    });
  }

  handleClose = () => {
    this.setState({
      openPopUp: false,
    });
  };

  handleCloseAction = () => {
    this.props.onChange(this.state.selectedIndex);
    this.handleClose();
  };

  renderList = (props, index) => {
    let isSelected = this.state.selectedIndex === index;
    return (
      <div
        key={index}
        id={'scroll_' + index}
        ref={index}
        onClick={() => this.handleChange(index)}
        className={'row-scroll' + (isSelected ? ' row-scroll-selected' : '')}
      >
        <div>
          <div className='flex-between'>
            <div className={isSelected ? 'content-selected' : ''}>
              <span>{props.name}</span>
              {this.props.isSelectedText && isSelected && (
                <span className={this.props.class}>
                  {this.props.isSelectedText}
                </span>
              )}
            </div>

            {isSelected && (
              <img
                style={{
                  width: 14,
                  position: 'absolute',
                  right: 20,
                  cursor: 'pointer',
                }}
                src={require(`assets/completed_step.svg`)}
                alt=''
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  renderPopUp() {
    if (this.state.openPopUp) {
      return (
        <WVFullscreenDialog
          open={this.state.openPopUp}
          onClose={this.handleClose}
          id="dropdown-in-modal-dialog"
          title={this.props.header_title}
          closeIconPosition="left"
        >
          <WVFullscreenDialog.Content>
            <div className='content' id='alert-dialog-description'>
              {this.props.options.map(this.renderList)}
            </div>
          </WVFullscreenDialog.Content>
          <WVFullscreenDialog.Action>
            <WVButton
              fullWidth
              contained
              color='secondary'
              onClick={this.handleCloseAction}
            >
              {this.props.cta_title}
            </WVButton>
          </WVFullscreenDialog.Action>
        </WVFullscreenDialog>
      );
    }
    return null;
  }

  isRuppe = (value) => {
    if (value && this.props.showInrSymbol) {
      return formatAmountInr(value);
    }

    return value;
  };

  render() {
    return (
      <div className='dropdown-in-modal'>
        {this.state.openPopUp && this.renderPopUp()}

        <FormControl
          className='Dropdown'
          disabled={this.props.disabled}
          onClick={() => {
            this.setState(
              {
                openPopUp: true,
                selectedIndex: this.props.selectedIndex,
              },
              () => {
                let that = this;
                setTimeout(function () {
                  that.handleShow(that.state.selectedIndex);
                }, 200);
              }
            );
          }}
        >
          <InputLabel htmlFor={this.props.id} style={{ marginTop: '-25px' }}>
            <span style={{ fontSize: '11px' }}>{this.props.label}</span>
          </InputLabel>

          <div className={`input-box ${this.props.inputBox && 'input-box-port-reb'}`}>
            <div className='input-value'>
              {this.isRuppe(
                //   this.props.parent?.state[this.props.name] ||
                this.props.value
              )}
              {this.props.isAppendText && (
                <span className={this.props.class}>{this.props.isAppendText}</span>
              )}
            </div>

            <SVG
              className='text-block-2-img'
              preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
              src={down_arrow}
            />
          </div>
          <span className='error-radiogrp'>
            {this.props.error ? this.props.helperText || 'Please select an option' : ''}
          </span>
        </FormControl>
      </div>
    );
  }
}

const DropdownInModal = (props) => <DropdownInModalClass {...props} />;

export default DropdownInModal;
