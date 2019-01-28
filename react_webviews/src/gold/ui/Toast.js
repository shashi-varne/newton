// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';
import { nativeCallback } from 'utils/native_callback';

export default function (message, type = 'default') {

  nativeCallback({
    action: 'show_toast',
    message: {
      message: message
    }
  });
  // switch (type) {
  //   case 'success':
  //     toast.success(message, {
  //       position: toast.POSITION.BOTTOM_CENTER
  //     });
  //     break;
  //   case 'error':
  //     toast.error(message, {
  //       position: toast.POSITION.BOTTOM_CENTER
  //     });
  //     break;
  //   case 'warn':
  //     toast.warn(message, {
  //       position: toast.POSITION.BOTTOM_CENTER
  //     });
  //     break;
  //   case 'info':
  //     toast.info(message, {
  //       position: toast.POSITION.BOTTOM_CENTER
  //     });
  //     break;
  //   default:
  //     toast(message, {
  //       position: toast.POSITION.BOTTOM_CENTER
  //     });
  // }
}
