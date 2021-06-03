import React, { useState } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty, storageService } from "utils/validators";
import { getPathname, storageConstants } from "../../constants";
import {
  dateOrdinalSuffix,
} from "../../common/functions";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import Slider from "common/ui/Slider";
import "./commonStyles.scss";

const sliderValues = {
  min: 1,
  max: 6,
  value: 2,
};
const productName = getConfig().productName;
const PausePeriod = (props) => {  
  const sip = storageService().getObject(storageConstants.PAUSE_SIP) || {};
  if (isEmpty(sip)) props.history.goBack();
  const navigate = navigateFunc.bind(props);
  const [period, setPeriod] = useState(sliderValues.value);

  const handleClick = () => () => {
    navigate(`${getPathname.pauseCancelDetail}pause/${period}`);
  };

  const handleChange = () => (value) => setPeriod(value);

  return (
    <Container
      data-aid='reports-select-a-period-screen'
      title="Select a Period"
      buttonTitle="CONTINUE"
      handleClick={handleClick()}
      classOverRideContainer="reports-sip-pause-period-main"
      classOverRide="reports-sip-pause-period-container"
    >
      {!isEmpty(sip) && (
        <div className="reports-sip-pause-period" data-aid='reports-sip-pause-period'>
          <div data-aid='reports-mf-name-screen'>
            <div className="mf-name">{sip.mfname}</div>
            <div className="content" data-aid='reports-spi-date'>
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
            <div className="content" data-aid='reports-sip-amount'>
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
          <div className="slider-container" data-aid='reports-slider-container'>
            <div className="head" data-aid='reports-head'>
              Pause for: <b>{period} months </b>
            </div>
            <Slider
              value={period}
              min={sliderValues.min}
              max={sliderValues.max}
              onChange={handleChange()}
            />
            <div className="bottom" data-aid='reports-bottom'>
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
