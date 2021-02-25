import React, { Component } from 'react'

import Input from '../../ui/Input'
import DropdownWithoutIcon from '../../ui/SelectWithoutIcon'
import Autosuggests from '../../ui/Autosuggest'
// eslint-disable-next-line 
import Banner from '../../ui/Banner'
import BottomInfo from '../../ui/BottomInfo'
import BottomSheet from '../../ui/BottomSheet'
import CustomButton from '../../ui/Button'
import ReactResponsiveCarousel from '../../ui/carousel'
import CheckBox from '../../ui/Checkbox'
import DialogBox from '../../ui/Dialog'
import DotDotLoader from '../../ui/DotDotLoader';
// eslint-disable-next-line 
import DotDotLoaderNew from '../../ui/DotDotLoaderNew'
import DropdownInModal from '../../ui/DropdownInModal'
import DropdownInPage from '../../ui/DropdownInPage'
import Faqs from '../../ui/Faqs'
import GenericTooltip from '../../ui/GenericTooltip'
import HowToSteps from '../../ui/HowToSteps'
import Icon from '../../ui/Icon'
// eslint-disable-next-line 
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
// eslint-disable-next-line 
import RadioBtn from '../../ui/RadioBtn'
import RadioWithoutIcon from '../../ui/RadioWithoutIcon'
import RadioWithoutIcon2 from '../../ui/RadioButton2'
import RadioOptions from '../../ui/RadioOptions'
// eslint-disable-next-line 
import RadioWithIcon from '../../ui/RadioWithIcon'
// eslint-disable-next-line 
import RadioWithoutIcon3 from '../../ui/RadioWithoutIcon2'
import DropdownWithoutIconSelect from '../../ui/SelectWithoutIcon'
import SliderWithValues from '../../ui/SilderWithValues'
import UiSkelton from '../../ui/Skelton'
import CustomizedSlider from '../../ui/Slider'
import StepsToFollow from '../../ui/stepsToFollow'
import TitleWithIcon from '../../ui/TitleWithIcon'
import TermsAndConditions from '../../ui/tnc'
import toast from '../../ui/Toast'
import Tooltip from '../../ui/TooltipLite'
import { yesNoOptions } from '../../../group_insurance/constants';
// eslint-disable-next-line 
import { disableBodyTouch } from '../../../utils/validators'
import { FormControl } from "material-ui/Form"
import MenuItem from "@material-ui/core/MenuItem"
import icn from '../../../assets/info_icon.svg'

import { Select } from "material-ui";

class ComponentsBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_data: {},
            suggestions_list: [],
            city: '',
            check: true,
            openPopUpInput : false,
            checked: true,
            mobile_no:'',
            fisdom_checked: false,
            InputPopup: false,
            openPopUpInputDate: false
        };
    }

    disableBodyTouch() {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.pointerEvents = 'none';
      }

    componentWillMount() {
        let city = [{ 'key': 'bangalore', 'value': 'bangalore' },
        { 'key': 'hydrabad', 'value': 'hydrabad' },
        { 'key': 'goa', 'value': 'goa' }, { "key": "ALISINGA", "value": "ALISINGA" }]

        let stepsContentMapperBlock2 = {
          title: `I want to`,
          img_alt:"Gold",
          options: [
            {
              icon: "ic_buy_gold",
              title: "Buy gold",
              next_state: '/gold/buy'
            },
            {
              icon: "ic_sell_gold",
              title: "Sell gold",
              next_state: '/gold/sell'
            },
            {
              icon: "ic_delivery",
              title: "Get delivery",
              next_state: '/gold/delivery'
            },
          ],
        };
        var insurance_details = [
          {'name': 'Life Insurance', 'value': 'Life Insurance'},
          {'name': 'Health Insurance', 'value': 'Health Insurance'},
          {'name': 'Covid Insurance', 'value': 'Covid Insurance'},
          {'name': 'Anything else', 'value': 'Anything else'}
      ]

        let vendor_details = [{
            'name': 'Donne Darko',
            'value': 'Donne Darko'
        },
        {
            'name': 'Bharti Axa',
            'value': 'bharti axa general'
        }]

      let residentialOptions = [ 'Owned','Rented','PG','Hostel','Batchlor Accomodation' ];

        let height = [{
          'name': '153',
          'value': '153'
        },{
          'name': '155',
          'value': '155'
        }]

        this.setState({
            vendor_details: vendor_details,
            suggestions_list: city,
            height: height,
            residentialOptions: residentialOptions,
            insurance_details: insurance_details,
            stepsContentMapperBlock2 : stepsContentMapperBlock2,
        })

    }

    handleChildClick = (e) => {
      e.stopPropagation();
    }

  updateParent(a, b) {
    this.setState({
      fisdom_checked: b,
      fisdom_total: b || 5,
      openPopUpInput: b,
      openPopUpInputDate: false,
    })
  }

  leftClick() {
    toast('you click left footer')
  }

  rightClick() {
    toast('you click right footer')
  }

  handler(index) {
    console.log(index)
  }

  setToolTip(bool){
    this.setState({
      toolTip: !bool
    })
  }

  handleChange = (name) => (event) => {
    if (!name) {
      return
    }

    if(name === 'DialogBox'){
      this.setState({
        DialogBox: !this.state.DialogBox
      })
      return
    }

    if(name === 'InputPopup'){
      this.setState({
        openPopUpInput2: !this.state.openPopUpInput2
      })
      return
    }

    if (name === 'setValue') {
      this.setState({
        selectedIndex: event
      })
      return
    }

    if (name === 'suggestions_list') {
      this.setState({
        answer: event.target.value,
      })
      return
    }

    if (name === 'radioOption') {
      this.setState({
        radioOption: event.target.value,
      })
      return
    }

    if (name === 'height') {
      let form_data = this.state.form_data
      form_data.height = event ? this.state.height[event]['value'] : '153'
      this.setState({
        form_data: form_data
      })
      return
    }

    if (name === 'check') {
      this.setState({
        check: !this.state.check
      })
      return
    }

    let form_data = this.state.form_data;
    let value
    let mobile = this.state.mobile_no

    if (name !== 'Vendor') {
      value = event.target.value || ''
    }

    if (name === 'Vendor') {
      // eslint-disable-next-line
      value = event
      form_data[name] = value;
      form_data[name + '_error'] = '';
    };

    if (name === 'mobile_no') {
      mobile = event.target.value
    }
    this.setState({
      mobile_no: mobile,
      mobile_no_error: "",
      form_data: form_data,
    });
  };

    render() {
        let { mobile_no } = this.state;

        return (
            <div style={{backgroundColor: 'white', height: 'auto'}}>  
            <header className='header-components-base'>
            <Banner text={'UI Componets List'} />
            <h2>UI Componets List</h2>
            </header>
            <div className='compoenets-list'>
            <h2>Select the List to View Demo</h2>
          <div className="compoenets-base">

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
               <div style={{backgroundColor: 'rgb(53, 203, 93)', color: 'white' , width : '130px' , borderRadius: '6px'}}>
               <CustomButton  twoButton={false} dualbuttonwithouticon={true} buttonTitle={'Continue'}/></div>

               <h3>ReactResponsiveCarousel</h3>
               <ReactResponsiveCarousel
                CarouselImg={[
                    { src: 'star_icn_landing_card_1.svg' },
                    { src: 'star_icn_landing_card_2.svg' },
                    { src: 'star_icn_landing_card_3.svg' }
                ]}
                callbackFromParent={()=>console.log("fisdom")}/>

                <h3>CheckBox</h3>
                <CheckBox handleChange={this.handleChange("check")} checked={this.state.check}  />

                <h3>CheckboxList</h3>
                {/* <p>pending do it tommorow</p> */}

                <h3>DialogBox</h3>
                <div  style={{backgroundColor: 'rgb(53, 203, 93)', 
                border: '6px solid white', color: 'green', textAlign: 'center' }} 
                onClick={this.handleChange("DialogBox")}>   
                {this.state.DialogBox ? <DialogBox
                 open={true}
                 onClose={false}
                 disableBackdropClick={true}
               >
                <div style={{height:'50px', width:'100%'}}> {'Life is either a daring adventure, or nothing.'}</div>
               </DialogBox> : 'CLICK ME'}
              </div>

    
                <h3>DotDotLoader</h3>
                <DotDotLoader />

                <h3>DotDotLoaderNew (disableBodyTouch)</h3>
                {/* <div><DotDotLoaderNew /></div> */}
                {this.disableBodyTouch()}
           
                <h3>DropdownInModal</h3>
                <DropdownInModal
                  parent={this}
                  options={this.state.height}
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
                  onChange={this.handleChange('height')} />


                  <h3>DropdownInPage</h3>
                  <DropdownInPage
                  options={['Yes' , 'No']}
                  value={this.state.selectedIndex || 0}
                  onChange={this.handleChange('setValue')} />
  
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
                width="40"
                className='compoenets-base'
                label="Label"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={`${mobile_no}` || ''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"
              />
            </div>
           </FormControl>

           <h3>InputPopup</h3>
           <div  style={{backgroundColor: 'rgb(53, 203, 93)', border: '6px solid white', color: 'green', textAlign: 'center' }} onClick={this.handleChange("InputPopup")}>{this.state.openPopUpInput2 ? 
           <div onClick={this.handleChildClick}><InputPopup parent={this} label='this is a inpage dropdown' cta_title='All Ok' header_title='Fisdom Dropdown' /> 
           </div>: 'Click Me'}</div>


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
              <LandingSteps
               style={{ margin: "20px 0px 0px 0px", cursor:'pointer' }}
               baseData={this.state.stepsContentMapperBlock2}
               classNameIcon="steps-icon"/>
              
              <h3>LeftRightFooter</h3>
              <LeftRightFooter parent={this} />

              <h3>Lite-Tooltip</h3>
                  <Tooltip
                    content={'Suvarna Vidhana Soudha was build by Chief minister Kengal Hanumanthaiya in 1952'}
                    background='#f0f7ff'
                    direction='down'
                    backgroundArrow='#f0f7ff'
                    className='fd-tooltip-container'
                    isOpen={true}
                    onClickAway={() => this.setToolTip(false)}
                  >
                    <img
                      src={icn}
                      width='25px'
                      className='info-tip'
                      alt='info'
                      onClick={() => this.setToolTip(!this.state.toolTip)}
                    />
                  </Tooltip>

              <h3>MmYyInModal</h3>

                 <div style={{border: '2px solid red', height:'100px'}}> 
                 <PlusMinusInput name={'fisdom'} label={'insurance'}  parent={this} /> 
                 <MmYyInModal  
                  parent={this}
                  header_title={'MmYyInModal'}
                  header_sub_title={'fisdom'}
                  cta_title={'All Ok'}
                  name={'fisdom'}
                  label={'Have a nice Day'}
                  id={'id07'}
                  dob={'05/1950'}
                  start_date={'05/1990'}
                  value={this.state.openPopUpInputDate}/>  </div>


              <h3>MobileInputWithIcon</h3>
              <MobileInputWithIcon  icon={icn} width='2' error={''}
                type='data'
                helperText={''}
                // eslint-disable-next-line
                width="40"
                className='compoenets-base'
                label="Enter Mobile Number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={`${mobile_no}` || ''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"/>

              <h3>MobileInputWithoutIcon</h3>
              <MobileInputWithoutIcon error={''}
                type='data'
                helperText={''}
                width="40"
                className='compoenets-base'
                label="Enter Mobile Number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={`${mobile_no}` || ''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"/>

              <h3>OtpDefault</h3>
              <OtpDefault  parent={this}/>

              <h3>PlusMinusInput</h3>                
                <PlusMinusInput name={'fisdom'} label={'insurance'}  parent={this} /> 

                <h3>RadioBtn</h3>
                {/* <RadioBtn   /> */}

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
                 <div className="RadioBlock RadioWithoutIcon" style={{ display: 'inline-table' , marginBottom: 30, color: '#a2a2a2', fontSize: '14px', fontWeight: 'normal'}}>
                        <RadioWithoutIcon2
                            label={'Radio Button'}
                            options={yesNoOptions}
                            type="professional2"
                            id="criminal"
                            // eslint-disable-next-line
                            label="RadioWithoutIcon2"
                            error={(this.state.form_data.is_ped_error) ? true : false}
                            helperText={this.state.form_data.is_ped_error}
                            value={this.state.form_data.is_ped || ''}
                            onChange={this.handleChange()} />
                            </div> 
           
                  <h3>RadioOptions</h3>
                  <FormControl fullWidth>
                  <div className="InputField">
                    <RadioOptions
                       error={(this.state.question1_error) ? true : false}
                       helperText={'RadioWithoutIcon2'}
                       width="40"
                       label="RadioWithoutIcon2"
                       class="MaritalStatus"
                       options={yesNoOptions}
                       id="marital-status"
                       value={this.state.radioOption || ''}
                       onChange={this.handleChange('radioOption')} />
                  </div>
                 </FormControl>


              <h3>Select DropDown</h3>
              <FormControl className="wr-code-input" style={{ borderBottom : '2px solid #3792FC' , backgroundColor: 'rgba(238, 238, 238, 0.3)' }}>
              <Select
                value={this.state.answer || ''}
                // renderValue={(mobile_no) => `+${mobile_no.split("/")[0]}`}
                onChange={this.handleChange('suggestions_list')}
                disableUnderline={true}
                label={'lable'}
                inputProps={{
                  name: "phone",
                }}
                disabled={false}
                classes={{ root: "wr-select-input" }}
              >
                {this.state.suggestions_list.map((code, index) => (
                  <MenuItem key={index} value={code.key + "/" + code.value}>
                    {`${code.value}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br></br>


            <h3>Select DropdownWithoutIcon</h3>
            <FormControl  fullWidth>
            <DropdownWithoutIconSelect 
                 parent={this}
                 header_title="What you're interested in"
                 selectedIndex = {this.state.form_data.index || 0}
                 width="40"
                 dataType="AOB"
                 options={this.state.insurance_details}
                 id="insurance"
                 label="What you're interested in"
                 error={this.state.form_data.insuranceType_error ? true : false}
                 helperText={this.state.form_data.insuranceType_error}
                 name="insuranceType"
                 value={this.state.form_data.Vendor || ''}
                 onChange={this.handleChange("Vendor")}/> 
                 </FormControl>



              <h3>SliderWithValues</h3>
              <SliderWithValues 
               label="Net monthly income"
               val="Net_monthly_Income"
               value={75000}
               min="0"
               max="1000000"
               minValue="0"
               maxValue="₹ 10 Lacs"
               onChange={this.handleChange()}/>

              <h3>UiSkelton</h3>
              <UiSkelton type={true} />

              <h3>CustomizedSlider</h3>
              <CustomizedSlider 
                    min={1000}
                    max={5000}
                    default={2000}
                    onChange={this.handleChange()}
                />

                <h3>StepsToFollow</h3>
                <StepsToFollow title='fisdom' subtitle='insurance' keyId='1' />
                <StepsToFollow title='fisdom' subtitle='gold' keyId='2' />
                <StepsToFollow title='fisdom' subtitle='equity' keyId='3' />

                <h3>TitleWithIcon</h3>
                <TitleWithIcon  icon={icn} width={'50px'} title={'fisdom'} />

                <h3>TermsAndConditions</h3>
                <TermsAndConditions   parent={this}  />
 
                  <h3>toast('Something went wrong')</h3>
                  <div onClick={() => { toast('Something went wrong') }}>Click Me</div>
          </div>
          </div>
          </div>
        );
    }
}

const abcd = (props) => (
    <ComponentsBase
        {...props} />
);

export default abcd;