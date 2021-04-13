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
import { isEmpty } from "../../utils/validators";
import { getBasePath } from "../../utils/functions";

class DigiStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      params: getUrlParams(),
      skelton: true,
    };
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
      if (
        kyc.kyc_status !== "compliant" &&
        !kyc.address.meta_data.is_nri &&
        kyc.dl_docs_status !== "" &&
        kyc.dl_docs_status !== "init" &&
        kyc.dl_docs_status !== null
      ) {
        dl_flow = true;
      }

      if (
        user.kyc_registration_v2 === "submitted" &&
        kyc.sign_status === "signed" &&
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
    /**
     * Need to handle this
     */
    // nativeCallback({ action: 'exit_web' });
    this.navigate("/invest");
  };

  navigateToReports = () => {
    this.navigate("/kyc/report");
  };

  retry = async () => {
    let { kyc, dl_flow } = this.state;
    if (
      kyc.application_status_v2 !== "init" &&
      kyc.application_status_v2 !== "submitted" &&
      kyc.application_status_v2 !== "complete"
    ) {
      if (dl_flow) {
        this.navigate("/kyc/journey", {
          searchParams: `${getConfig().searchParams}&show_aadhaar=true`,
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
          action: "take_control",
          message: {
            back_text: "You are almost there, do you really want to go back?",
          },
        });
        window.location.href = resultData.esign_link;
      } else {
        if (resultData && resultData.error === "all documents are not submitted") {
          toast("Document pending, redirecting to kyc");
          setTimeout(() => {
            if (dl_flow) {
              this.navigate('/kyc/journey', {
                state: {
                  show_aadhaar: true,
                }
              });
            } else {
              this.navigate('/kyc/journey');
            }
          }, 3000)
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

  render() {
    let { show_loader, skelton, dl_flow, show_note } = this.state;
    const { status = "failed" } = this.state.params;
    const headerData = {
      icon: "close",
      goBack: this.handleClick,
    };

    return (
      <Container
        showLoader={show_loader}
        title={
          status === "success" ? "eSign KYC completed" : "eSign KYC failed"
        }
        handleClick={status === "success" ? this.handleClick : this.retry}
        buttonTitle={
          status === "success"
            ? dl_flow && !show_note
              ? "START INVESTING"
              : "OKAY"
            : "RETRY E-SIGN"
        }
        headerData={headerData}
        skelton={skelton}
      >
        {/* <div className="nsdl-status">
          <img
            src={require(`assets/${productName}/ils_esign_${status}.svg`)}
            style={{ width: "100%" }}
            alt="Nsdl Status"
          />
          {status === "success" ?
            <div className="nsdl-status-text">
              You have successfully signed your KYC documents.
            </div>
            :
            <div className="nsdl-status-text">
              Sorry! the eSign verification is failed. Please try again.
            </div>
          }
        </div> */}
        {status === "success" ? (
          <Complete
            navigateToReports={this.navigateToReports}
            dl_flow={dl_flow}
            show_note={show_note}
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
