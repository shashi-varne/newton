import React, { Component } from "react";
import Dialog from "common/ui/Dialog";
import WrButton from "../common/Button";

const Filters = [
  {
    id: "fund_type",
    category: "Fund Type",
    filters: ["Debt", "Equity", "Other"],
  },
  {
    id: "current_value",
    category: "Current Value",
    filters: ["<1L", "1.5L", "5-10L", "10L+"],
  },
  {
    id: "rating",
    category: "Fisdom Rating",
    filters: ["3 & Below", "4 & above"],
  },
];

class FilterMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      fund_type: "",
      current_value: "",
      rating: "",
      filters: [],
    };
  }

  handleClick = () => {
    this.setState({
      render_filter: !this.state.render_filter,
      checked: !this.state.checked,
      fund_type: "",
      current_value: "",
      rating: "",
    });
  };

  selectCategory = (category, filter) => {
    this.setState({
      [category]: filter,
    });

    if (this.state[category] === filter) {
      this.setState({
        [category]: "",
      });
    }
  };

  handleChanges = () => {
    this.setState({
      filters: [
        this.state.fund_type,
        this.state.current_value,
        this.state.rating,
      ]
    });
    this.props.onClick()

  };

  handleClear = () => {
    this.setState({
      filters: []
    })
  }

  renderFilterModal = () => (
    <div className="wr-mobile-filter">
      {Filters.map((item, index) => {
        return (
          <div className="wr-categories" key={index}>
            {`${item.category}:`}
            <br />
            {item.filters.map((filter, index) => (
              <WrButton
                key={index}
                classes={{
                  root:
                    this.state[item.id] === filter
                      ? "wr-selected-filters"
                      : "wr-non-selected-filters",
                }}
                disableRipple
                size="small"
                onClick={() => this.selectCategory(item.id, filter)}
              >
                {filter}
              </WrButton>
            ))}
            {index !== Filters.length - 1 ? <hr /> : ""}
          </div>
        );
      })}
      <div className="wr-apply-changes">
        <WrButton
          classes={{
            root: "wr-text-btn",
          }}
          disableRipple
          size="small"
          onClick={this.handleChanges}
        >
          APPLY CHANGES
        </WrButton>
      </div>
    </div>
  );

  renderFilter = () => (
    <div className="wr-filter-category">
      <div>Filter:
        {this.state.filters.map((item, index) => item !== '' && (
          <WrButton size='small' disableRipple key={index}
            classes={{
              root:'wr-filter-btn'
            }}
          >
            {item}
          </WrButton>
        ))}
      </div>
      <div style={{color:'var(--primary'}} onClick={this.handleClear}>
        Clear All
      </div>
    </div>
  );

  render() {
    return (
      <React.Fragment>
        <Dialog
            open={this.props.open}
            onClose={this.props.onClose}
            style={{marginTop:'60px'}}
            classes={{ paper: "wr-paper-filter" }}
        >
          {this.renderFilterModal()}
        </Dialog>
        {this.state.filters.length > 0 && this.renderFilter()}
      </React.Fragment>
    );
  }
}

export default FilterMobile;
