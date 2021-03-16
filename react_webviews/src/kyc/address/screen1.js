import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import RadioWithoutIcon from 'common/ui/RadioWithoutIcon'
import {
  storageConstants,
  getPathname,
  addressProofOptions,
} from '../constants'
import { initData } from '../services'
import { storageService, isEmpty } from 'utils/validators'
import { validateFields, navigate as navigateFunc } from '../common/functions'
import { kycSubmit } from '../common/api'
import toast from 'common/ui/Toast'
import SVG from 'react-inlinesvg'
import { getConfig } from 'utils/functions'

const AddressDetails1 = (props) => {
  const genericErrorMessage = 'Something went wrong!'
  const navigate = navigateFunc.bind(props)
  const [showLoader, setShowLoader] = useState(true)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [form_data, setFormData] = useState({})
  const state = props.location.state || {}
  const isEdit = state.isEdit || false
  const [userkyc, setUserKyc] = useState(
    storageService().getObject(storageConstants.KYC) || {}
  )
  const [currentUser, setCurrentUser] = useState(
    storageService().getObject(storageConstants.USER) || {}
  )
  const [title, setTitle] = useState('')

  const residentialOptions = [
    {
      name: 'Indian',
      value: 'INDIAN',
    },
    {
      name: 'NRI',
      value: 'NRI',
    },
  ]

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    let userkycDetails = { ...userkyc }
    let user = { ...currentUser }
    if (isEmpty(userkycDetails) || isEmpty(user)) {
      await initData()
      userkycDetails = storageService().getObject(storageConstants.KYC)
      user = storageService().getObject(storageConstants.USER)
      setCurrentUser(user)
      setUserKyc(userkycDetails)
    }
    let topTilte = ''
    if (userkycDetails.address.meta_data.is_nri) {
      if (isEdit) {
        topTilte = 'Edit indian address details'
      } else {
        topTilte = 'Indian address details'
      }
    } else {
      if (isEdit) {
        topTilte = 'Edit address details'
      } else {
        topTilte = 'Address details'
      }
    }
    setTitle(topTilte)
    let isNri = userkycDetails.address.meta_data.is_nri
    let selectedIndexResidentialStatus = 0
    if (isNri) {
      selectedIndexResidentialStatus = 1
    }
    let address_doc_type =
      selectedIndexResidentialStatus === 1 ? 'PASSPORT' : ''
    let formData = {
      address_doc_type:
        userkycDetails.address?.address_doc_type || address_doc_type,
      residential_status:
        residentialOptions[selectedIndexResidentialStatus].value || '',
    }
    setShowLoader(false)
    setFormData({ ...formData })
  }

  const handleClick = () => {
    let keysToCheck = ['address_doc_type', 'residential_status']
    let result = validateFields(form_data, keysToCheck)
    if (!result.canSubmit) {
      let data = { ...result.formData }
      setFormData(data)
      return
    }
    let userkycDetails = { ...userkyc };
    userkycDetails.nri_address.meta_data.mobile_number =
      form_data.mobile_number;
    userkycDetails.nri_address.meta_data.address_doc_type =
      form_data.address_doc_type;
    saveNriAddressDetails1(userkycDetails);
  };

  const saveNriAddressDetails1 = async (userKyc) => {
    setIsApiRunning(true);
    try {
      let item = {
        kyc: {
          nri_address: userKyc.nri_address.meta_data,
        },
      };
      const submitResult = await kycSubmit(item)
      if (!submitResult) return
      navigate(getPathname.addressDetails2, {
        state: {
          isEdit: isEdit,
          backToJourney: state.backToJourney,
        },
      })
    } catch (err) {
      console.log(err)
      toast(err.message || genericErrorMessage)
    } finally {
      setIsApiRunning(false)
    }
  }

  const handleChange = (name) => (event) => {
    let value = event.target ? event.target.value : event
    let formData = { ...form_data }
    if (name === 'residential_status') {
      formData[name] = residentialOptions[value].value
      if (formData[name] === 'NRI') {
        formData.address_doc_type = 'PASSPORT'
      }
    }
    formData[`${name}_error`] = ''
    setFormData({ ...formData })
  }

  const handleAddressDocType = (value) => {
    let formData = { ...form_data }
    formData['address_doc_type'] = value
    formData[`address_doc_type_error`] = ''
    setFormData({ ...formData })
  }

  return (
    <Container
      showLoader={showLoader}
      id="kyc-address-details1"
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      isApiRunning={isApiRunning}
      disable={isApiRunning || showLoader}
      handleClick={handleClick}
    >
      <div className="kyc-complaint-personal-details kyc-address-details">
        <div className="kyc-main-title">
          {title} <span>1/4</span>
        </div>
        <main>
          <div className={`input ${isApiRunning && `disabled`}`}>
            <RadioWithoutIcon
              error={form_data.residential_status_error ? true : false}
              helperText={form_data.residential_status_error}
              width="40"
              label="Residential status:"
              class="residential_status"
              options={residentialOptions}
              id="account_type"
              value={form_data.residential_status || ''}
              onChange={handleChange('residential_status')}
              disabled={isApiRunning}
            />
          </div>
          <div className="input">
            <div className="address-label">Address proof:</div>
            <div className="address-proof">
              {addressProofOptions.map((data, index) => {
                const selected = form_data.address_doc_type === data.value
                const disabled =
                  form_data.residential_status === 'NRI' || isApiRunning
                return (
                  <span
                    key={index}
                    className={`address-proof-option ${
                      selected && `selected`
                    } ${disabled && `disabled`}`}
                    onClick={() => {
                      if (!disabled) {
                        handleAddressDocType(data.value)
                      }
                    }}
                  >
                    {data.name}
                    {selected && (
                      <SVG
                        className="check-icon"
                        preProcessor={(code) =>
                          code.replace(
                            /fill=".*?"/g,
                            'fill=' + getConfig().primary
                          )
                        }
                        src={require(`assets/check_selected_blue.svg`)}
                      />
                    )}
                  </span>
                )
              })}
              {form_data.address_doc_type_error && (
                <div className="helper-text">
                  {form_data.address_doc_type_error}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Container>
  )
}

export default AddressDetails1
