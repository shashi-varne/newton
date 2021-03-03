import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import { initData } from "../../services";
import {
  navigate as navigateFunc,
  dateOrdinalSuffix,
} from "../../common/functions";
import { getConfig } from "utils/functions";
import Slider from "common/ui/Slider";

const PausePeriod = (props) => {
  const productName = getConfig().productName;
  const sliderValues = {
    min: 1,
    max: 6,
    value: 2,
  };
  const sip = storageService().getObject(storageConstants.PAUSE_SIP) || {};
  if (isEmpty(sip)) props.history.goBack();
  const navigate = navigateFunc.bind(props);
  const [period, setPeriod] = useState(sliderValues.value);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    initData();
  };

  const handleClick = () => () => {
    navigate(`${getPathname.pauseCancelDetail}pause/${period}`);
  };

  const handleChange = () => (value) => setPeriod(value);

  return (
    <Container
      title="Select a Period"
      headerTitle="Select a Period"
      buttonTitle="CONTINUE"
      handleClick={handleClick()}
      classOverRideContainer="reports-sip-pause-period-main"
      classOverRide="reports-sip-pause-period-container"
    >
      {!isEmpty(sip) && (
        <div className="reports-sip-pause-period">
          <div>
            <div className="mf-name">{sip.mfname}</div>
            <div className="content">
              <img
                src={require(`assets/${productName}/sip_date_icon.svg`)}
                alt=""
              />
              <div>
                <div className="title">SIP date</div>
                <div>
                  {sip.next_trans ? sip.next_trans.split(" ")[0] : ""}
                  <sup>
                    {dateOrdinalSuffix(
                      sip.next_trans ? Number(sip.next_trans.split(" ")[0]) : ""
                    )}
                  </sup>{" "}
                  of the month
                </div>
              </div>
            </div>
            <div className="content">
              <img
                src={require(`assets/${productName}/amount_icon.svg`)}
                alt=""
              />
              <div>
                <div className="title">Amount</div>
                <div>{formatAmountInr(sip.amount)}</div>
              </div>
            </div>
          </div>
          <div className="slider-container">
            <div className="head">
              Pause for: <b>{period} months </b>
            </div>
            <Slider
              value={period}
              min={sliderValues.min}
              max={sliderValues.max}
              onChange={handleChange()}
            />
            <div className="bottom">
              <div>{sliderValues.min} MONTH</div>
              <div>{sliderValues.max} MONTHS</div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PausePeriod;
