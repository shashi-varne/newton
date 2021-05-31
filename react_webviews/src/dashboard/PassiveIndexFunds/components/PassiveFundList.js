import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService, isEmpty } from "utils/validators";
import { initialize, fetch_funddetails_list } from "../common/commonFunctions";
import FundListCard from "../mini-components/FundListCard";
import CartFooter from  "../../../common/ui/Filter/CartFooter";
import YearFilter from "../mini-components/YearFilter";
import { year_filters } from "../constants";
import "./PassiveFundDetails.scss";
import { nativeCallback } from "../../../utils/native_callback";

class FundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen_name: 'fund_list',
            result: [],
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
        const isins_number = { "isins_no": item.isin }
        storageService().setObject("isins_number", isins_number);
        this.navigate(`fund-details`);
    }

    yearFilter = (time) => {
        this.setState({
            selected: time
        })
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
                force_hide_inpage_title={true}
            >
                <div>
                    <h1 className='category-title'>{this.state.title}</h1>
                    <p>NIFTY is a benchmark index by the National Stock Exchange (NSE). It has a host of indices – NIFTY 50, Nifty Midcap 150, Nifty Smallcap 250 & more. Nifty50 comprises India's 50 largest companies traded on NSE such as Reliance Industries Ltd., HDFC Bank Ltd., Infosys Ltd., etc. Nifty50 has delivered a CAGR of 11.92% in the last 5 years as of 31 Dec 2020</p>


                    <YearFilter filterArray={year_filters} selected={this.state.selected} onclick={this.yearFilter} />


                    <React.Fragment>
                        {!isEmpty(result) &&
                            result.map((item, index) => {
                                return (
                                    <FundListCard
                                        data={item}
                                        key={index}
                                        handleClick={() =>
                                            this.clickCard(item)
                                        }
                                        selected={this.state.selected}
                                    />
                                );
                            })}
                    </React.Fragment>

                    <CartFooter
                        // cart={cart}
                        fundsList={result}
                    // setCart={setCart}
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