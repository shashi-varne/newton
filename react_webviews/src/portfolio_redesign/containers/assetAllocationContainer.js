import { CategoryRounded } from "@mui/icons-material";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetter } from "../../utils/validators";
import AllocationDetails from "./../AllocationDetails/AllocationDetails";

const mfData = {
  external_portfolio: {
    message: "invalid cas",
  },
  mf: {
    portfolio_summary: {
      one_day_earnings: -130941,
      invested_value: 72621328,
      current_value: 76334770,
      one_day_earnings_percent: -0.2,
      earnings: 3713442,
      xirr: 4.8,
      type: "mf",
    },
    asset_allocation: {
      detailed_exposure: {
        debt: {
          top_holdings: [
            {
              share: 20.911229979736273,
              instrument_name: "Infosys Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 6.690063260098466,
              instrument_name: "Bharti Airtel Ltd",
              holding_sector_name: "Communication Services",
            },
            {
              share: 6.652583255725353,
              instrument_name: "HCL Technologies Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 5.942107534961642,
              instrument_name: "Tech Mahindra Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 5.439578779560555,
              instrument_name: "ICICI Bank Ltd",
              holding_sector_name: "Financial Services",
            },
            {
              share: 4.745226837266267,
              instrument_name: "Wipro Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 4.417508082534195,
              instrument_name: "HDFC Bank Ltd",
              holding_sector_name: "Financial Services",
            },
            {
              share: 4.226020546797869,
              instrument_name: "Tata Consultancy Services Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 3.855002346425539,
              instrument_name: "Reliance Industries Ltd",
              holding_sector_name: "Energy",
            },
            {
              share: 2.756886189045609,
              instrument_name: "Axis Bank Ltd",
              holding_sector_name: "Financial Services",
            },
          ],
        },
        equity: {
          sector_allocation: [
            {
              share: 49.13923466110559,
              name: "Technology",
            },
            {
              share: 17.008213735273863,
              name: "Financial Services",
            },
            {
              share: 9.102221364291054,
              name: "Communication Services",
            },
            {
              share: 5.157240243975545,
              name: "Energy",
            },
            {
              share: 4.552410292519289,
              name: "Industrials",
            },
            {
              share: 4.538644026423734,
              name: "Consumer Cyclical",
            },
            {
              share: 3.4408892221788605,
              name: "Healthcare",
            },
            {
              share: 3.1248421514080267,
              name: "Consumer Defensive",
            },
            {
              share: 2.514037794614017,
              name: "Basic Materials",
            },
            {
              share: 0.8247986796807832,
              name: "Utilities",
            },
            {
              share: 0.5974678285292291,
              name: "Others",
            },
          ],
          top_holdings: [
            {
              share: 20.911229979736273,
              instrument_name: "Infosys Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 6.690063260098466,
              instrument_name: "Bharti Airtel Ltd",
              holding_sector_name: "Communication Services",
            },
            {
              share: 6.652583255725353,
              instrument_name: "HCL Technologies Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 5.942107534961642,
              instrument_name: "Tech Mahindra Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 5.439578779560555,
              instrument_name: "ICICI Bank Ltd",
              holding_sector_name: "Financial Services",
            },
            {
              share: 4.745226837266267,
              instrument_name: "Wipro Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 4.417508082534195,
              instrument_name: "HDFC Bank Ltd",
              holding_sector_name: "Financial Services",
            },
            {
              share: 4.226020546797869,
              instrument_name: "Tata Consultancy Services Ltd",
              holding_sector_name: "Technology",
            },
            {
              share: 3.855002346425539,
              instrument_name: "Reliance Industries Ltd",
              holding_sector_name: "Energy",
            },
            {
              share: 2.756886189045609,
              instrument_name: "Axis Bank Ltd",
              holding_sector_name: "Financial Services",
            },
          ],
        },
      },
      categories: [
        {
          earnings: 9682.632400000002,
          current_amount: 48413.162,
          type: "equity",
          allocation: 96.826324,
        },
        {
          earnings: 0.0,
          current_amount: 0.0,
          type: "debt",
          allocation: 0.0,
        },
        {
          type: "others",
          current_amount: 1586.8380000000002,
          allocation: 3.1736760000000004,
        },
      ],
    },
  },
};

const tabList = [
  { name: "Equity • 90%", key: "equity" },
  { name: "Debt • 10%", key: "debt" },
  { name: "Others • 0%", key: "others", disabled: true },
];

const AssetAllocationContainer = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const categories = mfData?.mf?.asset_allocation.categories;
  const tabHeaders = useMemo(() => {
    return categories.map((category, index) => {
      return {
        name: `${capitalizeFirstLetter(
          category.type
        )} • ${category.allocation.toFixed(2)}%`,
        key: category.type,
      };
    });
  }, [categories]);

  const equityData = {
    list: mfData?.mf?.asset_allocation.detailed_exposure?.equity,
    card: categories.find((item) => item.type === "equity"),
  };

  const debtData = {
    list: mfData?.mf?.asset_allocation.detailed_exposure?.debt,
    card: categories.find((item) => item.type === "debt"),
  };

  useEffect(() => {}, []);
  return (
    <WrappedComponent
      tabHeaders={tabHeaders}
      equityData={equityData}
      debtData={debtData}
    />
  );
};

export default AssetAllocationContainer(AllocationDetails);
