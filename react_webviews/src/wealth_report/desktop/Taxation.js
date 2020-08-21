import React, { useState, useEffect, Fragment } from "react";
import WrSelect from "../common/Select";
import WrButton from "../common/Button";
import Tooltip from "common/ui/Tooltip";
import { isMobileDevice } from "utils/functions";
import toast from "../../common/ui/Toast";
import Dialog from "common/ui/Dialog";
import { fetchTaxation, fetchTaxFilters } from "../common/ApiCalls";
import { inrFormatDecimal } from "../../utils/validators";
import { CircularProgress } from "material-ui";

const Taxation = (props) => {
  const [tabSelected, selectTab] = useState("stcg");
  const [openModal, toggleModal] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [taxationData, setTaxationData] = useState({
    combined_tax_data: {},
    stcg_tax_data: {},
    ltcg_tax_data: {}
  });
  const [taxFilters, setTaxFilters] = useState({ tax_slabs:[], financial_years:[] });
  const [selectedFinYear, setFinYear] = useState("");
  const [selectedTaxSlab, setTaxSlab] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let taxFilters = await fetchTaxFilters({ pan : props.pan });
        taxFilters = formatFilters(taxFilters);
        setTaxFilters(taxFilters);
        // TODO: Save values to LS
        const financial_year =
          selectedFinYear || taxFilters.financial_years[0].value;
        const tax_slab = selectedTaxSlab || taxFilters.tax_slabs[0].value;
        setFinYear(financial_year);
        setTaxSlab(tax_slab);
      } catch (err) {
        console.log(err);
        toast(err);
      }
    })();
  }, [props.pan]);

  useEffect(() => {
    if (!selectedFinYear || !selectedTaxSlab) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTaxation({
          pan: props.pan,
          financial_year: selectedFinYear,
          tax_slab: selectedTaxSlab,
        });
        setTaxationData(data);
      } catch (err) {
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, [props.pan, selectedFinYear, selectedTaxSlab]);

  const formatFilters = (filtersObj) => {
    const yearFormatter = (val) => {
      const [year1, year2] = val.split(' - ');
      return `FY ${year1} - ${year2.slice(-2)}`;
    };

    return {
      financial_years: (filtersObj.financial_years || []).map(filter => ({
        label: yearFormatter(filter),
        value: filter,
      })),
      tax_slabs: (filtersObj.tax_slabs || []).map(filter => ({
        label: `Slab ${filter}%`,
        value: filter,
      })),
    };
  };

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
    let { overall = [], debt = [], equity = [] } = taxationData[`${tabSelected}_tax_data`];
    const tabUpperCase = tabSelected.toUpperCase();
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
          label: `Realized ${tabUpperCase}`,
        },
        { propName: `taxable_${tabSelected}`, label: `Taxable ${tabUpperCase}` },
      ],
      equity: [
        { propName: "estimated_tax", label: "Tax to be Paid" },
        {
          propName: `realized_${tabSelected}`,
          label: `Realized ${tabUpperCase}`,
        },
        { propName: `taxable_${tabSelected}`, label: `Taxable ${tabUpperCase}` },
      ],
    };

    return (
      <Fragment>
        <div className="wr-taxation-detail-row">
          <div className="wr-tdr-title">
            Overall {tabSelected.toUpperCase()}
            <hr></hr>
          </div>
          {colMapping.overall.map((col, idx) => (
            <div className="wr-small-col" key={idx}>
              <span className="wr-small-col-val">
                {inrFormatDecimal(overall[col.propName])}
              </span>
              <span className="wr-small-col-title">{col.label}</span>
            </div>
          ))}
        </div>
        <div className="wr-taxation-detail-row">
          <div className="wr-tdr-title">
            Debt Funds
            <hr></hr>
          </div>
          {colMapping.debt.map((col, idx) => (
            <div className="wr-small-col" key={idx}>
              <span className="wr-small-col-val">
                {inrFormatDecimal(debt[col.propName])}
              </span>
              <span className="wr-small-col-title">{col.label}</span>
            </div>
          ))}
        </div>
        <div className="wr-taxation-detail-row">
          <div className="wr-tdr-title">
            Equity Funds
            <hr></hr>
          </div>
          {colMapping.equity.map((col, idx) => (
            <div className="wr-small-col" key={idx}>
              <span className="wr-small-col-val">
                {inrFormatDecimal(equity[col.propName])}
              </span>
              <span className="wr-small-col-title">{col.label}</span>
            </div>
          ))}
        </div>
      </Fragment>
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
      src={require(`assets/fisdom/ic-info.svg`)}
      id="wr-i-btn"
      alt=""
      onClick={() => toggleModal(true)}
    />
  );

  return (
    <div id="wr-taxation" className="wr-card-template">
      <div id="wr-taxation-filter">
        <WrSelect
          disableUnderline={true}
          style={{ marginRight: "24px" }}
          menu={taxFilters.financial_years}
          onSelect={handleSelect}
          selectedValue={selectedFinYear}
          name="year"
          disabled={isLoading}
        />

        <WrSelect
          disableUnderline={true}
          style={{ marginRight: "24px" }}
          menu={taxFilters.tax_slabs}
          onSelect={handleSelect}
          selectedValue={selectedTaxSlab}
          name="slab"
          disabled={isLoading}
        />
      </div>
      {
        isLoading ?
        (
          <div style={{ textAlign: 'center', marginTop: '120px' }}>
            <CircularProgress size={50} thickness={4} />
          </div>
        ) :
        (
          <Fragment>
            <div id="wr-taxation-summary">
              <div className="wr-taxation-summary-col">
                <span className="wr-tsc-value">
                  {inrFormatDecimal(taxationData.combined_tax_data.estimated_tax || "")}
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
                  {inrFormatDecimal(taxationData.combined_tax_data.realized_gains || "")}
                </span>
                <span className="wr-tsc-label">Total realized gains</span>
              </div>
              <div className="wr-vertical-divider"></div>
              <div className="wr-taxation-summary-col">
                <span className="wr-tsc-value">
                  {inrFormatDecimal(taxationData.combined_tax_data.taxable_gains || "")}
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
                  style={{ marginRight: "16px" }}
                  onClick={() => selectTab(tab)}
                  key={index}
                  disableRipple
                >
                  {tab.toUpperCase()}
                </WrButton>
              ))}
              {renderTaxDetailRows()}
            </div>
          </Fragment>
        )
      }
    </div>
  );
};

export default Taxation;
