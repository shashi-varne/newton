import React, { Component } from "react";
import Container from "../../../common/Container";
import { initialize } from "../../functions";
import DropdownInModal from "common/ui/DropdownInModal";
import { getConfig } from "utils/functions";
import {
  dateOrdinal,
  storageService,
  formatAmountInr,
  isEmpty,
} from "utils/validators";
import SuccessDialog from "../mini_components/SuccessDialog";
import InvestError from "../mini_components/InvestError";
import PennyVerificationPending from "../mini_components/PennyVerificationPending";

class SipDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      screenName: "sip_dates",
      isSipDatesScreen: true,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
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

    this.setState({
      form_data: form_data,
      sips: finalPurchases,
      orderType: orderType,
      sipOrOnetime: sipOrOnetime,
      buttonTitle: buttonTitle,
      sipBaseData: sipBaseData,
      props: this.props,
    });
  };

  handleClick = () => {
    let { sipBaseData, sips, userKyc, isSipDatesScreen } = this.state;
    sips.forEach((sip, index) => {
      sipBaseData.investment.allocations[index].sip_date = sip.sip_date;
    });

    let paymentRedirectUrl = encodeURIComponent(
      `${window.location.origin}/page/callback/sip/${sipBaseData.investment.amount}`
    );

    window.localStorage.setItem("investment", JSON.stringify(sipBaseData));

    this.proceedInvestmentChild({
      userKyc: userKyc,
      sipOrOnetime: "sip",
      body: sipBaseData,
      paymentRedirectUrl: paymentRedirectUrl,
      isSipDatesScreen: isSipDatesScreen,
    });
  };

  handleClose = () => {
    let { investResponse, paymentRedirectUrl } = this.state;
    let pgLink = investResponse.investments[0].pg_link;
    pgLink +=
      // eslint-disable-next-line
      (pgLink.match(/[\?]/g) ? "&" : "?") +
      "redirect_url=" +
      paymentRedirectUrl;
    if (getConfig().Web) {
      // handleIframe
      window.location.href = pgLink;
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
    let { form_data, sips } = this.state;
    form_data[key] = index;
    sips[key].sip_date = sips[key].sip_dates[index];
    this.setState({
      form_data: form_data,
      sips: sips,
    });
  };

  render() {
    let {
      sips,
      form_data,
      buttonTitle,
      openSuccessDialog,
      openInvestError,
      errorMessage,
      openPennyVerificationPending,
      isApiRunning,
    } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        handleClick={this.handleClick}
        buttonTitle={buttonTitle}
        hideInPageTitle
        isApiRunning={isApiRunning}
      >
        <div className="sip-dates">
          <div className="main-top-title">Select investment date</div>
          {sips &&
            sips.map((sip, index) => {
              let options = [];
              sip.sip_dates.forEach((date) => {
                options.push({ name: dateOrdinal(date) });
              });
              return (
                <div className="card content" key={index}>
                  <div className="text">
                    <div className="title">{sip.fundName}</div>
                    <div className="subtitle">
                      {formatAmountInr(sip.amount)}
                    </div>
                  </div>
                  <div className="mid-content">Investment date</div>
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
            handleClick={() => this.handleClose()}
          />
          <PennyVerificationPending
            isOpen={openPennyVerificationPending}
            handleClick={() => this.navigate("/kyc/add-bank")}
          />
          <InvestError
            isOpen={openInvestError}
            errorMessage={errorMessage}
            handleClick={() => this.navigate("/invest")}
          />
        </div>
      </Container>
    );
  }
}

export default SipDates;
