import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "../../common/components/Header";
import { didMount } from "../../common/components/container_functions";
import { renderPageLoader, renderGenericError } from '../../common/components/container_functions';
import Footer from "./footer";

import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listner";
import { getConfig } from "utils/functions";
import { goBackMap } from "../constants";
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
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: "lending", //to use in common functions
    };

    this.didmount = didMount.bind(this);
    this.renderPageLoader = renderPageLoader.bind(this);
    this.renderGenericError = renderGenericError.bind(this);
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

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;

    if (goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }

    switch (pathname) {
      case "/loan/home":
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
          className={`Loader ${this.props.loaderData ? this.props.loaderData.loaderClass : ""
            }`}
        >
          <div className="LoaderOverlay">
            <div className="LoaderOverlay-title">
              {data.title}
            </div>
            <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
            <div className="LoaderOverlay-subtitle" >{data.subtitle}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    if (this.state.mounted) {
      return (
        <div
          className={`ContainerWrapper loanMainContainer ${this.props.classOverRide
            }  ${getConfig().productName !== "fisdom" ? "blue" : ""} ${this.props.changeBackground ? 'idfc-container' : ''}`}
        >
          {/* Header Block */}
          {!this.props.noHeader &&
            !getConfig().hide_header &&
            !this.props.loaderWithData && (
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
              // : this.renderPageLoader()
              : ''
              }
            {/* {this.renderPageLoader()} */}
            {/* {this.renderPageLoader2()} */}
          </div>

          {this.renderGenericError()}

          {!this.state.force_hide_inpage_title &&
            !this.props.noHeader &&
            !this.props.hidePageTitle &&
            this.new_header_scroll()}

          { this.props.skelton && 
            <UiSkelton 
            type={this.props.skelton}
            />
          }

          {/* Children Block */}
          {/* <div
            style={this.props.styleContainer}
            className={`Container ${this.props.classOverRideContainer} ${this.props.noPadding ? "no-padding" : ""
              }`}
          >
            {this.props.children}
          </div> */}

          {/* Children Block */}
          <div
            style={{...this.props.styleContainer, backgroundColor: this.props.skelton ? '#fff': 'initial',
            // backgroundImage: this.props.skelton ? 'unset': 'initial'
          }}
            className={`Container ${this.props.classOverRideContainer} ${this.props.noPadding ? "no-padding" : ""}`}
            >
            <div 
            className={`${!this.props.skelton ? 'fadein-animation' : ''}`}
            style={{display: this.props.skelton ? 'none': ''}}
            > {this.props.children} </div>
          </div>

          {/* Footer Block */}
          {!this.props.noFooter && !this.props.skelton && (
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
              // showDotDot={this.props.showDotDot}
              showLoader={this.props.showLoader}
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
