import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {

    this.navigate = navigate.bind(this);
    this.openInBrowser = openInBrowser.bind(this);

    nativeCallback({ action: 'take_control_reset' });

    this.setState({
        productName: getConfig().productName,
    }, () => {
        if (!this.state.get_lead) {
            this.onload();
        }
    })
}


export function openInBrowser(url) {
    nativeCallback({
        action: 'open_in_browser',
        message: {
            url: url
        }
    });
}

export function navigate(pathname, data = {}) {

    if (this.props.edit || data.edit) {
        this.props.history.replace({
            pathname: pathname,
            search: getConfig().searchParams
        });
    } else {
        this.props.history.push({
            pathname: pathname,
            search: data.searchParams || getConfig().searchParams,
            params: data.params || {}
        });
    }

}