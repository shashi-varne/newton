import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getConfig, isMobile } from "utils/functions";
import { isEmpty, storageService } from "utils/validators";
import Container from "../../common/Container";
import { getbankInvestment } from "../common/api";

const PaymentOptions = (props) => {
  const state = props.location.state || {};
  const [show_skelton, setShowSkelton] = useState(true);
  let {
    pg_options,
    investment_type,
    // consent_bank,
    investment_amount,
    remark,
  } = state;

  let pg_link = "";
  if (!pg_options || isEmpty(pg_options)) props.history.goBack();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (pg_options.length === 1) {
      let mode = pg_options[0];
      redirectPayment(mode, false);
    }
  };

  const redirectPayment = async (mode, partner_check) => {
    setShowSkelton(true);
    if (mode.pg_type === "bank") {
      try {
        const result = await getbankInvestment({ url: mode.link });
        if (!result) {
          setShowSkelton(false);
          return;
        }
        let redirectData = {
          redirect_url: encodeURIComponent(
            `${window.location.origin}/sdk/page/callback${
              getConfig().searchParams
            }&is_secure=${storageService().get("is_secure")}`
          ),
          invest_id: result.post_args.ppt_id,
          remark: remark,
          account_number: result.post_args.account_number,
          amount: result.post_args.amount,
          data: {
            type: "bank",
            link: result.confirm_pay_url,
          },
        };
        // handle call back web make_bank_payment
      } catch (err) {
        console.log(err);
        toast(err);
      } finally {
        setShowSkelton(false);
      }
    } else {
      let redirectData = {
        show_toolbar: false,
        icon: "back",
        dialog: {
          message: "Are you sure you want to exit?",
          action: [
            {
              action_name: "positive",
              action_text: "Yes",
              action_type: "redirect",
              redirect_url: encodeURIComponent(
                `${
                  window.location.origin
                }/page/callback/${investment_type}/${investment_amount}${
                  getConfig().searchParams
                }&is_secure=${storageService().get("is_secure")}`
              ),
            },
            {
              action_name: "negative",
              action_text: "No",
              action_type: "cancel",
              redirect_url: "",
            },
          ],
        },
        data: {
          type: "server",
        },
      };

      if (isMobile.iOS) {
        if (!partner_check) {
          redirectData.show_toolbar = true;
        } else if (getConfig().partner.code !== "alb") {
          redirectData.show_toolbar = true;
        }
      }
      // handle call back web third_party_redirect
      pg_link = mode.link;
      if (mode.pg_type === "otp") {
        if (storageService().get("sdk_capabilities")) {
          window.location.href = pg_link +=
            // eslint-disable-next-line
            (pg_link.match(/[\?]/g) ? "&" : "?") +
            "plutus_redirect_url=" +
            encodeURIComponent(
              `${
                window.location.origin
              }/page/callback/${investment_type}/${investment_amount}${
                getConfig().searchParams
              }&is_secure=${storageService().get("is_secure")}`
            ) +
            "&sdk_capabilities=" +
            storageService().get("sdk_capabilities");
        } else {
          window.location.href = pg_link +=
            // eslint-disable-next-line
            (pg_link.match(/[\?]/g) ? "&" : "?") +
            "plutus_redirect_url=" +
            encodeURIComponent(
              `${
                window.location.origin
              }/page/callback/${investment_type}/${investment_amount}${
                getConfig().searchParams
              }&is_secure=${storageService().get("is_secure")}`
            );
        }
      } else {
        if (storageService().get("sdk_capabilities")) {
          window.location.href = pg_link +=
            // eslint-disable-next-line
            (pg_link.match(/[\?]/g) ? "&" : "?") +
            "redirect_url=" +
            encodeURIComponent(
              `${
                window.location.origin
              }/page/callback/${investment_type}/${investment_amount}${
                getConfig().searchParams
              }&is_secure=${storageService().get("is_secure")}`
            ) +
            "&sdk_capabilities=" +
            storageService().get("sdk_capabilities");
        } else {
          window.location.href = pg_link +=
            // eslint-disable-next-line
            (pg_link.match(/[\?]/g) ? "&" : "?") +
            "redirect_url=" +
            encodeURIComponent(
              `${
                window.location.origin
              }/page/callback/${investment_type}/${investment_amount}${
                getConfig().searchParams
              }&is_secure=${storageService().get("is_secure")}`
            );
        }
      }
      setShowSkelton(false);
    }
  };

  return (
    <Container
      noFooter={true}
      showLoader={show_skelton}
      title="Select Payment Option"
    >
      <section className="invest-payment-options">
        {!show_skelton &&
          pg_options &&
          pg_options.map((option, index) => {
            return (
              <div
                key={index}
                className="option"
                onClick={() => redirectPayment(option, true)}
              >
                <div className="left">
                  <img src={option.banner} alt="" />
                  <div className="text">
                    <div>{option.title}</div>
                    {option.subtitle && (
                      <div className="helper">{option.subtitle}</div>
                    )}
                  </div>
                </div>
                {option.type !== "otp" && (
                  <img
                    src={require(`assets/recommended_tag_icon.svg`)}
                    alt=""
                    className="right"
                  />
                )}
              </div>
            );
          })}
        <div className="bottom">
          <img
            className="left"
            src={require(`assets/norton_secured_icon.png`)}
            alt=""
          />
          <img className="right" src={require(`assets/ssl_icon.png`)} alt="" />
        </div>
      </section>
    </Container>
  );
};

export default PaymentOptions;
