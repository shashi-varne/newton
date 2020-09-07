import React, { Component } from "react";
import Grow from "@material-ui/core/Grow";
import WrButton from "../common/Button";
import { HoldingFilterOptions as Filters } from '../constants';
import { storageService } from "../../utils/validators";

export default class HoldingFilter extends Component {
  constructor(props) {
    super(props);
    const cachedFilters = storageService().getObject('wr-holdings-filter');
    this.state = {
      expand_filter: false,
      scheme_type: (cachedFilters && cachedFilters.scheme_type) || "",
      current_value_type: (cachedFilters && cachedFilters.current_value_type) || "",
      fisdom_rating: (cachedFilters && cachedFilters.fisdom_rating) || "",
    };
  }

  toggleFilter = () => {
    this.setState({
      expand_filter: !this.state.expand_filter,
    });
  };

  selectCategory = (category, newFilter) => {
    const currentFilter = this.state[category];

    this.setState({
      [category]: currentFilter !== newFilter ? newFilter : '',
    }, () => {
      const filters = {
        scheme_type: this.state.scheme_type,
        current_value_type: this.state.current_value_type,
        fisdom_rating: this.state.fisdom_rating,
      };
      this.props.onFilterChange(filters);
      storageService().setObject('wr-holdings-filter', filters);
    });
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
