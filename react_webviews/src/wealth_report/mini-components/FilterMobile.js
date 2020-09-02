import React, { Component } from "react";
import Dialog from "common/ui/Dialog";
import WrButton from "../common/Button";
import { HoldingFilterOptions as Filters } from "../constants";
import { Button } from "material-ui";
import { getConfig } from "utils/functions";
import CloseIcon from "@material-ui/icons/Close";
const isMobileView = getConfig().isMobileDevice;

class FilterMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme_type: {},
      current_value_type: {},
      fisdom_rating: {},
      filters: [],
      open: false
    };
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

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
    const filterKeys = Filters.map(filter => filter.id);
    const filters = filterKeys.map(kind => ({
      category: kind,
      label: this.state[kind].label || '',
      value: this.state[kind].value || '',
    }));
    const filtersObj = filters.reduce((obj, currentObj) => {
      obj[currentObj.category] = currentObj.value;
      return obj;
    }, {});

    this.setState({ filters, open: false });
    this.props.onFilterChange(filtersObj);
  };

  clearFilters = () => {
    this.setState({
      filters: [],
      scheme_type: {},
      current_value_type: {},
      fisdom_rating: {},
    });
    const filterKeys = Filters.map(filter => filter.id);
    const filters = filterKeys.map(kind => ({
      category: kind,
      label: '',
      value: '',
    }));
    const filtersObj = filters.reduce((obj, currentObj) => {
      obj[currentObj.category] = currentObj.value;
      return obj;
    }, {});
    this.props.onFilterChange(filtersObj);
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
            open={this.state.open}
            onClose={() => this.setState({ open: false })}
            style={{marginTop:'60px'}}
            classes={{ paper: "wr-paper-filter" }}
        >
          {this.renderFilterModal()}
        </Dialog>
        {this.state.filters.length > 0 && this.renderSelectedFilters()}
        <Button
          variant="fab"
          style={{
            display: isMobileView ? "" : "none",
          }}
          className='wr-fab-btn'
          onClick={this.handleClick}
          disableRipple
          disableFocusRipple
        >
          {this.state.open ? (
            <CloseIcon />
          ) : (
            <img src={require("assets/fisdom/ic-mob-filter.svg")} alt="" />
          )}
        </Button>
      </React.Fragment>
    );
  }
}

export default FilterMobile;
