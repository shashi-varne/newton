if (environment && environment == "iframe") {
    ("use strict");
  
    angular
      .module("plutusWebApp", [
        "LocalStorageModule",
        "coretemplates",
        "ui.router",
        "ngMaterial",
        "ngMessages",
        "ngFileUpload",
        "chart.js",
        "ngSanitize",
        "dndLists",
        "webcam",
        "ngRaven",
        "bootInfo"
      ])
      .config(config)
      .run([
        "$rootScope",
        "$mdToast",
        "$state",
        "$location",
        "$window",
        "$mdDialog",
        "kycService",
        "storageService",
        "loginService",
        "$mdBottomSheet",
        "platformService",
        "$q",
        "appService",
        "$mdSidenav",
        "bootInfo",
        function (
          $rootScope,
          $mdToast,
          $state,
          $location,
          $window,
          $mdDialog,
          kycService,
          storageService,
          loginService,
          $mdBottomSheet,
          platformService,
          $q,
          appService,
          $mdSidenav,
          bootInfo
        ) {
  // required
          var _event = {
            event_name: "hide_loader",
            properties: {
              journey: {
                name: "",
                trigger: "",
                journey_status: "",
                next_journey: ""
              }
            }
          };
  
          appService.sendEvent(_event);
  // required
          try {
            if ($rootScope.currentUser) {
              var payload = {
                Site: {
                  Name: $rootScope.currentUser.name,
                  Identity: $rootScope.currentUser.user_id,
                  Email: $rootScope.currentUser.email,
                  "MSG-email": true,
                  "MSG-push": true,
                  "MSG-sms": true
                }
              };
              clevertap.profile.push(payload);
            }
          } catch (e) {
            console.log(e);
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
  
          // web back pressed handler
          $rootScope.on_back_button_pressed_web = function () {
            // navigate
            $rootScope.$broadcast("backPressed");
            var fromState = $rootScope.fromState;
            var currentState = $rootScope.toState;
            var fromStateArray = ['payment-callback', 'nps-payment', 'sip-payment-callback', 'invest', 'reports', 'landing', '', 'new-mandate', 'otm-options', 'mandate-success', 'nps-mandate-success', 'nps-success', 'nps-sip', 'myaccount', 'confirmation-modal', 'page/callback', 'page-web-callback', 'nps-pran', 'recommendations', 'pause-request', 'kyc-journey'];
            switch (currentState) {
              case "fhc-summary":
                $state.go("root");
                break;
              case "mandate-success":
              case "nps-sip":
                sipDialog(ev);
                break;
              case "sip-payment-callback":
                if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                  $state.go("diyv2-money-control");
                } else {
                  $state.go("root");
                }
                break;
              case "payment-callback":
                if (fromStateArray.indexOf(fromState) !== -1) {
                  if (
                    $rootScope.currentUser.kyc_registration_v2 === "init" ||
                    $rootScope.currentUser.kyc_registration_v2 === "incomplete"
                  ) {
                    $state.go("kyc-journey");
                  } else {
                    if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                      $state.go("diyv2-money-control");
                    } else {
                      $state.go("root");
                    }
                  }
                }
                break;
              case "reports-redeemed":
                $state.go("reports");
                break;
              case "reports-switched":
                $state.go("reports");
                break;
              case "kyc-report":
              case "notification":
                if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                  $state.go("diyv2-money-control");
                } else {
                  $state.go("root");
                }
                break;
              case "kyc-journey":
                if (
                  $rootScope.currentUser.kyc_registration_v2 !== "submitted" &&
                  $rootScope.currentUser.kyc_registration_v2 !== "complete"
                ) {
                  kycIncompleteDialog();
                } else {
                  if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                    $state.go("diyv2-money-control");
                  } else {
                    $state.go("root");
                  }
                }
                break;
              case "esign-kyc":
              case "digilocker-success":
                backDialog();
                break;
              case "digilocker-failed":
                $state.go("kyc-journey", { show_aadhaar: true });
                break;
              case "esign-kyc-complete":
                if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                  $state.go("diyv2-money-control");
                } else {
                  $state.go("invest");
                }
                break;
              case "kyc-upload-doc-progress":
                if ($rootScope.toParams.toState) {
                  $state.go($rootScope.toParams.toState);
                } else {
                  $state.go("kyc-journey");
                }
                break;
              case "diy-fund-direct":
              case "diy-fund-info-direct":
              case 'diy-invest':
              case "diy-direct":
                if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                  $state.go("diyv2-money-control");
                } else {
                  $state.go("invest");
                }
                break;
              case "accountmerge-otp":
                var ev = document.createEvent("MouseEvents");
                accountMergeDialog(ev);
                break;
              case "account-linked":
                if ($rootScope.partner && $rootScope.partner.code === 'moneycontrol') {
                  var message = JSON.stringify({
                    type: "iframe_close"
                  });
                  appService.sendEvent(message);
                  storageService.clear();
                } else {
                  $state.go("logout");
                }
                break;
              case "kyc-journey":
              case "campaign-callback":
              case "invest":
              case "reports":
              case "page-web-callback":
              case "page/callback":
  
              case "nps-payment":
              case "nps-mandate-success":
              case "nps-success":
                $state.go("root");
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
              case 'diyv2-money-control':
                var message = JSON.stringify({
                  type: "iframe_close"
                });
                appService.sendEvent(message);
                storageService.clear();
                break;
              case 'accountmerge':
                if ($rootScope.partner.code === 'moneycontrol') {
                  $window.history.go(-2);
                }// check later
                // navigate kyc home
                break;
              default:
                if (appService.backMapper(currentState)) {
                  $state.go(appService.backMapper(currentState));
                } else {
                  $window.history.back();
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
                var message = JSON.stringify({
                  type: "iframe_close"
                });
  
                appService.sendEvent(message);
              },
              function () {
                $mdDialog.cancel();
              }
            );
          }
  
          var listenerCount = 0;
          function showConfirm() {
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
                  $rootScope.isLoggedIn = false;
                  storageService.clear();
                  localStorage.clear();
  
                  $location.path("/login");
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
  
          var partnerEvents = function (res) {
            switch (res.type) {
              case "back_pressed":
                $rootScope.handleIframeback();
                break;
  
              default:
                break;
            }
          };
  
          appService.listenPartnerEvents(partnerEvents);
  
          $rootScope.handleIframeback = function () {
            var backEnabledPages = [
              "funds",
              "reports",
              "withdraw",
              "withdraw-reason",
              "payment-callback",
              "sip-payment-callback",
              "page-callback-web",
              "new-mandate"
            ];
  
            if (backEnabledPages.indexOf($rootScope.toState) !== -1) {
              var message = JSON.stringify({
                type: "iframe_close"
              });
              if($rootScope.partner.code === 'moneycontrol' && ["payment-callback","sip-payment-callback"].includes($rootScope.toState)) {
                $rootScope.on_back_button_pressed_web();
              } else {
                appService.sendEvent(message);
              }
            } else {
              $rootScope.on_back_button_pressed_web();
            }
          };
        }
      ]);
  }
  