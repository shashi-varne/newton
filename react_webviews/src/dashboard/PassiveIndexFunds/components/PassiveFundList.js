import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService } from "utils/validators";
import { initialize } from "../common/commonFunctions";
import { getFundDetailsList } from "../services"
import WVBottomFilter from "../../../common/ui/Filter/WVBottomFilter";
import WVYearFilter from "../../../common/ui/YearFilter/WVYearFilter";
import WVGenericListCard from "../../../common/ui/GenericListCard/WVGenericListCard"
import { YEARS_FILTERS, BOTTOM_FILTER_NAME, SELECTED_YEAR } from "../constants";
import "./PassiveFundDetails.scss";
import { nativeCallback } from "../../../utils/native_callback";
import { isEmpty } from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import scrollIntoView from 'scroll-into-view-if-needed';

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
            bottomFilterOptions: BOTTOM_FILTER_NAME,
        };

        this.initialize = initialize.bind(this);
        this.getFundDetailsList = getFundDetailsList.bind(this)
    }

    componentWillMount() {
        this.initialize();
    }

    async componentDidMount() {
        const body = {
            "subcategory": "all",
            "sort_by": "low_to_high",
            "filter_by": "tracking_error",
            "return_type": "five_year_return"
        }
        const { result, fundDescription } = await this.getFundDetailsList(body)

        if (!isEmpty(result)) {
            this.getFilterNames(result, 'fund_house', 'Fund House');
            this.getFilterNames(result, 'tracking_index', 'Index');
        }

        this.setState({ body, result: result ? result : [], fundDescription })
    }


    getFilterNames(result, value, name) {

        const { bottomFilterOptions } = this.state

        if (result?.length > 0) {
            const dataArr = result.map((item) => item[value])
            const uniqueSet = new Set(dataArr)
            var uniqueArr = Array.from(uniqueSet)
        }
        if (!isEmpty(uniqueArr)) {
            const option = uniqueArr.map((item, idx) => {
                return ({
                    value: item,
                    control: Checkbox,
                    title: item,
                    labelPlacement: "end",
                    color: "primary",
                });
            })
            bottomFilterOptions.forEach(element => {

                if (element.name === name) {
                    element["option"] = option
                }

            });

            this.setState({
                bottomFilterOptions
            })
        }
        return;
    };

    clickCard(item) {
        this.sendEvents("next", item.legal_name);
        let dataCopy = Object.assign({}, item)
        dataCopy.diy_type = 'categories'
        storageService().setObject('diystore_fundInfo', dataCopy)
        this.navigate(`fund-details`, {
            searchParams: `${this.props.location.search}&isins=${item.isin}`,
        });
    }

    yearFilter = async (time) => {
        let body = this.state.body || {};
        const SelectedYear = SELECTED_YEAR[time] || "five_year_return";
        body["return_type"] = SelectedYear;

        const { result, fundDescription } = await this.getFundDetailsList(body);
        this.setState({ result, fundDescription, selected: SelectedYear, yearValue: time, }, () => this.handleScroll())
    }

    handleScroll = (id) => {
        setTimeout(function () {
            let element = document.getElementById("HeaderHeight");
            if (!element || element === null) {
                return;
            }

            scrollIntoView(element, {
                block: "start",
                inline: "nearest",
                behavior: "smooth",
            });
        }, 50);
    };

    setSortFilter = async (item) => {

        let body = {
            "filter_by": item["sort_value"] || "returns",
            "fund_house": item["fund_house_value"] || [],
            "return_type": this.state.selected || "five_year_return",
            "subcategory": item["index_value"] ? item['index_value'].length === 0 ? "all" : item["index_value"] : "all"
        }

        if (item["sort_value"] === "tracking_error" || item["sort_value"] === "expense_ratio") {
            body["sort_by"] = "low_to_high"
        } else body["sort_by"] = "high_to_low"

        if (item["fund_option_value"] === "Growth") {
            body["growth"] = "true"
        } else if (item["fund_option_value"] === "Dividend") {
            body["dividend"] = "true"
        }


        const { result, fundDescription } = await this.getFundDetailsList(body);
        this.setState({ result, fundDescription, body })
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
                background="passive-fund-list-page"
            >
                <div id={"passive-fund-list"}>
                    {this.state.fundDescription && (
                        <p className="category-description">
                            {this.state.fundDescription.substring(0, 90)}
                            <span style={this.state.expand ? {} : { display: "none" }}>
                                {this.state.fundDescription.substring(91)}
                            </span>...
                            <span className="category-desc-button" onClick={this.handleExpand}>
                                {this.state.expand ? " LESS" : " MORE"}
                            </span>
                        </p>
                    )}
                    <p className="fund-number">{result?.length || 0} FUNDS</p>
                    <WVYearFilter
                        filterArray={YEARS_FILTERS}
                        selected={this.state.yearValue || "1Y"}
                        onClick={this.yearFilter}
                        dataAidSuffix={'passive-year-filter'}
                    />

                    <React.Fragment>
                        {!isEmpty(result) &&
                            result.map((item, index) => {
                                return (
                                    <WVGenericListCard
                                        data={item}
                                        dataAidSuffix={'passive-list-card'}
                                        morning_star_rating={item?.morning_star_rating}
                                        starclassName={item?.morning_star_rating ? "" : "star-icon-na"}
                                        title={item["legal_name"]}
                                        subtitle={item["tracking_index"]}
                                        image={item.amc_logo_big}
                                        value={
                                            [{ 'title1': 'EXPENSE RATIO', 'title2': 'RETURNS' },
                                            {
                                                'title1': item["expense_ratio"], 'className1': 'return', "tag1": "%",
                                                'title2': item[this.state.selected], 'className2': item[this.state.selected] >= 0 ? 'return color-green' : 'return color-red', "tag2": item[this.state.selected] ? `%` : 'NA',
                                            },
                                            { 'title1': 'TRACKING ERROR' },
                                            { 'title1': item["tracking_error"] || "NA", 'className1': 'return', "tag1": item["tracking_error"] ? `% [${this.state.yearValue}]` : '' }]
                                        }
                                        key={index}
                                        handleClick={() => this.clickCard(item)}
                                    />
                                );
                            })}
                    </React.Fragment>
                    <WVBottomFilter
                        dataAidSuffix={'passive-card-details'}
                        filterOptions={this.state.bottomFilterOptions}
                        getSortedFilter={this.setSortFilter}
                        defaultFilter={{ "sort_value": "tracking_error" }}
                    />
                </div>
            </Container>
        );
    }
}

export default FundList;