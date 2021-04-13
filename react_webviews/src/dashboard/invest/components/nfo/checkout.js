import React, { Component } from "react";
import Container from "../../../common/Container";
import { storageService } from "utils/validators";
import { initialize } from "../../functions";
import Input from "common/ui/Input";
import { formatAmountInr } from "utils/validators";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
import { nfoData } from "../../constants";
import TermsAndCond from "../../../mini-components/TermsAndCond";
import { CATEGORY, FUNDSLIST, SUBCATEGORY, CART } from "../../../diy/constants";
import PennyVerificationPending from "../mini_components/PennyVerificationPending";
import InvestError from "../mini_components/InvestError";
import InvestReferralDialog from "../mini_components/InvestReferralDialog";
import { convertInrAmountToNumber } from "../../common/commonFunction";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_checkout",
      ctc_title: "INVEST",
      form_data: [],
      investType: props.type === "diy" ? "sip" : "onetime",
      partner_code: getConfig().partner_code,
      disableInput: [],
      fundsData: [],
      renderData: nfoData.checkoutInvestType,
      type: props.type,
      currentUser: storageService().getObject("user") || {},
      dialogStates: {},
      purchaseLimitData: {},
      productType : getConfig().productName
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let fundsData = [];
    let {
      form_data,
      renderData,
      partner_code,
      ctc_title,
      type,
      investType,
    } = this.state;
    ctc_title = this.getButtonText(investType);
    if (type === "nfo") {
      let fund = storageService().getObject("nfo_detail_fund");
      if (fund) {
        fundsData.push(fund);
        fundsData.forEach(() => form_data.push({}));
        this.setState(
          { fundsData: fundsData, form_data: form_data, ctc_title },
          () => this.getPurchaseLimit(fund.isin)
        );
      } else {
        this.props.history.goBack();
        return;
      }
    } else if (type === "diy") {
      let schemeType = storageService().get(CATEGORY) || "";
      let categoryName = storageService().get(SUBCATEGORY) || "";
      const fundInfo = storageService().getObject("diystore_fundInfo")
        ? [storageService().getObject("diystore_fundInfo")]
        : false;
      fundsData = !storageService().getObject(CART)
        ? fundInfo
        : storageService().getObject(CART);

      if (!fundsData || fundsData?.length < 1) {
        return;
      }
      fundsData.forEach(() => form_data.push({}));
      let fundsArray = storageService().getObject(FUNDSLIST);
      let isins = this.getIsins(fundsData);
      if (partner_code === "bfdlmobile") {
        renderData = renderData.map((data) => {
          return { ...data, selected_icon: "bfdl_selected.png" };
        });
      }
      this.setState(
        {
          fundsData: fundsData,
          categoryName: categoryName,
          schemeType: schemeType,
          fundsArray: fundsArray,
          form_data: form_data,
          renderData: renderData,
          ctc_title: ctc_title,
        },
        () => this.getPurchaseLimit(isins)
      );
    }
  };

  getPurchaseLimit = async (isins) => {
    if (this.props.type === "diy") {
      await this.getDiyPurchaseLimit({
        investType: "sip",
        isins: isins,
      });
      await this.getDiyPurchaseLimit({
        investType: "onetime",
        isins: isins,
      });
    } else {
      await this.getNfoPurchaseLimit({
        investType: "sip",
        isins: isins,
      });
      await this.getNfoPurchaseLimit({
        investType: "onetime",
        isins: isins,
      });
    }
  };

  getButtonText = (investType) => {
    let { type, currentUser, partner_code } = this.state;
    if (
      !currentUser.active_investment &&
      partner_code !== "bfdlmobile" &&
      type === "diy"
    ) {
      return "HOW IT WORKS?";
    }
    if (investType === "sip") {
      return "SELECT SIP DATE";
    }
    return "INVEST";
  };

  getIsins = (fundsData) => {
    let isinArr = fundsData.map((data) => {
      return data.isin;
    });
    return isinArr.join(",");
  };

  handleClick = () => {
    let { fundsData, type } = this.state;
    let allowedFunds = fundsData.filter((data) => data.allow_purchase);
    if (fundsData.length === 0 || allowedFunds.length === 0) {
      this.props.history.goBack();
      return;
    }
    let submit = true;
    let totalAmount = 0;
    allowedFunds.forEach((data) => {
      if (!data.amount) {
        submit = false;
      } else {
        totalAmount = totalAmount + data.amount;
      }
    });
    if (submit) {
      this.setState({ totalAmount: totalAmount, isApiRunning: true }, () =>
        this.proceedInvestment()
      );
    } else {
      if (type === "nfo") toast("Please enter valid amount");
      else toast("Please fill in all the amount field(s).");
    }
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

  handleChange = (name, index = 0) => async (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, ctc_title, fundsData, investType } = this.state;
    if (id === "sip" || id === "onetime") {
      if (id === investType) return;
      investType = id;
      ctc_title = this.getButtonText(investType);
      this.setState(
        {
          form_data: form_data,
          ctc_title: ctc_title,
          investType: investType,
        },
        () => {
          fundsData.forEach((fund, index) => {
            if (fund.amount) {
              this.checkLimit(fundsData[index].amount, index);
            }
          });
        }
      );
    } else if (name) {
      value = convertInrAmountToNumber(value);
      // eslint-disable-next-line
      if (!isNaN(parseInt(value))) {
        // eslint-disable-next-line
        fundsData[index].amount = parseInt(value);
        this.setState({ form_data: form_data, fundsData: fundsData });
        this.checkLimit(fundsData[index].amount, index);
      } else {
        fundsData[index].amount = "";
        form_data[`${name}_error`] = "This is required";
        this.setState({ form_data: form_data, fundsData: fundsData });
      }
    }
  };

  render() {
    let {
      form_data,
      investType,
      ctc_title,
      fundsData,
      disableInputSummary,
      isApiRunning,
      type,
      renderData,
      dialogStates,
    } = this.state;
    let allowedFunds = fundsData.filter((data) => data.allow_purchase) || [];
    if (allowedFunds && allowedFunds.length === 0) ctc_title = "BACK";
    return (
      <Container
        skelton={this.state.show_loader}
        buttonTitle={ctc_title}
        handleClick={this.handleClick}
        disable={disableInputSummary}
        title={"Your Mutual Fund Plan"}
        //hidePageTitle={type !== "nfo"}
        showLoader={isApiRunning}
        iframeRightContent={require(`assets/${this.state.productType}/invest_fund.svg`)}
      >
        <div className="nfo-checkout">
          <div
            className="checkout-invest-type"
            style={{
              marginTop: type === "nfo" && "0",
            }}
          >
            {renderData.map((data, index) => {
              return (
                <div
                  key={index}
                  id={data.value}
                  onClick={this.handleChange()}
                  className={
                    investType === data.value ? "selected item" : "item"
                  }
                >
                  {investType === data.value && (
                    <img alt="" src={require(`assets/${data.icon}`)} />
                  )}
                  {investType !== data.value && (
                    <img
                      id={data.value}
                      alt=""
                      src={require(`assets/${data.icon_light}`)}
                    />
                  )}
                  <h3 id={data.value}>{data.name}</h3>
                  {investType === data.value && (
                    <img
                      className="icon"
                      alt=""
                      src={require(`assets/${data.selected_icon}`)}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="cart-items">
            {fundsData && fundsData.length === 0 && (
              <p className="message">
                Please add atleast one fund to make an investment.
              </p>
            )}
            {fundsData &&
              fundsData.map((fund, index) => {
                return (
                  <div className="item card" key={index}>
                    <div className="icon">
                      <img alt={fund.friendly_name} src={fund.amc_logo_small} />
                    </div>
                    <div className="text">
                      <h4>
                        {fund.friendly_name || fund.legal_name}
                        {type === "diy" && (
                          <span>
                            <img
                              onClick={() => this.deleteFund(fund, index)}
                              className="icon"
                              alt=""
                              src={require(`assets/delete_new.png`)}
                            />
                          </span>
                        )}
                      </h4>
                      <small>Enter amount</small>
                      <Input
                        type="text"
                        name="amount"
                        id="amount"
                        class="input"
                        value={fund.amount ? formatAmountInr(fund.amount) : ""}
                        error={form_data[index].amount_error ? true : false}
                        helperText={form_data[index].amount_error}
                        onChange={this.handleChange("amount", index)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                    {!fund.allow_purchase && (
                      <div className="disabled">
                        <div className="text">This fund is not supported</div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <TermsAndCond />
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
          <InvestReferralDialog
            isOpen={dialogStates.openInvestReferral}
            proceedInvestment={this.proceedInvestment}
            close={() => this.handleDialogStates("openInvestReferral", false)}
          />
        </div>
      </Container>
    );
  }
}

export default Checkout;
