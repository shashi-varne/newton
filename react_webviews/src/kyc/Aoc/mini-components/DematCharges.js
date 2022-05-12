import React, { useMemo } from "react";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import BrokerageChargesTile from "../../Equity/mini-components/BrokerageChargesTile";
import { formatAmountInr } from "../../../utils/validators";
import "./mini-components.scss";

const getDematChargesData = (equityChargesData = {}) => () => {
  return [
    {
      name: "Annual maintainence fee",
      value: `${formatAmountInr(
        equityChargesData.demat_amc?.rupees
      )}/yr + GST`,
      subText: "Charged yearly",
      subValue: "1st year FREE",
      className: "kaim-fit-amf",
    },
    {
      name: "Standard brokerage",
      className: "kaim-fit-sb kaim-fit-sb-pt20",
    },
    {
      name: "Delivery",
      value: `Flat ${formatAmountInr(
        equityChargesData.brokerage_delivery?.rupees
      )}/-`,
      subValue: "on executed order",
    },
    {
      name: "Intraday",
      value: `Flat ${formatAmountInr(
        equityChargesData.brokerage_intraday?.rupees
      )}/-`,
      subValue: "on executed order",
    },
    {
      name: "Futures",
      value: `Flat ${formatAmountInr(
        equityChargesData.brokerage_future?.rupees
      )}`,
      subValue: "on executed order",
    },
    {
      name: "Options",
      value: `Flat ${formatAmountInr(
        equityChargesData.brokerage_options?.rupees
      )}`,
      subValue: "on executed order",
    },
    {
      name: "Mutual funds",
      value: formatAmountInr(0),
    },
  ];
};

const DematCharges = ({ isOpen, onClose, equityChargesData }) => {
  const dematList = useMemo(getDematChargesData(equityChargesData), [
    equityChargesData,
  ]);
  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Brokerage & other charges"
      button1Props={{
        title: "OKAY",
        variant: "contained",
        onClick: onClose,
      }}
      classes={{
        title: "wvbs-dc-title",
      }}
    >
      {dematList?.map((data, idx) => {
        return <BrokerageChargesTile data={data} key={idx} />;
      })}
    </WVBottomSheet>
  );
};

export default DematCharges;
