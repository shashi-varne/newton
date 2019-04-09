import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function (message, type = 'default') {

  switch (type) {
    case 'success':
      toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: 'custom-toast',
        hideProgressBar: true,
        closeButton: false
      });
      break;
    case 'error':
      toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: 'custom-toast',
        hideProgressBar: true,
        closeButton: false
      });
      break;
    case 'warn':
      toast.warn(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: 'custom-toast',
        hideProgressBar: true,
        closeButton: false
      });
      break;
    case 'info':
      toast.info(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: 'custom-toast',
        hideProgressBar: true,
        closeButton: false
      });
      break;
    default:
      toast(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        className: 'custom-toast',
        hideProgressBar: true,
        closeButton: false
      });
  }
}
