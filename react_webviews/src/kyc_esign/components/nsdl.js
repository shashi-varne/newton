import React, { Fragment, Component } from "react";
import Container from "../common/Container";
import { nativeCallback } from "utils/native_callback";
import { getConfig } from "utils/functions";
import { getUrlParams } from "utils/validators";
import ContactUs from "../../common/components/contact_us";
import Failed from "./failed";
import Complete from "./complete";
import toast from "../../common/ui/Toast";
import Api from "../../utils/api";
import { getUserKycFromSummary } from "../../kyc/common/api";
import { storageService } from "../../utils/validators";
import { isEmpty } from "lodash";
import { isDigilockerFlow } from "../../kyc/common/functions";
import { getBasePath, isTradingEnabled, navigate as navigateFunc } from "../../utils/functions";
import kycComplete from 'assets/kyc_complete.svg';
import { openModule } from "../../utils/native_callback";

class DigiStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      params: getUrlParams(),
      skelton: true,
    };

    this.navigate = navigateFunc.bind(this.props);
  }

  componentDidMount = () => {
    this.initialize();
  };
  
  initialize = async () => {
    await getUserKycFromSummary();
    const kyc = storageService().getObject("kyc");
    const user = storageService().getObject("user");
    let dl_flow = false;
    let show_note = false;
    if (!isEmpty(kyc) && !isEmpty(user)) {
      if (isDigilockerFlow(kyc)) {
        dl_flow = true;
      }

      if (
        user.pin_status !== "pin_setup_complete" &&
        kyc.kyc_product_type === 'equity'
      ) {
        this.setState({ set2faPin: true })
      }

      if (
        user.kyc_registration_v2 === "submitted" &&
        // kyc.sign_status === "signed" &&
        kyc.bank.meta_data_status !== "approved"
      ) {
        show_note = true;
      }
    }

    this.setState({ skelton: false, dl_flow, show_note, kyc });
  };

  navigate = (pathname, data = {}) => {
    this.props.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
    });
  };

  handleClick = () => {
    const {dl_flow, show_note} = this.state;
    if (dl_flow && !show_note) {
      this.sendEvents('next');
    } else {
      this.sendEvents('home');
    }
    if (this.state.set2faPin) {
      // Handles behaviour for both web as well as native
      openModule('account/setup_2fa', this.props, { routeUrlParams: '/kyc-complete' });
    }
    this.redirectToHome();
  };

  redirectToHome = () => {
    const config = getConfig();
    if (config.isNative) {
      nativeCallback({ action: 'exit_web' });
    } else {
      this.navigate("/invest");
    }
  }

  navigateToReports = () => {
    this.sendEvents("view_KYC_application");
    this.navigate("/kyc/report");
  };

  retry = async () => {
    this.sendEvents("retry", "esign_failed");
    let { kyc, dl_flow } = this.state;
    if (
      kyc.application_status_v2 !== "init" &&
      kyc.application_status_v2 !== "submitted" &&
      kyc.application_status_v2 !== "complete"
    ) {
      if (dl_flow) {
        this.navigate("/kyc/journey", {
          eventObjsearchParams: `${getConfig().searchParams}&show_aadhaar=true`,
        });
      } else {
        this.navigate("/kyc/journey");
      }
      return;
    }
    const redirectUrl = encodeURIComponent(
      getBasePath() + "/kyc-esign/nsdl" + getConfig().searchParams
    );

    this.setState({ show_loader: "button" });

    try {
      let res = await Api.get(
        `/api/kyc/formfiller2/kraformfiller/upload_n_esignlink?kyc_platform=app&redirect_url=${redirectUrl}`
      );
      let resultData = res.pfwresponse.result;
      if (resultData && !resultData.error) {
        if (getConfig().app === "ios") {
          nativeCallback({
            action: "show_top_bar",
            message: {
              title: "eSign KYC",
            },
          });
        }
        nativeCallback({
          action: "take_back_button_control",
          message: {
            back_text: "You are almost there, do you really want to go back?",
          },
        });
        window.location.href = resultData.esign_link;
      } else {
        if (
          resultData &&
          resultData.error === "all documents are not submitted"
        ) {
          toast("Document pending, redirecting to kyc");
          setTimeout(() => {
            if (dl_flow) {
              this.navigate("/kyc/journey", {
                state: {
                  show_aadhaar: true,
                },
              });
            } else {
              this.navigate("/kyc/journey");
            }
          }, 3000);
        } else {
          toast(
            resultData.error || resultData.message || "Something went wrong",
            "error"
          );
        }
      }

      this.setState({ show_loader: false });
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast("Something went wrong");
    }
  };

  sendEvents = (userAction, screenName) => {
    let kyc = this.state.kyc;
      let eventObj = {
        event_name: isTradingEnabled(kyc) ? "trading_onboarding" : "kyc_registration",
        properties: {
          user_action: userAction || "",
          screen_name: screenName || "kyc_complete",
          rti: "",
          initial_kyc_status: kyc?.initial_kyc_status || "",
          flow: this.state.dl_flow ? "digi kyc" : "general",
        },
      };
      if (userAction === "just_set_events") {
        return eventObj;
      } else {
        nativeCallback({ events: eventObj });
      }
    }

  render() {
    const { show_loader, skelton, dl_flow, show_note, kyc, set2faPin, productName } = this.state;
    const { status = "failed" } = this.state.params;
    const headerData = {
      icon: "close",
      goBack: this.redirectToHome,
    };

    return (
      <Container
        data-aid='esign-nsdl-screen'
        showLoader={show_loader}
        events={this.sendEvents("just_set_events")}
        title={status === "success" ? "" : "Complete eSign"}
        handleClick={status === "success" ? this.handleClick : this.retry}
        buttonTitle={status === "success" ? set2faPin ? "CONTINUE" : dl_flow && !show_note ? "START INVESTING" : "HOME" : "RETRY E-SIGN"}
        headerData={headerData}
        skelton={skelton}
        hidePageTitle={status === "success" ? true : false}
        iframeRightContent={status === "success" ? kycComplete : require(`assets/${productName}/esign_kyc_fail.svg`)}
      >
        {status === "success" ? (
          <Complete
            navigateToReports={this.navigateToReports}
            dl_flow={dl_flow}
            show_note={show_note}
            kyc={kyc}
          />
        ) : (
          <Fragment>
            <Failed />
            <ContactUs />
          </Fragment>
        )}
      </Container>
    );
  }
}

export default DigiStatus;
