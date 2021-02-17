import React, { Component } from 'react';

import GoldLivePrice from './live_price';
import Dialog, {
    DialogContent
  } from 'material-ui/Dialog';
import { FooterLayoutBase } from 'common/components/footer/layout';
import ReactHtmlParser from 'react-html-parser'; 

class ConfirmDialogClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    rednerContent1(props, index) {
        return (
            <div key={index} className="content-points">
                <div className="content-points-inside-text">
                    {ReactHtmlParser(props.name)}
                </div>
                <div className="content-points-inside-text">
                    {props.value}
                </div>
            </div>
        )
    }

    rednerContent2(props, index) {
        return (
            <div key={index} className="content2-points">
                <div className="content2-points-inside-text">
                    {props.name}
                </div>
                <div className="content2-points-inside-text">
                    {props.value}
                </div>
            </div>
        )
    }

    renderConfirmDialog = () => {
        return (
          <Dialog
            id="bottom-popup"
            open={this.props.parent.state.openConfirmDialog || false}
            onClose={this.props.parent.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <div className="gold-dialog" id="alert-dialog-description">
                {this.props.parent.state.orderType !== 'delivery' &&
                 <GoldLivePrice parent={this.props.parent} />}
                <div className="mid-buttons">
                  <FooterLayoutBase 
                    type="withProvider"
                     handleClick2={this.props.parent.handleClose}
                    //  handleClick={this.props.parent.handleClick}
                    handleClick={this.props.parent.handleClose}
                     buttonTitle={this.props.parent.state.confirmDialogData.buttonTitle}
                     buttonData= {this.props.parent.state.confirmDialogData.buttonData}
                  />
                </div>
    
                <div className="hr"></div>
    
                <div className="content">
                    {this.props.parent.state.confirmDialogData.content1.map(this.rednerContent1)}
                </div>
    
                <div className="hr"></div>
    
                <div className="content2">
                    {this.props.parent.state.confirmDialogData.content2.map(this.rednerContent2)}
                </div>
    
                <div className="hr"></div>
              </div>
            </DialogContent>
          </Dialog >
        );
    
    }

    render() {
        return (
            <div>
                {this.props.parent.state.confirmDialogData && this.renderConfirmDialog()}
            </div>
        );
    }
}

const ConfirmDialog = (props) => (
    <ConfirmDialogClass
    {...props} />
);

export default ConfirmDialog;