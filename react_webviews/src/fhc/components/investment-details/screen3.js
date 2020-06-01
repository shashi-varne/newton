import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import qs from 'qs';
import toast from '../../../common/ui/Toast';

import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import personal from 'assets/personal_details_icon.svg';
import Api from 'utils/api';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ value }) => {
  return (<li className="draggable-item item-li">{value.name}</li>);
})

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul style={{padding: '0'}}>
      {items.map((item, index) => (
        <SortableItem value={item} index={index} key={index}></SortableItem>
      ))}
    </ul>
  );
})

class InvestmentDetails3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      fhc_data: new FHC(),
      params: qs.parse(this.props.location.search.slice(1)),
      type: getConfig().productName
    }
  }

  async componentDidMount() {
    try {
      let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
      if (!fhc_data) {
        const res = await Api.get('page/financialhealthcheck/edit/mine', {
          format: 'json',
        });
        fhc_data = res.pfwresponse.result;
      }
      fhc_data = new FHC(fhc_data);
      this.setState({
        show_loader: false,
        fhc_data,
      });

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params: {
        disableBack: true
      }
    });
  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'fin_health_check',
      "properties": {
        "user_action": user_action,
        "screen_name": 'loan_details_one',
        "provider": this.state.provider,
        "investment": this.state.investment,
        "from_edit": (this.state.edit) ? 'yes' : 'no'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    fhc_data.investments = arrayMove(fhc_data.investments, oldIndex, newIndex);
    this.setState({ fhc_data });
  };


  handleClick = () => {
    // this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    fhc_data.investments.map((inv, idx) => inv.rank = `${idx+1}`);
    window.localStorage.setItem('fhc_data', JSON.stringify(fhc_data));
    if (this.state.investment === 'yes') {
      this.navigate('/fhc/investment2');
    } else {
      //skip to screen 3 if user selects 'No' for investments
      this.navigate('/fhc/investment4');
    }
  }

  bannerText = () => {
    return (
      <span>
        Let's have a look at your investments
      </span>
    );
  }

  render() {
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showLoader={this.state.show_loader}
        title="Fin Health Check (FHC)"
        count={false}
        total={5}
        current={3}
        banner={true}
        bannerText={this.bannerText()}
        handleClick={this.handleClick}
        edit={this.props.edit}
        topIcon="close"
        buttonTitle="Save & Continue"
      >
        <FormControl fullWidth>
          <TitleWithIcon width="23" icon={this.state.type !== 'fisdom' ? personal : personal}
            title={'Investment Details'} />
          <div>
            Rearrange the following in terms of how you 
            have invested money from high to low
          </div>
          <div className="sortable-investment-container">
            <div id="sortable-col-left">
              <ul style={{padding: '0'}}>
                {fhc_data.investments.map((v, i) => (
                  <li className="item-li" key={i}>{i+1}</li>
                ))}
              </ul>
            </div>
            <div style={{ width: '100%' }}>
              <SortableList
                items={fhc_data.investments}
                onSortEnd={this.onSortEnd}>
              </SortableList>
            </div>
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default InvestmentDetails3;
