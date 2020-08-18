import React, { useState, useEffect } from "react";
import WrSelect from "../common/Select";
import WrButton from "../common/Button";
import Tooltip from "common/ui/Tooltip";
import { isMobileDevice } from "utils/functions";
import toast from "../../common/ui/Toast";
import Dialog from "common/ui/Dialog";
import { fetchTaxation, fetchTaxFilters } from "../common/ApiCalls";
import { inrFormatDecimal } from "../../utils/validators";

const Taxation = (props) => {
  const [tabSelected, selectTab] = useState("stcg");
  const [openModal, toggleModal] = useState(false);

  const [taxationData, setTaxationData] = useState({});
  const [taxFilters, setTaxFilters] = useState({tax_slabs:[], financial_years:[]});
  const [selectedFinYear, setFinYear] = useState("");
  const [selectedTaxSlab, setTaxSlab] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const taxFilters = await fetchTaxFilters({ pan: props.pan });
        setTaxFilters(taxFilters);
        const financial_year =
          selectedFinYear || taxFilters.financial_years.pop();
        const tax_slab = selectedTaxSlab || taxFilters.tax_slabs.pop();
        const data = await fetchTaxation({
          pan: props.pan,
          financial_year,
          tax_slab,
        });
        setTaxationData(data);
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, []);

  const handleSelect = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if ((name === "year")) {
      setFinYear(value);
    } else if ((name === "slab")) {
      setTaxSlab(value);
    }
  };

  const renderTaxDetailRows = () => {
    const { overall, debt, equity } = taxationData[`${tabSelected}_tax_data`];
    const colMapping = {
      overall: [
        { propName: "estimated_tax", label: "Overall Tax" },
        { propName: `realized_${tabSelected}`, label: "Overall Realized" },
        { propName: `taxable_${tabSelected}`, label: "Overall Taxable" },
      ],
      debt: [
        { propName: "estimated_tax", label: "Tax to be Paid" },
        {
          propName: `realized_${tabSelected}`,
          label: `Realized ${tabSelected}`,
        },
        { propName: `taxable_${tabSelected}`, label: `Taxable ${tabSelected}` },
      ],
      equity: [
        { propName: "estimated_tax", label: "Tax to be Paid" },
        {
          propName: `realized_${tabSelected}`,
          label: `Realized ${tabSelected}`,
        },
        { propName: `taxable_${tabSelected}`, label: `Taxable ${tabSelected}` },
      ],
    };

    return (
      <div className="wr-taxation-detail-row">
        <div className="wr-tdr-title">
          Overall{" "}
          <span style={{ textTransform: "uppercase" }}>{tabSelected}</span>
          <hr></hr>
        </div>
        {colMapping.overall.map((col) => (
          <div className="wr-small-col">
            <span className="wr-small-col-val">
              {inrFormatDecimal(overall[col.propName])}
            </span>
            <span className="wr-small-col-title">{col.label}</span>
          </div>
        ))}
        <div className="wr-tdr-title">
          Debt Funds{" "}
          <span style={{ textTransform: "uppercase" }}>{tabSelected}</span>
          <hr></hr>
        </div>
        {colMapping.debt.map((col) => (
          <div className="wr-small-col">
            <span className="wr-small-col-val">
              {inrFormatDecimal(debt[col.propName])}
            </span>
            <span className="wr-small-col-title">{col.label}</span>
          </div>
        ))}
        <div className="wr-tdr-title">
          Equity Funds{" "}
          <span style={{ textTransform: "uppercase" }}>{tabSelected}</span>
          <hr></hr>
        </div>
        {colMapping.equity.map((col) => (
          <div className="wr-small-col">
            <span className="wr-small-col-val">
              {inrFormatDecimal(equity[col.propName])}
            </span>
            <span className="wr-small-col-title">{col.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const tipcontent = (
    <div className="wr-estd-tax" style={{ width: "300px" }}>
      <div className="head">Estimated Tax</div>
      <div className="content">
        Disclaimer: Calculation is solely based on the statement provided by
        you.
      </div>
    </div>
  );

  const i_btn = (
    <img
      src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
      id="wr-i-btn"
      alt=""
      onClick={() => toggleModal(true)}
    />
  );

  return (
    <div id="wr-taxation" className="wr-card-template">
      <div id="wr-taxation-filter">
        {taxFilters.tax_slabs.map((slab, index) => (
          <WrSelect
            disableUnderline={true}
            style={{ marginRight: "24px" }}
            value={slab}
            onSelect={handleSelect}
            selectedValue={selectedFinYear}
            name="year"
          />
        ))}

        {taxFilters.financial_years.map((year, index) => (
          <WrSelect
            disableUnderline={true}
            style={{ marginRight: "24px" }}
            value={year}
            onSelect={handleSelect}
            selectedValue={selectedTaxSlab}
            name="slab"
          />
        ))}
      </div>
      <div id="wr-taxation-summary">
        <div className="wr-taxation-summary-col">
          <span className="wr-tsc-value">
            {inrFormatDecimal(taxationData.combined_tax_data.estimated_tax)}
          </span>
          <span className="wr-tsc-label">
            Estimated Tax
            <span style={{ marginLeft: "6px", verticalAlign: "middle" }}>
              {!isMobileDevice() ? (
                <Tooltip
                  content={tipcontent}
                  direction="down"
                  className="wr-estd-tax-info"
                >
                  {i_btn}
                </Tooltip>
              ) : (
                <React.Fragment>
                  {i_btn}
                  <Dialog
                    open={openModal}
                    onClose={() => toggleModal(false)}
                    classes={{ paper: "wr-dialog-info" }}
                  >
                    {tipcontent}
                  </Dialog>
                </React.Fragment>
              )}
            </span>
          </span>
        </div>
        <div className="wr-vertical-divider"></div>
        <div className="wr-taxation-summary-col">
          <span className="wr-tsc-value">
            {inrFormatDecimal(taxationData.combined_tax_data.realized_gains)}
          </span>
          <span className="wr-tsc-label">Total realized gains</span>
        </div>
        <div className="wr-vertical-divider"></div>
        <div className="wr-taxation-summary-col">
          <span className="wr-tsc-value">
            {inrFormatDecimal(taxationData.combined_tax_data.taxable_gains)}
          </span>
          <span className="wr-tsc-label">Taxable gains</span>
        </div>
      </div>
      <div id="wr-taxation-detail">
        {["stcg", "ltcg"].map((tab, index) => (
          <WrButton
            classes={{
              root: tabSelected === tab ? "" : "wr-outlined-btn",
            }}
            style={{ marginRight: "16px", textTransform: "uppercase" }}
            onClick={() => selectTab(tab)}
            key={index}
            disableRipple
          >
            {tab}
          </WrButton>
        ))}
        {this.renderTaxDetailRows()}
      </div>
    </div>
  );
};

export default Taxation;
