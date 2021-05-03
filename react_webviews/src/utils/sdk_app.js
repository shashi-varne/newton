
import { getConfig, isNpsOutsideSdk } from "utils/functions";
import { storageService } from "utils/validators";
import { nativeCallback } from "./native_callback";

const isLoggedIn = storageService().get("currentUser");

export const checkBeforeRedirection = (fromState, toState) => {
  if (fromState !== '' && toState === '/prepare') {
    nativeCallback({ action: "exit_web" });
  }

  if (storageService().get('native') && (toState === '/' || toState === '/invest')) {
    nativeCallback({ action: "exit_web" });
  }
};

export const checkAfterRedirection = (fromState, toState) => {
  if (toState === "/" || isNpsOutsideSdk(toState, fromState)) {
    nativeCallback({ action: "take_back_button_control" });
    nativeCallback({ action: "clear_history" });
  } else {
    nativeCallback({ action: "reset_back_button_control" });
  }
}
        
        $rootScope.$on("$stateChangeSuccess", function (
          event,
          toState,
          toParams,
          fromState,
          fromParams
        ) {
          if (!$rootScope.partner) {
            $rootScope.partner = platformService.getPlatform();
          }
          $(".layout-container").animate({ scrollTop: 0 }, 200);
          $rootScope.local_front_image = {};
          $rootScope.local_back_image = {};
          $rootScope.nri_front_image = {};
          $rootScope.nri_back_image = {};
          $rootScope.showPageLoader = false;

         
        });


        // native back pressed handler
        var on_back_button_pressed = function () {
          // navigate

          $rootScope.$broadcast("backPressed");
          var fromState = $rootScope.fromState;
          var currentState = $rootScope.toState;
          var fromStateArray = ['payment-callback', 'nps-payment', 'sip-payment-callback', 'invest', 'reports', 'landing', '', 'new-mandate', 'otm-options', 'mandate-success', 'nps-mandate-success', 'nps-success', 'nps-sip', 'myaccount', 'confirmation-modal', 'page/callback', 'page-web-callback', 'pause-request', 'kyc-journey'];

          switch (currentState) {
            case "payment-options":
              if (fromState === "compliant-bank") {
                $state.go("landing");
              } else {
                $window.history.back();
              }
              break;
            case "confirmation-modal":
              if (fromStateArray.indexOf(fromState) !== -1) {
                callbackWeb.clear_history();
              }
              break;
            case "nps-sip":
              sipDialog(ev);
              break;
            
            case "sip-payment-callback":
              $state.go("landing");
              break;
            case "payment-callback":
              if (fromStateArray.indexOf(fromState) !== -1) {
                if (
                  $rootScope.currentUser.kyc_registration_v2 === "init" ||
                  $rootScope.currentUser.kyc_registration_v2 === "incomplete"
                ) {
                  $state.go("kyc-journey");
                } else {
                  callbackWeb.clear_history();
                  $state.go("landing");
                }
              }
              break;
           
            case "kyc-report":
            case "notification":
              $state.go("landing");
              break;
           case "add-bank":
              if (storageService.get('native')) {
                callbackWeb.user_exit();
              } else {
                $state.go("myaccount");
              }
              break;
            case "digilocker-failed":
              $state.go("kyc-journey", { show_aadhaar: true });
              break;
            case "esign-kyc-complete":
              if (storageService.get('native')) {
                callbackWeb.user_exit();
              } else {
                $state.go("invest");
              }
              break;
            case "kyc-upload-doc-progress":
              if ($rootScope.toParams.toState) {
                if (storageService.get('native')) {
                  callbackWeb.user_exit();
                } else {
                  $state.go($rootScope.toParams.toState);
                }
              } else {
                $state.go("kyc-journey");
              }
              break;
            case "reports-switched":
              $state.go("reports");
              break;
            case "diy-fund-direct":
            case "diy-fund-info-direct":
            case 'diy-invest':
            case "diy-direct":
            case "risk-recommendations-error":
              $state.go("landing");
              break;
            case "diyv2-money-control":
              callbackWeb.user_exit();
              break;
            case "accountmerge-otp":
              var ev = document.createEvent("MouseEvents");
              accountMergeDialog(ev);
              break;
            case "account-linked":
              callbackWeb.logout();
              break;
            case "campaign-callback":
            case "invest":
            case "reports":
            case "page/callback":
            case "nps-payment":
            case "nps-mandate-success":
            case "nps-success":
            case "page-web-callback":
              if (storageService.getObject("nps_additional_details_required")) {
                if (appService.isNpsOutsideSdk($rootScope.partner,
                  $rootScope.toState, $rootScope.fromState)) {
                  callbackWeb.clear_history();
                }
                $state.go("nps-sdk");
              } else {
                callbackWeb.clear_history();
                $state.go("landing");
              }
              break;
            case 'nps-investments':
              if (!appService.isNpsOutsideSdk($rootScope.partner,
                $rootScope.toState, $rootScope.fromState)) {
                $state.go('landing');
              } else {
                callbackWeb.user_exit();
              }
              break;
            case 'pause-request':
              $state.go('reports-sip');
              break;
            case 'reports-sipdetails':
              $state.go('reports-sip');
              break;
            case 'reports-sip':
              $state.go('reports');
              break;
            default:
              if ($rootScope.toState === "landing" || appService.isNpsOutsideSdk($rootScope.partner,
                $rootScope.toState, $rootScope.fromState)) {
                callbackWeb.user_exit();
              } else {
                if ($window.history.length > 1) {
                  if (appService.backMapper(currentState)) {
                    $state.go(appService.backMapper(currentState));
                  } else {
                    $window.history.back();
                  }
                } else {
                  callbackWeb.user_exit();
                }
              }
          }
        };

        // Account Merge Back Dialog
        function accountMergeDialog(ev) {
          var confirm = $mdDialog
            .confirm()
            .title("Are you sure you want to go back?")
            .ariaLabel("Lucky day")
            .targetEvent(ev)
            .ok("ENTER OTP")
            .cancel("LEAVE");

          $mdDialog.show(confirm).then(
            function () {
              $mdDialog.cancel();
            },
            function () {
              $window.history.back();
            }
          );
        }

        // SIP dialog
        function sipDialog(ev) {
          var confirm = $mdDialog
            .confirm()
            .title(
              "Are you sure, you want to keep the current selected dates for your next SIP debits?"
            )
            .ariaLabel("Lucky day")
            .targetEvent(ev)
            .ok("Yes")
            .cancel("No");

          $mdDialog.show(confirm).then(
            function () {
              if (
                $rootScope.currentUser.kyc_registration_v2 === "init" ||
                $rootScope.currentUser.kyc_registration_v2 === "incomplete"
              ) {
                $state.go("kyc-journey");
              } else {
                $rootScope.successDialog(ev);
              }
            },
            function () {
              $mdDialog.cancel();
            }
          );
        }

        backDialog = function () {
          $mdDialog
            .show({
              controller: function ($scope, $state, $rootScope) {
                $scope.discription =
                  "You are almost there, do you really want to go back?";
                $scope.confirmText = "YES";
                $scope.cancelText = "NO";
                $scope.cancel = function () {
                  $mdDialog.cancel();
                };

                $scope.confirm = function () {
                  $state.go("kyc-journey");
                };
              },

              templateUrl: "components/modal/genericConfirmDialog.html",
              parent: angular.element(document.body),
              clickOutsideToClose: true,
              fullscreen: false
            })
            .then(
              function () { },

              function () { }
            );
        };


        var listenerCount = 0;
        function showConfirm() {
          if (storageService.get('native')) {
            return;
          }
          listenerCount++;
          var confirm = $mdDialog
            .confirm()
            .title("No internet connection!")
            .textContent("Would you like to exit app?")
            .ariaLabel("nointernet")
            .ok("Exit")
            .cancel("Retry");
          if (listenerCount == 1) {
            $mdDialog.show(confirm).then(
              function () {
                listenerCount--;
                callbackWeb.logout();
              },
              function () {
                listenerCount--;
                if (navigator.onLine) {
                  location.reload();
                } else {
                  showConfirm();
                }
              }
            );
          }
        }

        if ($rootScope.partner && $rootScope.partner.code != "lvb") {
          window.addEventListener("offline", showConfirm);
        }
      }
    ]);
}
