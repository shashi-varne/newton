import React, { Component } from 'react';

import GoldLivePrice from './live_price';
import Dialog, {
    DialogContent
  } from 'material-ui/Dialog';
import { FooterLayoutBase } from 'common/components/footer/layout';
import ReactHtmlParser from 'react-html-parser'; 
import {getConfig} from 'utils/functions';

const mapper = {
    'buy': {
        'expired_title' : 'buying',
        'update_title': 'Buying'
    },
    'sell': {
        'expired_title' : 'selling',
        'update_title': 'Selling'
    }
}

class PriceChangeClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName
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

    refreshData = () => {
        if(this.props.parent.state.price_crashed) {
            this.props.parent.navigate('/gold/landing');
            return;
        }


        if (this.props.parent.state.timeAvailable > 0) {
            this.props.parent.handleClose();
        } else {
            this.props.parent.updateParent('refresh_price_event', true);
            this.props.parent.updateParent('show_loader', true);
            this.props.parent.updateParent('openRefreshModule', true);
        }
    }

    getBottomButtonData =() => {
        let data = this.props.parent.state.priceChangeDialogData.buttonData;
        data.leftStyle = {
            opacity: this.props.parent.state.price_crashed ? 0.3 : 1
        }

        return data;
    }

    renderConfirmDialog = () => {
        return (
          <Dialog
            id="bottom-popup"
            open={this.props.parent.state.openPriceChangedDialog || false}
            onClose={this.props.parent.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <div className="gold-dialog" id="alert-dialog-description">
                {!this.props.parent.state.price_crashed && this.props.parent.state.timeAvailable <=0 && <div>
                    <div style={{color: '#0A1C32', fontSize:16, fontWeight:700}}>
                    Oops! {mapper[this.props.parent.state.orderType].expired_title} price has changed
                    </div>
                    <div>
                        <img style={{width: '100%', margin: '10px 0 20px 0'}} 
                        src={ require(`assets/${this.state.productName}/ils_timeout.svg`)} alt="Gold" />
                    </div>
                    <div style={{color: '#767E86', fontSize:14, fontWeight:400,margin: '0 0 20px 0', lineHeight: 1.6}}>
                        Looks like you took too long… Please refresh to get the <b>latest {this.props.parent.state.orderType} price</b>
                    </div>
                </div>}

                {this.props.parent.state.price_crashed && 
                    <div>
                        <div style={{color: '#0A1C32', fontSize:16, fontWeight:700}}>
                        Oops! something went wrong
                        </div>
                        <div style={{color: '#767E86', fontSize:14, fontWeight:400,margin: '20px 0 20px 0', lineHeight: 1.6}}>
                        Something is not working, we are not sure yet but we will look into it, please try after sometime.
                        </div>
                    </div>
                }

                {this.props.parent.state.timeAvailable >0 && <div>
                    <div style={{color: '#0A1C32', fontSize:16, fontWeight:700, margin: '0 0 20px 0', lineHeight: 1.6}}>
                    {mapper[this.props.parent.state.orderType].update_title} price has been updated!
                    </div>
                </div>}


                <GoldLivePrice style={{opacity: this.props.parent.state.price_crashed ? 0.3 : 1}} parent={this.props.parent} />
                <div className="mid-buttons">
                  <FooterLayoutBase type="withProvider"
                     handleClick2={this.props.parent.handleClose}
                     handleClick={this.refreshData}
                     buttonTitle={this.props.parent.state.timeAvailable > 0 || this.props.parent.state.price_crashed ? 'OK' : this.props.parent.state.priceChangeDialogData.buttonTitle}
                     buttonData= {this.getBottomButtonData()}
                  />
                </div>
    
                <div style={{opacity: this.props.parent.state.timeAvailable <=0 ? 0.3 : 1}}>
                    <div className="hr"></div>
        
                    <div className="content">
                        {this.props.parent.state.priceChangeDialogData.content1.map(this.rednerContent1)}
                    </div>
        
                    <div className="hr"></div>
        
                    <div className="content2">
                        {this.props.parent.state.priceChangeDialogData.content2.map(this.rednerContent2)}
                    </div>
        
                    <div className="hr"></div>
                </div>
              </div>
            </DialogContent>
          </Dialog >
        );
    
    }

    render() {
        return (
            <div>
                {this.props.parent.state.priceChangeDialogData && this.renderConfirmDialog()}
            </div>
        );
    }
}

const PriceChangeDialog = (props) => (
    <PriceChangeClass
    {...props} />
);

export default PriceChangeDialog;