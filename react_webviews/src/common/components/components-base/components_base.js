import React, { Component } from 'react'

import Input from '../../ui/Input'
import DropdownWithoutIcon from '../../ui/SelectWithoutIcon'
import Autosuggests from '../../ui/Autosuggest'
import Banner from '../../ui/Banner'
import BottomInfo from '../../ui/BottomInfo'
import BottomSheet from '../../ui/BottomSheet'
import CustomButton from '../../ui/Button'
import ReactResponsiveCarousel from '../../ui/carousel'
import CheckBox from '../../ui/Checkbox'
import DialogBox from '../../ui/Dialog'
import DotDotLoader from '../../ui/DotDotLoader';
import DotDotLoaderNew from '../../ui/DotDotLoaderNew'
import DropdownInModal from '../../ui/DropdownInModal'
import DropdownInPage from '../../ui/DropdownInPage'
import Faqs from '../../ui/Faqs'
import GenericTooltip from '../../ui/GenericTooltip'
import HowToSteps from '../../ui/HowToSteps'
import Icon from '../../ui/Icon'
import Imgc from '../../ui/Imgc'
import InputPopup from '../../ui/InputPopup'
import InputWithIcon from '../../ui/InputWithIcon'
import LandingSteps from '../../ui/LandingSteps'
import LeftRightFooter from '../../ui/leftRightFooter'
import MmYyInModal from '../../ui/MmYyInModal'
import MobileInputWithIcon from '../../ui/MobileInputWithIcon'
import MobileInputWithoutIcon from '../../ui/MobileInputWithoutIcon'
import OtpDefault from '../../ui/otp'
import PlusMinusInput from '../../ui/PlusMinusInput'
import RadioBtn from '../../ui/RadioBtn'
import RadioWithoutIcon from '../../ui/RadioWithoutIcon'
import RadioWithoutIcon2 from '../../ui/RadioButton2'
import RadioOptions from '../../ui/RadioOptions'
import RadioWithIcon from '../../ui/RadioWithIcon'
import RadioWithoutIcon3 from '../../ui/RadioWithoutIcon2'
import DropdownWithoutIconSelect from '../../ui/SelectWithoutIcon'
// import Select from "material-ui";
import { yesNoOptions } from '../../../group_insurance/constants';
import { disableBodyTouch } from '../../../utils/validators'
import { FormControl } from "material-ui/Form"
import MenuItem from "@material-ui/core/MenuItem"
import icn from '../../../assets/info_icon.svg'

import {
  Select,
  TextField
} from "material-ui";

