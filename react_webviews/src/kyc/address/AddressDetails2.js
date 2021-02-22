import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import Toast from '../../common/ui/Toast'
import { getUrlParams, isEmpty, storageService } from '../../utils/validators'
import { getPinCodeData, submit } from '../common/api'
import Container from '../common/Container'
import { storageConstants, kycDocNameMapper } from '../constants'
import { initData } from '../services'
import { navigate as navigateFunc } from '../common/functions'

const AddressDetails2 = (props) => {
  const [showSkelton, setShowSkelton] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [pinTouched, setPinTouched] = useState(false)
  const [showError, setShowError] = useState(false)
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  const isDisabled = isEmpty(pincode) || isEmpty(address) || isApiRunning

  const getHelperText = (pincode) => {
    if (typeof pincode === 'string') {
      if (pincode.length === 0) {
        return 'This is required'
      }
      if (pincode.length < 6) {
        return 'Minlength is 6'
      }
      if (pincode.length > 6) {
        return 'Maxlength is 6'
      }
    }
  }

  const handleSubmit = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      setNomineeData()
      let item = {
        kyc: {
          address: kyc.address.meta_data,
          nomination: kyc.nomination.meta_data,
        },
      }
      const nomination_address = kyc?.nomination?.meta_data?.nominee_address
      item.kyc.nomination.address = nomination_address
      setIsApiRunning(true)
      await submit(item)
      if (backToJourney !== null) {
        navigate('/kyc/upload/address')
      } else {
        if (kyc?.address?.meta_data?.is_nri) {
          navigate('/kyc/nri-address-details-1', {
            isEdit,
          })
        } else {
          navigate('/kyc/journey')
        }
      }
    } catch (err) {
      setShowError(err.message)
      Toast(err.message, 'error')
    } finally {
      setIsApiRunning(false)
      setShowError(false)
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    switch (name) {
      case 'pincode':
        if (event.target.value.length <= 6) {
          if (!pinTouched) {
            setPinTouched(true)
          }
          setPincode(event.target.value)
        }
        break
      case 'address':
        setAddress(event.target.value)
        break
      default:
        break
    }
  }

  const fetchPincodeData = async () => {
    try {
      const data = await getPinCodeData(pincode)
      if (data.length === 0) {
        setKyc((userKyc) => ({
          ...userKyc,
          address: {
            ...userKyc.address,
            meta_data: {
              ...userKyc?.address?.meta_data,
              city: '',
              state: '',
              country: '',
            },
          },
        }))
      } else {
        setKyc((userKyc) => ({
          ...userKyc,
          address: {
            ...userKyc.address,
            meta_data: {
              ...userKyc?.address?.meta_data,
              city: data[0].district_name,
              state: data[0].state_name,
              country: 'INDIA',
            },
          },
        }))
        setCity(data[0].district_name)
        setState(data[0].state_name)
      }
    } catch (err) {
      Toast(err.message, 'error')
    }
  }

  const setNomineeData = () => {
    setKyc((kyc) => ({
      ...kyc,
      nomination: {
        ...kyc?.nomination,
        meta_data: {
          ...kyc?.nomination?.meta_data,
          city,
          state,
          pincode,
          addressline: address,
        },
      },
    }))
  }

  const urlParams = getUrlParams(props?.location?.search)

  const isEdit = urlParams?.isEdit
  const backToJourney = urlParams?.backToJourney
  let title = ''

  if (kyc?.address?.meta_data?.is_nri) {
    if (isEdit) {
      title = 'Edit indian address details'
    } else {
      title = 'Indian address details'
    }
  } else {
    if (isEdit) {
      title = 'Edit address details'
    } else {
      title = 'Address details'
    }
  }

  let total_pages = 2

  let address_proof = ''

  if (kyc?.address?.meta_data?.is_nri) {
    address_proof = 'Passport'
    total_pages = 4
  } else {
    address_proof = kycDocNameMapper[kyc?.address_doc_type]
  }

  const initialize = async () => {
    try {
      setShowSkelton(true)
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch (err) {
      setShowError(true)
    } finally {
      setShowSkelton(false)
    }
  }

  useEffect(() => {
    if (!kyc || isEmpty(kyc)) {
      initialize()
    }
  }, [])

  useEffect(() => {
    if (pincode.length === 6) {
      fetchPincodeData()
    }
  }, [pincode])

  return (
    <Container
      buttonTitle="SAVE AND CONTINUE"
      showSkelton={showSkelton}
      disable={isDisabled}
      hideInPageTitle
      handleClick={handleSubmit}
      isApiRunning={isApiRunning}
    >
      <section id="kyc-bank-kyc-address-details-2" className="page-body-kyc">
        <div className="title">{title}</div>
        <div className="sub-title">Address as per Driving Liscence</div>
        <form className="form-container">
          <TextField
            type="number"
            label="Pincode"
            name="pincode"
            className=""
            value={pincode}
            onChange={handleChange}
            margin="normal"
            helperText={pinTouched && getHelperText(pincode)}
            inputProps={{ minLength: 6, maxLength: 6 }}
            error={pinTouched && pincode.length !== 6}
            size="6"
            required
          />
          <TextField
            label="Address"
            name="address"
            className=""
            value={address}
            onChange={handleChange}
            margin="normal"
            multiline
          />
          <TextField
            label="City"
            name="city"
            className=""
            value={city}
            margin="normal"
            disabled
          />
          <TextField
            label="State"
            name="state"
            className=""
            value={state}
            margin="normal"
            disabled
          />
        </form>
      </section>
    </Container>
  )
}

