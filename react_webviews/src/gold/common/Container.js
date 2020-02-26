import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "./Header";
import Footer from "./footer";
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from "utils/native_callback";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner';
import { getConfig, setHeights } from 'utils/functions';
import {checkStringInString, storageService} from 'utils/validators';
import {forceBackState, goBackMap} from '../constants';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom,
      inPageTitle: true,
      force_hide_inpage_title: false
    };
  }

  componentDidMount() {
    this.check_hide_header_title();
    setHeights({ 'header': true, 'container': false });
    let that = this;
    if (getConfig().generic_callback) {
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    } else {
      window.PlutusSdk.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    }

    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    if (getConfig().generic_callback) {
      window.callbackWeb.remove_listener({});
    } else {
      window.PlutusSdk.remove_listener({});
    }

    window.removeEventListener("scroll", this.onScroll, false);
  }

  navigate = pathname => {
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  };

  getEvents(user_action) {
    if (!this || !this.props || !this.props.events) {
      return;
    }
    let events = this.props.events;
    events.properties.user_action = user_action;
    return events;
  }

  historyGoBack = (backData) => {

    
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

    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    
    if (checkStringInString(pathname, "payment")) {
      this.navigate("/gold/gold-locker");
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

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            onClick={this.handleClose}
            color="default"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    nativeCallback({ action: "native_back", events: this.getEvents("back") });
  };

  renderPopup = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openPopup}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {/* <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle> */}
        <DialogContent>
          <DialogContentText>{this.state.popupText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="default">
            No
          </Button>
          <Button onClick={this.handlePopup} color="default" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderPageLoader = () => {
    if (this.props.showLoader) {
      return (
        <div className={`Loader ${this.props.loaderData ? this.props.loaderData.loaderClass : ''}`}>
          <div className="LoaderOverlay">
            <img src={this.state.loaderMain} alt="" />
              {this.props.loaderData && this.props.loaderData.loadingText && 
                <div className="LoaderOverlayText">{this.props.loaderData.loadingText}</div>
              }
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    setHeights({ 'header': true, 'container': false });
  }

  getHeightFromTop() {
    var el = document.getElementsByClassName('Container')[0];
    var height = el.getBoundingClientRect().top;
    return height;
  }

  check_hide_header_title() {
    let force_hide_inpage_title;
    let restrict_in_page_titles = ['provider-filter'];
    if(restrict_in_page_titles.indexOf(this.props.headerType) !== -1) {
      force_hide_inpage_title = true;
    }

    this.setState({
      force_hide_inpage_title: force_hide_inpage_title || false
    })

    if(this.props.updateChild) {
      this.props.updateChild('inPageTitle', force_hide_inpage_title);
    }

  }

  onScroll = () => {
    let inPageTitle = this.state.inPageTitle;
    if (this.getHeightFromTop() >= 56) {
      //show up
      inPageTitle = true;

    } else if(this.getHeightFromTop() < 36) {
      //show down
      inPageTitle = false;
    }

    this.setState({
      inPageTitle: inPageTitle
    })

    if(this.props.updateChild) {
      this.props.updateChild('inPageTitle', inPageTitle);
    }

  };

  headerGoBack = () => {
    this.historyGoBack({fromHeader: true});
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className="active" key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

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

        {/* Children Block */}
        <div
          style={this.props.styleContainer}
          className={`Container ${this.props.classOverRideContainer} ${this.props.noPadding ? "no-padding" : ""}`}
        >
          {this.props.children}
        </div>

        {/* Footer Block */}
        {!this.props.noFooter && (
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
}

export default withRouter(Container);
