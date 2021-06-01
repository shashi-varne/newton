import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService, isEmpty } from "utils/validators";
import { initialize, fetch_funddetails_list, selected_year } from "../common/commonFunctions";
import CartFooter from "../../../common/ui/Filter/CartFooter";
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
            getFundHouses: [],
            getIndexName: [],
            expand: false,
            skelton: true
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
        this.setState({
            selected: selected_year(time)
        })
    }

    setSortFilter(item) {
        console.log(item, ' item!~ ')
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
                    {/* <h1 className="category-title">{this.state.title}</h1> */}
                    {this.state.fundDescription && (
                        <p className="category-description">{this.state.fundDescription.substring(0, 90)}<span style={this.state.expand ? {} : { display: "none" }}>{this.state.fundDescription.substring(91)}</span>...<span className="category-desc-button" onClick={this.handleExpand}>{this.state.expand ? " LESS" : " MORE"}</span></p>
                    )}

                    <YearFilter
                        filterArray={year_filters}
                        selected={this.state.selected}
                        onclick={this.yearFilter}
                    />

                    <React.Fragment>
                        {!isEmpty(result) &&
                            result.map((item, index) => {
                                return (
                                    <GenericListCard
                                        data={item}
                                        title1={'EXPENSE RATIO'}
                                        title2={'Returns'}
                                        title3={'TRACKING ERROR%'}
                                        data1={'expense_ratio'}
                                        data2={this.state.selected || "five_year_return"}
                                        data3={'tracking_error'}
                                        key={index}
                                        handleClick={() => this.clickCard(item)}
                                    />
                                );
                            })}
                    </React.Fragment>

                    <CartFooter
                        fundsList={result}
                        filterOptions={filter_options}
                        getSortedFilter={this.setSortFilter}
                    // sortFilter={sortFilter}
                    // fundHouse={fundHouse}
                    // fundOption={fundOption}
                    // setSortFilter={setSortFilter}
                    // setFundHouse={setFundHouse}
                    // setFundsList={setFundOption}
                    // setFundOption={setFundOption}
                    // {...parentProps}
                    />
                </div>
            </Container>
        );
    }
}

export default FundList;