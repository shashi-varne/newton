import React, { Component } from "react";
import Grow from "@material-ui/core/Grow";
import WrButton from "../common/Button";
import { HoldingFilterOptions as Filters } from '../constants';

export default class HoldingFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand_filter: false,
      fund_type: "",
      current_value: "",
      rating: "",
    };
  }

  toggleFilter = () => {
    this.setState({
      expand_filter: !this.state.expand_filter,
    });
  };

  selectCategory = (category, newFilter) => {
    const currentFilter = this.state[category];
    const filterObj = {
      [category]: currentFilter !== newFilter ? newFilter : '',
    };

    this.setState(filterObj);
    this.props.onFilterChange(filterObj);
  };

  render() {
    let { expand_filter } = this.state;
    let time = 1500;

    return (
      <React.Fragment>
        {!expand_filter && <FilterButton onClick={this.toggleFilter} />}
        {expand_filter && 
          <div
            className="wr-filter-content"
            style={{ display: expand_filter ? "flex" : "none" }}
          >
            <div className="wr-category">
              {Filters.map((item) => {
                time = time - 400;
                return (
                  <Grow
                    in={expand_filter}
                    {...(expand_filter ? { timeout: time } : {})}
                    key={item.category}
                  >
                    <div className="wr-head">
                      {`${item.category}:`}
                      {item.filters.map(({ label, value }) => (
                        <WrButton
                          key={value}
                          classes={{
                            root:
                              this.state[item.id] === value
                                ? "wr-selected-filters"
                                : "wr-non-selected-filters",
                          }}
                          disableRipple
                          size="small"
                          onClick={() => this.selectCategory(item.id, value)}
                        >
                          {label}
                        </WrButton>
                      ))}
                    </div>
                  </Grow>
                );
              })}
            </div>
            <div className="wr-vertical-divider"></div>
            <img
              src={require(`assets/fisdom/ic-clear-filter.svg`)}
              alt=""
              style={{ marginLeft: "16px", cursor: "pointer" }}
              onClick={this.toggleFilter}
            />
          </div>
        }
      </React.Fragment>
    );
  }
}

const FilterButton = (props) => {
  return (
    <div className="wr-filter">
      <WrButton
        classes={{
          root: "wr-btn",
        }}
        disableRipple
        size="small"
        onClick={props.onClick}
      >
        Filter
        <img
          src={require(`assets/fisdom/ic-filter.svg`)}
          alt=""
          style={{ marginLeft: "8px" }}
        />
      </WrButton>
    </div>
  )
}
