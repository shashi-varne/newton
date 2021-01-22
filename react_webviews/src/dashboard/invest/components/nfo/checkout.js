import React, { Component } from "react";
import Container from "fund_details/common/Container";
import { storageService } from "utils/validators";
import { initialize } from "../../functions";
import Input from "common/ui/Input";
import { formatAmountInr } from "utils/validators";
import { getConfig } from "utils/functions";
import toast from "common/ui/Toast";
import { nfoData } from "../../constants";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      screenName: "nfo_checkout",
      ctc_title: "INVEST",
      form_data: [],
      investType: "onetime",
      partner: getConfig().partner,
      disableInput: [],
      fundsData: [],
    };
    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let { state } = this.props.location || {};
    let type = "";
    if (state && state.type) {
      type = state.type;
      this.setState({ type: state.type });
    } else {
      this.props.history.goBack();
      return;
    }
    let fundsData = [];
    let { form_data } = this.state;
    if (type === "nfo") {
      let fund = storageService().getObject("nfo_detail_fund");
      if (fund) {
        fundsData.push(fund);
        fundsData.forEach(() => form_data.push({}));
        this.setState({ fundsData: fundsData, form_data: form_data }, () =>
          this.getNfoPurchaseLimit({
            investType: this.state.investType,
            isins: fund.isin,
          })
        );
      } else {
        this.props.history.goBack();
        return;
      }
    }
    if (type === "diy") {
      let schemeType = storageService().getObject("diystore_category") || "";
      let categoryName =
        storageService().getObject("diystore_subCategoryScreen") || "";
      fundsData =
        storageService().getObject("diystore_cart") == false
          ? [storageService().getObject("diystore_fundInfo")]
          : storageService().getObject("diystore_cart");
      fundsData.forEach(() => form_data.push({}));
      let fundsArray = storageService().getObject("diystore_fundsList");
      let isinArr = fundsData.map((data) => {
        return data.isin;
      });
      let isins = isinArr.join(",");
      this.setState(
        {
          fundsData: fundsData,
          categoryName: categoryName,
          schemeType: schemeType,
          fundsArray: fundsArray,
          form_data: form_data,
        },
        () =>
          this.getDiyPurchaseLimit({
            investType: this.state.investType,
            isins: isins,
          })
      );
    }
  };

  handleClick = () => {
    let { fundsData, type } = this.state;
    if (fundsData.length === 0) {
      this.props.history.goBack();
      return;
    }
    let submit = true;
    fundsData.forEach((data) => {
      if (!data.amount) {
        submit = false;
      }
    });
    if (submit) {
      this.proceedInvestment();
    } else {
      if (type === "nfo") toast("Please enter valid amount");
      else toast("Please fill in all the amount field(s).");
    }
  };

  handleChange = (name, index = 0) => async (event) => {
    let value = event.target ? event.target.value : event;
    let id = (event.target && event.target.id) || "";
    let { form_data, ctc_title, fundsData, investType, type } = this.state;
    if (id === "sip" || id === "onetime") {
      if (id === investType) return;
      investType = id;
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
      if (type === "nfo")
        await this.getNfoPurchaseLimit({
          investType: id,
          isins: fundsData[index].isin,
        });
      fundsData.forEach((fund, index) => {
        if (fund.amount) {
          this.checkLimit(fundsData[index].amount, index);
        }
      });
    } else if (name) {
      if (!isNaN(parseInt(value, 10))) {
        fundsData[index].amount = parseInt(value, 10);
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
      loadingText,
      type,
      partner,
    } = this.state;
    if (fundsData && fundsData.length === 0) ctc_title = "BACK";
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
            {nfoData.checkoutInvestType.map((data, index) => {
              if (type !== "nfo" && partner.code === "bfdlmobile")
                data.selected_icon = "bfdl_selected.png";
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
            {fundsData &&
              fundsData.map((fund, index) => {
                return (
                  <div className="item card" key={index}>
                    <div className="icon">
                      <img alt={fund.friendly_name} src={fund.amc_logo_small} />
                    </div>
                    <div className="text">
                      <h4>
                        {fund.friendly_name}
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
                        value={fund.amount || ""}
                        error={form_data[index].amount_error ? true : false}
                        helperText={
                          form_data[index].amount_error ||
                          formatAmountInr(fund.amount)
                        }
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
