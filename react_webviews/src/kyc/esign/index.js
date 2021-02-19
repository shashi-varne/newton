//     $rootScope.loadingView = false;
//     $scope.redirectUrl = encodeURIComponent(
//         $location.protocol() + "://" + $location.host() + ":" + $location.port() +
//         "/#!/digio/callback?is_secure=" + storageService.get("is_secure")
//     );
//     $scope.proceed = function () {
//         $rootScope.loadingView = true;
//         $rootScope.loadinMessage = "Loading... It may take a while, kindly hold on";
//         kycService.getEsignlink($scope.redirectUrl).then(function (data) {
//             if (!callbackWeb.isWeb() && storageService.get('native')) {
//                 var nativedata = {
//                     url: $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#!/kyc/journey?is_secure=' + storageService.get("is_secure"),
//                     message: 'You are almost there, do you really want to go back?'
//                 }
//                 if (isMobile.apple.device) {
//                     callbackWeb.show_top_bar({ title: 'eSign KYC' })
//                 }
//                 callbackWeb.take_back_button_control(nativedata);
//             } else if (!callbackWeb.isWeb()) {
//                 var redirectData = {
//                     show_toolbar: false,
//                     icon: 'back',
//                     dialog: {
//                         message: 'You are almost there, do you really want to go back?',
//                         action: [{
//                             action_name: 'positive',
//                             action_text: 'Yes',
//                             action_type: 'redirect',
//                             redirect_url: encodeURIComponent($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#!/kyc/journey?is_secure=' + storageService.get("is_secure"))
//                         }, {
//                             action_name: 'negative',
//                             action_text: 'No',
//                             action_type: 'cancel',
//                             redirect_url: ''
//                         }]
//                     },
//                     data: {
//                         type: 'server'
//                     }
//                 };
//                 if (isMobile.apple.device) {
//                     redirectData.show_toolbar = true;
//                 }

//                 callbackWeb.third_party_redirect(redirectData);
//             }
//             window.location.href = data.esign_link;
//         }, function (error) {
//             $rootScope.loadingView = false;
//             if (error.pfwstatus_code == 200) {
//                 if (error.pfwresponse.status_code != 200) {
//                     $mdToast.show(
//                         $mdToast.simple()
//                             .textContent(error.pfwresponse.result.message || error.pfwresponse.result.error)
//                             .hideDelay(3000)
//                             .parent(angular.element(document.body))
//                     );
//                 }
//             }
//         });
//     }

import React from 'react'
import { getConfig } from '../../utils/functions'
import Container from '../common/Container'

const Esign = () => {
  const productName = getConfig().productName
  const steps = [
    {
      name: 'ic_verify_otp',
      description: '1. Verify mobile and enter Aadhaar number',
    },
    {
      name: 'ic_esign_otp',
      description: '1. Verify mobile and enter Aadhaar number',
    },
    {
      name: 'ic_esign_done',
      description: '1. Verify mobile and enter Aadhaar number',
    },
  ]
  return (
    <Container noFooter hideInPageTitle>
      <section id="kyc-esign">
        <div className="title">eSign KYC</div>
        <img
          src={require(`assets/${productName}/ic_esign_kyc.svg`)}
          className="digi-image"
          alt=""
        />
        <div className="esign-desc">
          eSign is an online electronic signature service by UIDAI to facilitate{' '}
          <strong>Aadhaar holder to digitally sign</strong> documents.
        </div>
        <div className="subtitle">How to eSign documents</div>
        <div className="esign-steps">
          {steps.map(({ name, description}) => (
            <div className="step" key={name}>
              <img src={require(`assets/${productName}/${name}.svg`)} alt={name} className="step-icon" />
              <div className="step-text">
                {description}
              </div>
            </div>
          ))}
        </div>
        <footer className="bottom">
          <div className="bottom-text">
            Initiative By
          </div>
          <img className="bottom-image" alt="bottom image" src={require(`assets/ic_gov_meit.svg`)} />
        </footer>
      </section>
    </Container>
  )
}

export default Esign

{
  /* <section class="page home">
    <div class="page-body-kyc ekyc">
        <div class="page-title"> eSign KYC </div>
        <div class="body-image-container">
            <img class="digi-image" ng-src="{{partner.assets.ic_esign_kyc}}" />
        </div>
        <div class="esign-desc">
            eSign is an online electronic signature service by UIDAI to facilitate <strong>Aadhaar holder to digitally
                sign</strong> documents.
        </div>
        <div class="page-subtitle">How to eSign documents</div>
        <div class="esign-steps">
            <div class="step">
                <div class="icon-container">
                    <img ng-src="{{partner.assets.ic_verify_otp}}" />
                </div>
                <div class="step-text">
                    1. Verify mobile and enter Aadhaar number
                </div>
            </div>
            <div class="step">
                <div class="icon-container">
                    <img ng-src="{{partner.assets.ic_esign_otp}}" />
                </div>
                <div class="step-text">
                    2. Enter OTP recieved on your Aadhaar linked mobile number
                </div>
            </div>
            <div class="step">
                <div class="icon-container">
                    <img src="{{partner.assets.ic_esign_done}}" />
                </div>
                <div class="step-text">
                    3. e-Sign is successfully done
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="bottom-text">
                Initiative by
            </div>
            <div class="bottom-image">
                <img src="../assets/img/ic_gov_meit.svg" />
            </div>
        </div>
        <div class="page-footer">
            <md-button ng-click="proceed()" ng-class="{'button-loading' : isApiRunning}"
                class="md-raised md-primary cta-btn">Proceed</md-button>
        </div>
    </div>
</section> */
}
