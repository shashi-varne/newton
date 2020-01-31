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
import {checkStringInString} from 'utils/validators';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom,
      inPageTitle: true
    };
  }

  componentDidMount() {
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
      search: this.props.location.search + "&isDelivery=" + false
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

  historyGoBack = () => {
    // let { params } = this.props.location;
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    let pathname = this.props.history.location.pathname;
    if (checkStringInString(pathname, "payment")) {
      this.navigate("/gold/my-gold");
      return;
    }
    switch (pathname) {
      case checkStringInString(pathname, "select-gold-product"):
        this.props.history.push({
          pathname: "/gold/my-gold-locker",
          search: this.props.location.search + "&isDelivery=" + true
        });
        break;
      // case '/gold/my-gold':
      //   this.navigate('/gold/about');
      //   break;
      case "/gold/my-gold-locker":
        this.navigate("/gold/my-gold");
        break;
      case checkStringInString(pathname, "buy-gold-order"):
        this.navigate("/gold/my-gold");
        break;
      case checkStringInString(pathname, "gold-delivery-order"):
        this.navigate("/gold/gold-delivery-address");
        break;
      case checkStringInString(pathname, "gold-delivery-address"):
        this.navigate("/gold/select-gold-product");
        break;
      case "/gold":
      case "/gold/my-gold":
      case "/gold/about":
        // this.setState({
        //   callbackType: "exit",
        //   openPopup: true,
        //   popupText: "Are you sure you want to exit?"
        // });
        nativeCallback({ action: "native_back", events: this.getEvents("back") });
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
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={this.state.loaderMain} alt="" />
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

  onScroll = () => {

    let inPageTitle = this.state.inPageTitle;
    if (this.getHeightFromTop() >= 56) {
      //show up
      inPageTitle = true;

    } else {
      //show down
      inPageTitle = false;
    }

    this.setState({
      inPageTitle: inPageTitle
    })
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

    return (
      <div className={`ContainerWrapper ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`} >
        {/* Header Block */}
        <Header
          disableBack={this.props.disableBack}
          title={this.props.title}
          smallTitle={this.props.smallTitle}
          provider={this.props.provider}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          type={getConfig().productName}
          resetpage={this.props.resetpage}
          handleReset={this.props.handleReset}
          inPageTitle={this.state.inPageTitle}
        />

        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 56 }}>
          {/* Loader Block */}
          {this.renderPageLoader()}
        </div>

        {/* Children Block */}
        <div
          className={`Container ${this.props.noPadding ? "no-padding" : ""}`}
        >
          {this.props.children}
        </div>

        {/* Footer Block */}
        {!this.props.noFooter && (
          <Footer
            fullWidthButton={this.props.fullWidthButton}
            logo={this.props.logo}
            buttonTitle={this.props.buttonTitle}
            provider={this.props.provider}
            premium={this.props.premium}
            paymentFrequency={this.props.paymentFrequency}
            edit={this.props.edit}
            resetpage={this.props.resetpage}
            handleClick={this.props.handleClick}
            handleReset={this.props.handleReset}
            onlyButton={this.props.onlyButton}
            noFooter={this.props.noFooter}
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
