import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "../../common/components/Header";
import { didmount } from "../../common/components/container_functions";

import Footer from "./footer";

import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listner";
import { getConfig } from "utils/functions";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: "lending", //to use in common functions
    };

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  goBackMap(path) {
    let mapper = {
      '/loan1/idfc-dmi/calculator': '/loan1/idfc-dmi/home',
      '/loan1/idfc-dmi/personal-details': '/loan1/idfc-dmi/home',
      '/loan1/idfc-dmi/select-loan': '/loan1/idfc-dmi/personal-details',
      '/loan1/idfc-dmi/know-more': '/loan1/idfc-dmi/select-loan',
    }
  
    return mapper[path] || false;
  }

  historyGoBack = (backData) => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;

    if (this.goBackMap(pathname)) {
      this.navigate(this.goBackMap(pathname));
      return;
    }

    switch (pathname) {
      case "/loan1/idfc-dmi/home":
        nativeCallback({ action: "native_back" });
        break;
      default:
        this.props.history.goBack();
    }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
  };

  handleClose = () => {
    this.setState({
      openPopup: false,
    });
  };

  renderPageLoader2 = (data) => {
    if (this.props.showLoader) {
      return (
        <div
          className={`Loader ${
            this.props.loaderData ? this.props.loaderData.loaderClass : ""
          }`}
        >
          <div className="LoaderOverlay">
            <div className="LoaderOverlay-title">{data.title}</div>
            <img
              className="LoaderOverlay-image"
              src={require(`assets/${this.state.productName}/lock_key.svg`)}
              alt=""
            />
            <div className="LoaderOverlay-subtitle">{data.subtitle}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
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
        <div
          className={`ContainerWrapper loanMainContainer ${
            this.props.classOverRide
          }  ${getConfig().productName !== "fisdom" ? "blue" : ""}`}
        >
          {/* Header Block */}
          {!this.props.noHeader &&
            !getConfig().hide_header &&
            !this.props.showLoader && (
              <Header
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
              />
            )}

          {/* Below Header Block */}
          <div id="HeaderHeight" style={{ top: 56 }}>
            {/* Loader Block */}
            {this.props.loaderWithData
              ? this.renderPageLoader2(this.props.loaderData)
              : this.renderPageLoader()}
          </div>

          {!this.state.force_hide_inpage_title &&
            !this.props.noHeader &&
            !this.props.hidePageTitle &&
            this.new_header_scroll()}

          {/* Children Block */}
          <div
            style={this.props.styleContainer}
            className={`Container ${this.props.classOverRideContainer} ${
              this.props.noPadding ? "no-padding" : ""
            }`}
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
              style={this.props.styleFooter}
              twoButton={this.props.twoButton}
              dualbuttonwithouticon={this.props.dualbuttonwithouticon}
              buttonOneTitle={this.props.buttonOneTitle}
              buttonTwoTitle={this.props.buttonTwoTitle}
              handleClickOne={this.props.handleClickOne}
              handleClickTwo={this.props.handleClickTwo}
            />
          )}
          {/* No Internet */}
        </div>
      );
    }

    return null;
  }
}

export default withRouter(Container);
