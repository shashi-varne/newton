
// function AddressDetails1Ctrl(
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

//   $scope.residentialStatusOptions = ["Indian", "NRI"];
//   $scope.selectedIndexResidentialStatus = -1;
//   $scope.total_pages = 2;
//   $scope.handleChangeResidentialStatus = function (index) {
//     $scope.residentialError = "";
//     $scope.selectedIndexResidentialStatus = index;
//     $rootScope.userKyc.address.meta_data.is_nri = false;
//     $scope.total_pages = 2;
//     if (index === 1) {
//       $rootScope.userKyc.address.meta_data.is_nri = true;
//       $scope.selectedIndexAddressProof = 1;
//       $scope.total_pages = 4;
//       $scope.handleChangeAddressProof(1);
//     } else {
//       $scope.handleChangeAddressProof(-1);
//     }
//   };

//   $scope.addressProofOptions = [
//     { name: "Driving license", value: "DL" },
//     { name: "Passport", value: "PASSPORT" },
//     { name: "Aadhaar card", value: "AADHAAR" },
//     { name: "Voter ID", value: "VOTER_ID_CARD" },
//     { name: "Gas receipt", value: "UTILITY_BILL" },
//     { name: "Passbook", value: "LAT_BANK_PB" }
//   ];

//   $scope.getRadioValues = function () {
//     if ($rootScope.userKyc.address.meta_data.is_nri == true) {
//       $scope.selectedIndexResidentialStatus = 1;
//     } else if ($rootScope.userKyc.address.meta_data.is_nri == false) {
//       $scope.selectedIndexResidentialStatus = 0;
//     }

//     for (var j = 0; j < $scope.addressProofOptions.length; j++) {
//       if (
//         $scope.addressProofOptions[j].value.toLowerCase() ===
//         ($rootScope.userKyc.address_doc_type || "").toLowerCase()
//       ) {
//         $scope.selectedIndexAddressProof = j;
//         $scope.address_doc_type =
//           $scope.addressProofOptions[$scope.selectedIndexAddressProof].value;
//       }
//     }

//     if ($rootScope.userKyc.address.meta_data.is_nri) {
//       $scope.selectedIndexResidentialStatus = 1;
//       $scope.selectedIndexAddressProof = 1;
//       $scope.total_pages = 4;
//       $scope.address_doc_type = 'PASSPORT';
//     }
//   };

//   $scope.getRadioValues();

//   $scope.handleChangeAddressProof = function (index) {
//     $scope.addressError = "";
//     $scope.selectedIndexAddressProof = index;
//     if (index < 0) {
//       $scope.address_doc_type = "";
//       return;
//     }
//     $scope.address_doc_type = $scope.addressProofOptions[index].value;
//   };

//   $scope.goNext = function () {
//     $scope.sendCleverTapEvents("next");
//     var canSubmitForm = true;

//     if ($scope.selectedIndexResidentialStatus < 0) {
//       $scope.residentialError = "This is required.";
//       canSubmitForm = false;
//     }
//     if (!$scope.address_doc_type) {
//       $scope.addressError = "This is required.";
//       canSubmitForm = false;
//     }

//     if ($rootScope.userKyc.address.meta_data.is_nri) {
//       if ($scope.address_doc_type !== 'PASSPORT') {
//         $scope.addressError = "This is required.";
//         canSubmitForm = false;
//       }
//     }

//     if (!canSubmitForm) {
//       return;
//     }

//     $scope.isApiRunning = true;

//     var address = $rootScope.userKyc.address.meta_data;
//     if (!$rootScope.userKyc.address.meta_data.is_nri) {
//       address.address_doc_type = $scope.address_doc_type;
//     }

