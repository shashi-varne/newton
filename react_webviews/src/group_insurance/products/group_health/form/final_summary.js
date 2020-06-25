import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
// import toast from '../../../../common/ui/Toast';
import { initialize, updateLead } from '../common_data'
import BottomInfo from '../../../../common/ui/BottomInfo';
import { numDifferentiationInr } from 'utils/validators';

class GroupHealthPlanFinalSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            get_lead: true,
            common_data: {},
            lead: {
                member_base: []
            },
            accordianData: []
        }
        this.initialize = initialize.bind(this);
        this.updateLead = updateLead.bind(this);
    }


    componentWillMount() {
        this.initialize();
    }

    onload = () => {
        let lead = this.state.lead;
        console.log(lead);
        let member_base = lead.member_base;

        let personal_details_to_copy = [
            {
                'title': 'Insured name',
                'key': 'name'
            },
            {
                'title': 'Date of birth',
                'key': 'dob'
            },
            {
                'title': 'Gender',
                'key': 'gender'
            },
            {
                'title': 'Height',
                'key': 'height'
            },
            {
                'title': 'Weight',
                'key': 'weight'
            }
        ]

        let accordianData = [];

        let diseases_data_backend = [];
        for (var i = 0; i < member_base.length; i++) {
            let member = Object.assign({}, member_base[i]);

            let obj = {
                title: `Personal details (insured ${i + 1})`,
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-personal-details/${member.key}`
            }

            let info = {};
            let data = [];

            for (var pc in personal_details_to_copy) {
                info = Object.assign({}, personal_details_to_copy[pc]);
                info.subtitle = member[info.key];
                data.push(info);
            }

            obj.data = data;
            accordianData.push(obj);

            if(member.ped_diseases_name) {
                let dis_data = {
                    'title' : `${member.relation}'s diseses`,
                    'subtitle': member.ped_diseases_name
                }

                diseases_data_backend.push(dis_data);
            }
            
        }

        let contact_data = {
            'title': 'Contact details',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-contact`,
            data: [
                {
                    'title': 'Email',
                    'subtitle': lead.email
                },
                {
                    'title': 'Mobile number',
                    'subtitle': lead.mobile_number
                }
            ]
        }

        accordianData.push(contact_data);

        let address_data_backned = lead.permanent_address;
        let address_data = {
            'title': 'Address details',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-address`,
            data: [
                {
                    'title': 'Address line 1',
                    'subtitle': address_data_backned.addressline
                },
                {
                    'title': 'Address line 2',
                    'subtitle': address_data_backned.addressline2
                },
                {
                    'title': 'Pincode',
                    'subtitle': address_data_backned.pincode
                },
                {
                    'title': 'City',
                    'subtitle': lead.city
                },
                {
                    'title': 'State',
                    'subtitle': address_data_backned.state
                }
            ]
        }

        accordianData.push(address_data);

        let nominee_data_backned = lead.nominee_account_key;
        let nominee_data = {
            'title': 'Nominee',
            edit_state: `/group-insurance/group-health/${this.state.provider}/edit-nominee`,
            data: [
                {
                    'title': 'Name',
                    'subtitle': nominee_data_backned.name
                },
                {
                    'title': 'Relation',
                    'subtitle': nominee_data_backned.relation
                }
            ]
        }
        accordianData.push(nominee_data);


        if(diseases_data_backend.length !== 0) {
            let diseases_data = {
                'title': 'Pre-existing diseases',
                edit_state: `/group-insurance/group-health/${this.state.provider}/edit-is-ped`,
                data: diseases_data_backend
            }

            accordianData.push(diseases_data);
        }
        
        this.setState({
            accordianData: accordianData
        })
    }


    handleClick = async () => {


    }


    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'health_suraksha',
            "properties": {
                "user_action": user_action,
                "screen_name": 'insurance'
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }


    renderMembertop = (props, index) => {
        return (
            <div className="member-tile" key={index}>
                <div className="mt-left">
                    <img src={require(`assets/${this.state.productName}/ic_hs_insured.svg`)} alt="" />
                </div>
                <div className="mt-right">
                    <div className="mtr-top">
                        Insured {index + 1} name
                    </div>
                    <div className="mtr-bottom">
                        {props.name} ({props.relation.toLowerCase()})
                    </div>
                </div>
            </div>
        );
    }

    renderAccordiansubData = (props, index) => {
        return (
            <div key={index}>
                {props.subtitle &&
                    <div className="bctc-tile">
                        <div className="title">
                            {props.title}
                        </div>
                        <div className="subtitle">
                            {props.subtitle}
                        </div>
                    </div>
                }
            </div>
        )
    }

    renderAccordian = (props, index) => {
        return (
            <div key={index} onClick={() => this.handleAccordian(index)} className="bc-tile">
                <div className="bct-top">
                    <div className="bct-top-title">
                        {props.title}
                    </div>
                    <div className="bct-icon">
                        <img src={require(`assets/${props.open ? 'minus_icon' : 'plus_icon'}.svg`)} alt="" />
                    </div>
                </div>

                {props.open &&
                    <div className="bct-content">
                        {props.data.map(this.renderAccordiansubData)}
                        <div onClick={() => this.openEdit(props.edit_state)} className="generic-page-button-small">
                            EDIT
                        </div>
                    </div>}
            </div>
        );
    }

    handleAccordian = (index) => {
        let accordianData = this.state.accordianData;
        let selectedIndex = this.state.selectedIndex;

        if (index === this.state.selectedIndex) {
            accordianData[index].open = false;
            selectedIndex = -1;
        } else {
            if (selectedIndex >= 0) {
                accordianData[selectedIndex].open = false;
            }

            accordianData[index].open = true;
            selectedIndex = index;
        }

        this.setState({
            accordianData: accordianData,
            selectedIndex: selectedIndex
        })
    }

    openEdit = (state) => {
        // this.navigate(state, {edit: true});
        this.navigate(state);
    }

    render() {

        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Summary"
                fullWidthButton={true}
                onlyButton={true}
                buttonTitle="MAKE PAYMENT OF ₹7,640"
                handleClick={() => this.handleClick()}
            >

                <div className="group-health-final-summary">
                    <div className="group-health-top-content-plan-logo" style={{ marginBottom: 0 }}>
                        <div className="left">
                            <div className="tc-title">{this.state.common_data.base_plan_title}</div>
                            <div className="tc-subtitle">{this.state.lead.plan_title}</div>
                        </div>

                        <div className="tc-right">
                            <img src={require(`assets/${this.state.providerData.logo_card}`)} alt="" />
                        </div>
                    </div>

                    <div className='mid-content'>

                        {this.state.lead.member_base.map(this.renderMembertop)}

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_how_to_claim2.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    SUM ASSURED
                                </div>
                                <div className="mtr-bottom">
                                    {numDifferentiationInr(this.state.lead.sum_assured)}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_periods.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    COVER PERIOD
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.tenure}
                                </div>
                            </div>
                        </div>

                        <div className="member-tile">
                            <div className="mt-left">
                                <img src={require(`assets/${this.state.productName}/ic_hs_cover_amount.svg`)} alt="" />
                            </div>
                            <div className="mt-right">
                                <div className="mtr-top">
                                    TOTAL PREMIUM
                                </div>
                                <div className="mtr-bottom">
                                    {this.state.lead.total_amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-content">
                        <div className="generic-hr"></div>

                        {this.state.accordianData.map(this.renderAccordian)}


                    </div>
                </div>
                <BottomInfo baseData={{ 'content': 'Get best health insurance benefits at this amount and have a secured future.' }} />

            </Container>
        );
    }
}

export default GroupHealthPlanFinalSummary;