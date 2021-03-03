import { storageservice } from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';

export async function initialize() {

    this.setState({
        productName: getConfig().productName,
    }, () => {
        this.onload();
    })
}