import React, { useState, useEffect, Fragment } from "react";
import Container from "../common/Container";
import {
  formatAmountInr,
  isEmpty,
  storageService,
  validateNumber,
} from "utils/validators";
import Button from "material-ui/Button";
import { getPathname, storageConstants } from "../constants";
import { initData } from "../services";
import {
  getFundDetailsForSwitch,
  postSwitchRecommendation,
} from "../common/api";
import { navigate as navigateFunc } from "../common/functions";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import toast from "common/ui/Toast";

const SwitchNow = (props) => {
  const params = props?.match?.params || {};
  if (isEmpty(params) || !params.amfi) props.history.goBack();
  const amfi = params.amfi || "";

  const navigate = navigateFunc.bind(props);
  const fundToSwitch = storageService().getObject(
    storageConstants.REPORTS_SWITCH_FUND_TO
  );
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [fundDetails, setFundDetails] = useState({});
  const [fundTo] = useState(fundToSwitch || {});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await initData();
    try {
      const data = await getFundDetailsForSwitch({
        amfi,
      });
      if (!data) {
        showSkelton(false);
        return;
      }
      setFundDetails(data.report);
    } catch (err) {
      console.log(err);
      toast(err);
    } finally {
      setShowSkelton(false);
    }
  };

  const fullSwitch = (index) => {
    if (isApiRunning) return;
    let fundInfo = { ...fundDetails };
    fundInfo.folio_wise_details[index].switchAmount =
      fundInfo.folio_wise_details[index].switchable_amount;
    setFundDetails({ ...fundInfo });
  };

  const handleClick = async () => {
    let dataToSend = [];
    for (let fund of fundDetails.folio_wise_details) {
      let obj = {
        from_mf: fundDetails.mf.isin,
        all_units: false,
        amount: "",
        to_mf: fundTo.isin,
        folio_number: "",
      };
      obj.folio_number = fund.folio;
      obj.amount = fund.switchAmount;
      if (!obj.amount) {
        toast("Please enter amount");
        return;
      }
      if (obj.amount === fund.switchable_amount) {
        obj.all_units = true;
      } else {
        obj.all_units = false;
      }
      dataToSend.push(obj);
    }

    try {
      setIsApiRunning(true);
      const result = await postSwitchRecommendation({
        switch_orders: dataToSend,
      });
      if (
        result &&
        result.resend_redeem_otp_link !== "" &&
        result.verification_link !== ""
      ) {
        navigate(getPathname.otpSwitch, {
          state: {
            resend_link: result.resend_redeem_otp_link,
            verify_link: result.verification_link,
            message: result.message,
          },
        });
      }
    } catch (err) {
      toast(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const handleAmount = (index) => (event) => {
    const value = event.target ? event.target.value : event;
    if (!validateNumber(value)) return;
    let fundInfo = { ...fundDetails };
    fundInfo.folio_wise_details[index].switchAmount = Number(value);
    setFundDetails({ ...fundInfo });
  };

  return (
    <Container
      headerTitle="Available Funds"
      hideInPageTitle={true}
      skelton={showSkelton}
      buttonTitle="SWITCH NOW"
      handleClick={handleClick}
      isApiRunning={isApiRunning}
      disable={isApiRunning || showSkelton}
    >
      <div className="reports-switch-now">
        {!showSkelton && !isEmpty(fundDetails) && (
          <>
            <header>
              <div className="content">
                <div className="name">{fundDetails.mf.friendly_name}</div>
                <div className="text">Switchable amount</div>
                <div className="amount">{fundDetails.switchable_amount}</div>
              </div>
              <img alt="" src={require(`assets/direction_icn.png`)} />
              <div className="content">
                <div className="name">{fundTo.mfname}</div>
                <div className="type">{fundTo.mftype}</div>
              </div>
            </header>
            <main>
              {fundDetails &&
                fundDetails.folio_wise_details &&
                fundDetails.folio_wise_details.map((folio, index) => {
                  return (
                    <Fragment key={index}>
                      {folio.switch_possible && (
                        <div className="reports-folio">
                          <div className="title">
                            <span className="text">Folio : </span>
                            <span>{folio.folio}</span>
                          </div>
                          <div className="flex">
                            <div className="content">
                              <div className="text">Switchable Amount</div>
                              <div className="sub-text">
                                {formatAmountInr(folio.switchable_amount)}
                              </div>
                            </div>
                            <div className="content">
                              <div className="text">Long Term Amount</div>
                              <div className="sub-text">{folio.current}</div>
                            </div>
                          </div>
                          <TextField
                            className="input"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    className="input-button"
                                    onClick={() => fullSwitch(index)}
                                  >
                                    Full Switch
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                            helperText={
                              formatAmountInr(folio.switchAmount) || ""
                            }
                            value={folio.switchAmount || ""}
                            onChange={handleAmount(index)}
                            disabled={isApiRunning}
                          />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
            </main>
          </>
        )}
      </div>
    </Container>
  );
};

export default SwitchNow;
