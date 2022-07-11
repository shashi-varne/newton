import { MF_LANDING } from "businesslogic/strings/portfolio";
import React from "react";
import { formatAmountInr } from "../../utils/validators";
import BottomsheetRow from "./BottomsheetRow";

const { currentInvestmentSheet: CURRENT_INVESTMENT_SHEET } = MF_LANDING;

function LandingBottomsheet({ current, invested, earning }) {
  return (
    <div className="pf-landing-bottomsheet">
      <BottomsheetRow
        label={CURRENT_INVESTMENT_SHEET.keyCurrent.text}
        labelId={CURRENT_INVESTMENT_SHEET.keyCurrent.dataAid}
        value={formatAmountInr(current)}
        valueId={CURRENT_INVESTMENT_SHEET.valueCurrent.dataAid}
      />
      <BottomsheetRow
        label={CURRENT_INVESTMENT_SHEET.keyInvested.text}
        labelId={CURRENT_INVESTMENT_SHEET.keyInvested.dataAid}
        value={formatAmountInr(invested)}
        valueId={CURRENT_INVESTMENT_SHEET.valueInvested.dataAid}
      />
      <BottomsheetRow
        label={CURRENT_INVESTMENT_SHEET.keyProfitLoss.text}
        labelId={CURRENT_INVESTMENT_SHEET.keyProfitLoss.dataAid}
        value={formatAmountInr(earning)}
        valueId={CURRENT_INVESTMENT_SHEET.valueProfitLoss.dataAid}
        valueColor={
          earning > 0
            ? "foundationColors.secondary.profitGreen.400"
            : "foundationColors.secondary.lossRed.400"
        }
      />
    </div>
  );
}

export default LandingBottomsheet;