//     kycService
//       .submit({
//         kyc: {
//           address: address
//         }
//       })
//       .then(
//         function (data) {
//           $scope.isApiRunning = false;
//           $rootScope.currentUser.name = data.kyc.pan.meta_data.name;
//           $state.go("kyc-address-details-2", {
//             backToJourney: $stateParams.backToJourney,
//             isEdit: $stateParams.isEdit
//           });
//         },
//         function (response) {
//           $scope.isApiRunning = false;
//           if (response.hasOwnProperty("pfwresponse")) {
//             var status = response.pfwresponse.status_code;
//             switch (status) {
//               case 403:
//                 $mdToast.show(
//                   $mdToast
//                     .simple()
//                     .textContent(response.pfwresponse.result.error)
//                     .hideDelay(3000)
//                     .parent(angular.element(document.body))
//                 );
//                 break;
//               default:
//                 $mdToast.show(
//                   $mdToast
//                     .simple()
//                     .textContent(response.pfwresponse.result.error || response.pfwresponse.result.message || "Server error")
//                     .hideDelay(3000)
//                     .parent(angular.element(document.body))
//                 );
//                 break;
//             }
//           }
//         }
//       );
//   };

import React from 'react'
import Container from '../common/Container'
import RadioWithoutIcon from '../../common/ui/RadioWithoutIcon'

const AddressDetails1 = (props) => {
  const [showSkelton, setShowSkelton] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  return (
    <Container showSkelton={showLoader} buttonTitle="SAVE AND CONTINUE" disable={isApiRunning} hideInPageTitle handleClick={handleSubmit} isApiRunning={isApiRunning}>

    </Container>
  )
}

export default AddressDetails1

/**
 * <section
  class="page home"
  ng-class="{paddingBottom : '!isStartKyc', paddingBottomRemove : 'isStartKyc'}"
>
  <div class="page-body-kyc">
    <div class="title">
      {{ title }}
      <div class="page-progress">1/{{ total_pages }}</div>
    </div>
    <form
      class="form row"
      name="indianaddressform1"
      ng-submit="submitPan()"
      autocomplete="off"
    >
      <div class="input-select-radio-button-container">
        <label class="label-input">Residential status:</label>
        <div id="select-radio-buttons">
          <div
            ng-repeat="item in residentialStatusOptions track by $index"
            class="radio-btn-group"
            ng-click="handleChangeResidentialStatus($index)"
          >
            <div
              class="ContainerWrapper RadioButton unchecked"
              data-value="{this.props.value}"
              ng-class="{'checked': selectedIndexResidentialStatus === $index}"
            >
              <div
                class="RadioButtonTiles"
                ng-class="{'RadioLabelChecked': selectedIndexResidentialStatus === $index}"
              >
                {{ item }}
                <div
                  ng-if="selectedIndexResidentialStatus === $index"
                  class="checkmark"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div ng-if="residentialError" class="validation-errors-select">
          {{ residentialError }}
        </div>
      </div>

      <div class="input-select-radio-button-container">
        <label class="label-input">Address proof:</label>
        <div id="select-radio-buttons">
          <div
            ng-repeat="item in addressProofOptions track by $index"
            class="radio-btn-group"
            ng-click="handleChangeAddressProof($index)"
          >
            <div
              class="ContainerWrapper RadioButton unchecked"
              data-value="{this.props.value}"
              ng-class="{'checked': selectedIndexAddressProof === $index}"
            >
              <div
                class="RadioButtonTiles"
                ng-class="{'RadioLabelChecked': selectedIndexAddressProof === $index,
                'RadioButtonDisabled': userKyc.address.meta_data.is_nri && 
               $index !==1}"
              >
                {{ item.name }}
                <div
                  ng-if="selectedIndexAddressProof === $index"
                  class="checkmark"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div ng-if="addressError" class="validation-errors-select">
          {{ addressError }}
        </div>
      </div>
    </form>

    <div class="page-footer">
      <div class="server-errors">
        <div ng-show="serverValidationError == true">
          {{ serverValidationMessage }}
        </div>
      </div>
      <md-button
        ng-disabled="selectedIndexResidentialStatus === '' || isApiRunning"
        class="cta-button md-raised md-primary"
        ng-click="goNext()"
        ng-class="{'button-loading' : isApiRunning}"
        >SAVE AND CONTINUE</md-button
      >
    </div>
  </div>
</section>

 */