import { storageService, formatAmountInr } from "utils/validators";
import { getConfig } from "utils/functions";

export function navigate(pathname, data, redirect) {
  if (redirect) {
    this.props.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
    });
  } else {
    this.props.history.push({
      pathname: `/nps/${pathname}`,
      search: data?.searchParams || getConfig().searchParams,
      state: { graphData: data },
    });
  }
}

export function formCheckUpdate (keys_to_check, form_data) {
    if (!form_data) {
        form_data = this.state.form_data;
    }

    let keysMapper = {
        "pan": 'pan',
        "pran": 'pran',
        "dob": 'dob',
        "mobile_no": 'mobile no.'
    }

    let selectTypeInput = []

    for (var i = 0; i < keys_to_check.length; i++) {
        let key_check = keys_to_check[i];
        let first_error = selectTypeInput.indexOf(key_check) !== -1 ? 'Please select ' : 'Please enter ';
        if (!form_data[key_check]) {
            form_data[key_check + '_error'] = first_error + keysMapper[key_check];
        }
    }

    this.setState({
        form_data: form_data
    })
}