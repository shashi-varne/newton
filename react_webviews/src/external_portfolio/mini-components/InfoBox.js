import React, { Component } from 'react';
import { copyToClipboard } from 'utils/validators';
import toast from '../../common/ui/Toast';

export default class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyText: 'COPY',
    };
  }

  copyItem = () => {
    if (copyToClipboard(this.props.textToCopy)) {
      toast("Text copied");
      this.setState({ copyText: 'Copied' });
      setTimeout(() => {
        this.setState({ copyText: 'Copy' });
      }, 3000);
    }
  }

  render() {
    const { copyText } = this.state;
    const {
      image,
      imageAltText,
      children,
      ctrlText,
      isCopiable,
      boxStyle = {},
    } = this.props;

    const classes = this.props.classes || {};

    if (ctrlText && isCopiable) {
      return (<span style={{color: 'red'}}>
        Error: Cannot use both <b>ctrlText</b> and <b>isCopiable</b>
      </span>)
    }

    return (
      <div
        id="info-box"
        className={classes.root}
        style={boxStyle}>
        {image && 
          <div id="info-box-img">
            <img
              src={image}
              className={classes.img}
              alt={imageAltText}
            />
          </div>
        }
        <div
          id="info-box-body"
          className={classes.body}>
          {children}
        </div>
        {ctrlText &&
          <div
            id="info-box-ctrl"
            className={classes.ctrl}
            onClick={this.props.onCtrlClick}
          >
            <span>{ctrlText}</span>
          </div>
        }
        {isCopiable &&
          <img
            className="info-box-copy-icon"
            src={require('assets/copy_icn.svg')}
            alt="copy"
            onClick={this.copyItem}
          />
        }
      </div>
    );
  }
}