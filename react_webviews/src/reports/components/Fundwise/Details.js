import React, { useState, useEffect, Fragment } from "react";
import Container from "../../common/Container";
import { formatAmountInr, isEmpty } from "utils/validators";
import { getFunds } from "../../common/api";
import "./commonStyles.scss";
import { storageService } from "../../../utils/validators";
import { storageConstants } from "../../constants";

const fundsSections = [
  "purchase",
  "switchin",
  "transferin",
  "divreinvest",
  "redemption",
  "switchout",
  "transferout",
  "divpayout",
];

const showPriceDetails = ["redemption", "switchout", "transferout"];
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
    let data = storageService().getObject(
      storageConstants.REPORTS_SELECTED_FUND
    );
    if (!data) {
      const result = await getFunds();
      if (!result) {
        setShowSkelton(false);
        return;
      }
      data = result.report[dataindex] || {};
      storageService().setObject(storageConstants.REPORTS_SELECTED_FUND, data);
    }
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
    <Container title="Transactions" noFooter={true} skelton={showSkelton} data-aid='reprots-transactions-screen'>
      <div className="reports-fundswise-details" data-aid='reports-fundswise-details'>
        {!isEmpty(fund) && (
          <>
            <h5>{fund.mf.friendly_name}</h5>
            <div className="folio-number" data-aid='reports-folio-number'>Folio Number: {folio_number}</div>
            {fundsSections.map((key, index) => {
              return (
                <Fragment key={index}>
                  {fund[key]?.units > 0 && (
                    <FundswiseDetailsCard
                      fundData={fund[key]}
                      title={key}
                      showPrice={showPriceDetails.includes(key)}
                    />
                  )}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
    </Container>
  );
};

export default FundswiseDetails;

export const FundswiseDetailsCard = ({ fundData, title, showPrice }) => {
  const renderTiles = ["amount", "units"];
  if (showPrice) {
    renderTiles.push("price");
  }
  const tilesData = {
    amount: {
      text: "Amount",
      value: `${formatAmountInr(fundData?.amount || "")}${
        fundData?.amount === 0 ? 0 : ""
      }`,
    },
    units: {
      text: "Units",
      value: `${fundData?.units?.toFixed(4) || ""}`,
    },
    price: {
      text: "Price",
      value: `${formatAmountInr(fundData?.price || "")}${
        fundData?.price === 0 ? 0 : ""
      }`,
    },
  };
  return (
    <>
      <div className="content" data-aid='content'>{title}</div>
      <div className="block1" data-aid='block1'>
        <ul>
          {renderTiles.map((data, index) => {
            return (
              <li key={index} data-aid='reports-value-block'>
                <span>{tilesData[data].text}</span>
                <span>{tilesData[data].value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
