import React, { Component } from 'react';
import { copyToClipboard } from 'utils/validators';
// import Toast from '../../common/ui/Toast';
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
      // this.sendEvents('copy');
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
        className={classes.root}>
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
          <div
            id="info-box-ctrl"
            className={classes.ctrl}
            onClick={this.copyItem}
          >
            <span>{copyText}</span>
          </div>
        }
      </div>
    );
  }
}