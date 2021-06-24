import React, { Component } from "react";
import Container from "../common/Container";
import { navigate as navigateFunc } from "utils/functions";
import DropdownInModal from "common/ui/DropdownInModal";
import { getConfig } from "utils/functions";
import {
  dateOrdinal,
  storageService,
  formatAmountInr,
  isEmpty,
} from "utils/validators";
import SuccessDialog from "../Invest/mini-components/SuccessDialog";
import InvestError from "../Invest/mini-components/InvestError";
import PennyVerificationPending from "../Invest/mini-components/PennyVerificationPending";
import { getBasePath, isIframe } from "../../utils/functions";
import {
  handleIframeInvest,
  proceedInvestment,
} from "../proceedInvestmentFunctions";
import "./SipDates.scss";
import { nativeCallback } from "../../utils/native_callback";
import { flowName } from "../Invest/constants";

const partnerCode = getConfig().partner_code;
/* eslint-disable */
class SipDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "sip_dates",
      dialogStates: {},
      isSipDatesScreen: true,
    };
    this.navigate = navigateFunc.bind(this.props);
    this.proceedInvestment = proceedInvestment.bind(this);
  }

  componentDidMount() {
    this.onload();
  }

  onload = () => {
    let sipBaseData = storageService().getObject("investmentObjSipDates") || {};
    if (
      isEmpty(sipBaseData) ||
      isEmpty(sipBaseData.investment) ||
      sipBaseData.investment?.allocations?.length === 0
    ) {
      this.navigate("/");
      return;
    }

    let orderType = sipBaseData.investment.type;
    let sipOrOnetime = "sip";

    let finalPurchases = [];
    let newPurchases = sipBaseData.investment.allocations;
    for (let dict of newPurchases) {
      let data = {};
      data.id = dict.id || "";
      data.amount = dict.amount;
      data.sip_date = dict.default_date;
      data.fundName = dict.mfname;
      data.sip_dates = dict.sip_dates;
      finalPurchases.push(data);
    }

    let form_data = [];
    finalPurchases.forEach((data) => {
      form_data.push(data.sip_dates.indexOf(data.sip_date));
    });

    let buttonTitle =
      finalPurchases.length === 1 ? "CONFIRM DATE" : "CONFIRM DATES";

    const paymentRedirectUrl = encodeURIComponent(
      `${getBasePath()}/page/callback/sip/${sipBaseData.investment.amount}${
        getConfig().searchParams
      }`
    );

    this.setState({
      form_data: form_data,
      sips: finalPurchases,
      orderType: orderType,
      sipOrOnetime: sipOrOnetime,
      buttonTitle: buttonTitle,
      sipBaseData: sipBaseData,
      paymentRedirectUrl: paymentRedirectUrl,
      props: this.props,
    });
  };

  handleClick = () => {
    this.sendEvents('next')
    let {
      sipBaseData,
      sips,
      userKyc,
      isSipDatesScreen,
      paymentRedirectUrl,
    } = this.state;
    sips.forEach((sip, index) => {
      sipBaseData.investment.allocations[index].sip_date = sip.sip_date;
    });

    window.localStorage.setItem("investment", JSON.stringify(sipBaseData));

    this.proceedInvestment({
      userKyc: userKyc,
      sipOrOnetime: "sip",
      body: sipBaseData,
      paymentRedirectUrl: paymentRedirectUrl,
      isSipDatesScreen: isSipDatesScreen,
      history: this.props.history,
      handleApiRunning: this.handleApiRunning,
      handleDialogStates: this.handleDialogStates,
    });
  };

  handleSuccessDialog = () => {
    this.sendEvents('next', "sip_dates_popup", {intent: "date confirmation"})
    let { investResponse, paymentRedirectUrl } = this.state;
    let pgLink = investResponse.investments[0].pg_link;
    pgLink = `${pgLink}${pgLink.match(/[\?]/g) ? "&" : "?"}redirect_url=${paymentRedirectUrl}${partnerCode ? "&partner_code="+partnerCode : ""}`
    if (getConfig().Web) {
      if (isIframe()) {
        handleIframeInvest(
          pgLink,
          investResponse,
          this.props.history,
          this.handleApiRunning
        );
      } else {
        window.location.href = pgLink;
      }
    } else {
      if (investResponse.rta_enabled) {
        this.navigate("/payment/options", {
          state: {
            pg_options: investResponse.pg_options,
            consent_bank: investResponse.consent_bank,
            investment_type: investResponse.investments[0].order_type,
            remark: investResponse.investments[0].remark_investment,
            investment_amount: investResponse.investments[0].amount,
            redirect_url: paymentRedirectUrl,
          },
        });
      } else {
        this.navigate("/kyc/journey");
      }
    }
    this.setState({
      openSuccessDialog: false,
    });
  };

  handleChange = (key) => (index) => {
    this.sendEvents('next', 'sip_dates_popup', {intent: "date confirmation"})
    let { form_data, sips } = this.state;
    form_data[key] = index;
    sips[key].sip_date = sips[key].sip_dates[index];
    this.setState({
      form_data: form_data,
      sips: sips,
    });
  };

  handleDialogStates = (key, value, errorMessage) => {
    let dialog_states = { ...this.state.dialogStates };
    dialog_states[key] = value;
    if (errorMessage) dialog_states["errorMessage"] = errorMessage;
    this.setState({ dialogStates: dialog_states });
  };

  handleApiRunning = (isApiRunning) => {
    this.setState({ isApiRunning: isApiRunning });
  };

  sendEvents = (userAction, screenName, additionalData) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "screen_name": screenName || 'investment date',
        "user_action": userAction || "",
        "flow": (this.state.orderType === "savetaxsip" ? flowName['saveTax'] : this.state.orderType) || "",
        ...additionalData
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  render() {
    let {
      sips,
      form_data,
      buttonTitle,
      openSuccessDialog,
      isApiRunning,
      dialogStates,
    } = this.state;

    return (
      <Container
        events={this.sendEvents("just_set_events")}
        data-aid='select-investment-date-screen'
        skelton={this.state.show_loader}
        handleClick={this.handleClick}
        buttonTitle={buttonTitle}
        title="Select investment date"
        showLoader={isApiRunning}
        loaderData={{
          loadingText:"Your payment is being processed. Please do not close this window or click the back button on your browser."
        }}
      >
        <div className="sip-dates" data-aid='select-investment-date'>
          {sips &&
            sips.map((sip, index) => {
              let options = [];
              sip.sip_dates.forEach((date) => {
                options.push({ name: dateOrdinal(date) });
              });
              return (
                <div className="card content" key={index} data-aid='card-content'>
                  <div className="text" data-aid='text'>
                    <div className="title">{sip.fundName}</div>
                    <div className="subtitle">
                      {formatAmountInr(sip.amount)}
                    </div>
                  </div>
                  <div className="mid-content" data-aid='mid-content'>Investment date</div>
                  <DropdownInModal
                    options={options}
                    header_title="Available dates"
                    cta_title="SELECT DATE"
                    selectedIndex={form_data[index]}
                    value={dateOrdinal(sip.sip_date)}
                    id="date"
                    name="date"
                    onChange={this.handleChange(index)}
                    isAppendText="of every month"
                    class="appened-text"
                    isSelectedText="of every month"
                  />
                </div>
              );
            })}
          <SuccessDialog
            isOpen={openSuccessDialog}
            sips={sips}
            handleClick={this.handleSuccessDialog}
            close={() => this.setState({ openSuccessDialog: false })}
          />
          <PennyVerificationPending
            isOpen={dialogStates.openPennyVerificationPending}
            handleClick={() => this.navigate("/kyc/add-bank")}
          />
          <InvestError
            isOpen={dialogStates.openInvestError}
            errorMessage={dialogStates.errorMessage}
            handleClick={() => this.navigate("/invest")}
            close={() => this.handleDialogStates("openInvestError", false)}
          />
        </div>
      </Container>
    );
  }
}

export default SipDates;
