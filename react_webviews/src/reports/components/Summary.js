import React, { useState } from "react";
import Container from "fund_details/common/Container";
import { formatAmountInr } from "../../utils/validators";
import { getConfig } from "../../utils/functions";
import Button from "@material-ui/core/Button";
import Slider from "common/ui/Slider";

const FundDetails = (props) => {
  const productName = getConfig().productName;
  const amount = -10;
  const [data, setData] = useState({
    amount: 500,
    time: 1,
  });

  const handleChange = (name) => (event) => {
    console.log(event);
    let value = event.target ? event.target.value : event;
    let Data = { ...data };
    Data[name] = value;
    Data[`${name}_error`] = "";
    setData(Data);
  };

  return (
    <Container
      title="My Money"
      hideInPageTitle={true}
      noFooter={true}
      showLoader=""
    >
      <div className="reports">
        <header>
          <div className="title">Current Value</div>
          <div className="amount">{formatAmountInr(0)}</div>
          {false && (
            <>
              <div className="title ">
                1 Day Change:{" "}
                <span className={amount >= 0 ? "green" : "red"}>
                  - {formatAmountInr(28273)} (-1.0%)
                </span>
              </div>
              <div className="row">
                <div className="content">
                  <div>Amount Invested</div>
                  <div>{formatAmountInr(562990)}</div>
                </div>
                <div className="content">
                  <div>Earnings</div>
                  <div className={amount >= 0 && "green"}>
                    {formatAmountInr(562990)}
                  </div>
                </div>
              </div>
              <div className="title">Redeemed Value</div>
              <div className="amount">{formatAmountInr(0)}</div>
              <div className="row">
                <div className="content">
                  <div>Purchase Cost</div>
                  <div>{formatAmountInr(562990)}</div>
                </div>
                <div className="content">
                  <div>Earnings</div>
                  <div className={amount > 0 && "green"}>
                    {formatAmountInr(562990)}
                  </div>
                </div>
              </div>
              <div className="pointer">View current investments</div>
            </>
          )}
        </header>
        <main>
          {false && (
            <>
              {" "}
              <div className="content">
                <img alt="" src={require(`assets/nps_report_icon.png`)} />
                <div className="text">
                  <div className="title">NPS Investments</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/goalwise.png`)} />
                <div className="text">
                  <div className="title">Track my goals</div>
                  <div>View Goal Wise Investments</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/pending_purchase.png`)} />
                <div className="text">
                  <div className="title">Pending Purchase</div>
                  <div>{formatAmountInr(12345)}</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/pending_redemption.png`)} />
                <div className="text">
                  <div className="title">Pending Withdrawals</div>
                  <div>{formatAmountInr(12345)}</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/pending_purchase.png`)} />
                <div className="text">
                  <div className="title">Pending Switch</div>
                  <div>{formatAmountInr(12345)}</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/sip.png`)} />
                <div className="text">
                  <div className="title">Existing SIPs</div>
                  <div>{formatAmountInr(12345)}</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/transactions.png`)} />
                <div className="text">
                  <div className="title">Transactions</div>
                </div>
              </div>
              <div className="content">
                <img alt="" src={require(`assets/fundwise.png`)} />
                <div className="text">
                  <div className="title">Track Fund Performance</div>
                  <div>View fund wise summary</div>
                </div>
              </div>
              <div className="content">
                <img
                  alt=""
                  src={require(`assets/${productName}/ic_pf_withdraw.svg`)}
                />
                <div className="text">
                  <div className="title">Withdraw</div>
                  <div>Withdraw your funds</div>
                </div>
              </div>
            </>
          )}
          <div className="invest-more">
            <div className="invest-more-content">
              <p>
                You have not invested in Mutual Funds!
                <br />
                <b>Invest today & grow your wealth</b>
              </p>
              <Button>Explore Mutual Funds</Button>
            </div>
            <img src={require(`assets/plant.svg`)} alt="" />
          </div>
          <div className="check-investment">
            <p>Check what would you have made with mutual funds?</p>
            <label>Mode :</label>
            <div className="invest-type">
              <div className="invest-type-button">
                <div className="text">Monthly(SIP)</div>
                <span className="hollow-dot">
                  <span className="dot"></span>
                </span>
              </div>
              <div className="invest-type-button">
                <div className="text">One-time</div>
                <span className="hollow-dot selected">
                  <span className="dot"></span>
                </span>
              </div>
            </div>
            <div className="invested-slider-container">
              <div className="invested-slider-head">
                Invested Amount :{" "}
                <span>{formatAmountInr(data.amount)} Monthly</span>
              </div>
              <div className="invested-slider">
                <Slider
                  default={data.amount}
                  min={500}
                  max={50000}
                  onChange={handleChange("amount")}
                />
              </div>
              <div className="invested-slider-range">
                <div className="invested-slider-left">500</div>
                <div className="invested-slider-ratio-text">
                  <span>Slide to change amount</span>
                </div>
                <div className="invested-slider-right">50K</div>
              </div>
            </div>

            <div className="invested-slider-container">
              <div className="invested-slider-head">
                For : <span>{data.time} Years</span>
              </div>
              <div className="invested-slider">
                <Slider
                  default={data.time}
                  min={1}
                  max={20}
                  onChange={handleChange("time")}
                />
              </div>
              <div className="invested-slider-range">
                <div className="invested-slider-left">1Y</div>
                <div className="invested-slider-ratio-text">
                  <span>Slide to change time</span>
                </div>
                <div className="invested-slider-right">20Y</div>
              </div>
            </div>
            <div className="report-result-tile">
              You could have made : {formatAmountInr(12345)}
            </div>
          </div>
          <div className="content">
            <img
              alt=""
              src={require(`assets/${productName}/ic_pf_withdraw.svg`)}
            />
            <div className="text">
              <div className="title">Withdraw</div>
              <div>Withdraw your funds</div>
            </div>
          </div>
          <div className="content">
            <img
              alt=""
              src={require(`assets/${productName}/ic_pf_insurance.svg`)}
            />
            <div className="text">
              <div className="title">Insurance</div>
            </div>
          </div>
          <div className="content">
            <img alt="" src={require(`assets/${productName}/ic_pf_gold.svg`)} />
            <div className="text">
              <div className="title">Gold</div>
              <div>23 gm</div>
            </div>
          </div>
        </main>
      </div>
    </Container>
  );
};

export default FundDetails;
