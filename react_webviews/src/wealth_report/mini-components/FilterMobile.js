import React, { Component } from "react";
import Dialog from "common/ui/Dialog";
import WrButton from "../common/Button";
import { HoldingFilterOptions as Filters } from "../constants";

class FilterMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fund_type: "",
      current_value: "",
      rating: "",
      filters: [],
    };
  }

  selectCategory = (category, newFilter, reApplyFilter) => {
    const currentFilter = this.state[category];
    const filterChanged = currentFilter.value !== newFilter.value;

    this.setState({
      [category]: filterChanged ? newFilter : {},
    }, () => { //to get updated state immediately https://stackoverflow.com/questions/41446560/react-setstate-not-updating-state
      if (reApplyFilter) this.applyFilters();
    });
  }

  applyFilters = () => {
    const filters = ['fund_type', 'current_value', 'rating'].map(kind => ({
      category: kind,
      label: this.state[kind].label || '',
      value: this.state[kind].value || '',
    }));

    this.setState({ filters });
    this.props.onFilterChange(filters);
  };

  clearFilters = () => {
    this.setState({
      filters: [],
      fund_type: {},
      current_value: {},
      rating: {},
    });
  };

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
                    this.state[item.id].value === filter.value
                      ? "wr-selected-filters"
                      : "wr-non-selected-filters",
                }}
                disableRipple
                size="small"
                onClick={() => this.selectCategory(item.id, filter)}
              >
                {filter.label}
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
          onClick={this.applyFilters}
        >
          APPLY CHANGES
        </WrButton>
      </div>
    </div>
  );

  renderSelectedFilters = () => {
    const selectedFilters = this.state.filters.filter(obj => obj.value);
    
    return selectedFilters.length ? (
      <div className="wr-filter-category">
        <div>Filter:
          {this.state.filters.map(({ category, label, value }) => value && (
            <WrButton size='small' disableRipple key={value}
              classes={{
                root:'wr-filter-btn'
              }}
              onClick={() => this.selectCategory(category, { label, value }, true)}
            >
              {label}
            </WrButton>
          ))}
        </div>
        <div style={{color:'var(--primary'}} onClick={this.clearFilters}>
          Clear All
        </div>
      </div>
    ) : '';
  }

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
        {this.state.filters.length > 0 && this.renderSelectedFilters()}
      </React.Fragment>
    );
  }
}

export default FilterMobile;
