if (environment && environment == "web") {
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
        "bootInfo",
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
        "whatsappService",
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
          bootInfo,
          whatsappService
        ) {
  
          if ($rootScope.finity) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function () {
              runHotjar();
              runGoogleAds();
            };
            script.src = "assets/js/utils.js";
            head.appendChild(script);
          }
  
        //   try {
        //     if ($rootScope.currentUser) {
        //       var payload = {
        //         Site: {
        //           Name: $rootScope.currentUser.name,
        //           Identity: $rootScope.currentUser.user_id,
        //           Email: $rootScope.currentUser.email,
        //           "MSG-email": true,
        //           "MSG-push": true,
        //           "MSG-sms": true
        //         }
        //       };
        //       clevertap.profile.push(payload);
        //     }
        //   } catch (e) {
        //     console.log(e);
        //   }
          $rootScope.$on("$stateChangeStart", function (
            event,
            toState,
            toParams,
            fromState,
            fromParams
          ) {
           
            if ($rootScope.isLoggedIn) {
              if (toState.name == "login" && storageService.get("deeplink_url")) {
                window.location.href = decodeURIComponent(
                  storageService.get("deeplink_url")
                );
              } else {
                if (
                  toState.name == "partner-landing" ||
                  toState.name == "login" ||
                  toState.name == "register" ||
                  toState.name == "forgotpassword" ||
                  toState.name == "mobile-otp"
                ) {
                  if (!fromState.name) {
                    $location.path("/");
                  } else {
                    $location.path(fromState.url);
                  }
                }
              }
            }
          });
  
  
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
              case "nps-sip":
                sipDialog(ev);
                break;
              case "sip-payment-callback":
                $state.go("root");
                break;
              case "payment-callback":
                if (fromStateArray.indexOf(fromState) !== -1) {
                  if (
                    $rootScope.currentUser.kyc_registration_v2 === "init" ||
                    $rootScope.currentUser.kyc_registration_v2 === "incomplete"
                  ) {
                    $state.go("kyc-journey");
                  } else {
                    $state.go("root");
                  }
                }
                break;
              case "kyc-report":
              case "notification":
                $state.go("root");
                break;
              case "add-bank":
                $state.go("myaccount");
                break;
              case "digilocker-failed":
                $state.go("kyc-journey", { show_aadhaar: true });
                break;
              case "esign-kyc-complete":
                $state.go("invest");
                break;
              case "kyc-upload-doc-progress":
                if ($rootScope.toParams.toState) {
                  $state.go($rootScope.toParams.toState);
                } else {
                  $state.go("kyc-journey");
                }
                break;
              case "reports-switched":
                $state.go("reports");
                break;
              
              case "account-linked":
                $state.go("logout");
                break;
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
              case 'diy-fund-info-direct':
                $state.go('landing');
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
                if (
                  $rootScope.currentUser.kyc_registration_v2 === "init" ||
                  $rootScope.currentUser.kyc_registration_v2 === "incomplete"
                ) {
                  $state.go("kyc-journey");
                } else {
                  $state.go("root");
                }
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
  
          $rootScope.$watch(
            $rootScope.getWindowDimensions,
            function (newValue, oldValue) {
              $rootScope.isMobileDevice = isMobile.any || window.innerWidth < 767;
            },
            true
          );
  
          w.on("resize", function () {
            $rootScope.$apply();
          });
  // need to confirm for lvb
          if ($rootScope.partner && $rootScope.partner.code != "lvb") {
            window.addEventListener("offline", showConfirm);
          }
        }
      ]);
  }
  