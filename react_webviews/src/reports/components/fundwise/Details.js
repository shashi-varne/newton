import React, { useState, useEffect } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getFunds } from "../../common/api";

const FundswiseDetails = (props) => {
  const params = props?.match?.params || {};
  const dataindex = params.dataindex || "";
  if (dataindex === "") props.history.goBack();
  const [folio_number, setFolioNumber] = useState("");
  const [fund, setFund] = useState({});
  const [showSkelton, setShowSkelton] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const result = await getFunds();
    if (!result) {
      setShowSkelton(false);
      return;
    }
    const data = result.report[dataindex] || {};
    const folio_details = data.folio_details || {};
    setFund(data);
    setFolioNumber(
      folio_details
        .map(function (obj) {
          return obj.folio_number;
        })
        .join(", ") || ""
    );
    setShowSkelton(false);
  };

  return (
    <Container title="Transactions" noFooter={true} skelton={showSkelton}>
      <div className="reports-fundswise-details">
        {!showSkelton && !isEmpty(fund) && (
          <>
            <h5>{fund.mf.friendly_name}</h5>
            <div className="folio-number">Folio Number: {folio_number}</div>
            {fund.purchase.units > 0 && (
              <>
                <div className="content">Purchase</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.purchase.amount)}
                        {fund.purchase.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.purchase.units.toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.switchin.units > 0 && (
              <>
                <div className="content">Switchin</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.switchin.amount)}
                        {fund.switchin.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.switchin.units.toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.transferin.units > 0 && (
              <>
                <div className="content">Transferin</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.transferin.amount)}
                        {fund.transferin.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.transferin.units.toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.divreinvest.units > 0 && (
              <>
                <div className="content">Divreinvest</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.divreinvest.amount)}
                        {fund.divreinvest.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.divreinvest.units.toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.redemption.units > 0 && (
              <>
                <div className="content">Redemption</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.redemption.amount)}
                        {fund.redemption.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.redemption.units.toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Price</span>
                      <span>
                        {formatAmountInr(fund.redemption.price)}
                        {fund.redemption.price === 0 && 0}
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.switchout.units > 0 && (
              <>
                <div className="content">Switchout</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.switchout.amount)}
                        {fund.switchout.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.switchout.units.toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Price</span>
                      <span>
                        {formatAmountInr(fund.switchout.price)}
                        {fund.switchout.price === 0 && 0}
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.transferout.units > 0 && (
              <>
                <div className="content">Transferout</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.transferout.amount)}
                        {fund.transferout.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.transferout.units.toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Price</span>
                      <span>
                        {formatAmountInr(fund.transferout.price)}
                        {fund.transferout.price === 0 && 0}
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {fund.divpayout.units > 0 && (
              <>
                <div className="content">Divpayout</div>
                <div className="block1">
                  <ul>
                    <li>
                      <span>Amount</span>
                      <span>
                        {formatAmountInr(fund.divpayout.amount)}
                        {fund.divpayout.amount === 0 && 0}
                      </span>
                    </li>
                    <li>
                      <span>Units</span>
                      <span>{fund.divpayout.units.toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default FundswiseDetails;
