import React, { Component } from 'react';
import Container from '../../../common/Container';

import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import { health_providers } from '../../../constants';
import BottomInfo from '../../../../common/ui/BottomInfo';
import { storageService } from 'utils/validators';
import Input from '../../../../common/ui/Input';

class GroupHealthPlanSelectCity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: getConfig().productName,
            provider: this.props.match.params.provider,
            groupHealthPlanData: storageService().getObject('groupHealthPlanData'),
            city: ''
        }
    }

    componentWillMount() {
        this.setState({
            providerData: health_providers[this.state.provider],
        })
    }




    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = () => {
        let groupHealthPlanData = this.state.groupHealthPlanData;
        groupHealthPlanData.city = this.state.city;
        storageService().setObject('groupHealthPlanData',groupHealthPlanData );
    
        this.navigate('plan-list');
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

    handleChange = name => event => {
        if (!name) {
          name = event.target.name;
        }
        var value = event.target ? event.target.value : '';
        this.setState({
            [name]: value,
            [name + '_error']: ''
        })

      };


    render() {


        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                title="Where do you live?"
                fullWidthButton={true}
                buttonTitle="CONTINUE"
                onlyButton={true}
                handleClick={() => this.handleClick()}
            >

                <div className="InputField">
                    <Input
                        type="text"
                        width="40"
                        label="City"
                        id="city"
                        name="city"
                        error={(this.state.city_error) ? true : false}
                        helperText={this.state.city_error || 'Premium depends on city of residence'}
                        value={this.state.city}
                        onChange={this.handleChange()} />
                </div>
                <BottomInfo baseData={{ 'content': 'Get cashless treatments at 10000+ cities' }} />
            </Container>
        );
    }
}

export default GroupHealthPlanSelectCity;