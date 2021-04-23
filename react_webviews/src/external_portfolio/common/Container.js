import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "./Header";
import Footer from "./footer";

import { nativeCallback } from "utils/native_callback";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listener';
import { getConfig, setHeights } from 'utils/functions';
// import {checkStringInString, storageService} from 'utils/validators';
import { isEmpty, isFunction } from "../../utils/validators";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      productName: getConfig().productName,
      inPageTitle: true,
    };
  }

  componentDidMount() {
    // this.check_hide_header_title();
    setHeights({ 'header': true, 'container': false });
    let that = this;
    window.callbackWeb.add_listener({
      type: 'back_pressed',
      go_back: function () {
        that.historyGoBack();
      }
    });

    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.callbackWeb.remove_listener({});
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
    // let fromHeader = backData ? backData.fromHeader : false;
    // let pathname = this.props.history.location.pathname;
    let { params } = this.props.location;
    
    if (params && params.disableBack) {
      nativeCallback({ action: 'exit' });
      return;
    }

    if (isFunction(this.props.goBack)) {
      return this.props.goBack(params);
    }
    nativeCallback({ events: this.getEvents('back') });
    this.props.history.goBack();
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
            <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
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
    let el = '';
    if (this.props.hideInPageTitle) {
      el = document.getElementById('hni-custom-title');
    } else {
      el = document.getElementsByClassName('Container')[0];
    }
    if (!el || isEmpty(el)) return;
    let height = el.getBoundingClientRect().top;
    return height;
  }

  // check_hide_header_title() {
  //   let force_hide_inpage_title;
  //   if(restrict_in_page_titles.indexOf(this.props.headerType) !== -1) {
  //     force_hide_inpage_title = true;
  //   }

  //   this.setState({
  //     force_hide_inpage_title: force_hide_inpage_title || false
  //   })

  //   if(this.props.updateChild) {
  //     this.props.updateChild('inPageTitle', force_hide_inpage_title);
  //   }

  // }

  onScroll = () => {
    let inPageTitle = this.state.inPageTitle;
    const heightLimit = this.props.hideInPageTitle ? 32 : 56;
    if (this.getHeightFromTop() >= heightLimit) {
      //show up
      inPageTitle = true;

    } else {
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
        {(!this.props.noHeader && !getConfig().hide_header) && <Header
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
          rightIcon={this.props.rightIcon}
          handleRightIconClick={this.props.handleRightIconClick}
          inPageTitle={this.state.inPageTitle}
          force_hide_inpage_title={this.props.hideInPageTitle}
          style={this.props.styleHeader}
          className={this.props.classHeader}
          headerData={this.props.headerData}
        />}

        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 56 }}>
          {/* Loader Block */}
          {this.renderPageLoader()}
        </div>

        {/*  */}

        {!this.props.hideInPageTitle &&
          <div id="header-title-page"
            style={Object.assign(this.props.styleHeader || {}, { padding: '0 20px' })} 
            className={`header-title-page ${this.props.classHeader}`}>
              {this.state.inPageTitle && 
                <div className={`header-title-text-hni ${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`} style={{width: this.props.count ? '75%': ''}}>
                  {this.props.title}
                </div>
              }
              
              {this.state.inPageTitle && this.props.count &&
                <span color="inherit" 
                className={`${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
                style={{ fontSize: 10 }}>
                  <span style={{ fontWeight: 600 }}>{this.props.current}</span>/<span>{this.props.total}</span>
                </span>}
          </div>
        }

        {this.props.subtitle &&
          <div className="header-subtitle-text-hni">
            {this.props.subtitle}
          </div>
        }

        {/* Children Block */}
        <div
          style={this.props.styleContainer}
          className={`
            Container hni-container
            ${this.props.classOverRideContainer}
            ${this.props.noPadding ? "no-padding" : ""}
          `}
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
