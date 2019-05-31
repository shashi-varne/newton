import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function (message, type = 'default') {
  console.log(message)
  switch (type) {
    case 'success':
      if (!toast.isActive('success')) {
        toast.success(message, {
          toastId: 'success',
          position: toast.POSITION.BOTTOM_CENTER,
          className: 'custom-toast',
          hideProgressBar: true,
          closeButton: false
        });
      }
      break;
    case 'error':
      if (!toast.isActive('error')) {
        toast.error(message, {
          toastId: 'error',
          position: toast.POSITION.BOTTOM_CENTER,
          className: 'custom-toast',
          hideProgressBar: true,
          closeButton: false
        });
      }
      break;
    case 'warn':
      if (!toast.isActive('warn')) {
        toast.warn(message, {
          toastId: 'warn',
          position: toast.POSITION.BOTTOM_CENTER,
          className: 'custom-toast',
          hideProgressBar: true,
          closeButton: false
        });
      }
      break;
    case 'info':
      if (!toast.isActive('info')) {
        toast.info(message, {
          toastId: 'info',
          position: toast.POSITION.BOTTOM_CENTER,
          className: 'custom-toast',
          hideProgressBar: true,
          closeButton: false
        });
      }
      break;
    default:
      if (!toast.isActive('default')) {
        toast(message, {
          toastId: 'default',
          position: toast.POSITION.BOTTOM_CENTER,
          className: 'custom-toast',
          hideProgressBar: true,
          closeButton: false
        });
      }
  }
}
