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
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: "whatsapp",
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
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
  };

  historyGoBack = (backData) => {
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;

    switch (pathname) {
      case "/whatsapp/whatsapp-confirm":
        nativeCallback({ action: "native_back" });
        break;
      case "/whatsapp/whatsapp-edit":
        this.navigate("/whatsapp/whatsapp-confirm");
        break;
      default:
        this.props.history.goBack();
    }
  };

  headerGoBack = () => {
    this.historyGoBack({fromHeader: true});
  }

  render() {

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
            {this.renderPageLoader()}
          </div>

          {/*  */}

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
