import React, { Component } from "react";
import Container from "./common/container";
import { initialize } from "./common/functions";
import Button from "material-ui/Button";
import Card from "../common/ui/Card";

class PolicyQuotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            screen_name: "select_loan_screen",
            displayTag: true, 
        };
        this.initialize = initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();

        let stepContentMapper = [
            {
                title: 'IDFC FIRST BANK',
                subtitle: 'Competetive intrest rate',
                loan_amount: " ₹40 lac",
                logo: 'idfc_logo',
                cta_title: 'APPLY NOW',
                card_tag: 'Recommended',
                benefits: {
                    benefits_title: 'Basic benefits',
                    options: [
                        {
                            data: "Loan up to 40 lakhs:",
                            sub_data: [
                                "For salaried, the range is from Rs. 1 lakh to 40 lacs",
                                "For self-employed the max loan amount is Rs. 9 lacs",
                            ]
                        },
                        "Low interest rate starting at 10.75% p.a.",
                        "Flexible loan tenure min 12 months to max 60 months",
                        "Option of ‘balance transfer’ at attractive rates",
                        "Loan sanction in less than 4 hrs",
                        "100% digital with easy documentation",
                        "Top-up facility to avail extra funds on the existing loan% digital with easy documentation",
                    ]
                }
            },
            {
                title: 'DMI Finance',
                subtitle: 'Quick disbursal',
                loan_amount: " ₹1 lac",
                logo: 'dmi-finance',
                cta_title: 'APPLY NOW',
                benefits: {
                    options: [
                        "Complete Digital and Presenceless process",
                        "You don't have to provide any security money for your loan",
                    ]
                },
            }
        ];

        let selectedIndexs = [];

        stepContentMapper.forEach(() => {
            selectedIndexs.push(false)
        })

        this.setState({
            stepContentMapper: stepContentMapper,
            selectedIndexs: selectedIndexs,
        });
    }

    handleBenefits = (index) => {
        let { selectedIndexs } = this.state;
        selectedIndexs[index] = !this.state.selectedIndexs[index]
        this.setState({ selectedIndexs: selectedIndexs })
    }

    renderBenefits  = (data, index) => {
        return <div key={index} className='benefits-points'>
            <div className='dot'></div>
            <div>
                <div>{data.data ? data.data : data}</div>
                {data.sub_data &&
                    data.sub_data.map((element, index) => {
                        return <div key={index} className='sub-data'>{"- " + element}</div>
                    })
                }
            </div>
        </div>
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                title="Select loan provider"
                noFooter={true}
            >
                <div className='select_loan'>
                    {this.state.stepContentMapper.map((item, index) => {
                        return <Card key={index}>
                            {item.card_tag && this.state.displayTag && <div className='card-tag'>{item.card_tag}</div>}
                            <div className="flex partner">
                                <div>
                                    <div>{item.title}</div>
                                    <div>{item.subtitle}</div>
                                </div>
                                <img
                                    src={require(`assets/${item.logo}.svg`)}
                                    alt={item.logo}
                                />
                            </div>
                            <div className='flex'>
                                <div> <span className='sub-text'>Loan upto:</span> {" " + item.loan_amount} </div>
                                <Button
                                    variant="raised"
                                    size="large"
                                    autoFocus
                                >
                                    {item.cta_title}
                                </Button>
                            </div>
                            <div className="benefits" onClick={() => this.handleBenefits(index)}>
                                <div className='benefits-header'>
                                    Benefits
                                    <img src={require(`assets/${this.state.selectedIndexs[index] ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                                </div>
                                {this.state.selectedIndexs[index] && (
                                    <div className='benefits-content'>
                                        {item.benefits.benefits_title && <div>{item.benefits.benefits_title}</div>}
                                        {item.benefits.options.map(this.renderBenefits)}
                                    </div>
                                )}
                            </div>
                        </Card>
                    })}
                </div>
            </Container >
        );
    }
}

export default PolicyQuotes;
