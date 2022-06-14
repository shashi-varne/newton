import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './ToastMessage.scss';

const ToastMessage = (message, type = 'default', customClassName='' ) => {
  console.log({customClassName})
  switch (type) {
    case 'success':
      if (!toast.isActive('success')) {
        toast.success(message, {
          toastId: 'success',
          ...DEFAULT_PROPS,
          className: `custom-toast-message ${customClassName}`,
        });
      }
      break;
    case 'error':
      if (!toast.isActive('error')) {
        toast.error(message, {
          toastId: 'error',
          ...DEFAULT_PROPS,
          className: `custom-toast-message ${customClassName}`,
        });
      }
      break;
    case 'warn':
      if (!toast.isActive('warn')) {
        toast.warn(message, {
          toastId: 'warn',
          ...DEFAULT_PROPS,
          className: `custom-toast-message ${customClassName}`,
        });
      }
      break;
    case 'info':
      if (!toast.isActive('info')) {
        toast.info(message, {
          toastId: 'info',
          ...DEFAULT_PROPS,
          className: `custom-toast-message ${customClassName}`,
        });
      }
      break;
    default:
      if (!toast.isActive('default')) {
        toast(message, {
          toastId: 'default',
          ...DEFAULT_PROPS,
          className: `custom-toast-message ${customClassName}`,
         });
      }
  }
};

export default ToastMessage;

const DEFAULT_PROPS = {
  position: toast.POSITION.BOTTOM_CENTER,
  className: 'custom-toast-message',
  hideProgressBar: true,
  closeButton: false,
};
