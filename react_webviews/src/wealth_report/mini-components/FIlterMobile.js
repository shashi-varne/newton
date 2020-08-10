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
      open: true,
      checked: false,
      fund_type: "",
      current_value: "",
      rating: "",
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

  render3 = () => (
    <div className="wr-mobile-filter">
      {Filters.map((item, index) => {
        return (
          <div className="wr-categories">
            {`${item.category}:`}
            <br />
            {item.filters.map((filter) => (
              <WrButton
                key={filter}
                classes={{
                  root:
                    this.state[item.id] === filter
                      ? "wr-selected-btn"
                      : "wr-btn",
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
        >
          APPLY CHANGES
        </WrButton>
      </div>
    </div>
  );

  render() {
    return (
      <React.Fragment>
        <Dialog
            open={this.props.open && this.state.open}
            onClose={this.props.onClose}
        >
          {this.render3()}
        </Dialog>
      </React.Fragment>
    );
  }
}

export default FilterMobile;
