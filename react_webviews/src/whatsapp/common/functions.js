import { storageService } from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {
  this.navigate = navigate.bind(this);

  this.setState({
    productName: getConfig().productName,
  });

  let screen_name = this.state.screen_name || '';

  if (screen_name === 'confirm_number') {
    try {
      this.setState({
        show_loader: true,
      });

      const res = await Api.get('/api/kyc/ex/contact/verified/mobile');

      if (res.pfwresponse.status_code === 200) {
        const resultData = res.pfwresponse.result;

        const { mobile_number: mobile } = resultData;
        storageService().set('mobile', mobile);

        this.setState({
          mobile: (mobile && mobile.slice(3)) || '',
          contact_id: resultData.contact_id || '',
        });

        if (resultData.verification_required || !resultData.mobile_number) {
          this.navigate('edit-number');
        }
      } else {
        const resultData = res.pfwresponse.result;
        this.setState({
          show_loader: false,
        });
        toast(resultData.error || resultData.message || 'Something went wrong');
      }
    } catch (err) {
      this.setState({
        show_loader: false,
      });
      toast('Something went wrong');
    }
  }

  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get('/api/iam/myaccount');
    const resultData = res.pfwresponse.result || {};

    if (res.pfwresponse.status_code === 200) {
      const { mobile, user_id } = resultData.user;

      storageService().set('user_id', user_id);
      storageService().set('mobile', mobile);

      if (!this.state.mobile) {
        this.setState({
          mobile: (mobile && mobile.slice(3)) || '',
        });
      }

      this.setState({
        productName: getConfig().productName,
        user_id: user_id,
      });
      this.setState({
        show_loader: false,
      });
    } else {
      this.setState({
        show_loader: false,
      });
      toast(resultData.error || resultData.message || 'Something went wrong');
    }
  } catch (err) {
    console.log(err);
    this.setState({
      show_loader: false,
    });
    toast('Something went wrong');
  }

  nativeCallback({ action: 'take_control_rest' });
}

export async function getContact() {
  // let user_id = storageService().get('user_id');
  let mobile = storageService().get('mobile');

  try {
    this.setState({
      show_loader: true,
    });

    const res = await Api.get(`api/communication/contact/get?contact_value=${mobile}`);

    if (res.pfwresponse.status_code === 200) {
      const resultData = res.pfwresponse.result.contact_details;
      const { id } = resultData;

      this.setState({
        show_loader: false,
        // contact_id: id,
      });

      return id;
    } else {
      const resultData = res.pfwresponse.result;
      this.setState({
        show_loader: false,
      });
      toast(resultData.error || resultData.message || 'Something went wrong');
    }
  } catch (err) {
    this.setState({
      show_loader: false,
    });
    toast('Something went wrong');
  }
}

export function navigate(pathname, data = {}) {
  this.props.history.push({
    pathname: pathname,
    search: data.searchParams || getConfig().searchParams,
    params: data.params || {},
  });
}