class Components_base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            suggestions_list: [],
            city: '',
            check: true,
            openPopUpInput : true,
        };
    }


    componentWillMount() {
        let city = [{ 'key': 'bangalore', 'value': 'bangalore' },
        { 'key': 'hydrabad', 'value': 'hydrabad' },
        { 'key': 'goa', 'value': 'goa' }, { "key": "ALISINGA", "value": "ALISINGA" }]

        let vendor_details = [{
            'name': 'Donne Darko',
            'value': 'Donne Darko'
        },
        {
            'name': 'Bharti Axa',
            'value': 'bharti axa general'
        },
        ]

        this.setState({
            vendor_details: vendor_details,
            suggestions_list: city,
        })

    }

  updateParent(a, b) {
    console.log(a, b)
  }

  handler(index){
    console.log(index)
  }

    handleChange = (name) => (event) => {
        if (!name) {
            return
        }

        if (name === 'check') {
            this.setState({
                check: !this.state.check
            })
            return
        }

        let form_data = this.state.form_data;
        let mobile, value;

        if (name !== 'Vendor') {
            value = event.target.value || ''
            mobile = value.slice(4);
        }

        if (name === 'Vendor') {
            // eslint-disable-next-line
            value = event
            form_data[name] = value ;
            form_data[name + '_error'] = '';
        };

        this.setState({
            mobile_no: mobile,
            mobile_no_error: "",
            form_data: form_data,
        });
    };

    render() {
        let { mobile_no } = this.state;

        mobile_no = '9937476458'
        return (
            <div style={{backgroundColor: 'white', height: 'auto'}}>  
            <header className='header-components-base'>
            <h2>UI Componets List</h2>
            </header>
            <div className='compoenets-list'>
            <h2>Select the List to View Demo</h2>
          <div className="compoenets-base">

          <h3>Banner</h3>
       <div style={{position: 'fixed'}} > <Banner text={'UI Componets List'}/> </div>   

           <h3>DropdownWithoutIcon</h3>
            <DropdownWithoutIcon
              parent={this}
              header_title="Insurance Company"
              cta_title="SAVE"
              selectedIndex = { 0 }
              width="40"
              dataType="AOB"
              options={this.state.vendor_details}
              id="relation"
              label="Insurance Company"
              error={this.state.form_data.name_error2 ? true : false}
              name="Vendor"
              helperText={this.state.form_data.name_error2}
              value={this.state.form_data.Vendor || ''}
              onChange={this.handleChange("Vendor")}
            />


           <h3>Autosuggests</h3>
               <FormControl fullWidth>
                    <div className="InputField">
                    {this.state.suggestions_list.length > 0 &&
                     <Autosuggests
                        parent={this}
                        width="40"
                        placeholder="Search for city, This is the Autosuggests Search Bar"
                        options={this.state.suggestions_list}
                        label="City"
                        id="city"
                        name="city"
                        error={(this.state.city_error) ? true : false}
                        helperText={this.state.city_error || 'Premium depends on city of residence'}
                        value={this.state.city}
                        onChange={this.handleChange()} />
                    }
                    </div>
                </FormControl>

               <h3>BottomInfo</h3>
               <BottomInfo baseData={{ 'content': 'Your information is safe and secure with us' }} />

               <h3>BottomSheet</h3>
               <BottomSheet  data={'hello world'}/>

               <h3>CustomButton 1:</h3>
               <CustomButton  twoButton={true}  buttonOneTitle={'Download'} buttonTwoTitle={'Continue'}/>

               <h3>CustomButton 2:</h3>
               <CustomButton  twoButton={true} dualbuttonwithouticon={true} buttonOneTitle={'Download'} buttonTwoTitle={'Continue'}/>

               <h3>CustomButton 3:</h3>
               <CustomButton  twoButton={false} dualbuttonwithouticon={true} buttonTitle={'Continue'}/>

               <h3>ReactResponsiveCarousel</h3>
               <ReactResponsiveCarousel
                CarouselImg={[
                    { src: 'star_icn_landing_card_1.svg' },
                    { src: 'star_icn_landing_card_2.svg' },
                    { src: 'star_icn_landing_card_3.svg' }
                ]}
                callbackFromParent={()=>console.log("fisdom")}/>

                <h3>CheckBox</h3>
                <CheckBox onChange={this.handleChange("check")}/>

                <h3>CheckboxList</h3>
                <p>pending do it tommorow</p>

                <h3>DialogBox</h3>
                <DialogBox /> 
                <p>pending do it tommorow</p>

                <h3>DotDotLoader</h3>
                <DotDotLoader />

                <h3>DotDotLoaderNew</h3>
                {/* <div><DotDotLoaderNew /></div> */}
                {disableBodyTouch(true)}
           
                <h3>DropdownInModal</h3>
                <DropdownInModal
                  parent={this}
                  options={this.state.vendor_details}
                  header_title="Select Height (cm)"
                  cta_title="SAVE"
                  selectedIndex={this.state.selectedIndex}
                  value={this.state.form_data.height || '153'}
                  error={this.state.form_data.height_error ? true : false}
                  helperText={this.state.form_data.height_error}
                  width="40"
                  label="Height (cm)"
                  class="Education"
                  id="height"
                  name="height"
                  onChange={this.handleChange()} />


                  <h3>DropdownInPage</h3>
                  <p>pending....</p>
                   {/* <DropdownInPage
                     options={this.state.smokeList}
                     value={this.state.selectedIndex}
                     onChange={this.setValue} /> */}

                   <h3>Faqs</h3>
                   <Faqs options={[{'title': 'fisdom', 'subtitle': 'Insurance', 'points': ['gold','insurance','equity','index funds','mutual funds']}]} />

                  <h3>GenericTooltip</h3>
                  <GenericTooltip productName={'fisdom'}  content='fisdom for financial freedom' />

                  <h3>HowToSteps</h3>
                  <HowToSteps
                   style={{ margin: "0px 0px 0px 0px",paddingTop:0 }}
                   baseData={{
                    title: `Benefits of digital gold`,
                    options: [
                      {
                        icon: "ic_benefit_gold",
                        // title: "Affordability",
                        subtitle: "Buy gold at live international market prices as per your budget",
                      },
                      {
                        icon: "ic_secure_vault",
                        // title: "Easy sell or conversion",
                        subtitle: "Sell to get the amount credited or convert to gold coins",
                      },
                      {
                        icon: "ic_purity",
                        // title: "100% insured & secured",
                        subtitle: "Assurance of 24 karat gold with no making or storage charges",
                      },
                    ],
                  }}
                   classNameIcon="steps-icon"
                   showSkelton={true}/>

                <h3>Icon</h3>
                <Icon  src={icn} width='20px' />

                <h3>Imgc</h3>
                {/* <Imgc /> */}
                <p>pending.....</p>
                
                <h3>Input Bar</h3>
            <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={''}
                type='data'
                helperText={''}
                type="text"
                width="40"
                className='compoenets-base'
                label="Label"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={`+91 ${mobile_no}` || ''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"
              />
            </div>
           </FormControl>

           <h3>InputPopup</h3>
           {/* <InputPopup  parent={this} /> */}
           <p>this is a Input Popup Box</p>


           <h3>InputWithIcon</h3>
            <FormControl fullWidth>
            <div className="InputField">
            <InputWithIcon
              error={(this.state.employer_name_error) ? true : false}
              helperText={this.state.employer_name_error || "Enter full name e.g Fisdom Pvt Limited"}
              type="text"
              icon={icn}
              width="40"
              label="Name of present employer *"
              class="Name"
              id="name"
              name="employer_name"
              value={this.state.employer_name}
              onChange={this.handleChange()} /> 
              </div>
              </FormControl>

              <h3>LandingSteps</h3>
              {/* <LandingSteps baseData={{ 'title': 'fisdom', 'subtitle': 'Insurance', 'options': [{"title": 'insurance', 'subtitle': 'gold'}]}} /> */}
  
              <h3>LeftRightFooter</h3>
              <LeftRightFooter parent={this} />

              <h3>MmYyInModal</h3>
              {/* <MmYyInModal /> */}
              <p>pending.....</p>

              <h3>MobileInputWithIcon</h3>
              <MobileInputWithIcon  icon={icn} width='2' error={''}
                type='data'
                helperText={''}
                type="text"
                width="40"
                className='compoenets-base'
                label="Enter Mobile Number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"/>

              <h3>MobileInputWithoutIcon</h3>
              <MobileInputWithoutIcon error={''}
                type='data'
                helperText={''}
                type="text"
                width="40"
                className='compoenets-base'
                label="Enter Mobile Number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"/>

              <h3>OtpDefault</h3>
              <OtpDefault  parent={this}/>

              <h3>PlusMinusInput</h3>
              <PlusMinusInput
                    name={'fisdom'}
                    label={'insurance'}
                    parent={this}
                />

                <h3>RadioBtn</h3>
                <RadioBtn   />

                <h3>RadioWithoutIcon</h3>
                <FormControl fullWidth>
                <div className="InputField">
                        <RadioWithoutIcon
                            width="40"
                            label={'Radio Button'}
                            class="Gender:"
                            options={yesNoOptions}
                            id="is_ped"
                            name="is_ped"
                            error={(this.state.form_data.is_ped_error) ? true : false}
                            helperText={this.state.form_data.is_ped_error}
                            value={this.state.form_data.is_ped || ''}
                            onChange={this.handleChange()} />
                            </div> </FormControl>

                 <h3>RadioWithoutIcon2</h3>
                 <FormControl fullWidth>
                 <div className="InputField" style={{  margin: '0 auto', display: 'inline-table' , marginRight: '100px', marginLeft: '100px' }}>
                        <RadioWithoutIcon2
                            label={'Radio Button'}
                            options={yesNoOptions}
                            type="professional2"
                            id="criminal"
                            label="Criminal proceedings"
                            error={(this.state.form_data.is_ped_error) ? true : false}
                            helperText={this.state.form_data.is_ped_error}
                            value={this.state.form_data.is_ped || ''}
                            onChange={this.handleChange()} />
                            </div> </FormControl>
           
                  <h3>RadioOptions</h3>
                  <FormControl fullWidth>
                  <div className="InputField">
                    <RadioOptions
                      error={true}
                      helperText={"helperText"}
                      width="40"
                      label={'label qyestions'}
                      class="MaritalStatus"
                      options={yesNoOptions}
                      id="marital-status"
                      value={'Bengaluru'}
                      onChange={this.handleChange()} />
                  </div>
                 </FormControl>


              <h3>Select DropDown</h3>
              <FormControl className="wr-code-input">
              <Select
                value={mobile_no}
                renderValue={(mobile_no) => `+${mobile_no.split("/")[0]}`}
                onChange={this.handleChange()}
                disableUnderline={true}
                inputProps={{
                  name: "phone",
                }}
                disabled={false}
                classes={{ root: "wr-select-input" }}
              >
                {this.state.suggestions_list.map((code, index) => (
                  <MenuItem key={index} value={code.dialCode + "/" + code.format}>
                    {`${code.name} +${code.dialCode}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br></br>


            <h3>Select DropdownWithoutIcon</h3>
            <DropdownWithoutIconSelect 
              value={mobile_no}
              renderValue={(mobile_no) => `+${mobile_no.split("/")[0]}`}
              onChange={this.handleChange()}
              disableUnderline={true}
              options={this.state.suggestions_list}
              inputProps={{
                name: "phone",
              }}
              isAOB={true}
              disabled={false}
              classes={{ root: "wr-select-input" }}/>

              <h3>SliderWithValues</h3>

          </div>
          </div>
          </div>
        );
    }
}

const abcd = (props) => (
    <Components_base
        {...props} />
);

export default abcd;