export default AddressDetails2

// "use strict";

// angular
//   .module("plutusWebApp")
//   .controller("AddressDetails2Ctrl", AddressDetails2Ctrl);

// AddressDetails2Ctrl.$inject = [
//   "$scope",
//   "$rootScope",
//   "kycService",
//   "$state",
//   "$mdToast",
//   "Upload",
//   "$stateParams",
//   "storageService",
//   "appService"
// ];

// function AddressDetails2Ctrl(
//   $scope,
//   $rootScope,
//   kycService,
//   $state,
//   $mdToast,
//   Upload,
//   $stateParams,
//   storageService,
//   appService
// ) {
//   if ($rootScope.userKyc.address.meta_data.is_nri) {
//     if ($stateParams.isEdit) {
//       $scope.title = "Edit indian address details";
//     } else {
//       $scope.title = "Indian address details";
//     }
//   } else {
//     if ($stateParams.isEdit) {
//       $scope.title = "Edit address details";
//     } else {
//       $scope.title = "Address details";
//     }
//   }

//   $scope.stateParams = $stateParams;
//   $scope.nomination_address =
//     $rootScope.userKyc.nomination.meta_data.nominee_address;

//   $scope.docNameMapper = {
//     DL: "Driving license",
//     PASSPORT: "Passport",
//     AADHAAR: "Aadhaar card",
//     VOTER_ID_CARD: "Voter ID",
//     UTILITY_BILL: "Gas receipt",
//     LAT_BANK_PB: "Passbook"
//   };

//   $scope.total_pages = 2;
//   if ($rootScope.userKyc.address.meta_data.is_nri) {
//     $scope.address_proof = "Passport";
//     $scope.total_pages = 4;
//   } else {
//     $scope.address_proof =
//       $scope.docNameMapper[$rootScope.userKyc.address_doc_type];
//   }
//   $scope.checkPincode = function() {
//     $scope.hasPinError = false;

//     if (("" + $rootScope.userKyc.address.meta_data.pincode).length == 6) {
//       $scope.hasPinLoading = true;

//       kycService
//         .getPincodeData($rootScope.userKyc.address.meta_data.pincode)
//         .then(function(data) {
//           $scope.hasPinLoading = false;
//           if (data.length === 0) {
//             $scope.hasPinError = true;
//             $rootScope.userKyc.address.meta_data.city = "";
//             $rootScope.userKyc.address.meta_data.state = "";
//             $rootScope.userKyc.address.meta_data.country = "";
//           } else {
//             $rootScope.userKyc.address.meta_data.city = data[0].district_name;
//             $rootScope.userKyc.address.meta_data.state = data[0].state_name;
//             $rootScope.userKyc.address.meta_data.country = "India";
//           }
//         });
//     } else {
//       $rootScope.userKyc.address.meta_data.city = "";
//       $rootScope.userKyc.address.meta_data.state = "";
//       $rootScope.userKyc.address.meta_data.country = "";
//     }
//   };

//   $scope.setNomineeData = function() {
//     var keysToCopy = ["city", "state", "pincode", "addressline"];
//     if ($scope.is_address_same) {
//       for (var i = 0; i < keysToCopy.length; i++) {
//         $scope.nomination_address[keysToCopy[i]] =
//           $rootScope.userKyc.address.meta_data[keysToCopy[i]];
//       }
//     }
//   };
//   $scope.is_address_same = true;
//   $scope.handleCheckbox = function() {
//     $scope.setNomineeData();
//   };

//   $scope.goNext = function() {
//     $scope.sendCleverTapEvents("next");
//     $scope.setNomineeData();

//     $scope.indianaddressform2.$setSubmitted();

//     if ($scope.indianaddressform2.$invalid) {
//       return;
//     }

//     $scope.isApiRunning = true;
//     var item = {
//       kyc: {
//         address: $rootScope.userKyc.address.meta_data,
//         nomination: $rootScope.userKyc.nomination.meta_data
//       }
//     };

//     item.kyc.nomination.address = $scope.nomination_address;
//     kycService.submit(item).then(
//       function(data) {
//         $scope.isApiRunning = false;

//         if ($stateParams.backToJourney !== null) {
//           $state.go("kyc-upload-doc-address");
//         } else {
//           if ($rootScope.userKyc.address.meta_data.is_nri) {
//             $state.go("kyc-nri-address-details-1", {
//               isEdit: $stateParams.isEdit
//             });
//           } else {
//             $state.go("kyc-journey");
//           }
//         }
//       },
//       function(error) {
//         $scope.isApiRunning = false;
//       }
//     );
//   };
