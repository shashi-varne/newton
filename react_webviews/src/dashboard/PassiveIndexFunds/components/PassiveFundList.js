import React, { Component } from "react";
import Container from "../../common/Container";
import { storageService, isEmpty } from "utils/validators";
import { initialize, fetch_funddetails_list } from "../common/commonFunctions";
import Radio from '@material-ui/core/Radio';
import FundListCard from "../mini-components/FundListCard";
import CartFooter from "../../../common/ui/Filter/CartFooter";
import YearFilter from "../mini-components/YearFilter";
import { year_filters, sort_filter_data, filter_options } from "../constants";
import "./PassiveFundDetails.scss";

class FundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen_name: 'fund_list',
            result: [],
            getFundHouses: [],
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

    clickCard(isin) {
        const isins_number = { "isins_no": isin }
        storageService().setObject("isins_number", isins_number);
        this.navigate(`fund-details`);
    }

    yearFilter = (time) => {
        this.setState({
            selected: time
        })
    }


    render() {

        const { result, getFundHouses } = this.state; console.log(getFundHouses)
        
        return (
            <Container
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
                                            this.clickCard(item.isin)
                                        }
                                        selected={this.state.selected}
                                    />
                                );
                            })}
                    </React.Fragment>
                    <CartFooter
                        // cart={cart}
                        fundsList={result}
                        SortFilterData={sort_filter_data}
                        filterOptions={filter_options}
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