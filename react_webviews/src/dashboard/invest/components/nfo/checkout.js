import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { storageService } from "utils/validators";
import { initialize } from "../../functions";
import Input from "common/ui/Input";
import { formatAmountInr } from "utils/validators";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_checkout",
      ctc_title: "INVEST",
      form_data: {},
      investType: "onetime",
      partner: getConfig().partner,
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let fund = storageService().getObject("nfo_detail_fund");
    if (fund) {
      this.setState({ fund: fund });
    } else {
      this.props.history.goBack();
      return;
    }
    this.getNfoPurchaseLimit({
      investType: this.state.investType,
      isins: fund.isin,
    });
  };

  handleClick = () => {
    let { fund } = this.state;
    if (!fund.amount) {
      toast("Please enter valid amount");
    } else {
      this.proceedInvestment();
    }
  };

  handleChange = (name) => async (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, ctc_title, fund, investType } = this.state;
    if (id === "sip" || id === "onetime") {
      investType = id;
      form_data.investType_error = "";
      await this.getNfoPurchaseLimit({ investType: id, isins: fund.isin });
      if (fund.amount) this.checkLimit(fund.amount);
      if (id === "sip") {
        ctc_title = "SELECT SIP DATE";
      } else {
        ctc_title = "INVEST";
      }
      this.setState({
        form_data: form_data,
        ctc_title: ctc_title,
        investType: investType,
      });
    } else if (name) {
      if (!value) {
        fund.amount = "";
        form_data[`${name}_error`] = "This is required";
        this.setState({ form_data: form_data, fund: fund });
      } else {
        fund.amount = value;
        this.setState({ form_data: form_data, fund: fund });
        this.checkLimit(value);
      }
    }
  };

  render() {
    let {
      form_data,
      investType,
      ctc_title,
      fund,
      showFundnotSupported,
      disableInputSummary,
      loadingText,
    } = this.state;
    return (
      <Container
        showLoader={this.state.show_loader}
        buttonTitle={ctc_title}
        handleClick={this.handleClick}
        disable={disableInputSummary}
        hideInPageTitle
        loaderData={{
          loadingText,
        }}
      >
        <div className="nfo-checkout">
          <div className="checkout-invest-type">
            <div
              id="sip"
              onClick={this.handleChange()}
              className={investType === "sip" ? "selected item" : "item"}
            >
              {investType === "sip" && (
                <img alt="" src={require(`assets/sip_icn.png`)} />
              )}
              {investType !== "sip" && (
                <img
                  id="sip"
                  alt=""
                  src={require(`assets/sip_icn_light.png`)}
                />
              )}
              <h3 id="sip">SIP / Monthly</h3>
              {investType === "sip" && (
                <img
                  className="icon"
                  alt=""
                  src={require(`assets/selected.png`)}
                />
              )}
            </div>
            <div
              id="onetime"
              onClick={this.handleChange()}
              className={investType === "onetime" ? "selected item" : "item"}
            >
              {investType === "onetime" && (
                <img alt="" src={require(`assets/one_time_icn.png`)} />
              )}
              {investType !== "onetime" && (
                <img
                  id="onetime"
                  alt=""
                  src={require(`assets/one_time_icn_light.png`)}
                />
              )}
              <h3 id="onetime">One Time</h3>
              {investType === "onetime" && (
                <img
                  className="icon"
                  alt=""
                  src={require(`assets/selected.png`)}
                />
              )}
            </div>
          </div>
          <div className="cart-items">
            {fund && (
              <div className="item card">
                <div className="icon">
                  <img alt={fund.friendly_name} src={fund.amc_logo_small} />
                </div>
                <div className="text">
                  <h4>{fund.friendly_name}</h4>
                  <small>Enter amount</small>
                  <Input
                    type="number"
                    name="amount"
                    id="amount"
                    class="input"
                    value={fund.amount || ""}
                    error={form_data.amount_error ? true : false}
                    helperText={
                      form_data.amount_error || formatAmountInr(fund.amount)
                    }
                    onChange={this.handleChange("amount")}
                  />
                </div>
                {showFundnotSupported && (
                  <div className="disabled">
                    <div className="text">This fund is not supported</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="nfo-disclaimer">
            {getConfig().Web && getConfig().productName !== "finity" && (
              <div className="text">
                <img src={require(`assets/check_mark.png`)} alt="" /> By
                clicking on the button below, I agree that I have read and
                accepted the
                <a
                  href="https://www.fisdom.com/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  terms & conditions
                </a>{" "}
                and understood the{" "}
                <a
                  href="https://www.fisdom.com/scheme-offer-documents/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  scheme offer documents
                </a>
              </div>
            )}
            {getConfig().Web && getConfig().productName === "finity" && (
              <div className="text">
                <img src={require(`assets/check_mark.png`)} alt="" /> By
                clicking on the button below, I agree that I have read and
                accepted the <span>terms</span> and understood the <br />
                <span> scheme offer documents</span>
              </div>
            )}
            {!getConfig().Web && getConfig().productName === "finity" && (
              <div className="text">
                <img src={require(`assets/check_mark.png`)} alt="" /> By
                clicking on the button below, I agree that I have read and
                accepted the <span>terms.</span>
              </div>
            )}
            {!getConfig().Web && getConfig().productName !== "finity" && (
              <div className="text">
                <img src={require(`assets/check_mark.png`)} alt="" /> By
                clicking on the button below, I agree that I have read and
                accepted the <a>terms & conditions</a> and understood the{" "}
                <a>scheme offer documents</a>
              </div>
            )}
          </div>
        </div>
      </Container>
    );
  }
}

export default Checkout;
