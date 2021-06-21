import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import {
  didMount,
  commonRender,
} from "../../common/components/container_functions";
import { nativeCallback } from "utils/native_callback";
import "../../utils/native_listener";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { storageService } from "../../utils/validators";
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";
import { PATHNAME_MAPPER } from "../constants";

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
      project: "kyc", //to use in common functions
    };
    this.historyGoBack = this.historyGoBack.bind(this);
    this.didMount = didMount.bind(this);
    this.commonRender = commonRender.bind(this);
  }

  componentDidMount() {
    this.didMount();
    this.navigate = navigateFunc.bind(this.props);
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {
    const fromState = this.props.location?.state?.fromState || "";
    const toState = this.props.location?.state?.toState || "";
    const params = this.props.location?.params || {};
    let pathname = this.props.location?.pathname || "";
    if(pathname.indexOf('appl/webview') !== -1) {
      pathname = pathname.split("/")[5] || "/";
    }

    let openDialog = false;
    switch (pathname) {
      case "/kyc/personal-details4":
      case "/kyc/dl/personal-details3":
      case "/kyc/compliant-personal-details4":
      case "/kyc/upload/fno-income-proof":
      case "/kyc/digilocker/success":
      case "/kyc/digilocker/failed":
      case "/kyc/trading-experience":
        this.setState({ openConfirmBack: true });
        openDialog=true;
        break;
      default:
        break;
    }

    if(openDialog) {
      return;
    }
    
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }

    if (toState) {
      let isRedirected = this.backButtonHandler(this.props, fromState, toState, params);
      if (isRedirected) {
        return;
      }
    }

    console.log("Container props...", this.props);

    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    const goBackPath = this.props.location?.state?.goBack || "";
    console.log("goBackPath...", goBackPath)

    if (goBackPath) {
      if (goBackPath === "exit" && storageService().get("native")) {
        switch (pathname) {
          case "/kyc/home":
          case "/kyc/add-bank":
          case "/kyc/approved/banks/doc":
          case "/kyc/journey":
          case "/kyc/nri-error":
          case "/kyc/account-info":
          case "/kyc/stocks-status":
          case "/kyc/upload/progress":
            nativeCallback({ action: "exit_web" });
            break;
          default:
            console.log("Props history goBack...")
            this.props.history.goBack();
        }
        return;
      }
      this.navigate(goBackPath);
      return;
    }

    console.log("Props history goBack...");
    this.props.history.goBack();
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  closeConfirmBackDialog = () => {
    this.setState({ openConfirmBack: false });
  };

  redirectToJourney = () => {
    const kyc = storageService().getObject("kyc");
    this.navigate = navigateFunc.bind(this.props);
    const config = getConfig();
    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }
    const showAadhaar = !(kyc.address.meta_data.is_nri || kyc.kyc_type === "manual");
    if (kyc.kyc_status !== "compliant") {
      this.navigate(PATHNAME_MAPPER.journey, {
        searchParams: `${config.searchParams}&show_aadhaar=${showAadhaar}`
      });
    } else {
      this.navigate(PATHNAME_MAPPER.journey)
    }
  };

  render() {
    return (
      <Fragment>
        <ConfirmBackDialog
          isOpen={this.state.openConfirmBack}
          close={this.closeConfirmBackDialog}
          goBack={this.redirectToJourney}
        />
        {this.commonRender()}
      </Fragment>
    );
  }
}

export default withRouter(Container);
