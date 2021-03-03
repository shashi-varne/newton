import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from "../../common/components/Header";
import { didmount } from "../../common/components/container_functions";
import Footer from './footer';
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listner";
import { getConfig } from "utils/functions";
// import { checkStringInString, storageService } from "utils/validators";
// import { forceBackState, goBackMap } from "../constants";

import UiSkelton from "../../common/ui/Skelton";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callbackType: "",
      inPageTitle: true,
      new_header: true,
      force_hide_inpage_title: false,
      project: "help",
    };

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;

    switch (pathname) {
      case "/help":
        nativeCallback({ action: "exit", events: this.getEvents() });
        break;
      default:
    }
  };

  render() {
    if (this.state.mounted) {
      return (
        <div
          className={`ContainerWrapper ${this.props.classOverRide}  ${
            getConfig().productName !== "fisdom" ? "blue" : ""
          }`}
        >
          {/* Header Block */}
          {!this.props.noHeader && !getConfig().hide_header && (
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

          {!this.state.force_hide_inpage_title && this.new_header_scroll()}

          {this.props.skelton && <UiSkelton type={this.props.skelton} />}

          {/* Children Block */}
          <div
            style={{
              ...this.props.styleContainer,
              backgroundColor: this.props.skelton ? "#fff" : "initial",
            }}
            className={`Container ${this.props.classOverRideContainer} ${
              this.props.noPadding ? "no-padding" : ""
            }`}
          >
            <div
              className={`${!this.props.skelton ? "fadein-animation" : ""}`}
              style={{ display: this.props.skelton ? "none" : "" }}
            >
              {" "}
              {this.props.children}
            </div>
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
