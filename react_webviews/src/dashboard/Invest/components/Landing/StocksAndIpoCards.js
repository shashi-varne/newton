import React from "react";
import { SkeltonRect } from "../../../../common/ui/Skelton";
import FreedomPlanCard from "../../mini-components/FreedomPlanCard";
import InvestCard from "../../mini-components/InvestCard";

const StocksAndIpoCards = ({
  handleClick,
  stocksAndIpo,
  subscriptionStatus,
  showLoader,
  handleFreedomCard,
}) => {
  return (
    <>
      {(subscriptionStatus.freedom_cta || subscriptionStatus.renewal_cta) && (
        <>
          {showLoader ? (
            <SkeltonRect className="invest-fp-loader" />
          ) : (
            <FreedomPlanCard onClick={handleFreedomCard} />
          )}
        </>
      )}
      {stocksAndIpo.map((item, index) => {
        if (showLoader) {
          return (
            <SkeltonRect
              style={{
                width: "100%",
                height: "170px",
                marginBottom: "15px",
              }}
              key={index}
            />
          );
        } else {
          return (
            <InvestCard
              data={item}
              key={index}
              handleClick={handleClick(item.key, item.key)}
            />
          );
        }
      })}
    </>
  );
};

export default StocksAndIpoCards;
