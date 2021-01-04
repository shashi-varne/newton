export function setTermInsData(termData) {

    window.sessionStorage.setItem('excluded_providers', '');
    window.sessionStorage.setItem('required_providers', '');
    window.sessionStorage.setItem('quoteSelected', '');
    window.sessionStorage.setItem('quoteData', '');
    let pathname = '';
    let resumeFlagTerm = false;

    if (!termData.error) {
      let insurance_apps = termData.insurance_apps;
      let application, required_fields;
      required_fields = termData.required;
      if (insurance_apps.complete.length > 0) {
        application = insurance_apps.complete[0];
        pathname = 'report';
      } else if (insurance_apps.failed.length > 0) {
        application = insurance_apps.failed[0];
        pathname = 'report';
      } else if (insurance_apps.init.length > 0) {
        application = insurance_apps.init[0];
        resumeFlagTerm = true;
        pathname = 'journey';
      } else if (insurance_apps.submitted.length > 0) {
        resumeFlagTerm = true;
        application = insurance_apps.submitted[0];
        pathname = 'journey';
      } else {
        // intro
        pathname = 'intro';
      }

      if (application) {
        let data = {
          application: application,
          required_fields: required_fields
        }
        window.sessionStorage.setItem('cameFromHome', true);
        window.sessionStorage.setItem('homeApplication', JSON.stringify(data));
        pathname = 'journey';
        this.setState({
          termApplication: application
        })
      }
    } else {
      pathname = 'intro';
    }

    let fullPath = '/group-insurance/term/' + pathname;

    this.setState({
      redirectTermPath: fullPath
    })

    return resumeFlagTerm;

  }