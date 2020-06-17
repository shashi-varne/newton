import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import { fetchFHCData } from '../../common/ApiCalls';
import { storageService } from '../../../utils/validators';
import { nativeCallback } from 'utils/native_callback';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';
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
      type: getConfig().productName
    };
    this.navigate = navigate.bind(this);
  }

  async componentDidMount() {
    try {
      let fhc_data = storageService().getObject('fhc_data');
      if (!fhc_data) {
        fhc_data = await fetchFHCData();
        storageService().setObject('fhc_data', fhc_data);
      } else {
        fhc_data = new FHC(fhc_data);
      }
      fhc_data.investments = fhc_data.investments.sort((inv1, inv2) => inv1.rank - inv2.rank);
      this.setState({
        show_loader: false,
        fhc_data,
      });
    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast(err);
    }
  }

  sendEvents = (user_action) => {
    const snakeCase = val => val.replace(/[-\s]/g, '_');
    const eventOpts = this.state.fhc_data.investments.reduce((obj, currInv) => {
      obj[snakeCase(currInv.type)] = 'yes';
      return obj;
    }, {});
    let eventObj = {
      "event_name": 'fhc',
      "properties": {
        "user_action": user_action,
        "screen_name": 'investment details',
        ...(eventOpts || []),
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
    this.sendEvents('next');
    let fhc_data = new FHC(this.state.fhc_data.getCopy());
    fhc_data.investments.map((inv, idx) => inv.rank = `${idx+1}`);
    storageService().setObject('fhc_data', fhc_data)
    const showTaxSaving = storageService().get('enable_tax_saving');
    // skip to screen 4 if user selects 'No' for investments and enable_tax_saving = true
    if (showTaxSaving === 'true') {
      this.navigate('investment4');
    } else {
      this.navigate('invest-complete');
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
          <TitleWithIcon width="23" icon={require(`assets/${this.state.type}/invest.svg`)}
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
                lockAxis={'y'}
                pressDelay={200}
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

function arrayMove(arr, oldIdx, newIdx) {
  if (oldIdx === newIdx) return arr;
  let arrToReturn = [...arr];
  const [moveElem] = arrToReturn.splice(oldIdx, 1);
  arrToReturn.splice(newIdx, 0, moveElem);
  return arrToReturn;
}
