import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from '../../common/components/Header';
import {didmount} from '../../common/components/container_functions';

import Footer from "./footer";

import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';
import {checkStringInString, storageService} from 'utils/validators';
import {forceBackState, goBackMap} from '../constants';

import UiSkelton from '../../common/ui/Skelton';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      inPageTitle: true,
      new_header:true,
      force_hide_inpage_title: false,
      project: 'gold' //to use in common functions
    };

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    
    let fromHeader = backData ? backData.fromHeader : false;
    let pathname = this.props.history.location.pathname;

    let provider = '';
    if(checkStringInString(pathname, "safegold")) {
      provider = 'safegold';
    }

    if(checkStringInString(pathname, "mmtc")) {
      provider = 'mmtc';
    }

    if (fromHeader && checkStringInString(pathname, "check-how")) {
      this.navigate("/gold/landing");
      return;
    }

    if(forceBackState()) {
      // let state = forceBackState();
      storageService().remove('forceBackState');
      // this.navigate(state);
      // return;
    }

    if(goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }
    
    if (checkStringInString(pathname, "payment")) {
      this.navigate("/gold/landing");
      return;
    }


    if(checkStringInString(pathname, "gold-delivery-order")) {
      this.navigate("/gold/" + provider +  "/delivery-select-address");
      return;
    }

    if(checkStringInString(pathname, "delivery-select-address")) {
      this.navigate("/gold/" + provider +  "/select-gold-product");
      return;
    }

    if(checkStringInString(pathname, "select-gold-product")) {
      this.navigate("/gold/delivery-products");
      return;
    }

    if(checkStringInString(pathname, "sell-select-bank")) {
      this.navigate("/gold/sell");
      return;
    }

    switch (pathname) {
      case "/gold/gold-locker":
        this.navigate("/gold/landing");
        break;
      case "/gold":
      case "/gold/my-gold":
      case "/gold/about":
      case "/gold/landing":
        nativeCallback({ action: "native_back"});
        break;
      default:
        this.props.history.goBack();
    }
  };


  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({fromHeader: true});
  }

  handlePopup = () => {
    this.setState({
        openPopup: false
    });

    nativeCallback({ action: "native_back", events: this.getEvents("back") });
  };

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className="active" key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    if (this.state.mounted) { 
      return (
        <div className={`ContainerWrapper ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`}  >
          {/* Header Block */}
          {(!this.props.noHeader && !getConfig().hide_header) &&<Header
            disableBack={this.props.disableBack}
            title={this.props.title}
            smallTitle={this.props.smallTitle}
            provider={this.props.provider}
            count={this.props.count}
            total={this.props.total}
            current={this.props.current}
            goBack={this.headerGoBack}
            edit={this.props.edit}
            type={getConfig().productName}
            resetpage={this.props.resetpage}
            handleReset={this.props.handleReset}
            inPageTitle={this.state.inPageTitle}
            force_hide_inpage_title={this.state.force_hide_inpage_title}
            style={this.props.styleHeader}
            className={this.props.classHeader}
            headerData={this.props.headerData}
          />}
  
          {/* Below Header Block */}
          <div id="HeaderHeight" style={{ top: 56 }}>
            {/* Loader Block */}
            {this.renderPageLoader()}
          </div>
  

          {!this.state.force_hide_inpage_title && 
            this.new_header_scroll() 
          }

          { this.props.skelton && 
            <UiSkelton 
            type={this.props.skelton}
            />
          }
  
          {/* Children Block */}
            <div
            style={{...this.props.styleContainer, backgroundColor: this.props.skelton ? '#fff': 'initial'}}
            className={`Container ${this.props.classOverRideContainer} ${this.props.noPadding ? "no-padding" : ""}`}
            >
            <div 
            className={`${!this.props.skelton ? 'fadein-animation' : ''}`}
            style={{display: this.props.skelton ? 'none': ''}}
            > {this.props.children}
             </div>
          </div>
  
          {/* Footer Block */}
          {!this.props.noFooter && !this.props.skelton &&  (
            <Footer
              noFooter={this.props.noFooter}
              fullWidthButton={this.props.fullWidthButton}
              logo={this.props.logo}
              buttonTitle={this.props.buttonTitle}
              provider={this.props.provider}
              premium={this.props.premium}
              paymentFrequency={this.props.paymentFrequency}
              edit={this.props.edit}
              resetpage={this.props.resetpage}
              handleClick={this.props.handleClick}
              handleClick2={this.props.handleClick2}
              handleReset={this.props.handleReset}
              onlyButton={this.props.onlyButton}
              disable={this.props.disable}
              withProvider={this.props.withProvider}
              buttonData={this.props.buttonData}
            />
          )}
          {/* No Internet */}
          {this.renderDialog()}
          {this.renderPopup()}
        </div>
      );
    }

    return null;

    
  }
}

export default withRouter(Container);
