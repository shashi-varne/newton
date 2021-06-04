import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService, isEmpty } from "utils/validators";
import { initialize, fetch_funddetails_list, selected_year } from "../common/commonFunctions";
import BottomFilter from "../../../common/ui/Filter/BottomFilter";
import YearFilter from "../../../common/ui/YearFilter";
import GenericListCard from "../../../common/ui/GenericListCard"
import { year_filters, filter_options } from "../constants";
import "./PassiveFundDetails.scss";
import { nativeCallback } from "../../../utils/native_callback";

class FundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen_name: 'fund_list',
            result: [],
            expand: false,
            skelton: true,
            selected: "five_year_return",
            yearValue: "5Y",
            mount: true,
        };

        this.initialize = initialize.bind(this);
        this.fetch_funddetails_list = fetch_funddetails_list.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    componentDidMount() {
        this.fetch_funddetails_list()
    }

    clickCard(item) {
        this.sendEvents("next", item.legal_name);
        // TO BE CHECKED
        const isins_number = { "isins_no": item.isin }
        storageService().setObject("isins_number", isins_number);
        // --
        let dataCopy = Object.assign({}, item)
        dataCopy.diy_type = 'categories'
        storageService().setObject('diystore_fundInfo', dataCopy)
        this.navigate(`fund-details`, {
            searchParams: `${this.props.location.search}&isins=${item.isin}`,
        });
    }

    yearFilter = (time) => {
        let body = this.state.body || {};
        const SelectedYear = selected_year(time)
        this.setState({
            selected: SelectedYear,
            yearValue: time,
        })
        body["return_type"] = SelectedYear;
        this.fetch_funddetails_list(body);
    }

    setSortFilter = (item) => {

        let body = {
            "filter_by": item["Sort by"] || "returns",
            "fund_house": item["Fund House"] || [],
            // "tracking_index": item["Index"] || [],
            "return_type": this.state.selected || "five_year_return",
             "subcategory": item["Index"] ? item['Index'].length === 0 ?  "all" :  item["Index"] : "all"
        }

        if (item["Sort by"] === "tracking_error" || item["Sort by"] === "expense_ratio") {
            body["sort_by"] = "low_to_high"
        } else body["sort_by"] = "high_to_low"

        if (item["Fund Option"] === "Growth") {
            body["growth"] = "true"
        } else if (item["Fund Option"] === "Dividend") {
            body["dividend"] = "true"
        }

        this.setState({
            body: body
        });

        this.fetch_funddetails_list(body)
    }

    sendEvents = (userAction, fundSelected) => {
        let fundCategory = (this.state.title || "").toLowerCase().split(" ").join("_");
        let eventObj = {
            event_name: "passive_funds",
            properties: {
                user_action: userAction || "",
                screen_name: "explore_funds",
                fund_selected: fundSelected || "",
                fund_category: (fundCategory === "global_indices" ? "global_index_funds" : fundCategory) || ""
            },
        };
        if (userAction === "just_set_events") {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    };
    handleExpand = () => {
        this.setState({
            expand: !this.state.expand
        })
    }

    render() {

        const { result } = this.state
        return (
            <Container
                events={this.sendEvents("just_set_events")}
                title={this.state.title}
                noFooter={true}
                skelton={this.state.skelton}
                showError={this.state.showError}
                errorData={this.state.errorData}
            >
                <div>
                    {this.state.fundDescription && (
                        <p className="category-description">{this.state.fundDescription.substring(0, 90)}<span style={this.state.expand ? {} : { display: "none" }}>{this.state.fundDescription.substring(91)}</span>...<span className="category-desc-button" onClick={this.handleExpand}>{this.state.expand ? " LESS" : " MORE"}</span></p>
                    )}
                    <p className="fund-number">{result.length} FUNDS</p>
                    <YearFilter
                        filterArray={year_filters}
                        selected={this.state.yearValue || "1Y"}
                        onClick={this.yearFilter}
                    />

                    <React.Fragment>
                        {!isEmpty(result) &&
                            result.map((item, index) => {
                                return (
                                    <GenericListCard
                                        data={item}
                                        morning_star_rating={item?.morning_star_rating}
                                        title={item["legal_name"]}
                                        subtitle={item["tracking_index"]}
                                        image={item.amc_logo_big}
                                        value={
                                            [{ 'title1': 'EXPENSE RATIO', 'title2': 'RETURNS' },
                                            {
                                                'title1': item["expense_ratio"], 'className1': 'return', "tag1": "%",
                                                'title2': item[this.state.selected], 'className2': 'return color', "tag2": item[this.state.selected] ? `%` : 'Na',
                                            },
                                            { 'title1': 'TRACKING ERROR' },
                                            { 'title1': item["tracking_error"] || "Na", 'className1': 'return', "tag1": item["tracking_error"] ? `% [${this.state.yearValue}]` : '' }]
                                        }
                                        key={index}
                                        handleClick={() => this.clickCard(item)}
                                    />
                                );
                            })}
                    </React.Fragment>
                    <BottomFilter
                        filterOptions={filter_options}
                        getSortedFilter={this.setSortFilter}
                        defaultFilter={{ "Sort by": "tracking_error" }}
                    />
                </div>
            </Container>
        );
    }
}

export default FundList;